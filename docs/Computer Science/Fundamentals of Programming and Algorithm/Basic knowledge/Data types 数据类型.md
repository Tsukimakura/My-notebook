In C, data types specify the type, size, and range of data that can be stored in a variable. They are broadly categorized into four groups.

---

## **1. Basic (Primitive) Data Types**

These are the fundamental arithmetic types provided by the language.

### **A. Integer Types (int)**

Used to store whole numbers (no decimals). The size depends on the compiler and architecture (16-bit, 32-bit, or 64-bit).

| Type      | Size (Typical) | Format Specifier | Range (Typical 32-bit) |
| --------- | -------------- | ---------------- | ---------------------- |
| short     | 2 bytes        | %hd              | -32,768 to 32,767      |
| **int**   | **4 bytes**    | **%d**           | **-2B to +2B**         |
| long      | 4 or 8 bytes   | %ld              | At least same as int   |
| long long | 8 bytes        | %lld             | Very large numbers     |

### **B. Character Type (char)**

Used to store a single character. Internally, C stores characters as **integers** (ASCII values).

- **Size:** Always **1 byte**.
    
- **Format Specifier:** %c.
    
- **Note:** char can also be used as a tiny integer (-128 to 127).
    

### **C. Floating-Point Types**

Used to store numbers with fractional parts (decimals).

| Type        | Size (Typical)      | Precision         | Format Specifier |
| ----------- | ------------------- | ----------------- | ---------------- |
| **float**   | 4 bytes             | 6 decimal places  | %f               |
| **double**  | 8 bytes             | 15 decimal places | %lf              |
| long double | 10, 12, or 16 bytes | High precision    | %Lf              |

### **D. The void Type**

Represents the **absence of type**. It is used in three scenarios:

1. **Function Return:** void func() (Function returns nothing).
    
2. **Function Arguments:** void func(void) (Function takes no parameters).
    
3. **Generic Pointers:** void *ptr (A pointer that can point to any data type).
    

---

## **2. Type Modifiers (Qualifiers)**

Keywords that alter the meaning of base data types to fit specific needs.

### **A. Signed vs. Unsigned**

- **signed**: (Default) Can hold positive and negative numbers.
    
- **unsigned**: Can **only** hold positive numbers (and zero). This effectively doubles the positive range.
    
    - Example: unsigned int ranges from 0 to 4,294,967,295 (on 32-bit).
        
    - Format Specifier: %u.
        

### **B. Size Qualifiers**

- short: Reduces storage size.
    
- long: Increases storage size.
    

### **C. const and volatile**

- **const**: The variable becomes read-only after initialization.
    
- **volatile**: Tells the compiler not to optimize the variable because its value may change unexpectedly (e.g., by hardware or an interrupt).
    

---

## **3. Derived Data Types**

Types that are derived from the fundamental types.

### **A. Arrays**

A collection of elements of the **same type** stored in contiguous memory.

```c
int numbers[5]; // An array of 5 integers
char name[20];  // A string (array of characters)
```

### **B. Pointers**

Variables that store the **memory address** of another variable.

```c
int x = 10;
int *ptr = &x; // ptr holds the address of x
```

### **C. Functions**

A block of code performing a task. Functions have a return type and parameter types.

---

## **4. User-Defined Data Types**

Types defined by the programmer to organize complex data.

### **A. Structure (struct)**

A collection of variables (members) of **different types** grouped under a single name.

```c
struct Student {
    char name[50];
    int age;
    float gpa;
};
```

### **B. Union (union)**

Similar to a struct, but all members **share the same memory location**. Only one member can store a value at a time. The size of the union is the size of its largest member.

```c
union Data {
    int i;
    float f;
}; // Size is 4 bytes (size of float/int)
```

### **C. Enumeration (enum)**

A user-defined type consisting of a set of named integer constants.

```c
enum Color { RED, GREEN, BLUE }; 
// Internally: RED=0, GREEN=1, BLUE=2
```

---

## **5. Modern C Types (stddef.h & stdint.h)**

Important for portable and robust code (C99 standard and later).

### **A. size_t**

- **Definition:** Unsigned integer type.
    
- **Use:** Represents the size of objects (result of sizeof) and array indices. It guarantees to be big enough to hold the size of the largest possible object in memory.
    

### **B. Fixed-Width Integers (<stdint.h>)**

Used when you need exact sizes regardless of the machine.

- int8_t, uint8_t: Exactly 1 byte.
    
- int16_t, uint16_t: Exactly 2 bytes.
    
- int32_t, uint32_t: Exactly 4 bytes.
    
- int64_t, uint64_t: Exactly 8 bytes.
    

### **C. Boolean (<stdbool.h>)**

- **Type:** bool
    
- **Values:** true (1), false (0).
    
- (Before C99, programmers used int 0 and 1 for logic).
    

---

## **Summary Cheat Sheet**

| Category         | Keywords                             | Example              |
| ---------------- | ------------------------------------ | -------------------- |
| **Basic**        | int, char, float, double, void       | int count = 10;      |
| **Modifiers**    | signed, unsigned, short, long, const | unsigned long size;  |
| **Derived**      | Arrays, Pointers                     | int *p;              |
| **User-Defined** | struct, union, enum                  | struct Point {x, y}; |
| **Modern**       | size_t, uint32_t, bool               | size_t len = 5;      |