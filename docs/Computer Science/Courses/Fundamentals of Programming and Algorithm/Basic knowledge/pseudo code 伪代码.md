## 1. What Is Pseudocode?

Pseudocode is a **high-level, language-independent description of an algorithm**.  
It looks like code, but it is **not tied to any programming language**.  
Its purpose is to help you **think and design** before writing real code.

---

## 2. Basic Principles of Pseudocode

- Use **plain English** to describe logic.
    
- Focus on **steps**, not syntax.
    
- Be **clear**, **structured**, and **consistent**.
    
- Indentation represents **blocks** (like loops or conditionals).
    
- No need to worry about real coding rules (types, semicolons, etc.).
    

---

## 3. Common Keywords

These are commonly used in pseudocode across textbooks:

|Purpose|Keyword Examples|
|---|---|
|Start/End|`BEGIN`, `END`|
|Variables|`SET`, `LET`, `INITIALIZE`|
|Conditions|`IF`, `ELSE`, `ELSE IF`, `END IF`|
|Loops|`FOR`, `WHILE`, `REPEAT…UNTIL`, `END FOR`|
|Functions|`FUNCTION`, `RETURN`|
|I/O|`READ`, `WRITE`, `PRINT`|

---

## 4. Basic Structures

### **4.1 Sequential Execution**

`BEGIN     PRINT "Hello"     SET x ← 10     SET y ← x + 5     PRINT y END`

### **4.2 Conditional Branching**

`IF score ≥ 60 THEN     PRINT "Pass" ELSE     PRINT "Fail" END IF`

### **4.3 Looping**

**FOR loop**

`FOR i ← 1 TO 10 DO     PRINT i END FOR`

**WHILE loop**

`WHILE n > 0 DO     PRINT n     n ← n - 1 END WHILE`

---

## 5. Functions

`FUNCTION Add(a, b)     RETURN a + b END FUNCTION`

Calling a function:

`result ← Add(3, 4) PRINT result`

---

## 6. A Complete Example: Find Maximum in an Array

`FUNCTION FindMax(arr, n)     SET max ← arr[0]      FOR i ← 1 TO n - 1 DO         IF arr[i] > max THEN             max ← arr[i]         END IF     END FOR      RETURN max END FUNCTION`

---

## 7. Tips for Writing Good Pseudocode

- Use **meaningful names** (e.g., `total`, `count`, `isFound`).
    
- Keep it **language-neutral** (not C, not Python, just logic).
    
- Make sure each step is **unambiguous**.
    
- Add comments if needed.
    
- Aim for **readability over accuracy**.