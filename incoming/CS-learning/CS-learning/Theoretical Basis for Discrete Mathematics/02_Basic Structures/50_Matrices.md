## **1. Matrices: Definition and Notation**

- **Definition:** A matrix is a rectangular array of numbers. A matrix with $m$ rows and $n$ columns is called an $m \times n$ matrix.
    
- **Applications:** Matrices are discrete structures used to describe linear transformations, express graph connections (edges between vertices), and build models for transportation and communication networks.
    
- **Square Matrix:** A matrix with the same number of rows as columns ($n \times n$).
    
- **Matrix Equality:** Two matrices are equal if they have the exact same dimensions ($m \times n$) and their corresponding entries in every position are equal.
    
- **Notation:** 
	
	- Let $A = [a_{ij}]$ denote a matrix where $a_{ij}$ is the element in the $i$-th row and $j$-th column.
	    
    - The $i$-th row of $A$ is a $1 \times n$ matrix: $[a_{i1}, a_{i2}, \dots, a_{in}]$.
        
    - The $j$-th column of $A$ is an $m \times 1$ matrix.
        

---

## **2. Matrix Arithmetic**

### **A. Matrix Addition**

- **Definition:** Let $A = [a_{ij}]$ and $B = [b_{ij}]$ be $m \times n$ matrices. Their sum, $A + B$, is the $m \times n$ matrix whose $(i,j)$-th element is $a_{ij} + b_{ij}$.
    
- **Constraint:** Matrices of different sizes cannot be added.
    
- _Example:_
    
    $$\begin{bmatrix} 1 & 0 & -1 \\ 2 & 2 & -3 \\ 3 & 4 & 0 \end{bmatrix} + \begin{bmatrix} 3 & 4 & -1 \\ 1 & -3 & 0 \\ -1 & 1 & 2 \end{bmatrix} = \begin{bmatrix} 4 & 4 & -2 \\ 3 & -1 & -3 \\ 2 & 5 & 2 \end{bmatrix}$$
    

### **B. Matrix Multiplication**

- **Definition:** Let $A$ be an $m \times k$ matrix and $B$ be a $k \times n$ matrix. The product $AB$ is the $m \times n$ matrix whose $(i,j)$-th element is the sum of the products of corresponding elements from the $i$-th row of $A$ and the $j$-th column of $B$.
    
    - Formula: $c_{ij} = a_{i1}b_{1j} + a_{i2}b_{2j} + \dots + a_{ik}b_{kj}$
        
- **Constraint:** Matrix multiplication is only defined when the number of columns in the first matrix equals the number of rows in the second matrix.
    
- **Non-Commutative Property:** In general, $AB \neq BA$. Order matters strictly.
    

---

## **3. Special Matrices and Operations**

### **A. Identity Matrix & Powers**

- **Identity Matrix ($I_n$):** A square matrix of order $n$ defined as $I_n = [\delta_{ij}]$, where $\delta_{ij} = 1$ if $i = j$ (the main diagonal), and $\delta_{ij} = 0$ if $i \neq j$.
    
    - Property: For any $m \times n$ matrix $A$, $AI_n = A$ and $I_mA = A$.
        
- **Powers of Matrices:** Defined only for square ($n \times n$) matrices.
    
    - $A^0 = I_n$
        
    - $A^r = AAA\dots A$ ($r$ times)
        

### **B. Transposes and Symmetric Matrices**

- **Transpose ($A^t$):** Let $A = [a_{ij}]$ be an $m \times n$ matrix. Its transpose $A^t$ is the $n \times m$ matrix obtained by interchanging the rows and columns of $A$.
    
    - If $A^t = [b_{ij}]$, then $b_{ij} = a_{ji}$.
        
- **Symmetric Matrix:** A square matrix $A$ is symmetric if $A = A^t$ (i.e., $a_{ij} = a_{ji}$ for all $i, j$). It remains unchanged when its rows and columns are interchanged.
    

---

## **4. Zero-One Matrices**

- **Definition:** A matrix in which all entries are strictly either 0 or 1. They are fundamental in representing discrete structures and operate on Boolean arithmetic.
    
- **Boolean Arithmetic Rules:**
    
    - **AND ($\land$):** $b_1 \land b_2 = 1$ if $b_1 = 1$ and $b_2 = 1$; otherwise $0$.
        
    - **OR ($\lor$):** $b_1 \lor b_2 = 1$ if $b_1 = 1$ or $b_2 = 1$; otherwise $0$.
        

### **A. Join and Meet**

Let $A = [a_{ij}]$ and $B = [b_{ij}]$ be $m \times n$ zero-one matrices.

- **Join ($A \lor B$):** The zero-one matrix whose $(i,j)$-th entry is $a_{ij} \lor b_{ij}$.
    
- **Meet ($A \land B$):** The zero-one matrix whose $(i,j)$-th entry is $a_{ij} \land b_{ij}$.
    

### **B. Boolean Product ($\odot$)**

- **Definition:** Let $A$ be an $m \times k$ zero-one matrix and $B$ be a $k \times n$ zero-one matrix. The Boolean product $A \odot B$ is the $m \times n$ zero-one matrix whose $(i,j)$-th entry is:
    
    $$c_{ij} = (a_{i1} \land b_{1j}) \lor (a_{i2} \land b_{2j}) \lor \dots \lor (a_{ik} \land b_{kj})$$
    
- _Note: This process perfectly mimics standard matrix multiplication, but replaces standard multiplication with Boolean AND ($\land$) and standard addition with Boolean OR ($\lor$)._
    

### **C. Boolean Powers ($A^{[r]}$)**

- **Definition:** Let $A$ be a square zero-one matrix and $r$ be a positive integer. The $r$-th Boolean power of $A$ is the Boolean product of $r$ factors of $A$.
    
    - $A^{[r]} = A \odot A \odot \dots \odot A$ ($r$ times)
        
    - $A^{[0]} = I_n$ (The identity matrix)
        
- _Property:_ Boolean products are associative, making Boolean powers well-defined. Boolean powers of a matrix often reach a fixed state $A^{[n]}$ after a certain number of iterations, where subsequent powers equal $A^{[n]}$.