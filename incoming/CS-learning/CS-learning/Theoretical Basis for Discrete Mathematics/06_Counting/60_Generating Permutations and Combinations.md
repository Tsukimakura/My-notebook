## 1. Generating Permutations

**Problem:** List all $n!$ permutations of a set of $n$ elements.

**General Strategy:** Map the $n$ elements to the integers $\{1, 2, \dots, n\}$. Generate all permutations of these integers in increasing lexicographic order, then map the integers back to the original elements.

### Lexicographic Ordering

A permutation $a_1a_2\dots a_n$ precedes another permutation $b_1b_2\dots b_n$ if, for some index $k$ (where $1 \le k \le n$), the following conditions hold:

- $a_i = b_i$ for all $i < k$
    
- $a_k < b_k$
    

_Example:_ $123465$ precedes $124635$ because they share the prefix $12$, and at the third position, $3 < 4$.

### Algorithm: Finding the Next Larger Permutation

Given a permutation $a_1a_2\dots a_n$, follow these steps to find the exact next permutation in lexicographic order:

1. **Find the Pivot:** Locate the largest index $j$ such that $a_j < a_{j+1}$.
    
    _(If no such $j$ exists, the permutation is the last one, sorted in descending order)._
    
2. **Find the Successor:** Look at the elements to the right of the pivot ($a_{j+1}, \dots, a_n$). Find the smallest integer in this suffix that is strictly greater than $a_j$. Let's say this integer is at position $k$.
    
3. **Swap:** Swap the values of $a_j$ and $a_k$.
    
4. **Sort the Suffix:** Arrange the remaining elements after the original position $j$ in strictly increasing order. _(Because the suffix was previously in decreasing order, this step can be achieved simply by reversing the suffix sequence)._
    

**Example Walkthrough:**

Find the next larger permutation in lexicographic order after **$124653$**.

- **Step 1:** Compare adjacent elements from right to left to find $a_j < a_{j+1}$. Here, $4 < 6$. So, the pivot is $a_3 = 4$.
    
- **Step 2:** Look at the suffix $\{6, 5, 3\}$. The smallest number greater than $4$ is $5$.
    
- **Step 3:** Swap $4$ and $5$. The sequence becomes $125643$.
    
- **Step 4:** Sort the new suffix $\{6, 4, 3\}$ in increasing order to get $\{3, 4, 6\}$.
    
- **Result:** The next permutation is **$125346$**.
    

---

## 2. Generating All Combinations (Subsets)

**Problem:** Generate all combinations (subsets) of a finite set with $n$ elements.

**General Strategy:** Represent each subset using a bit string of length $n$. Generate all $2^n$ bit strings in order of their increasing binary value.

### Algorithm: Finding the Next Bit String

Start with the bit string $000\dots0$ (the empty set) and successively find the next larger binary expansion until reaching $111\dots1$ (the universal set).

To find the next larger bit string:

1. Locate the first position from the right that is a `0`.
    
2. Change this `0` to a `1`.
    
3. Change all `1`s to the right of this position into `0`s.
    

_Example:_ Find the next bit string after $1000110011$.

- The rightmost `0` is at the 3rd position from the right (before the final `11`).
    
- Change that `0` to `1`. Change the subsequent `11` to `00`.
    
- **Result:** $1000110100$.
    

---

## 3. Generating $r$-Combinations

**Problem:** Generate all $r$-combinations of the set $\{1, 2, \dots, n\}$.

**General Strategy:** Represent each $r$-combination as a strictly increasing sequence of $r$ integers. Start with the smallest lexicographic sequence $S_1 = \{1, 2, \dots, r\}$ and methodically increment the values from right to left.

### Algorithm: Finding the Next $r$-Combination

Given a current $r$-combination $S = \{a_1, a_2, \dots, a_r\}$, find the next valid combination:

1. **Identify the Increment Target:** Locate the rightmost element $a_i$ that has not yet reached its maximum allowable value.
    
    _(The maximum allowable value for the element at position $i$ is $n - r + i$)._
    
2. **Increment:** Replace $a_i$ with $a_i + 1$.
    
3. **Reset Subsequent Elements:** For all positions $j$ to the right of $i$ (i.e., for $j = i+1, i+2, \dots, r$), reset the value to be strictly one greater than the element before it.
    
    _(Formulaically: $a_j = a_i + j - i$, using the newly incremented $a_i$)._
    

**Example Walkthrough:**

Given the set $\{1, 2, \dots, 10\}$, find the next 6-combination after $S_i = \{2, 3, 5, 6, 9, 10\}$.

- Here, $n = 10$, $r = 6$.
    
- **Step 1:** Find the rightmost element not at its maximum.
    
    - $a_6 = 10$. Max is $10 - 6 + 6 = 10$. (At max).
        
    - $a_5 = 9$. Max is $10 - 6 + 5 = 9$. (At max).
        
    - $a_4 = 6$. Max is $10 - 6 + 4 = 8$. ($6 < 8$, so this is our target $a_i$).
        
- **Step 2:** Increment $a_4$ from $6$ to $7$.
    
- **Step 3:** Reset elements to the right to form a consecutive sequence.
    
    - $a_5$ becomes $7 + 1 = 8$.
        
    - $a_6$ becomes $8 + 1 = 9$.
        
- **Result:** The next combination is **$S_{i+1} = \{2, 3, 5, 7, 8, 9\}$**.