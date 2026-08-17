# 15_Hashing and Dynamic Searching

## I. Introduction to Searching Methods

Searching algorithms transition from strict structural requirements to mathematical calculations to improve efficiency.

- **Binary Search:** Requires a strictly sorted, static array. Search time is $O(\log n)$.

- **Search Trees (e.g., BST):** Relaxes strict array requirements to handle dynamic searching (insertions/deletions). Time complexity depends on the height of the tree.

- **Hashing:** Abandons object comparison entirely. Instead, it uses mathematical computation to map a key directly to a memory address, aiming for $O(1)$ time complexity for insertions, deletions, and lookups.

## II. Core Concepts of Hashing

Hashing relies on two main components: a **Hash Function** and a **Collision Resolution Strategy**.

- **The Hash Function ($f(x)$):** Takes an input object (key $X$) and calculates a resulting address ($Y$).

- **Uniform Distribution:** A good hash function distributes keys evenly across the available memory space to minimize collisions.

- **Loading Density ($\lambda$):** The ratio of the number of elements ($N$) to the total table size. Keeping $\lambda$ low (typically $< 0.5$ for open addressing) is crucial for maintaining performance.

- **Identifier Density:** The ratio of the number of elements actually stored in the hash table ($N$) to the total number of all theoretically possible keys or identifiers ($T$) in the entire key space.

	- _Formula:_ $N / T$

	- _Distinction:_ While Loading Density compares the number of elements to the _physical memory space_ (table size), Identifier Density compares the number of elements to the _logical key space_. Because the total possible key space is usually massive (e.g., all possible string combinations), the Identifier Density is typically a very small fraction close to 0.

- **Collision:** Occurs when two different keys calculate to the same address ($f(X_1) = f(X_2)$). Because the potential key space is vastly larger than the available memory, collisions are inevitable.

### Real-World Applications

- **Compilers:** Managing Symbol Tables (mapping variables to their data types and properties).

- **Search Engines:** Managing Inverted Indices (finding the intersection of documents containing specific keywords).

- **Blockchain & Data Integrity:** Generating 256-bit cryptographic "fingerprints." The address space ($2^{256}$) is so massive that the probability of a collision is virtually zero, making it ideal for verifying data integrity.

## III. Designing Hash Functions

The design depends heavily on the data type of the key.

### 1. Hash Functions for Integers

- **Modulo Division (Most Common):** $f(x) = x \pmod{P}$. To minimize bias and clustering, $P$ should ideally be a prime number.

- **Mid-Square Method:** Square the integer and extract the middle digits. This ensures that changes in any part of the original number affect the final hash value.

- **Folding Method:** Split the number into equal-length segments and add them together (e.g., breaking a long phone number into pairs of digits and summing them).

- **Digit Analysis:** Analyze the dataset and extract the digits that show the most uniform distribution (e.g., using the last two digits of a student ID rather than the first two, which might be identical for an entire cohort).

### 2. Hash Functions for Strings

- **Simple ASCII Sum (Poor strategy):** Adding the ASCII values of characters. If the string is short, the resulting hash values will cluster at the very beginning of a large table, leaving the rest of the table empty.

- **Polynomial/Shift-and-Add (Optimized strategy):** Treat the string as a base-32 number (to allow fast bitwise shifting). Multiply the accumulated hash value by 32 (via a 5-bit left shift `HashVal << 5`) and add the next character's value.

```c
/**
 * Efficient string hashing function using a left-shift and add strategy.
 * @param Key The string to be hashed.
 * @param TableSize The size of the hash table (should ideally be a prime number).
 * @return The calculated hash index.
 */
unsigned int Hash(const char *Key, int TableSize) {
    unsigned int HashVal = 0;

    // Iterate through each character of the string
    while (*Key != '\0') {
        // Left shift by 5 (equivalent to HashVal * 32) and add the ASCII value
        HashVal = (HashVal << 5) + *Key++;
    }

    return HashVal % TableSize;
}
```

## IV. Collision Resolution Strategies

When a calculated slot is already occupied, the system must have a strategy to find or create an alternative location.

### 1. Separate Chaining

- **Mechanism:** The hash table is an array of pointers. Each index points to the head of a linked list. All elements that hash to the same value are chained together in that list.

- **Advantages:** Can handle loading densities $> 1$. The table never strictly "fills up," though search times will degrade to $O(N)$ if chains become too long.

- **Performance with Duplicates:** If the application allows duplicate elements in a Separate Chaining hash table, **insertions are inherently faster than deletions**. A new element can be inserted at the `head` of the linked list in $O(1)$ time. A deletion, however, requires an $O(L)$ sequential search (where $L$ is the length of the list) to find the correct node before removing it.

