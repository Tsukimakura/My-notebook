## I. Binary Search Trees (BST)

Binary search trees are used to store items in a structured way that enables highly efficient searching and sorting operations.

### 1. Core Concepts

- **Definition:** An ordered rooted binary tree where each vertex contains a distinct **key value**.
    
- **The BST Property:** For any given vertex in the tree:
    
    - Its key value is **greater than** every key value in its left subtree.
        
    - Its key value is **less than** every key value in its right subtree.
        

### 2. Construction and Insertion

The shape of a binary search tree is strictly determined by its key values and the order in which they are inserted.

- **Initialization:** The first value inserted automatically becomes the root of the tree.
    
- **Insertion Process:** To insert a new value, begin at the root and compare the new value to the current vertex's key:
    
    - If it is **less**, move to the left child.
        
    - If it is **greater**, move to the right child.
        
    - Continue this process down the tree until an empty spot (null child) is found, and insert the new value there as a leaf.
        

### 3. Computational Complexity

The efficiency of locating or adding an item depends on the tree's height.

- **Worst-Case:** The maximum number of comparisons needed to find or insert an item is equal to the length of the longest path from the root to a leaf.
    
- **Balanced BST:** If a binary search tree containing $n$ items is balanced, locating or adding an item requires no more than $\lceil \log(n+1) \rceil$ comparisons.
    

## II. Decision Trees

Rooted trees can be used to model problems in which a sequence of decisions systematically leads to a solution.

- **Concept:** A **decision tree** is a rooted tree where each internal vertex corresponds to a specific decision or test. The subtrees branching from these vertices represent the possible outcomes of that decision.
    
- **Application Example:** Counterfeit coin detection. A decision tree can model the process of finding one lighter counterfeit coin among a group using a balance scale, where each internal node is a weighing action and the branches represent the scale tipping left, right, or remaining balanced.
    

## III. Prefix Codes

When encoding characters (like the English alphabet) into bit strings, using varying lengths of bit strings can drastically improve coding efficiency.

### 1. The Prefix Property

- **Problem:** Variable-length codes can create ambiguity during decoding if the code for one letter forms the beginning of the code for another letter (e.g., if "e" is `0` and "a" is `01`).
    
- **Solution (Prefix Codes):** To ensure definite meaning and unambiguous decoding, a coding system must guarantee that **no bit string corresponds to the first part of another bit string**. Codes with this property are called prefix codes.
    

### 2. Constructing Prefix Codes with Trees

Prefix codes can be easily constructed and visualized using a binary tree:

- The **left edge** extending from each internal vertex is labeled `0`.
    
- The **right edge** extending from each internal vertex is labeled `1`.
    
- The **leaves** of the tree are labeled with the characters being encoded.
    
- The code for any character is the sequential string of bits along the unique path from the root to its specific leaf.
    

## IV. Huffman Coding

Huffman coding is an algorithmic method for producing the most efficient prefix codes based on the statistical **frequencies of occurrences** of characters.

### 1. The Objective

Given a tree with $t$ leaves representing characters, and weights $w_1, w_2, \dots, w_t$ representing their frequencies, the goal is to minimize the total weighted length of the encoded data:

$$\text{Minimize } \sum_{i=1}^{t} l_i w_i$$

_(Where $l_i$ is the length of the prefix code/path for character $i$, and $w_i$ is its frequency)._

### 2. The Huffman Algorithm

The algorithm builds the optimal tree from the bottom up:

1. **Initialize:** Start with a forest of $n$ rooted trees, where each tree is a single leaf vertex representing a character $a_i$ with its assigned frequency weight $w_i$.
    
2. **Iterate:** While there is more than one tree in the forest:
    
    - Select the two rooted trees, $T$ and $T'$, with the **least weights**.
        
    - Combine them by creating a new root node. Make $T$ its left subtree (assigning edge label `0`) and $T'$ its right subtree (assigning edge label `1`).
        
    - The weight of this new combined tree is the sum of its parts: $w(T) + w(T')$.
        
    - Place this new tree back into the forest.
        
3. **Complete:** The process finishes when only one tree remains. The Huffman code for any symbol is the concatenation of the edge labels on the path from the final root to the vertex representing that symbol.