#### **1. The Core Concept**

Pointer comparison evaluates the **memory addresses** held by the pointers, not the values stored at those addresses.

- **Result:** In C, comparison operators return an int: 1 for **true** and 0 for **false**.
    

#### **2. Equality Operators (`==, !=`)**

- **Purpose:** To check if two pointers point to the exact same memory location (or if both are NULL).
    
- **Syntax:**
    
    - ptr1 == ptr2: Returns 1 if addresses are identical.
        
    - ptr1 != ptr2: Returns 1 if addresses are different.
        
- **Valid Comparisons:**
    
    - Pointers of the **same type**.
        
    - One pointer and void*.
        
    - Any pointer and NULL.
        

#### **3. Relational Operators (<, >, <=, >=)**

- **Purpose:** To determine the order of pointers in memory (lower address vs. higher address).
    
- **Strict Rule (The "Same Array" Rule):**
    
    - Relational comparisons are guaranteed to be valid **ONLY** if both pointers point to elements **within the same array** (or the position just past the last element).
        
- **Behavior:**
    
    - ptr1 < ptr2: True if ptr1 points to an earlier element (lower index) than ptr2.
        
    - **Undefined Behavior:** Comparing pointers to completely unrelated variables (e.g., two different int variables declared separately) is undefined and unsafe, even if it compiles.
        

#### **4. Checking for NULL**

- **NULL Macro:** Represents a null pointer constant (defined in <stddef.h>, <stdio.h>, etc.).
    
- **Common Idioms:**
    
    - Explicit: if (ptr == NULL)
        
    - Implicit: if (!ptr) (Checks if pointer is NULL)
        
    - Implicit: if (ptr) (Checks if pointer is NOT NULL)
        

#### **5. Important Constraints**

- **Type Mismatch:** Comparing incompatible pointer types (e.g., int* vs char*) generally causes a compiler warning and is unsafe without explicit casting.
    
- **Struct Padding:** Be careful when comparing pointers within structures; while struct members increase in address order, there may be padding bytes between them.


### **Quick Summary Table**

|   |   |   |   |
|---|---|---|---|
|Operator|Usage|Return Value|Constraint|
|==, !=|Check identity|int (0 or 1)|Same type or void*/NULL|
|<, >|Check order|int (0 or 1)|**Must be same array**|
|!ptr|Check Null|int (0 or 1)|Works on any pointer|