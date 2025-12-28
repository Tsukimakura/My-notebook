Here is a comprehensive reference guide for C language `printf` and `scanf` format specifiers, organized into detailed lookup tables.

---

### 1. Basic Conversion Specifiers
These are the core symbols used by both functions to define the data type.

| Specifier | Data Type | `printf` (Output) Meaning | `scanf` (Input) Meaning |
| :--- | :--- | :--- | :--- |
| **%d** | `int` | Signed decimal integer | Reads a signed decimal integer |
| **%i** | `int` | Signed decimal integer | **Smart Read**: Detects hex (`0x`), octal (`0`), or decimal |
| **%u** | `unsigned int` | Unsigned decimal integer | Reads an unsigned decimal integer |
| **%o** | `unsigned int` | Unsigned octal (no prefix) | Reads an octal number |
| **%x** / **%X** | `unsigned int` | Unsigned hex (lowercase/uppercase) | Reads a hexadecimal number |
| **%f** | `float` / `double` | Decimal floating point (default 6 digits) | **Reads `float` only** (Use `%lf` for `double`) |
| **%e** / **%E** | `float` / `double` | Scientific notation (e.g., 3.14e+02) | Reads a floating point number |
| **%g** / **%G** | `float` / `double` | Shortest representation of `%f` or `%e` | Reads a floating point number |
| **%c** | `char` | Single character | Reads the **next** character (does NOT skip whitespace) |
| **%s** | `char *` | String (prints until `\0`) | Reads string (stops at whitespace/newline) |
| **%p** | `void *` | Pointer address (implementation specific) | Reads an address (usually hex) |
| **%%** | None | Prints a literal `%` | Matches a literal `%` in input |

---

### 2. printf Formatting Details
**Prototype:** `%[flags][width][.precision][length]specifier`

#### A. Flags (Control alignment, sign, padding)
| Flag | Description | Example | Result (Value: 5) |
| :--- | :--- | :--- | :--- |
| **-** | **Left Justify** (Default is right) | `%-5d` | `"5    "` |
| **+** | **Force Sign** (Show `+` for positives) | `%+d` | `"+5"` |
| **(space)** | Space for positive, `-` for negative | `% d` | `" 5"` |
| **0** | **Zero Pad** (Pad with 0 instead of spaces) | `%05d` | `"00005"` |
| **#** | **Alternate Form** (0 for octal, 0x for hex) | `%#x` | `"0x5"` |

#### B. Width & Precision
| Format | Description | Example | Result |
| :--- | :--- | :--- | :--- |
| **%N** | **Min Width** N (pads with spaces) | `%5d` (val 10) | `"   10"` |
| **%.N** | **Precision** (Decimal places for floats) | `%.2f` (val 3.149) | `"3.15"` |
| **%.N** | **Precision** (Max characters for strings) | `%.3s` (val "hello")| `"hel"` |
| **%.N** | **Precision** (Min digits for integers, pad 0)| `%.4d` (val 10) | `"0010"` |
| **%*** | **Dynamic Width** (Provided by argument) | `printf("%*d", 5, 10)` | `"   10"` |
| **.* ** | **Dynamic Precision** (Provided by argument)| `printf("%.*f", 2, 3.1)`| `"3.10"` |

---

### 3. scanf Input Control Details
**Prototype:** `%[*][width][length]specifier`

#### A. Input Modifiers
| Feature | Format | Description | Example |
| :--- | :--- | :--- | :--- |
| **Width Limit** | `%Ns` | Reads max N characters. **Crucial for safety.** | `scanf("%9s", buf)` (Leaves room for `\0`) |
| **Suppression** | `%*d` | Reads input but **discards** it (does not assign). | `scanf("%d%*c%d", &a, &b)` (Skips char between ints) |
| **Scanset** | `%[...]` | Reads *only* characters listed in brackets. | `scanf("%[A-Z]", str)` (Only reads uppercase) |
| **Negated Scanset**| `%[^...]`| Reads *until* a character in brackets is found. | `scanf("%[^\n]", str)` (Reads whole line until Enter) |
| **Whitespace** | `" "` | A space in the format string skips *any* amount of whitespace (spaces, tabs, newlines). | `scanf(" %c", &ch)` (Skips previous newline) |

---

### 4. Length Modifiers
Used to handle data types of specific sizes (`short`, `long`, `size_t`, etc.).

| Modifier | Integer (d, i, u, o, x) | Float (f, e, g) | C Type Mapping |
| :--- | :--- | :--- | :--- |
| **hh** | `signed/unsigned char` | - | `char` (treated as integer) |
| **h** | `short` | - | `short` |
| **l** (ell) | `long` | `double` (Required for scanf) | `long` / `double` |
| **ll** (ell ell)| `long long` | - | `long long` |
| **L** | - | `long double` | `long double` |
| **z** | `size_t` | - | `size_t` (e.g. result of `sizeof`) |

---

### 5. Cheat Sheet & Examples

#### Common `printf` Scenarios
| Goal | Format String | Value | Output |
| :--- | :--- | :--- | :--- |
| Currency (2 decimals) | `"$%.2f"` | `12.5` | `"$12.50"` |
| Zero-padded ID (5 digits) | `"%05d"` | `42` | `"00042"` |
| Left-aligned column | `"|%-10s|"` | `"Item"` | `"|Item      |"` |
| Hex address (Standard) | `"%p"` | `&val` | `00000064321A` |
| Print `size_t` | `"%zu"` | `sizeof(int)` | `4` |
| Print `long long` | `"%lld"` | `9223372036854775807`| `9223372036854775807` |

#### Common `scanf` Scenarios
| Goal | Format String | Notes |
| :--- | :--- | :--- |
| Read `double` | `"%lf"` | **Must** use `l` modifier. `%f` is only for `float`. |
| Read string with spaces | `"%[^\n]"` | Reads until newline character. |
| Read Date (YYYY-MM-DD) | `"%d-%d-%d"` | The `-` in the string matches and skips the dashes in input. |
| Skip specific prefix | `"ID:%d"` | If input is `ID:500`, it stores `500`. |
| Safe String Read | `"%19s"` | If buffer is `char buf[20]`. Prevents overflow. |

### 6. Important Notes
1.  **Double Precision:**
    *   `printf`: `%f` works for both `float` and `double` (float is promoted to double).
    *   `scanf`: You **must** distinguish: `%f` for `float`, `%lf` for `double`.
2.  **Safety:** Never use `%s` in `scanf` without a width limit (e.g., `%100s`). Unbounded `%s` is a major security vulnerability (buffer overflow).
3.  **Return Values:**
    *   `printf`: Returns the number of characters printed.
    *   `scanf`: Returns the number of items successfully read and assigned. Use this to check for EOF or bad input.
4.  **Buffer Clearing:** `scanf("%c", &ch)` reads the newline character left over from a previous `scanf`. Use `scanf(" %c", &ch)` (note the space) to skip it.