```c
#include <stdlib.h>
#include <string.h>

// Type definitions
typedef const char* ElementType;
struct ListNode;
typedef struct ListNode *Position;
typedef Position List;

struct HashTbl;
typedef struct HashTbl *HashTable;

// Node for the linked list (Chaining)
struct ListNode {
    ElementType Element;
    Position Next;
};

// Hash Table structure containing an array of linked lists
struct HashTbl {
    int TableSize;
    List *TheLists;
};

/**
 * Inserts a new key into a Separate Chaining Hash Table.
 * Assumes Find() and Hash() are already implemented.
 */
void Insert_Chaining(ElementType Key, HashTable H) {
    Position Pos, NewCell;
    List L;

    // Check if the key is already in the table
    Pos = Find(Key, H);

    if (Pos == NULL) { // Key is not found, safe to insert
        NewCell = malloc(sizeof(struct ListNode));
        if (NewCell == NULL) {
            // Handle memory allocation failure
            return;
        }

        // Find the correct list (bucket) using the Hash function
        L = H->TheLists[Hash(Key, H->TableSize)];

        // Insert the new cell at the front of the list (after the header)
        NewCell->Next = L->Next;
        NewCell->Element = Key; // Note: In practice, use strdup(Key) for safe memory management
        L->Next = NewCell;
    }
}
```

### 2. Open Addressing

Instead of using linked lists, Open Addressing stores all elements directly within the hash table array. If a collision occurs, it probes for the next available empty slot using a predefined offset sequence.

- **Linear Probing:** $f(i) = i$. If the target slot is full, check the very next slot, and so on.

    - _Drawback:_ Causes **Primary Clustering**. Collisions tend to group together, causing subsequent insertions to take increasingly longer to find an empty slot.

	- **Linear Probing Cost Asymmetry:** In linear probing, the expected number of probes required to insert a new element is strictly **greater** than the expected number of probes required for a successful search. Inserting a new element acts as an _unsuccessful search_, forcing the algorithm to traverse an entire cluster to find an empty slot. A successful search typically terminates midway through a cluster.

- **Quadratic Probing:** $f(i) = i^2$. The offset jumps by perfect squares ($+1, +4, +9, +16$).

    - _Mathematical Guarantee:_ If the table size is a prime number AND the table is strictly less than half full ($\lambda < 0.5$), you are mathematically guaranteed to find an empty slot.

    - _Optimization:_ You do not need to compute heavy multiplications for $i^2$. You can calculate the next position using the previous position: `NextPos = CurrentPos + 2i - 1`.

- **Double Hashing:** Uses a second hash function to determine the step size for probing.

	- **Degeneration Risk in Double Hashing:** The probe sequence formula is $H_i(k) = (H(k) + i \times Hash_2(k)) \pmod{M}$. If the secondary hash function evaluates to a constant $1$ (i.e., $Hash_2(k) = 1$), the formula simplifies to $(H(k) + i) \pmod{M}$. In this scenario, Double Hashing becomes mathematically equivalent to standard **Linear Probing**, completely losing its advantage of preventing primary clustering.

## V. Handling Deletions (Lazy Deletion)

In an Open Addressing hash table, you **cannot** simply physically delete an element and leave the slot completely empty.

- **The Problem:** Open addressing relies on "jumping" over occupied slots to find displaced elements. If you empty a slot, subsequent searches for elements that were forced further down the probe sequence will hit the empty slot, assume the element doesn't exist, and fail incorrectly.

- **The Solution (Lazy Deletion):** Instead of removing the item, update a status flag in the slot to `Deleted`.

    - During a search, if you hit a `Deleted` slot, you know to keep probing.

    - During an insertion, a `Deleted` slot can be overwritten with new data.

```c
// Define the states for Lazy Deletion in Open Addressing
enum KindOfEntry { Legitimate, Empty, Deleted };

// Structure for a single hash table cell
struct HashEntry {
    ElementType Element;
    enum KindOfEntry Info;
};

// Open Addressing Hash Table structure
typedef struct HashEntry Cell;
struct HashTblOpen {
    int TableSize;
    Cell *TheCells;
};
typedef struct HashTblOpen *HashTableOpen;

/**
 * Inserts a key into an Open Addressing Hash Table.
 * Assumes Find() handles the collision resolution (Linear/Quadratic probing).
 */
void Insert_OpenAddressing(ElementType Key, HashTableOpen H) {
    Position Pos;

    // Find the appropriate position for the key
    Pos = Find(Key, H);

    // If the cell is NOT Legitimate (it is Empty or Deleted), we can insert
    if (H->TheCells[Pos].Info != Legitimate) {
        H->TheCells[Pos].Info = Legitimate;
        H->TheCells[Pos].Element = Key; // Note: In practice, use strdup(Key)
    }
    // If it IS Legitimate, the key is already in the table, do nothing.
}
```

## VI. Rehashing

As the hash table fills up, performance degrades significantly due to increased collisions.

- **Triggers:** Rehashing is typically triggered when the loading density $\lambda$ exceeds $0.5$, or when an insertion fails.

- **The Process:**

	1. Allocate a new table roughly twice the size of the original (specifically, the next prime number up from double the size).

    2. Iterate through the old table and **recalculate** the hash values for every existing element based on the new table size.

    3. Insert them into the new table. (You cannot simply copy elements over, as their modulo results have changed).

