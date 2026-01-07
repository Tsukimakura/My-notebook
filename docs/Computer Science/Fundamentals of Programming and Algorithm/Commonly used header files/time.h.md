### 1. Overview
The `<time.h>` header provides standard facilities for time manipulation, including retrieving the system time, converting between different time formats (e.g., timestamps vs. calendar dates), and formatting date strings.

It revolves around two main concepts:
1.  **Calendar Time**: The "absolute" time (usually seconds since the Epoch).
2.  **Processor Time**: The CPU time consumed by the program.

### 2. Key Data Types
Understanding these types is crucial, as functions in this library often convert data from one type to another.

| Type | Description |
| :--- | :--- |
| **`time_t`** | Represents **Calendar Time**. Usually a long integer representing the number of seconds elapsed since the Unix Epoch (00:00:00 UTC, January 1, 1970). |
| **`struct tm`** | Represents **Broken-down Time**. A structure containing separate fields for year, month, day, hour, etc. (See detail below). |
| **`clock_t`** | Represents **Processor Time**. Used for measuring execution duration (CPU ticks). |

#### The `struct tm` Structure
This is the most common structure used for human-readable dates.
```c
struct tm {
    int tm_sec;   // Seconds (0-60)
    int tm_min;   // Minutes (0-59)
    int tm_hour;  // Hours (0-23)
    int tm_mday;  // Day of the month (1-31)
    int tm_mon;   // Month (0-11)  <-- NOTE: 0 is January
    int tm_year;  // Year - 1900   <-- NOTE: Years since 1900
    int tm_wday;  // Day of the week (0-6, Sunday = 0)
    int tm_yday;  // Day in the year (0-365)
    int tm_isdst; // Daylight Saving Time flag (>0 if DST is in effect)
};
```

### 3. Essential Functions

#### A. Time Acquisition
*   **`time_t time(time_t *timer)`**
    Returns the current calendar time as a `time_t` value.
    *   *Usage:* `time_t now = time(NULL);`

*   **`clock_t clock(void)`**
    Returns the processor time used by the program since it started. Used for benchmarking.

#### B. Time Conversion
*   **`struct tm *localtime(const time_t *timer)`**
    Converts a `time_t` timestamp into a `struct tm` expressed in the **local time zone**.

*   **`struct tm *gmtime(const time_t *timer)`**
    Converts a `time_t` timestamp into a `struct tm` expressed in **UTC (GMT)**.

*   **`time_t mktime(struct tm *timeptr)`**
    The inverse of `localtime`. Converts a `struct tm` back into a `time_t` timestamp.

#### C. Formatting (String Output)
*   **`size_t strftime(char *s, size_t max, const char *format, const struct tm *tm)`**
    The most flexible function. Formats a `struct tm` into a string based on a custom format specifier (similar to `printf`).
    *   `%Y`: Year (2024), `%m`: Month (01-12), `%d`: Day (01-31), `%H`: Hour (00-23), `%M`: Minute.

*   **`char *ctime(const time_t *timer)`**
    Quickly converts a timestamp to a fixed-format string (e.g., "Wed Jun 30 21:49:08 1993\n").

### 4. Code Examples

#### Example 1: Getting and Formatting Current Date
This is the standard workflow: `time()` $\to$ `localtime()` $\to$ `strftime()`.

```c
#include <stdio.h>
#include <time.h>

int main() {
    // 1. Get raw time (Unix timestamp)
    time_t raw_time;
    time(&raw_time);

    // 2. Convert to local time structure
    struct tm *info;
    info = localtime(&raw_time);

    // 3. Format into a readable string
    char buffer[80];
    // Format: YYYY-MM-DD HH:MM:SS
    strftime(buffer, 80, "%Y-%m-%d %H:%M:%S", info);

    printf("Current local time: %s\n", buffer);

    return 0;
}
```

#### Example 2: Measuring Execution Time
Using `clock()` to calculate how long a function takes to run.

```c
#include <stdio.h>
#include <time.h>

int main() {
    clock_t start, end;
    double cpu_time_used;

    start = clock(); // Record start tick

    // --- Heavy task to measure ---
    for(int i = 0; i < 100000000; i++); 
    // -----------------------------

    end = clock(); // Record end tick

    // Calculate duration in seconds
    cpu_time_used = ((double) (end - start)) / CLOCKS_PER_SEC;

    printf("Task took %f seconds to execute \n", cpu_time_used);
    return 0;
}
```

#### Example 3: Seeding the Random Number Generator
Commonly used with `<stdlib.h>`.

```c
#include <stdlib.h>
#include <time.h>

int main() {
    // Use current time as seed so numbers differ each run
    srand(time(NULL)); 
    
    int random_num = rand();
    return 0;
}
```

### 5. Common Pitfalls

1.  **`tm_mon` Offset**: The month field in `struct tm` ranges from **0 to 11** (0 is January, 11 is December). Do not expect 1-12.
2.  **`tm_year` Offset**: The year field is **years since 1900**. To get the current year (e.g., 2025), you must calculate `info->tm_year + 1900`.
3.  **Thread Safety**: Functions like `localtime`, `gmtime`, and `ctime` return pointers to static internal buffers. They are **not thread-safe**. In multi-threaded applications, use the reentrant versions (`localtime_r`, `gmtime_r`) provided by POSIX or C11.