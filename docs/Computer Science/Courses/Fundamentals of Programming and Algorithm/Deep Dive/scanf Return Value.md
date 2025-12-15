#### 1. Function Prototype

The `scanf` **function** is **declared** in the **standard input/output header file**:

```c
#include <stdio.h>
```

**Function Prototype**
```c
int scanf(const char *format, ...);
```

#### 2. Return Value of the function scanf

| Return Value                    | Meaning                    | Typical Scenario                           |
| ------------------------------- | -------------------------- | ------------------------------------------ |
| **Positive N**                  | Successfully read N items  | `scanf("%d %f", &a, &b)` returns 2         |
| **0**                           | No items successfully read | Input doesn't match format                 |
| **EOF**(end-of-file,usually -1) | End of file or error       | User presses Ctrl+D or input stream closes |
