**Character encoding** is the mechanism that maps characters (letters, digits, symbols) to numeric codes so they can be stored in memory or transmitted over networks.  
Computers ultimately operate on binary data, so encoding defines how human-readable text becomes machine-readable bytes — and how those bytes are converted back into characters.

Encodings specify:

- The **character set** (which characters are supported)
    
- The **mapping** from characters to numbers (code points)
    
- The **byte representation** used when storing/transmitting text
    

Without a consistent encoding, text may appear corrupted (mojibake), especially when mixing languages.

---

# **Common Character Encodings and Their Usage**

## **1. ASCII (American Standard Code for Information Interchange)**

**Characteristics:**

- Uses **7 bits** (128 possible characters)
    
- Includes English letters, digits, punctuation, control characters
    
- The earliest widely adopted encoding (1960s)
    

**Usage scenario:**

- Early computing and networking protocols
    
- Modern systems still keep ASCII as a **subset** of Unicode
    
- Suitable for English-only environments
    

---

## **2. Extended ASCII / ISO-8859 Series**

Examples: **ISO-8859-1 (Latin-1)**, ISO-8859-15, Windows-1252

**Characteristics:**

- **8-bit** encoding (256 characters)
    
- Adds accented European characters
    
- Different regions use different variants
    

**Usage scenario:**

- Older Western European systems and documents
    
- Legacy software
    
- Email, early Web content before Unicode adoption
    

---

## **3. GB2312, GBK, GB18030 (Chinese Encodings)**

### **GB2312**

- Standard for simplified Chinese (early)
    
- Few thousand characters
    

### **GBK**

- Extension of GB2312
    
- Supports simplified + traditional Chinese
    

### **GB18030**

- The mandatory Chinese encoding standard
    
- Covers all Unicode characters
    

**Usage scenarios:**

- Windows systems in China historically used **GBK**
    
- Modern Chinese applications are required to support **GB18030**
    
- Legacy documents and websites in China may still use these encodings
    

---

## **4. Shift-JIS, EUC-JP (Japanese Encodings)**

**Characteristics:**

- Designed for Japanese Kanji, Hiragana, Katakana
    
- Variable-length encodings
    

**Usage scenarios:**

- Japanese Windows systems (Shift-JIS)
    
- Older Unix/Linux in Japan (EUC-JP)
    
- Legacy Japanese websites and applications
    

---

## **5. Unicode**

Unicode is a **character set** that aims to represent _all_ characters of all languages.

Unicode itself does not specify the storage format — that’s the role of **UTF encodings**:

---

## **6. UTF-8 (Unicode Transformation Format – 8 bit)**

**Characteristics:**

- Variable length (1–4 bytes)
    
- Compatible with ASCII (first 128 characters)
    
- Most popular encoding today
    
- Handles all languages efficiently
    

**Usage scenarios:**

- The modern Web (HTML, JSON, XML)
    
- Programming languages (Python 3, Go, Rust, etc.)
    
- Linux systems default to UTF-8
    
- Cross-platform applications
    

---

## **7. UTF-16**

**Characteristics:**

- Uses **2 or 4 bytes**
    
- Efficient for Asian scripts, though UTF-8 is now preferred
    
- BOM (Byte Order Mark) sometimes required
    

**Usage scenarios:**

- Windows internal encoding (UTF-16 LE)
    
- Java and JavaScript string representation
    
- Some large databases and enterprise systems
    

---

## **8. UTF-32**

**Characteristics:**

- Fixed length: **4 bytes per character**
    
- Very simple mapping (1 code point = 1 integer)
    

**Usage scenarios:**

- Internal text processing
    
- Academic or specialized applications where fast indexing matters
    
- Rarely used for storage or transmission due to size
    

---

# **Choosing an Encoding: When to Use What?**

|Encoding|Strengths|Use Case|
|---|---|---|
|**ASCII**|Simple, universal subset|Basic English text, protocols|
|**ISO-8859** / Windows-1252|Compact, legacy support|Western language legacy data|
|**GBK / GB18030**|Good for Chinese text|Chinese OS, legacy files|
|**Shift-JIS / EUC-JP**|Japanese support|Older Japanese systems|
|**UTF-8**|Compact, universal, web standard|Modern software, international apps, web|
|**UTF-16**|Good for internal operations|Windows internals, Java/JS strings|
|**UTF-32**|Simplest mapping|Low-level internal processing|