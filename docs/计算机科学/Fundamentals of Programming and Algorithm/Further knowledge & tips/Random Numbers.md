---
title: "Random Numbers"
status: draft
tags: [cs]
created: null
updated: 2026-10-06
sources: []
---

# Random Numbers

- C generates pseudo-random (伪随机)numbers using `<stdlib.h>` functions: `rand()` and `srand()`

- `rand()` returns a pseudo-random integer between 0 and `RAND_MAX`

- `RAND_MAX` is at least 32,767

- Default seed value is 1, producing identical sequences without `srand()`
