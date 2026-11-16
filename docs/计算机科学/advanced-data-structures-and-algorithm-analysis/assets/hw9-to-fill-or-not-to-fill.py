"""HW9: greedy fuel purchasing; reads one case from standard input."""
import sys


def solve(data):
    it = iter(data.split())
    capacity, distance, mileage = (float(next(it)) for _ in range(3))
    n = int(next(it))
    by_position = {}
    for _ in range(n):
        price, pos = float(next(it)), float(next(it))
        by_position[pos] = min(price, by_position.get(pos, float('inf')))
    by_position[distance] = 0.0
    stations = sorted(by_position.items())  # (distance, price)
    if stations[0][0] != 0:
        return 'The maximum travel distance = 0.00'
    i = 0
    fuel = cost = 0.0
    reach = capacity * mileage
    eps = 1e-9
    while stations[i][0] < distance:
        pos, price = stations[i]
        candidates = []
        cheaper = None
        for j in range(i + 1, len(stations)):
            if stations[j][0] - pos > reach + eps:
                break
            candidates.append(j)
            if stations[j][1] < price:
                cheaper = j
                break
        if not candidates:
            return f'The maximum travel distance = {pos + reach:.2f}'
        if cheaper is not None:
            j = cheaper
            target = (stations[j][0] - pos) / mileage
        else:
            j = min(candidates, key=lambda k: stations[k][1])
            target = min(capacity, (distance - pos) / mileage)
        bought = max(0.0, target - fuel)
        cost += bought * price
        fuel += bought - (stations[j][0] - pos) / mileage
        i = j
    return f'{cost:.2f}'


if __name__ == '__main__':
    print(solve(sys.stdin.read()))
