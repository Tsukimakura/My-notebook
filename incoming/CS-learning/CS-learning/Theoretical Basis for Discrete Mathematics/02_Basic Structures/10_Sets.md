# Introduction

## 1. Introduction and Basic Definitions

- **Set:** An unordered collection of objects.
    
- **Elements/Members:** The objects contained within a set.
    
- **Membership Notation:** * $a \in A$ denotes that $a$ is an element of set $A$.
    
    - $a \notin A$ denotes that $a$ is _not_ a member of set $A$.
        

---

## 2. Describing Sets

### 2.1 Roster Method

All elements are explicitly listed inside curly braces.

- **Order does not matter:** $\{a, b, c, d\} = \{b, c, a, d\}$
    
- **Repetition does not matter:** Listing a distinct object more than once does not change the set: $\{a, b, c, d\} = \{a, b, c, b, c, d\}$
    
- **Ellipses ($...$):** Can be used when a pattern is clear. Example: $\{a, b, c, \dots, z\}$ or $S = \{\dots, -3, -2, -1\}$
    

### 2.2 Set-Builder Notation

Specifies a property or properties that all members must satisfy.

- **Format:** $S = \{x \mid \text{property}\}$ or using a predicate $S = \{x \mid P(x)\}$
    
- **Examples:**
    
    - $O = \{x \mid x \text{ is an odd positive integer less than } 10\}$
        
    - $O = \{x \in \mathbf{Z}^+ \mid x \text{ is odd and } x < 10\}$
        
    - Positive rational numbers: $\mathbf{Q}^+ = \{x \in \mathbf{R} \mid x = p/q, \text{ for some positive integers } p, q\}$
        

### 2.3 Interval Notation

Used for subsets of real numbers:

- **Closed interval:** $[a, b] = \{x \mid a \leq x \leq b\}$
    
- **Open interval:** $(a, b) = \{x \mid a < x < b\}$
    
- **Half-open/closed:** $[a, b) = \{x \mid a \leq x < b\}$ and $(a, b] = \{x \mid a < x \leq b\}$
    

---

## 3. Important and Special Sets

### 3.1 Common Mathematical Sets

- $\mathbf{N}$, $\mathbf{Z}$, $\mathbf{Z}$, $\mathbf{R}$, $\mathbf{R}^+$, $\mathbf{C}$, $\mathbf{Q}$ ...

### 3.2 Universal Set and Empty Set

- **Universal Set ($U$):** The set containing _everything_ currently under consideration. It can be implicit or explicitly stated, and its contents depend heavily on context. Visualized as the outer rectangle in a Venn Diagram.
    
- **Empty Set ($\emptyset$ or $\{\}$):** The set containing exactly zero elements.
    

### 3.3 Sets as Elements

Sets can themselves be elements of other sets.

---

## 4. Set Relationships

### 4.1 Set Equality

Two sets $A$ and $B$ are equal ($A = B$) if and only if they have the exact same elements.

- **Logical Definition:** $\forall x(x \in A \leftrightarrow x \in B)$
    
- **Alternative Definition:** $A = B$ if and only if $A \subseteq B$ and $B \subseteq A$.
    

### 4.2 Subsets ($A \subseteq B$)

Set $A$ is a subset of $B$ if and only if every element of $A$ is also an element of $B$.

- **Logical Definition:** $\forall x(x \in A \rightarrow x \in B)$
    
- **Universal Truths:** For every set $S$, $\emptyset \subseteq S$ and $S \subseteq S$.
    
- **Showing $A \subseteq B$:** Prove that if $x$ belongs to $A$, then $x$ must also belong to $B$.
    
- **Showing $A \not\subseteq B$:** Find a single counterexample (an element $x \in A$ where $x \notin B$).
    

### 4.3 Proper Subsets ($A \subset B$)

If $A \subseteq B$, but $A \neq B$, then $A$ is a proper subset of $B$.

- **Logical Definition:** $\forall x(x \in A \rightarrow x \in B) \land \exists x(x \in B \land x \notin A)$
    

---

## 5. Operations and Advanced Concepts

### 5.1 Set Cardinality ($|S|$)

If there are exactly $n$ distinct elements in a finite set $S$ (where $n$ is a nonnegative integer), then $n$ is the cardinality of $S$.

