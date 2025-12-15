| Escape       | Meaning / description                   | Value / notes                                                             | Example (char or string literal)                               |
| ------------ | --------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `\\`         | Backslash                               | Single backslash character `\`                                            | `"C:\\folder\\file.txt"`                                       |
| `\'`         | Single quote                            | Useful in character literals                                              | `'\''` (a single-quote character)                              |
| `\"`         | Double quote                            | Useful in string literals                                                 | `"He said \"Hi\""`                                             |
| `\?`         | Literal question mark                   | Avoids trigraph confusion (rare)                                          | `"What\?"`                                                     |
| `\a`         | Alert (bell)                            | May ring terminal bell                                                    | `printf("\a");`                                                |
| `\b`         | Backspace                               | Moves cursor back one position                                            | `printf("X\bY");` /* prints Y replacing X on some terminals */ |
| `\f`         | Form feed                               | Page break in some printers/terminals                                     | `"\f"`                                                         |
| `\n`         | Newline (line feed)                     | Moves to next line (`LF`, `\x0A`)                                         | `"Line1\nLine2"`                                               |
| `\r`         | Carriage return                         | Return to start of line (`CR`, `\x0D`)                                    | `"Hello\rX"`                                                   |
| `\t`         | Horizontal tab                          | Tab character                                                             | `"Col1\tCol2"`                                                 |
| `\v`         | Vertical tab                            | Vertical tab (rare)                                                       | `"\v"`                                                         |
| `\0`         | Null character (NUL)                    | Terminates C strings; `'\0' == 0`                                         | `char s[] = "hi\0bye";`                                        |
| `\ooo`       | Octal escape (1–3 octal digits)         | Value = octal number (e.g. `\141` == `'a'`)                               | `"\101"` is `'A'`                                              |
| `\xhh...`    | Hex escape (1+ hex digits)              | Value = hexadecimal number (stops at non-hex)                             | `"\x41"` is `'A'`                                              |
| `\uXXXX`     | Universal character name (4 hex digits) | Unicode code point — C99/C11; may map to `wchar_t` or multi-byte encoding | `"\u00A9"` (©)                                                 |
| `\U00XXXXXX` | Universal character name (8 hex digits) | For higher Unicode code points                                            | `"\U0001F600"` (grinning face; encoding dependent)             |

**Notes**

- In `\x` escapes, any following hex digit becomes part of the escape — separate it if needed (e.g. `"\x3A" "text"` or `"\x3A"text` with concatenation).
    
- Use octal/hex carefully for portability and readability.
    
- `\0` is the canonical string terminator; embedding nulls inside a string literal is allowed but standard library string functions will stop at the first `\0`.
    
- Universal character names are processed by the compiler; actual encoding in the executable depends on implementation and locale.