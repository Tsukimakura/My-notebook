## 1. What is Hashing?

**Hashing** is the process of mapping arbitrary data (Input) to a fixed-size value (Output) using an algorithm.

- **Formula:** 
    
    `H(Key)=Hash Value`
    
- **Key Properties:**
    
    1. **Deterministic:** Same input  ->  Always same output.
        
    2. **Irreversible:** You cannot reverse-engineer the input from the hash (in cryptography).
        
    3. **Collision:** When different inputs produce the same output.
        

---

## 2. The Core Link: Hash Value = Address

The most important concept to understand is **how the computer uses the Hash Value**.

- **The Logic:** The Hash Value acts as a **Pointer** or **Index**.
    
- **The Equation:**  
    
	`Memory Address=Base Address+Hash Value`
    
- **Why it matters:**
    
    - It allows **Direct Access ($O(1)$)**.
        
    - The computer does not need to "search" for data. It calculates the Hash Value and "teleports" directly to that physical location in memory.
        

> **Analogy:**
> 
> - **Input:** Guest Name ("John").
>     
> - **Hash Function:** "Count letters in name" (4).
>     
> - **Hash Value:** 4.
>     
> - **Address:** John goes directly to **Room #4**. No need to check a guest list.
>     

---

## 3. Hash Sort (Counting Sort)

**Hash Sort** is named because it uses this exact **Direct Addressing** principle to organize data.

### How it Works (The "Hash" Logic)

It uses the simplest possible Hash Function: **The Identity Function**.  $H(x)=x$

1. **Input:** The number 5.
    
2. **Hashing:** The function calculates the hash value is 5.
    
3. **Addressing:** The computer goes directly to **Index (Address) 5** in the array.
    
4. **Action:** It increments the counter at that address.
    

### Handling "Collisions"

In standard hashing, collisions (two inputs mapping to the same address) are bad.

- In **Hash Sort**, a collision simply means **Duplicate Numbers**.
    
- **Solution:** We just increment the counter (e.g., "There are two 5s").