- **Examples:** 
	
	- $|\emptyset| = 0$
	    
    - $|\{1, 2, 3\}| = 3$
        
    - $|\{\emptyset\}| = 1$
        
- _Note:_ The set of integers is infinite (does not have a finite cardinality $n$).
    

### 5.2 Power Sets ($\mathcal{P}(A)$)

The power set of $A$ is the set of _all_ subsets of set $A$.

- **Example:** If $A = \{a, b\}$, then $\mathcal{P}(A) = \{\emptyset, \{a\}, \{b\}, \{a, b\}\}$
    
- **Cardinality rule:** If a set has $n$ elements, the cardinality of its power set is $2^n$.
    

### 5.3 Tuples and Cartesian Products

- **$n$-tuple:** An ordered collection $(a_1, a_2, \dots, a_n)$. Ordered pairs are 2-tuples. Two $n$-tuples are equal iff their corresponding elements are equal.
    
- **Cartesian Product of 2 Sets ($A \times B$):** The set of all ordered pairs $(a, b)$ where $a \in A$ and $b \in B$.
    
    - **Definition:** $A \times B = \{(a, b) \mid a \in A \land b \in B\}$
        
    - _Note:_ A subset $R$ of a Cartesian product $A \times B$ is called a _relation_.
        
- **Cartesian Product of $n$ Sets:** Generalizes to $n$-tuples.
    
    - $A_1 \times A_2 \times \dots \times A_n = \{(a_1, a_2, \dots, a_n) \mid a_i \in A_i \text{ for } i = 1, 2, \dots, n\}$
        

### 5.4 Truth Sets of Quantifiers

Given a predicate $P$ and a domain $D$, the truth set is the set of elements in $D$ for which $P(x)$ is true.

- **Notation:** $\{x \in D \mid P(x)\}$
    
- **Example:** If the domain is integers and $P(x)$ is "$|x| = 1$", the truth set is $\{-1, 1\}$.
    

---

### Russell's Paradox `(*)`

The limits of naïve set theory:

- _Paradox:_ Let $S$ be the set of all sets which are not members of themselves. Is $S$ a member of itself?
    
- _Analogy:_ Henry is a barber who shaves all people who do not shave themselves. Does Henry shave himself? (This contradiction forces modern math to use stricter axiomatic set theories).
    

---

# Set Operations

## 1. Introduction and Boolean Algebra

Set theory and propositional calculus are both instances of an algebraic system known as **Boolean Algebra**.

- The operators used in set theory directly correspond to the operators used in propositional logic (e.g., Union $\leftrightarrow$ OR, Intersection $\leftrightarrow$ AND).
    
- **Universal Set ($U$):** In all operations, it is assumed there is a universal set $U$, and all sets discussed are subsets of $U$.
    

---

## 2. Core Set Operations

### 2.1 Union ($A \cup B$)

The union of sets $A$ and $B$ is the set containing elements that are in $A$, in $B$, or in both.

- **Definition:** $A \cup B = \{x \mid x \in A \lor x \in B\}$
    

### 2.2 Intersection ($A \cap B$)

The intersection of sets $A$ and $B$ is the set containing elements that are in _both_ $A$ and $B$.

- **Definition:** $A \cap B = \{x \mid x \in A \land x \in B\}$
    
- **Disjoint Sets:** If the intersection is empty ($A \cap B = \emptyset$), the sets $A$ and $B$ are said to be disjoint.
    

### 2.3 Complement ($\bar{A}$ or $A^c$)

The complement of set $A$ (with respect to $U$) is the set of elements in $U$ that are _not_ in $A$.

- **Definition:** $\bar{A} = \{x \in U \mid x \notin A\}$
    

### 2.4 Difference ($A - B$)

The difference of $A$ and $B$ is the set containing elements that are in $A$ but _not_ in $B$. It is also called the complement of $B$ with respect to $A$.

- **Definition:** $A - B = \{x \mid x \in A \land x \notin B\} = A \cap \bar{B}$
    

### 2.5 Symmetric Difference ($A \oplus B$)

The set of elements that are in $A$ or in $B$, but not in both.

- **Definition:** $A \oplus B = (A - B) \cup (B - A)$
    

---

## 3. The Cardinality of the Union of Two Sets

