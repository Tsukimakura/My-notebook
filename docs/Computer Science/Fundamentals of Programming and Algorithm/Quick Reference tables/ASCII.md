# ASCII Table (0–127)

## **Control Characters (0–31, 127)**

| Decimal | Hex  | Abbrev | Description            |
| ------- | ---- | ------ | ---------------------- |
| 0       | 0x00 | NUL    | Null character (`\0`)  |
| 1       | 0x01 | SOH    | Start of Header        |
| 2       | 0x02 | STX    | Start of Text          |
| 3       | 0x03 | ETX    | End of Text            |
| 4       | 0x04 | EOT    | End of Transmission    |
| 5       | 0x05 | ENQ    | Enquiry                |
| 6       | 0x06 | ACK    | Acknowledge            |
| 7       | 0x07 | BEL    | Bell (`\a`)            |
| 8       | 0x08 | BS     | Backspace (`\b`)       |
| 9       | 0x09 | TAB    | Horizontal Tab (`\t`)  |
| 10      | 0x0A | LF     | Line Feed (`\n`)       |
| 11      | 0x0B | VT     | Vertical Tab (`\v`)    |
| 12      | 0x0C | FF     | Form Feed (`\f`)       |
| 13      | 0x0D | CR     | Carriage Return (`\r`) |
| 27      | 0x1B | ESC    | Escape                 |
| 32      | 0x20 | SP     | Space                  |
| 127     | 0x7F | DEL    | Delete                 |

---

## **Printable Characters (32–126)**

### **Digits (48–57)**

|Decimal|Hex|Char|
|---|---|---|
|48|0x30|0|
|49|0x31|1|
|50|0x32|2|
|51|0x33|3|
|52|0x34|4|
|53|0x35|5|
|54|0x36|6|
|55|0x37|7|
|56|0x38|8|
|57|0x39|9|

---

### **Uppercase Letters (65–90)**

`A–Z` (0x41–0x5A)

---

### **Lowercase Letters (97–122)**

`a–z` (0x61–0x7A)

---

### **Common Punctuation**

| Decimal | Hex  | Char        | Description      |
| ------- | ---- | ----------- | ---------------- |
| 33      | 0x21 | !           | Exclamation mark |
| 34      | 0x22 | "           | Double quote     |
| 35      | 0x23 | #           | Hash             |
| 37      | 0x25 | %           | Percent          |
| 38      | 0x26 | &           | Ampersand        |
| 39      | 0x27 | '           | Single quote     |
| 42      | 0x2A | *           | Asterisk         |
| 43      | 0x2B | +           | Plus             |
| 44      | 0x2C | ,           | Comma            |
| 45      | 0x2D | -           | Hyphen           |
| 46      | 0x2E | .           | Dot              |
| 47      | 0x2F | /           | Slash            |
| 58      | 0x3A | :           | Colon            |
| 59      | 0x3B | ;           | Semicolon        |
| 60      | 0x3C | <           | Less-than        |
| 61      | 0x3D | =           | Equal            |
| 62      | 0x3E | >           | Greater-than     |
| 63      | 0x3F | ?           | Question mark    |
| 64      | 0x40 | @           | At symbol        |
| 91      | 0x5B | [           | Left bracket     |
| 92      | 0x5C | \|Backslash |                  |
| 93      | 0x5D | ]           | Right bracket    |
| 94      | 0x5E | ^           | Caret            |
| 95      | 0x5F | _           | Underscore       |
| 123     | 0x7B | {           | Left brace       |
| 124     | 0x7C | \|          | Vertical bar     |
| 125     | 0x7D | }           | Right brace      |
| 126     | 0x7E | ~           | Tilde            |

---

#  Common ASCII Values You Should Memorize

### **1. Character Ranges (very important)**

|Concept|Value|
|---|---|
|`'0'` starts at|**48**|
|`'A'` starts at|**65**|
|`'a'` starts at|**97**|
|Difference between lowercase and uppercase|**32**|
|Convert char digit → int|`c - '0'`|

---

### **2. Key Escape Characters**

|Escape|Decimal|Meaning|
|---|---|---|
|`\0`|0|String terminator in C|
|`\n`|10|Newline|
|`\r`|13|Carriage return|
|`\t`|9|Tab|
|`\'`|39|Single quote|
|`\"`|34|Double quote|
|`\\`|92|Backslash|

---

### **3. Special Printable Characters**

| Char        | Decimal | Notes                     |
| ----------- | ------- | ------------------------- |
| Space `' '` | **32**  | First printable character |
| DEL         | **127** | Delete                    |
