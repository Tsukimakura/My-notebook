/* Adapted from the supplied HW9 saved C answer; not a judge verdict.
 * Input checks and a reachability tolerance are added.
 */
#include <stdio.h>

typedef struct {
    double price;
    double dist;
} Station;

int main(void)
{
    double capacity, destination, avg;
    int n;
    Station station[501];

    if (scanf("%lf %lf %lf %d", &capacity, &destination, &avg, &n) != 4
        || n < 1 || n > 500 || capacity <= 0 || avg <= 0)
        return 1;

    for (int i = 0; i < n; i++)
        if (scanf("%lf %lf", &station[i].price, &station[i].dist) != 2)
            return 1;

    station[n].price = 0;
    station[n].dist = destination;
    n++;

    for (int i = 0; i < n - 1; i++) {
        int first = i;
        for (int j = i + 1; j < n; j++) {
            if (station[j].dist < station[first].dist ||
                (station[j].dist == station[first].dist &&
                 station[j].price < station[first].price))
                first = j;
        }
        Station temp = station[i];
        station[i] = station[first];
        station[first] = temp;
    }

    if (station[0].dist != 0) {
        printf("The maximum travel distance = 0.00\n");
        return 0;
    }

    const double eps = 1e-9;
    double range = capacity * avg;
    double fuel = 0;
    double cost = 0;
    int i = 0;

    while (station[i].dist < destination) {
        int next = -1;
        double target = capacity;  /* 默认加满 */

        for (int j = i + 1; j < n; j++) {
            double distance = station[j].dist - station[i].dist;
            if (distance > range + eps)
                break;

            if (station[j].price <= station[i].price) {
                next = j;
                target = distance / avg;  /* 够到下一站即可 */
                break;
            }

            if (next == -1 || station[j].price < station[next].price)
                next = j;
        }

        if (next == -1) {
            printf("The maximum travel distance = %.2f\n",
                   station[i].dist + range);
            return 0;
        }

        if (fuel < target) {
            cost += (target - fuel) * station[i].price;
            fuel = target;
        }

        fuel -= (station[next].dist - station[i].dist) / avg;
        i = next;
    }

    printf("%.2f\n", cost);
    return 0;
}
