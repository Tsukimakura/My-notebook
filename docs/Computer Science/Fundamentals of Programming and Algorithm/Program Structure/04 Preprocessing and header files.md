## 1. Header File Management
Header files (`.h`) allow code sharing between compilation units. However, they introduce the risk of **Duplicate Inclusion**.

### Declaration vs. Definition
*   **Function Declarations:** `void func(int a);` can be repeated multiple times without error.
*   **Type Definitions:** `struct Point { int x; };` **cannot** be repeated in a single compilation unit. Doing so causes a "Redefinition Error."

### The Duplicate Inclusion Problem
If `file.c` includes `A.h`, and `A.h` includes `B.h`, but `file.c` also includes `B.h`, the content of `B.h` appears twice in the compilation unit. If `B.h` contains a struct definition, compilation fails.

### Solution: Include Guards
Standard practice to ensure a header file is processed only once per compilation unit.
```c
#ifndef MY_HEADER_H
#define MY_HEADER_H

struct Point { int x, y; };

#endif
```

---

## 2. Header File Search Mechanism
When the preprocessor encounters `#include`, it searches for the file based on the syntax used.

### Case A: Double Quotes (`#include "header.h"`)
Used for **project-specific (custom)** headers.
**Search Order:**
1.  **Current Directory:** The directory containing the source file issuing the `#include` directive (Highest Priority).
2.  **`-I` Directories:** Directories specified by the compiler flag `-I`.
3.  **System Standard Directories:** The default compiler paths.

### Case B: Angle Brackets (`#include <header.h>`)
Used for **System/Standard Libraries** or installed third-party libraries.
**Search Order:**
1.  **`-I` Directories:** Directories specified by the `-I` flag (Highest Priority).
2.  **System Standard Directories:** (e.g., `/usr/include`, `/usr/local/include`).
*   *Note:* It does **not** search the current source directory.

### Practical Tip
*   To see the exact search paths your compiler uses, run: `gcc -E -x c -v /dev/null`
*   **Best Practice:** Use quotes `""` for your own files and brackets `<>` for libraries. If your project structure is complex (e.g., `src/` and `include/`), use `-I./include` and include files as `#include "my_header.h"`.