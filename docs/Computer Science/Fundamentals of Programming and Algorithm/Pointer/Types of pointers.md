### 1. The Concept

A pointer stores a memory address. However, C requires you to specify **what kind of data** is stored at that address. This is the **Pointer Type**.

- **Format:** data_type *pointer_name;
    
- **Example:** int *ptr; means ptr holds the address of an integer variable.
    

### 2. Why do Pointer Types Matter?

Since all pointers just store addresses (which are just numbers/hex codes), why do we need types like int* or double*?

There are two main reasons:

#### A. Interpretation (Dereferencing)

The type tells the compiler **how many bytes to read** and how to interpret them when you use the * operator.

- char *p: Reads **1 byte** at the address.
    
- int *p: Reads **4 bytes** (typically) at the address.
    
- double *p: Reads **8 bytes** at the address.
    

#### B. Pointer Arithmetic (Step Size)

The type tells the compiler how far to jump when you add to a pointer (p + 1).

- If p is char* (size 1): p + 1 moves **1 byte** forward.
    
- If p is int* (size 4): p + 1 moves **4 bytes** forward.
    
- If p is struct* (size 100): p + 1 moves **100 bytes** forward.
    

### 3. Common Pointer Types

| Declaration    | Description                        | Typical Size of Target       |
| -------------- | ---------------------------------- | ---------------------------- |
| char *p        | Points to a character (or string)  | 1 byte                       |
| int *p         | Points to an integer               | 4 bytes                      |
| double *p      | Points to a double-precision float | 8 bytes                      |
| struct Node *p | Points to a user-defined struct    | Depends on struct definition |

### 4. Special Type: void * (Generic Pointer)

- **Definition:** A pointer that has no specific data type.
    
- **Usage:** It can hold the address of **any** variable type (int, float, char).
    
- **Restrictions:**
    
    1. You **cannot dereference** it (*p is illegal) because the compiler doesn't know how many bytes to read.
        
    2. You **cannot do arithmetic** (p++ is illegal) because the compiler doesn't know the step size.
        
- **Solution:** You must **Type Cast** it to a specific type before using it. (implicit or explicit)[[Type Conversion 类型转换 | more about type conversion]]

- About the position of `const`
	- **const on the LEFT of `*`**  Protects the **Data** (Value).
	- **const on the RIGHT of `*`**  Protects the **Pointer** (Address).
	e.g. 
	`const int *p` OR `int const *p` -- **Pointer to Constant**
	`int * const p` -- **Constant Pointer**
	[[typedef | An exception in typedef]]
