## 1. Introduction and Core Definitions

- **Definition of a Function:** Let $A$ and $B$ be nonempty sets. A function $f$ from $A$ to $B$, denoted $f: A \rightarrow B$, is an assignment of exactly one element of $B$ to each element of $A$.
    
    - We write $f(a) = b$ if $b$ is the unique element of $B$ assigned by the function $f$ to the element $a$ of $A$.
        
- **Relation Perspective:** A function $f: A \rightarrow B$ can also be defined as a subset of the Cartesian product $A \times B$ (a relation), with the strict condition that no two elements of the relation share the same first element.
    
    - Logical notation: $\forall x, y_1, y_2 [((x, y_1) \in f \land (x, y_2) \in f) \rightarrow y_1 = y_2]$
        

### 1.1 Key Terminology

Given a function $f: A \rightarrow B$ where $f(a) = b$:

- **Domain:** Set $A$ is the domain of $f$.
    
- **Codomain:** Set $B$ is the codomain of $f$.
    
- **Image:** $b$ is called the image of $a$ under $f$.
    
- **Preimage:** $a$ is called the preimage of $b$.
    
- **Range:** The set of _all_ images of points in $A$ under $f$, denoted $f(A)$. (Note: The range is a subset of the codomain).
    
- **Function Equality:** Two functions are equal if they have the same domain, the same codomain, and map each element of the domain to the same element of the codomain.
    

### 1.2 Functions on Sets

If $f: A \rightarrow B$ and $S$ is a subset of $A$ ($S \subseteq A$), then the image of the subset $S$ under $f$ is:

$$f(S) = \{f(s) \mid s \in S\}$$

---

## 2. Representing Functions

Functions can be specified in several different ways:

1. **Explicit Statement:** A direct mapping assignment (e.g., mapping diagrams showing "Student $\rightarrow$ Grade").
    
2. **Formula:** A mathematical equation (e.g., $f(x) = x + 1$).
    
3. **Computer Program:** An algorithm or code block (e.g., a Java function that calculates the $n$-th Fibonacci number).
    

---

## 3. Types of Functions (Mapping Properties)

### 3.1 Injections (One-to-One)

A function $f$ is injective (one-to-one) if and only if $f(a) = f(b)$ implies that $a = b$ for all $a, b$ in the domain. In simpler terms, no two different elements in the domain map to the same element in the codomain.

### 3.2 Surjections (Onto)

A function $f: A \rightarrow B$ is surjective (onto) if and only if for every element $b \in B$ there is an element $a \in A$ with $f(a) = b$. This means the range is perfectly equal to the codomain.

### 3.3 Bijections (One-to-One Correspondence)

A function is a bijection if it is **both** injective (one-to-one) and surjective (onto).

---

## 4. Inverse Functions ($f^{-1}$)

Let $f$ be a bijection from $A$ to $B$. The inverse function of $f$, denoted $f^{-1}$, is the function from $B$ to $A$ defined as:

$$f^{-1}(y) = x \iff f(x) = y$$

- **Crucial Rule:** An inverse function _only_ exists if $f$ is a bijection.
    

---

## 5. Function Composition ($f \circ g$)

Let $g: A \rightarrow B$ and $f: B \rightarrow C$. The composition of $f$ with $g$, denoted $f \circ g$, is the function from $A$ to $C$ defined by:

$$(f \circ g)(x) = f(g(x))$$

- **Order of Operations:** The inner function $g$ is evaluated first, and its output becomes the input for the outer function $f$.
    
- **Requirement:** $f \circ g$ is only defined if the range of $g$ is a subset of the domain of $f$.
    
- **Commutativity:** Generally, $f \circ g \neq g \circ f$.
    

---

## 6. Graphs of Functions

Let $f$ be a function from set $A$ to set $B$. The graph of the function $f$ is the set of ordered pairs $\{(a, b) \mid a \in A \land f(a) = b\}$. These can be plotted on a coordinate plane (e.g., $f(x) = x^2$).

---

## 7. Important Special Functions

### 7.1 Floor and Ceiling Functions

These functions map real numbers to integers.

- **Floor Function ($\lfloor x \rfloor$):** The largest integer less than or equal to $x$.
    
    - _Examples:_ $\lfloor 3.5 \rfloor = 3$, $\lfloor -1.5 \rfloor = -2$
        
- **Ceiling Function ($\lceil x \rceil$):** The smallest integer greater than or equal to $x$.
    
    - _Examples:_ $\lceil 3.5 \rceil = 4$, $\lceil -1.5 \rceil = -1$
        

**Useful Properties (where $n$ is an integer, $x$ is a real number):**

1. $\lfloor x \rfloor = n \iff n \leq x < n + 1$
    
2. $\lceil x \rceil = n \iff n - 1 < x \leq n$
    
3. $x - 1 < \lfloor x \rfloor \leq x \leq \lceil x \rceil < x + 1$
    
4. $\lfloor -x \rfloor = -\lceil x \rceil$ and $\lceil -x \rceil = -\lfloor x \rfloor$
    
5. $\lfloor x + n \rfloor = \lfloor x \rfloor + n$
    

### 7.2 Factorial Function ($n!$)

$f: \mathbf{N} \rightarrow \mathbf{Z}^+$. The product of the first $n$ positive integers.

- $f(n) = 1 \cdot 2 \cdot \dots \cdot (n-1) \cdot n$
    
- **Base Case:** $f(0) = 0! = 1$
    
- **Stirling's Formula** (Approximation for large $n$): $n! \sim \sqrt{2\pi n}(n/e)^n$
    

---

## 8. Partial Functions

A partial function $f$ from set $A$ to set $B$ assigns a unique element in $B$ to each element $a$ in a _subset_ of $A$.

- **Domain of Definition:** The specific subset of $A$ for which the function provides a mapping. The function is considered _undefined_ for elements in $A$ outside this subset.
    
- **Total Function:** If the domain of definition is equal to the entire set $A$.
    
- **Example:** $f: \mathbf{Z} \rightarrow \mathbf{R}$ where $f(n) = \sqrt{n}$. This is a partial function because it is undefined for negative integers; its domain of definition is the set of nonnegative integers.
    