- **Complexity:** Rehashing takes $O(N)$ time, but because it happens infrequently, the amortized cost per insertion remains $O(1)$.

## VII. Exam/Analytical Strategy: Reconstructing Input Sequences

A common advanced problem involves providing a fully populated hash table, the hash function, and the collision resolution strategy, then asking for the **original input sequence**.

- **Key Insight:** If an element is sitting in its natural hash slot (i.e., no offset was applied), it implies there were no prior collisions for that slot. If an element is displaced, the elements occupying its intended slot _must_ have been inserted before it.

- **Solution Method:** This creates a dependency graph. Solving the problem is equivalent to performing a **Topological Sort** on the elements to find the valid order of insertions.

## VIII. Performance Metrics and Complexity Analysis

To formally evaluate the efficiency of a hash table, we analyze its time complexity and average probing lengths.

- **Time Complexity Parity:** The `insert` and `find` operations share the exact same time complexity profile. Assuming a uniform hash function and a well-maintained loading density, the average time complexity for both is $O(1)$. In the absolute worst-case scenario (e.g., every single key hashes to the same index), both operations degrade to $O(N)$.

- **Average Search Length (ASL):** The definitive metric for measuring the real-world efficiency of a hash table.

    - **ASL for Successful Searches:** Calculated as the sum of the number of probes (comparisons) required to locate every existing element, divided by the total number of elements in the table.

    - _Example:_ If inserting three elements required 1, 2, and 3 probes respectively, the ASL for finding them later is $(1 + 2 + 3) / 3 = 2.0$.

---

## IX. Advanced Collision Resolution: Robin Hood Hashing

Introduced by Pedro Celis in 1986, **Robin Hood Hashing** is an open addressing collision resolution strategy designed to improve upon the worst-case search times of standard linear probing.

### 1. Core Philosophy and Mechanism

The underlying philosophy is to **"rob the rich in order to give to the poor."** Its primary goal is to reduce the variance in look-up costs by balancing the displacement of keys.

- **Probe Distance ($d(x)$):** The algorithm tracks how far an element is from its ideal hashed position.

    - _Formula:_ $d(x) = (g(x) - h(x)) \pmod{\text{TableSize}}$

    - $g(x)$ is the actual occupied position, and $h(x)$ is the originally calculated hash position.

- **The "Robbery" Concept:** * A **"rich"** key is one that is placed very close to its original hash index (small $d(x)$).

    - A **"poor"** key is one that has been displaced far from its original hash index (large $d(x)$).

    - During insertion, as the probe sequence advances, the algorithm compares the probe distance of the incoming key with the probe distance of the key currently occupying the slot. If the incoming key is "poorer" ($d(\text{incoming}) > d(\text{current})$), it "robs" the slot. The displaced element is then pushed forward to find a new slot.

### 2. Performance Characteristics and Trade-offs

Robin Hood Hashing fundamentally alters the performance profile of an open-addressed hash table:

- **Expected Probes:** Maintains the same asymptotic growth as linear probing but achieves slightly lower expected probes on average.

- **Worst-Case Improvement:** Provides a significant improvement in worst-case search behavior, reducing the maximum search length from $O(N)$ to $O(\log N)$.

- **Load Factor Tolerance:** Offers highly predictable performance even when the table is highly populated (high load factor tolerance).

- **Drawbacks:** * Insertions become slower due to the potential for multiple swaps (displacements) during a single insertion.

    - Deletions are inherently more complex.

    - Requires a higher memory footprint, as each cell in the hash table must store its current probe distance.

### 3. Implementation

To implement Robin Hood Hashing, the standard hash table cell structure must be modified to include a displacement (`Disp`) tracker.

```c
/**
 * Inserts a new key using the Robin Hood Hashing strategy.
 * Assumes a swap() utility function exists and that the HashEntry
 * structure has an added integer field 'Disp' to track probe distance.
 */
bool RobinHood_Insert(ElementType Key, HashTable H) {
    // Calculate the initial hash value
    Position Pos = Hash(Key, H->TableSize);
    Position Hv = Pos; // Store original hash to detect full table

    int CurrentDisp = 0;
    ElementType currentKey = Key;

    while (true) {
        // If the current slot is available, insert the element
        if (H->TheCells[Pos].Info != Legitimate) { /* Empty or deleted */
            H->TheCells[Pos].Info = Legitimate;
            H->TheCells[Pos].Element = currentKey;
            H->TheCells[Pos].Disp = CurrentDisp;
            return true;
        }

        // "Rob the rich": If the incoming key is poorer than the occupying key
        if (CurrentDisp > H->TheCells[Pos].Disp) {
            swap(&currentKey, &H->TheCells[Pos].Element);
            swap(&CurrentDisp, &H->TheCells[Pos].Disp);
        }

        // Move to the next slot (Linear Probing step)
        Pos = (Pos + 1) % H->TableSize;

        // If we have looped entirely around, the table is full
        if (Pos == Hv) {
            return false;
        }

        // Increment the probe distance for the key currently being shifted
        CurrentDisp++;
    }
}
```
