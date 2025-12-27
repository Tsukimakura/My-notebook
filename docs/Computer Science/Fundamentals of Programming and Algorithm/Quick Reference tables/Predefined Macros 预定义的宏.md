Here is a **Quick Reference Table (Cheat Sheet)** for Predefined Macros in C. These are automatically defined by the compiler and are essential for debugging, cross-platform development, and version control.

---

### 1. Standard ISO C Macros
These macros are supported by almost all compliant C compilers (ANSI C / C99 / C11).

| Macro             | Type     | Description                                            | Example Output  |
| :---------------- | :------- | :----------------------------------------------------- | :-------------- |
| `__FILE__`        | `string` | Name of the current source file.                       | `"main.c"`      |
| `__LINE__`        | `int`    | Current line number in the source file.                | `42`            |
| `__DATE__`        | `string` | Date of compilation (Mmm dd yyyy).                     | `"Dec 23 2025"` |
| `__TIME__`        | `string` | Time of compilation (hh:mm:ss).                        | `"14:30:00"`    |
| `__func__`        | `string` | Name of the current function (C99+).                   | `"myFunction"`  |
| `__STDC__`        | `int`    | Defined as `1` if the compiler is standard-compliant.  | `1`             |
| `__STDC_HOSTED__` | `int`    | `1` if running on an OS, `0` if bare-metal (embedded). | `1`             |

---

### 2. C Standard Version Detection (`__STDC_VERSION__`)
Used to check which C standard the compiler is using.

| Value (`long`) | C Standard |
| :--- | :--- |
| **Undefined** | C89 / ANSI C |
| `199409L` | C94 |
| `199901L` | C99 |
| `201112L` | C11 |
| `201710L` | C17 |
| `202311L` | C23 (Expected) |

**Usage:**
```c
#if __STDC_VERSION__ >= 199901L
    // Use C99 features like 'long long' or variable declarations in for-loops
#endif
```

---

### 3. Operating System (OS) Detection
Used for cross-platform conditional compilation.

| Macro | Target OS | Notes |
| :--- | :--- | :--- |
| `_WIN32` | Windows (32/64-bit) | Defined for both x86 and x64 on Windows. |
| `_WIN64` | Windows (64-bit) | Only defined for 64-bit Windows. |
| `__linux__` | Linux | Ubuntu, Debian, CentOS, etc. |
| `__APPLE__` | macOS / iOS | Used with `__MACH__`. |
| `__ANDROID__` | Android | Specific to Android NDK. |
| `__unix__` | Unix | Generic Unix systems. |

**Usage:**
```c
#ifdef _WIN32
    #include <windows.h>
#elif defined(__linux__)
    #include <unistd.h>
#endif
```

---

### 4. Compiler Detection
Used to handle compiler-specific keywords or optimizations.

| Macro | Compiler | Format / Note |
| :--- | :--- | :--- |
| `__GNUC__` | GCC (GNU) | Also defined by Clang/ICC as they emulate GCC. |
| `__clang__` | Clang / LLVM | Specific to Clang. |
| `_MSC_VER` | Microsoft Visual C++ | Integer value (e.g., `1900` for VS2015). |
| `__MINGW32__` | MinGW | Windows port of GCC. |

---

### 5. Architecture Detection
Used to optimize for specific hardware (CPU).

| Macro | Architecture |
| :--- | :--- |
| `__x86_64__` / `_M_X64` | x86_64 (64-bit Intel/AMD) |
| `__i386__` / `_M_IX86` | x86 (32-bit Intel/AMD) |
| `__arm__` / `_M_ARM` | ARM (32-bit) |
| `__aarch64__` | ARM64 (64-bit) |

---

### 6. Useful Non-Standard Extensions
Supported by most major compilers (GCC, Clang, MSVC) but technically not ISO C.

| Macro | Description |
| :--- | :--- |
| `__COUNTER__` | Expands to an integer starting at 0 and increments by 1 every time it is used. Great for generating unique variable names. |
| `__cplusplus` | Defined if the file is being compiled as C++. Used for `extern "C"` blocks. |
| `__VA_OPT__` | (C23/C++20) Handles the trailing comma in variadic macros cleanly. |

---

### Quick Example: "Universal" Header
A common pattern combining these macros to set up a project environment.

```c
#ifndef MY_CONFIG_H
#define MY_CONFIG_H

// 1. Check C++ compatibility
#ifdef __cplusplus
extern "C" {
#endif

// 2. OS Specific Definitions
#if defined(_WIN32)
    #define PLATFORM_NAME "Windows"
    #define PATH_SEP '\\'
#elif defined(__linux__)
    #define PLATFORM_NAME "Linux"
    #define PATH_SEP '/'
#elif defined(__APPLE__)
    #define PLATFORM_NAME "macOS"
    #define PATH_SEP '/'
#else
    #define PLATFORM_NAME "Unknown"
#endif

// 3. Debug Helper
#define LOG_LOC() printf("File: %s, Line: %d, Func: %s\n", \
                          __FILE__, __LINE__, __func__)

#ifdef __cplusplus
}
#endif

#endif
```