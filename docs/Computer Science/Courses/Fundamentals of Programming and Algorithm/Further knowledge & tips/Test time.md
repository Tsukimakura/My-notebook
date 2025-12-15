- `time(0)` returns the value of time in seconds since 0 hours, 0 minutes, 0 seconds,
January 1, 1970, Coordinated Universal Time, without including leap seconds.

```c
#include <time.h>
time_t then = time(0);
printf(“%llu\n”, time(0)-then);
```