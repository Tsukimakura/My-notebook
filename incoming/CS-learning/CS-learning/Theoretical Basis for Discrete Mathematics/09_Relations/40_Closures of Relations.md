## 1. Definition of Closure

The **closure** of a relation $R$ with respect to a property $\mathbf{P}$ is the relation obtained by adding the _minimum_ number of ordered pairs to $R$ necessary to satisfy property $\mathbf{P}$.

## 2. Reflexive Closure

- **Set Theory Representation**: The reflexive closure of $R$ is denoted as $r(R)$.
    
    $$r(R) = R \cup \Delta$$
    
    where the diagonal relation $\Delta = \{(a,a) \mid a \in A\}$.
    
- **Digraph Representation**: Add loops to all vertices that do not already have one.
    
- **Matrix Representation**: Insert $1$'s along the entire main diagonal of the zero-one matrix.
    

## 3. Symmetric Closure

- **Set Theory Representation**: The symmetric closure of $R$ is denoted as $s(R)$.
    
    $$s(R) = R \cup R^{-1}$$
    
- **Digraph Representation**: For every directed arc from $a$ to $b$, add a corresponding arc in the opposite direction (from $b$ to $a$).
    
- **Matrix Representation**: Ensure symmetry across the main diagonal. If $m_{ij} = 1$ and $m_{ji} = 0$, change $m_{ji}$ to $1$.
    

## 4. Transitive Closure

Finding the transitive closure is more complex than reflexive or symmetric closures because adding a single missing edge might necessitate adding further edges to maintain transitivity.

**Paths and Cycles**

- A **path** from $a$ to $b$ in a digraph $G$ is a sequence of one or more edges $(x_0, x_1), (x_1, x_2), \dots, (x_{n-1}, x_n)$ where $x_0 = a$ and $x_n = b$.
    
- The path has a **length** of $n$.
    
- If $a = b$ (the path starts and ends at the same vertex), it is called a **circuit** or **cycle**.
    
- **Theorem 1**: Let $R$ be a relation on a set $A$. There is a path of length $n$ from $a$ to $b$ if and only if $(a,b) \in R^n$.
    

**The Connectivity Relation ($R^*$)**

- **Definition**: The connectivity relation, denoted $R^*$, consists of all pairs $(a,b)$ such that there is a path of any length from $a$ to $b$.
    
    $$R^* = \bigcup_{i=1}^{\infty} R^i$$
    
- **Theorem 2**: The transitive closure of a relation $R$ (denoted $t(R)$) equals the connectivity relation $R^*$. ($t(R) = R^*$)
    
- **Lemma 1**: If $A$ is a set containing $n$ elements, and there is a path from $a$ to $b$, then there is a path with length not exceeding $n$. If $a \neq b$, there is a path with length not exceeding $n-1$.
    
    - _Conclusion from Lemma 1_: $t(R) = \bigcup_{i=1}^{n} R^i$ (You only need to compute powers up to $n$).
        

## 5. Computing Transitive Closure

There are two primary algorithms discussed for computing the transitive closure computationally.

**Algorithm 1: Using Boolean Matrix Powers**

- **Theorem 3**: $M_{R^*} = M_R \lor M_{R^2} \lor M_{R^3} \lor \dots \lor M_{R^n}$
    
- **Procedure**:
    
    1. Initialize $A := M_R$ and $B := A$.
        
    2. For $i = 2$ to $n$:
        
        - $A := A \odot M_R$ (Boolean product to find the next power)
            
        - $B := B \lor A$ (Accumulate the Boolean sum)
            
    3. Return $B$.
        
- _Complexity_: Requires $n^2(2n-1)(n-1) + (n-1)n^2 = O(n^4)$ bit operations.
    

**Algorithm 2: Warshall's Algorithm (Roy-Warshall Algorithm)**

A significantly more efficient method ($2n^3$ bit operations) for computing the transitive closure. It works by evaluating paths through "interior vertices".

- **Core Concept**: Let $W_k = [w_{ij}^{(k)}]$ be a zero-one matrix where the $(i,j)$ entry is $1$ if and only if there is a path from $v_i$ to $v_j$ such that all interior vertices of the path are within the subset $\{v_1, v_2, \dots, v_k\}$.
    
- **Recursive Formula (Lemma 2)**:
    
    $$w_{ij}^{(k)} = w_{ij}^{(k-1)} \lor (w_{ik}^{(k-1)} \land w_{kj}^{(k-1)})$$
    
    _Logic_: A path exists using the first $k$ vertices if either (a) a path already existed using only the first $k-1$ vertices, or (b) a path exists from $i$ to $k$, and another from $k$ to $j$, both using only the first $k-1$ vertices.
    
- **Procedure**:
    
    ```text
    W = M_R
    For k = 1 to n:
        For i = 1 to n:
            For j = 1 to n:
                W_ij = W_ij ∨ (W_ik ∧ W_kj)
    ```
    
    _Shortcut for manual calculation_: When updating the matrix for a specific $k$, if the column element $W_{ik} = 1$, then row $i$ becomes the logical OR of its current state and row $k$ ($W_{ij} = W_{ij} \lor W_{kj}$).