To find the number of elements in the union of two sets, we use the **Principle of Inclusion-Exclusion**.

- **Formula:** $|A \cup B| = |A| + |B| - |A \cap B|$
    

---

## 4. Set Identities

These are fundamental laws (analogous to logical equivalences) used to simplify set expressions.

- **Identity Laws:** 
	
	- $A \cup \emptyset = A$
	    
    - $A \cap U = A$
        
- **Domination Laws:**
    
    - $A \cup U = U$
        
    - $A \cap \emptyset = \emptyset$
        
- **Idempotent Laws:**
    
    - $A \cup A = A$
        
    - $A \cap A = A$
        
- **Complementation Law:**
    
    - $\overline{(\bar{A})} = A$
        
- **Commutative Laws:**
    
    - $A \cup B = B \cup A$
        
    - $A \cap B = B \cap A$
        
- **Associative Laws:**
    
    - $A \cup (B \cup C) = (A \cup B) \cup C$
        
    - $A \cap (B \cap C) = (A \cap B) \cap C$
        
- **Distributive Laws:**
    
    - $A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$
        
    - $A \cup (B \cap C) = (A \cup B) \cap (A \cup C)$
        
- **De Morgan's Laws:**
    
    - $\overline{A \cup B} = \bar{A} \cap \bar{B}$
        
    - $\overline{A \cap B} = \bar{A} \cup \bar{B}$
        
- **Absorption Laws:**
    
    - $A \cup (A \cap B) = A$
        
    - $A \cap (A \cup B) = A$
        
- **Complement Laws:**
    
    - $A \cup \bar{A} = U$
        
    - $A \cap \bar{A} = \emptyset$
        

---

## 5. Proving Set Identities

1. **Mutual Subsets:** Prove that the left side is a subset of the right side, and the right side is a subset of the left side (i.e., show $X \subseteq Y$ and $Y \subseteq X$).
    
2. **Set-Builder Notation & Propositional Logic:** Expand the sets using definitions and apply known logical equivalences.
    
3. **Membership Tables:** Similar to truth tables. Use `1` to indicate an element belongs to the set and `0` to indicate it does not. Verify that the columns for both sides of the identity match identically.
    

---

## 6. Generalized Unions and Intersections

Set operations can be extended to an indexed collection of $n$ sets: $A_1, A_2, \dots, A_n$. Because union and intersection are associative, these are well-defined.

- **Generalized Union:** $\bigcup_{i=1}^n A_i = A_1 \cup A_2 \cup \dots \cup A_n$
    
- **Generalized Intersection:** $\bigcap_{i=1}^n A_i = A_1 \cap A_2 \cap \dots \cap A_n$
    

---

## 7. Computer Representation of Sets

Sets can be efficiently represented in computing using **bit strings**.

- **Method:**
    
    1. Specify an arbitrary ordering of the elements in the universal set $U$ (e.g., $a_1, a_2, \dots, a_n$).
        
    2. Represent a subset $A$ of $U$ with a bit string of length $n$.
        
    3. The $i$-th bit is `1` if $a_i \in A$, and `0` if $a_i \notin A$.
        
- **Operations:**
    
    - **Union** corresponds to a **bitwise OR**.
        
    - **Intersection** corresponds to a **bitwise AND**.
        

**Example:**

Let $U = \{1, 2, 3, 4, 5, 6, 7, 8, 9\}$.

Let $A = \{1, 2, 3, 4, 5\}$ and $B = \{1, 3, 5, 7, 9\}$.

Find the difference $A - B$ using bit strings.

- **Step 1: Translate to bit strings:**
    
    - Set $A$: `11 1110 000` (1s in positions 1 through 5)
        
    - Set $B$: `10 1010 101` (1s in odd positions)
        
- **Step 2: Apply the logical equivalent:** $A - B = A \cap \bar{B}$
    
    - Find the complement of $B$ ($\bar{B}$), which flips the bits of $B$: `01 0101 010`
        
- **Step 3: Perform Bitwise AND (Intersection):**
    
    - `11 1110 000` ($A$)
        
    - `01 0101 010` ($\bar{B}$)
        
    - `-----------` (Bitwise AND)
        
    - `01 0100 000` $\rightarrow$ This bit string translates back to the set **$\{2, 4\}$**.
        
