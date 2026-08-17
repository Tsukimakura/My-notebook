## 1. Strong Induction

**Strong Induction** (also known as the second principle of mathematical induction or complete induction) is used to prove that a propositional function $P(n)$ is true for all positive integers $n$.

It consists of two steps:

1. **Basis Step:** Verify that $P(1)$ is true.
    
2. **Inductive Step:** Show that the conditional statement $[P(1) \wedge P(2) \wedge \dots \wedge P(k)] \rightarrow P(k+1)$ holds for all positive integers $k$.
    
    - _Note:_ Unlike standard mathematical induction which only assumes $P(k)$ is true, strong induction assumes that $P$ is true for _all_ integers from $1$ up to $k$.
        

**Equivalence of Methods:**

The principles of mathematical induction, strong induction, and the well-ordering property are all logically equivalent. You can always use strong induction instead of standard mathematical induction, but it is best to use whichever method simplifies the proof.

## 2. Example Proofs Using Strong Induction

**Example 1: The Infinite Ladder**

- _Problem:_ Suppose we can reach the 1st and 2nd rungs of an infinite ladder, and if we can reach a rung, we can reach two rungs higher. Prove we can reach every rung.
    
- _Basis Step:_ We can reach the 1st step.
    
- _Inductive Step:_ Assume we can reach the first $k$ rungs for an arbitrary $k \geq 2$. We must show we can reach the $(k+1)$st rung. By the inductive hypothesis, we can reach the $(k-1)$st rung. Since we can always reach two rungs higher than any reachable rung, we can step from the $(k-1)$st rung to the $(k+1)$st rung.
    

**Example 2: Fundamental Theorem of Arithmetic (Completion)**

- _Problem:_ Show that every integer $n > 1$ can be written as the product of primes.
    
- _Basis Step:_ $P(2)$ is true because 2 is a prime number.
    
- _Inductive Step:_ Assume $P(j)$ is true for all integers $j$ where $2 \leq j \leq k$. To show $P(k+1)$ holds, consider two cases:
    
    1. If $k+1$ is prime, $P(k+1)$ is trivially true.
        
    2. If $k+1$ is composite, it can be written as the product of two positive integers $a$ and $b$ where $2 \leq a \leq b < k+1$. By the strong inductive hypothesis, both $a$ and $b$ can be written as products of primes. Therefore, $k+1 = a \cdot b$ can also be written as a product of primes.
        

**Example 3: The Postage Stamp Problem**

- _Problem:_ Prove that every amount of postage of 12 cents or more can be formed using just 4-cent and 5-cent stamps.
    
- _Method 1: Using Strong Induction_
    
    - _Basis Step:_ $P(12)$ (three 4-cent), $P(13)$ (two 4-cent, one 5-cent), $P(14)$ (one 4-cent, two 5-cent), and $P(15)$ (three 5-cent) hold.
        
    - _Inductive Step:_ Assume $P(j)$ holds for $12 \leq j \leq k$, where $k \geq 15$. We need to show $P(k+1)$ holds. By the inductive hypothesis, $P(k-3)$ holds since $k-3 \geq 12$. To form $k+1$ cents, simply add one 4-cent stamp to the postage for $k-3$ cents.
        
- _Method 2: Using Standard Mathematical Induction_
    
    - _Basis Step:_ 12 cents is formed by three 4-cent stamps.
        
    - _Inductive Step:_ Assume $P(k)$ holds for $k \geq 12$. To show $P(k+1)$, consider two cases based on the $k$ cent postage:
        
        1. If at least one 4-cent stamp is used, replace it with a 5-cent stamp to yield $k+1$ cents.
            
        2. If no 4-cent stamps are used, the postage must consist of at least three 5-cent stamps (since $k \geq 12$). Replace three 5-cent stamps (15 cents) with four 4-cent stamps (16 cents) to yield $k+1$ cents.
            

## 3. Using Strong Induction in Computational Geometry

**Key Terminology:**

- **Simple Polygon:** A polygon with no intersecting sides. It divides the plane into two regions: interior and exterior.
    
- **Convex / Nonconvex:** Geometric properties of the polygon's interior angles.
    
