> **General rule:** Many specifiers are shared by `printf` and `scanf`, but their meanings differ: `printf` _outputs_ with the specified conversion; `scanf` _reads_ and requires pointers (e.g., `&i`). Always apply the correct **length modifier** for the target type.

## Common length modifiers
  
| Modifier | Meaning / use (applies to integer/float conversions)                       |
| -------- | -------------------------------------------------------------------------- |
| (none)   | default `int` for `%d`, `unsigned` for `%u`, `double` for `%f` in `printf` |
| `hh`     | `signed char` / `unsigned char`                                            |
| `h`      | `short` / `unsigned short`                                                 |
| `l`      | `long` / `unsigned long` or `wint_t` for `%c`/`%C` in some platforms       |
| `ll`     | `long long` / `unsigned long long`                                         |
| `z`      | `size_t` (useful for portability)                                          |
| `t`      | `ptrdiff_t`                                                                |
| `j`      | `intmax_t` / `uintmax_t`                                                   |
| `L`      | `long double` (floating-point only)                                        |

## `printf` / `fprintf` — common conversion specifiers

| Specifier    | Output type                                           | Example `printf` usage                                                  |
| ------------ | ----------------------------------------------------- | ----------------------------------------------------------------------- |
| `%d` or `%i` | Signed decimal integer (`int`)                        | `printf("%d\n", -42);`                                                  |
| `%u`         | Unsigned decimal integer                              | `printf("%u\n", 42u);`                                                  |
| `%o`         | Unsigned octal                                        | `printf("%o\n", 10u);`                                                  |
| `%x` / `%X`  | Unsigned hex (lower/upper)                            | `printf("%x\n", 255);`                                                  |
| `%f` / `%F`  | Decimal floating-point (`double`)                     | `printf("%f\n", 3.14);`                                                 |
| `%e` / `%E`  | Scientific notation (`double`)                        | `printf("%e\n", 0.00123);`                                              |
| `%g` / `%G`  | Use `%f` or `%e` whichever is shorter                 | `printf("%g\n", 12345.0);`                                              |
| `%a` / `%A`  | Hexadecimal floating-point (C99)                      | `printf("%a\n", 1.5);`                                                  |
| `%c`         | Single character (int promoted)                       | `printf("%c\n", 'A');`                                                  |
| `%s`         | Null-terminated string (`char *`)                     | `printf("%s\n", "hello");`                                              |
| `%p`         | Pointer (implementation-defined format)               | `printf("%p\n", (void*)ptr);`                                           |
| `%n`         | Writes number of characters output so far into `int*` | `printf("hi%n", &count);` _(use cautiously — security risk if misused)_ |
| `%%`         | A literal percent sign                                | `printf("100%% complete\n");`                                           |

**Examples with length modifiers**

- `printf("%lld\n", (long long)val);`
    
- `printf("%zu\n", my_size);` — use `%zu` for `size_t`.
    

## `scanf` / `fscanf` — common conversion specifiers

|Specifier|Reads into|Example `scanf` usage & notes|
|---|---|---|
|`%d`|pointer to `int`|`scanf("%d", &i);`|
|`%i`|pointer to `int` (auto-detects base: 0x hex, 0 octal)|`scanf("%i", &i);`|
|`%u`|pointer to `unsigned`|`scanf("%u", &u);`|
|`%o`|pointer to `unsigned` (octal)|`scanf("%o", &u);`|
|`%x` / `%X`|pointer to `unsigned` (hex)|`scanf("%x", &u);`|
|`%f`|pointer to `float` _or_ `double`? — **Important:** in `scanf`, `%f` expects `float *`. Use `%lf` for `double *`.|`float f; scanf("%f", &f);`|
|`%lf`|pointer to `double`|`double d; scanf("%lf", &d);`|
|`%Lf`|pointer to `long double`|`long double ld; scanf("%Lf", &ld);`|
|`%c`|pointer to `char` — reads next character (including whitespace unless you use a leading space)|`char ch; scanf(" %c", &ch);` (note leading space to skip whitespace)|
|`%s`|pointer to `char` buffer — **stops at whitespace**; **must** limit width to avoid overflow|`char buf[20]; scanf("%19s", buf);`|
|`%p`|pointer to `void*`|`void *ptr; scanf("%p", &ptr);` (implementation-defined)|
|`%n`|pointer to `int` — number of characters read so far|`scanf("%d%n", &i, &count);`|
|`%[...]` (scanset)|pointer to `char` buffer — reads characters matching set|`char buf[50]; scanf("%49[^\n]", buf);` /* read up to newline */|

**Length modifiers for `scanf`**

- Use `hh`, `h`, `l`, `ll`, `z`, `t`, `j` like in `printf` but make sure the pointer type matches:
    
    - `scanf("%hd", &short_var);`
        
    - `scanf("%hhu", &unsigned_char_var);`
        
    - `scanf("%lld", &long_long_var);`
        
    - `scanf("%zu", &size_var);` _(reads into `size_t`)_
        
    - `scanf("%Lf", &long_double_var);` _(long double)_
        

## Safety and best practices

- **Always** limit field width for `%s` when using `scanf` to prevent buffer overflow (e.g. `%19s` for a 20-byte buffer).
    
- Prefer `fgets()` + `sscanf()` or `fgets()` + manual parsing when reading lines — more robust.
    
- Be careful with `%n`: it can be exploited if used with untrusted format strings. Avoid using unvalidated user-supplied format strings.
    
- For printing `size_t` use `%zu`. For `uintptr_t`/`intptr_t`, convert to `unsigned long` or use macros from `<inttypes.h>` (see below).
    
- For portable printing/reading of `int64_t`, `uint64_t`, etc., use macros from `<inttypes.h>`:
    
    - `printf("%" PRId64 "\n", some_int64);`
        
    - `scanf("%" SCNu64, &some_uint64);`  
        (e.g., `PRId64`, `PRIu64`, `SCNd32`, `SCNu64`, etc.)
        

## Useful examples

- Print an integer: `printf("x = %d\n", x);`
    
- Read a string safely: `char name[32]; if (scanf("%31s", name) == 1) ...`
    
- Print a `long long`: `printf("%lld\n", (long long)val);`
    
- Read a `double`: `double d; scanf("%lf", &d);`
    
- Print pointer value: `printf("ptr = %p\n", (void*)ptr);`