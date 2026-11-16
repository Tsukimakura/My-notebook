#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAXN 100

int N, M, L;
int statement[MAXN + 1];
bool wolf[MAXN + 1];

bool check(void)
{
    int liars = 0;
    int wolfLiars = 0;

    for (int i = 1; i <= N; ++i) {
        int target = abs(statement[i]);
        bool lie;

        if (statement[i] > 0)
            lie = wolf[target];
        else
            lie = !wolf[target];

        if (lie) {
            ++liars;
            if (wolf[i])
                ++wolfLiars;
        }
    }

    return liars == L &&
           wolfLiars >= 1 &&
           wolfLiars < M;
}

bool dfs(int i, int count)
{
    if (count == M)
        return check();

    if (count + i < M)
        return false;

    wolf[i] = true;
    if (dfs(i - 1, count + 1))
        return true;

    wolf[i] = false;
    if (dfs(i - 1, count))
        return true;

    return false;
}

int main(void)
{
    if (scanf("%d %d %d", &N, &M, &L) != 3) return 1;

    for (int i = 1; i <= N; ++i)
        if (scanf("%d", &statement[i]) != 1) return 1;

    if (!dfs(N, 0)) {
        printf("No Solution\n");
        return 0;
    }

    bool first = true;

    for (int i = N; i >= 1; --i) {
        if (wolf[i]) {
            if (!first)
                printf(" ");
            printf("%d", i);
            first = false;
        }
    }

    printf("\n");
    return 0;
}
