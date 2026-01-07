### 1. Control Characters (0–31 & 127)
These characters are non-printable and used for hardware control or terminal formatting.

| Dec | Hex | Oct | C Escape | Name | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 0 | 00 | 000 | `\0` | **NUL** | Null Character (String Terminator) |
| 7 | 07 | 007 | `\a` | **BEL** | Audible Bell (Alert) |
| 8 | 08 | 010 | `\b` | **BS** | Backspace |
| 9 | 09 | 011 | `\t` | **HT** | Horizontal Tab |
| 10 | 0A | 012 | `\n` | **LF** | Line Feed (Newline) |
| 11 | 0B | 013 | `\v` | **VT** | Vertical Tab |
| 12 | 0C | 014 | `\f` | **FF** | Form Feed (New Page) |
| 13 | 0D | 015 | `\r` | **CR** | Carriage Return |
| 27 | 1B | 033 | `\e`* | **ESC** | Escape |
| 32 | 20 | 040 | (space) | **SPC** | Space |
| 127 | 7F | 177 | | **DEL** | Delete |

*\*Note: `\e` is a common GCC/Clang extension but not part of the strict ANSI C standard.*

---

### 2. Printable Characters (32–126)
Commonly used characters including digits, letters, and punctuation.

#### **Digits & Special Characters**
| Dec | Hex | Oct | Char | | Dec | Hex | Oct | Char |
| :--- | :--- | :--- | :--- | --- | :--- | :--- | :--- | :--- |
| 48 | 30 | 060 | **0** | | 33 | 21 | 041 | **!** |
| 49 | 31 | 061 | **1** | | 34 | 22 | 042 | **"** |
| 50 | 32 | 062 | **2** | | 35 | 23 | 043 | **#** |
| 51 | 33 | 063 | **3** | | 36 | 24 | 044 | **$** |
| 52 | 34 | 064 | **4** | | 38 | 26 | 046 | **&** |
| 57 | 39 | 071 | **9** | | 61 | 3D | 075 | **=** |

#### **Uppercase Letters (A-Z)**
| Dec | Hex | Oct | Char  |     | Dec | Hex | Oct | Char  |
| :-- | :-- | :-- | :---- | --- | :-- | :-- | :-- | :---- |
| 65  | 41  | 101 | **A** |     | 78  | 4E  | 116 | **N** |
| 66  | 42  | 102 | **B** |     | 79  | 4F  | 117 | **O** |
| 67  | 43  | 103 | **C** |     | ... | ... | ... | ...   |
| 71  | 47  | 107 | **G** |     | 90  | 5A  | 132 | **Z** |

#### **Lowercase Letters (a-z)**
| Dec | Hex | Oct | Char  |     | Dec | Hex | Oct | Char  |
| :-- | :-- | :-- | :---- | --- | :-- | :-- | :-- | :---- |
| 97  | 61  | 141 | **a** |     | 110 | 6E  | 156 | **n** |
| 98  | 62  | 142 | **b** |     | 111 | 6F  | 157 | **o** |
| 99  | 63  | 143 | **c** |     | ... | ... | ... | ...   |
| 103 | 67  | 147 | **g** |     | 122 | 7A  | 172 | **z** |

---

### 3. Memory Aid
*   **Uppercase vs Lowercase:** The difference between `'a'` (97) and `'A'` (65) is exactly **32** (or `0x20`). Setting/clearing the 6th bit toggles case.
*   **Digit Conversion:** `'0'` is **48** (`0x30`). Always use `c - '0'` to convert a character digit to its integer value.
*   **Null Pointer vs Null Char:** `NULL` (pointer) is typically `(void*)0`, whereas `'\0'` (character) is the integer `0`. They are numerically 0 but semantically different.
*   **Hex/Octal Limits:** 
    *   Max 1-byte Hex: `\xff` (255)
    *   Max 1-byte Octal: `\377` (255)