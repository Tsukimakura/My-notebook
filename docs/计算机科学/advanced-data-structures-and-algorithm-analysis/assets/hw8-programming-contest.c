#define MAXS 1000
int need_time(const int time[], const int score[], int happy_score, int n)
{
    int dp[MAXS + 1];
    int inf = 100 * n + 1;
    int reach = 0;

    dp[0] = 0;
    for (int s = 1; s <= happy_score; ++s)
        dp[s] = inf;

    for (int i = 0; i < n; ++i) {
        reach += score[i];
        if (reach > happy_score)
            reach = happy_score;

        for (int s = reach; s >= 1; --s) {
            int rest = s > score[i] ? s - score[i] : 0;
            int candidate = dp[rest] + time[i];

            if (candidate < dp[s])
                dp[s] = candidate;
        }
    }

    return dp[happy_score] == inf ? -1 : dp[happy_score];
}
