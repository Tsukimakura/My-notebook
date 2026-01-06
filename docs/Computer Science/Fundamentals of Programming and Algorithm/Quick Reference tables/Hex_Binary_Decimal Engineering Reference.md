## 1. The Nibble Lookup (4-bit Base)
*Memorize this. All larger Hex numbers are just sequences of these 16 patterns.*

|   Hex   | Binary | Decimal |   Hex   | Binary | Decimal |
| :-----: | :----: | :-----: | :-----: | :----: | :-----: |
| **0x0** | `0000` |    0    | **0x8** | `1000` |    8    |
| **0x1** | `0001` |    1    | **0x9** | `1001` |    9    |
| **0x2** | `0010` |    2    | **0xA** | `1010` |   10    |
| **0x3** | `0011` |    3    | **0xB** | `1011` |   11    |
| **0x4** | `0100` |    4    | **0xC** | `1100` |   12    |
| **0x5** | `0101` |    5    | **0xD** | `1101` |   13    |
| **0x6** | `0110` |    6    | **0xE** | `1110` |   14    |
| **0x7** | `0111` |    7    | **0xF** | `1111` |   15    |

---

## 2. Powers of Two (Bit Flags & Shifts)
*Used for setting bits `(1 << n)`, memory addressing, and flag definitions.*

### A. Low Byte (Bits 0-7)
| Bit ($n$) | Logic `(1 << n)` | Hex Value | Decimal | Note |
| :---: | :--- | :---: | :---: | :--- |
| **0** | `1 << 0` | **0x01** | 1 | |
| **1** | `1 << 1` | **0x02** | 2 | |
| **2** | `1 << 2` | **0x04** | 4 | |
| **3** | `1 << 3` | **0x08** | 8 | |
| **4** | `1 << 4` | **0x10** | 16 | |
| **5** | `1 << 5` | **0x20** | 32 | |
| **6** | `1 << 6` | **0x40** | 64 | |
| **7** | `1 << 7` | **0x80** | 128 | MSB of a **Byte** (`int8`) |

### B. High Byte / Word (Bits 8-15)
| Bit ($n$) | Logic `(1 << n)` | Hex Value | Decimal | Note |
| :---: | :--- | :---: | :---: | :--- |
| **8** | `1 << 8` | **0x100** | 256 | Start of high byte |
| **9** | `1 << 9` | **0x200** | 512 | |
| **10** | `1 << 10` | **0x400** | 1,024 | **1 Kilo** (KB) |
| **11** | `1 << 11` | **0x800** | 2,048 | |
| **12** | `1 << 12` | **0x1000** | 4,096 | **4 KB** (Page Size) |
| **13** | `1 << 13` | **0x2000** | 8,192 | |
| **14** | `1 << 14` | **0x4000** | 16,384 | |
| **15** | `1 << 15` | **0x8000** | 32,768 | MSB of a **Short** (`int16`) |

### C. Large Boundaries (Bits 16 & 31)
| Bit ($n$) | Logic `(1 << n)` | Hex Value | Decimal | Note |
| :---: | :--- | :---: | :---: | :--- |
| **16** | `1 << 16` | **0x0001 0000** | 65,536 | **64 KB** |
| ... | ... | ... | ... | |
| **20** | `1 << 20` | **0x0010 0000** | 1,048,576 | **1 Mega** (MB) |
| ... | ... | ... | ... | |
| **30** | `1 << 30` | **0x4000 0000** | 1,073,741,824 | **1 Giga** (GB) |
| **31** | `1 << 31` | **0x8000 0000** | 2,147,483,648 | MSB of an **Int** (`int32`) |

---

## 3. Standard Type Maximums (Masks)
*Commonly used for masking operations (`val & 0xFF`) or checking overflow.*

| Type | Hex Mask | Binary Visual | Decimal (Unsigned) |
| :--- | :---: | :--- | :---: |
| **UINT8_MAX** | **0xFF** | `1111 1111` | 255 |
| **UINT16_MAX** | **0xFFFF** | `... 1111 1111` | 65,535 |
| **UINT32_MAX** | **0xFFFFFFFF** | `(32 ones)` | 4,294,967,295 |
| **INT32_MAX** | **0x7FFFFFFF** | `0111 ... 1111` | 2,147,483,647 |