- **Interior Diagonal:** A line segment connecting two non-adjacent vertices that lies entirely within the polygon.
    
- **Triangulation:** Dividing a polygon into non-overlapping triangles.
    

**Lemma 1:** _Every simple polygon has an interior diagonal._

- _Proof Idea:_ Find the vertex $b$ with the minimum x-coordinate. Connect its adjacent vertices $a$ and $c$. The interior angle $\angle abc$ is less than $180^{\circ}$. If the triangle $abc$ contains no other vertices of the polygon, then the segment $ac$ is an interior diagonal. If it does contain other vertices, find the vertex $p$ inside the triangle that minimizes the angle $\angle bap$. The segment $bp$ will be an interior diagonal.
    

**Theorem 1:** _A simple polygon with $n$ sides ($n \geq 3$) can be triangulated into $n-2$ triangles._

- _Basis Step:_ $T(3)$ is true because a triangle is a simple polygon with 3 sides and naturally forms $3-2=1$ triangle.
    
- _Inductive Step:_ Assume $T(j)$ is true for all integers $3 \leq j \leq k$. Suppose we have a polygon $P$ with $k+1$ sides. By Lemma 1, $P$ has an interior diagonal $ab$. This diagonal splits $P$ into two smaller simple polygons: $Q$ (with $s$ sides, $3 \leq s \leq k$) and $R$ (with $t$ sides, $3 \leq t \leq k$). By the strong inductive hypothesis, $Q$ and $R$ can be triangulated into $s-2$ and $t-2$ triangles respectively. Therefore, $P$ can be triangulated.
    

## 4. The Well-Ordering Property

**Definition:** Every nonempty set of nonnegative integers has a least element.

- This property is an axiom of the positive integers and serves as the underlying foundation for both forms of mathematical induction.
    

**Generalization of Well-Ordering:**

A set is considered _well-ordered_ if every non-empty subset has a least element under a specific relation.

- **Examples of well-ordered sets:** 
	
	- $\mathbb{N}$ (natural numbers) under the $\leq$ relation.
	    
    - The set of finite strings over an alphabet using lexicographic ordering.
        
- **Examples of non-well-ordered sets:** 
	
	- $\mathbb{Z}$ (all integers) under $\leq$ (it extends infinitely negative, so it has no smallest element).
	    
    - The open interval $(0, 1)$ (it has no least element).
        

## 5. Proofs Using the Well-Ordering Property

**Example 1: The Division Algorithm**

- _Statement:_ If $a$ is an integer and $d$ is a positive integer, there exist unique integers $q$ and $r$ with $0 \leq r < d$ such that $a = dq + r$.
    
- _Proof:_ Let $S$ be the set of nonnegative integers of the form $a - dq$, where $q$ is an integer. $S$ is nonempty. By the well-ordering property, $S$ has a least element $r = a - dq_0$. Therefore, $r \geq 0$. We must show $r < d$. Assume for contradiction that $r \geq d$. Then $a - d(q_0 + 1) = a - dq_0 - d = r - d \geq 0$. This implies $r - d$ is a nonnegative element in $S$ that is strictly smaller than $r$, which contradicts the assumption that $r$ is the least element. Thus, $0 \leq r < d$.
    

**Example 2: Round-Robin Tournaments**

- _Statement:_ In a tournament where everyone plays everyone exactly once (no ties), if there is a cycle of length $m$ ($m \geq 3$), there must be a cycle of length 3.
    
- _Proof:_ Assume for contradiction that there is no cycle of length 3, but there is at least one cycle. Let $S$ be the set of all positive integers $n$ for which a cycle of length $n$ exists. By the well-ordering property, $S$ has a least element $k$. By our assumption, $k > 3$. Consider the first three elements of this shortest cycle: $p_1, p_2, p_3$.
    
    - _Case 1:_ If $p_3$ beats $p_1$, a cycle of length 3 is formed ($p_1, p_2, p_3$), contradicting the assumption.
        
    - _Case 2:_ If $p_1$ beats $p_3$, a shorter cycle is formed ($p_1, p_3, \dots, p_k$) of length $k-1$, contradicting the assumption that $k$ is the least element in $S$.
        
    - Since both possible outcomes form a contradiction, a cycle of length 3 must exist.