## I. Traversal Algorithms

A **traversal algorithm** is a procedure for systematically visiting every vertex of an ordered rooted tree exactly once. Tree traversals are defined recursively. There are three primary traversal methods:

### 1. Preorder Traversal

**Definition:** Let $T$ be an ordered tree with root $r$. If $T$ has only $r$, then $r$ is the preorder traversal of $T$. Otherwise, suppose $T_1, T_2, \dots, T_n$ are the subtrees at $r$ from left to right. The preorder traversal begins by visiting $r$, then traverses $T_1$ in preorder, then $T_2$ in preorder, and so on, until $T_n$ is traversed.

**For a Binary Ordered Tree:**

1. Visit the **root** (Visit first).
    
2. Visit the **left subtree** using preorder.
    
3. Visit the **right subtree** using preorder.
    

### 2. Inorder Traversal

**Definition:** Let $T$ be an ordered tree with root $r$. If $T$ has only $r$, then $r$ is the inorder traversal of $T$. Otherwise, suppose $T_1, T_2, \dots, T_n$ are the left to right subtrees at $r$. The inorder traversal begins by traversing $T_1$ in inorder, then visits $r$, then traverses $T_2$ in inorder, and so on, until $T_n$ is traversed.

**For a Binary Ordered Tree:**

1. Visit the **left subtree** using inorder.
    
2. Visit the **root** (Visit second).
    
3. Visit the **right subtree** using inorder.
    

### 3. Postorder Traversal

**Definition:** Let $T$ be an ordered tree with root $r$. If $T$ has only $r$, then $r$ is the postorder traversal of $T$. Otherwise, suppose $T_1, T_2, \dots, T_n$ are the left to right subtrees at $r$. The postorder traversal begins by traversing $T_1$ in postorder, then traverses $T_2$ in postorder, until $T_n$ is traversed, and finally ends by visiting $r$.

**For a Binary Ordered Tree:**

1. Visit the **left subtree** using postorder.
    
2. Visit the **right subtree** using postorder.
    
3. Visit the **root** (Visit last).
    

## II. Binary Expression Trees

Complicated expressions (such as arithmetic expressions, compound propositions, or combinations of sets) can be represented using **ordered rooted trees**, specifically a **Binary Expression Tree**.

**Key Characteristics:**

- **Leaf nodes** contain a single **operand** (e.g., numbers, variables).
    
- **Nonleaf nodes** (internal vertices) contain a single **operator** (e.g., +, -, *, /).
    
- The left and right subtrees of an operator node represent subexpressions that must be evaluated _before_ applying the operator at the root of the subtree.
    

## III. Expression Notations (Infix, Prefix, and Postfix)

By traversing a binary expression tree using the three different algorithms, we obtain three distinct ways to write mathematical expressions without ambiguity.

- **Prefix Form (Polish Notation):**
    
    - Obtained by a **preorder traversal** of the binary expression tree.
        
    - _Operators precede their operands._
        
    - Example: $+ * 3 \ln + x 1 / a \uparrow x 2$
        
- **Infix Form:**
    
    - Obtained by an **inorder traversal** of the binary expression tree.
        
    - Produces a fully parenthesized expression (parentheses are required to maintain the order of operations).
        
    - _Operators are between their operands._
        
    - Example: $(3 * \ln(x + 1)) + (a / (x \uparrow 2))$
        
- **Postfix Form (Reverse Polish Notation):**
    
    - Obtained by a **postorder traversal** of the binary expression tree.
        
    - _Operands precede their operators._
        
    - Example: $3\ x\ 1 + \ln * a\ x\ 2 \uparrow / +$
        

## IV. Evaluating Binary Expression Trees

When an expression tree is used to represent an expression, the levels of the nodes indicate their relative precedence of evaluation.

- Operations at **higher levels** of the tree (closer to the root) are evaluated **later** than those below them.
    
- The operation at the **root** is always the **last** operation performed.
    

**Evaluation Methods based on Notation:**

1. **Postfix Form:** Can be evaluated sequentially from **left to right**. As you read left to right, whenever you encounter an operator, you apply it to the immediately preceding operands.
    
    - _Example:_ $8\ 5 - 4\ 2 + 3 / *$ evaluates to $(8-5) * ((4+2)/3) = 3 * (6/3) = 3 * 2 = 6$.
        
2. **Prefix Form:** Can be evaluated sequentially from **right to left**. As you read right to left, whenever you encounter an operator, you apply it to the immediately following operands.
    
    - _Example:_ $* - 8\ 5 / + 4\ 2\ 3$ evaluates to the same result.