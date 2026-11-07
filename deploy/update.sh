#!/usr/bin/env bash
# Run on the server only. No inbound deploy webhook or SSH key in GitHub.
set -Eeuo pipefail
cd -- "$(dirname -- "${BASH_SOURCE[0]}")"
umask 077
mkdir -p .state
exec 9>.state/update.lock
flock -n 9 || exit 0
[[ -f .env && -f compose.override.yml ]] || { echo 'Configure .env and compose.override.yml first.' >&2; exit 1; }
repository=$(sed -n 's/^NOTEBOOK_REPOSITORY=//p' .env)
[[ "$repository" =~ ^ghcr\.io/[a-z0-9._-]+/[a-z0-9._/-]+$ ]] || { echo 'Invalid NOTEBOOK_REPOSITORY.' >&2; exit 1; }
docker pull "$repository:main" >/dev/null
digest=$(docker image inspect "$repository:main" --format '{{range .RepoDigests}}{{println .}}{{end}}' | while IFS= read -r item; do
    if [[ "$item" == "$repository@sha256:"* ]]; then printf '%s\n' "$item"; break; fi
done)
[[ "$digest" =~ @sha256:[a-f0-9]{64}$ ]] || { echo 'Could not resolve image digest.' >&2; exit 1; }
next="NOTEBOOK_IMAGE=$digest"
compose=(docker compose --env-file .env --env-file .state/current.env -f compose.yml -f compose.override.yml)
# Re-check health even for the same digest; a previous failed start must be retried.
if [[ -f .state/current.env && "$(cat .state/current.env)" == "$next" ]]; then
    container=$("${compose[@]}" ps -q notebook)
    if [[ -n "$container" && "$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{end}}' "$container")" == healthy ]]; then
        exit 0
    fi
fi
had_previous=false
if [[ -f .state/current.env ]]; then
    cp .state/current.env .state/rollback.env
    had_previous=true
fi
printf '%s\n' "$next" > .state/current.env.tmp
mv .state/current.env.tmp .state/current.env
rollback() {
    echo 'Update failed; restoring the previous version when available.' >&2
    if [[ "$had_previous" == true ]]; then
        mv .state/rollback.env .state/current.env
        "${compose[@]}" up -d --no-build notebook || true
    else
        rm -f .state/current.env
        echo 'First deployment failed; check configuration and container health.' >&2
    fi
}
trap rollback ERR
"${compose[@]}" up -d --no-build notebook
container=$("${compose[@]}" ps -q notebook)
healthy=false
for _ in {1..45}; do
    status=$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{end}}' "$container")
    if [[ "$status" == healthy ]]; then healthy=true; break; fi
    if [[ "$status" == unhealthy ]]; then break; fi
    sleep 2
done
if [[ "$healthy" != true ]]; then false; fi
trap - ERR
if [[ "$had_previous" == true ]]; then mv .state/rollback.env .state/previous.env; fi
echo 'Notebook update healthy.'
