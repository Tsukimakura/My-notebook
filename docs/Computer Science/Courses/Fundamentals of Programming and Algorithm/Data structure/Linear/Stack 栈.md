## 1. Concept & Definition

A **Stack** is a linear data structure that follows a specific order in which operations are performed. The order is **LIFO (Last In, First Out)**.

- **LIFO Principle:** The element that is inserted last is the first one to be removed.

### Key Terminology

- **Top:** In this implementation, the index representing the **next available slot** for insertion.
    
- **Push:** Adding an element to the stack.
    
- **Pop:** Removing the most recently added element.
    
- **Peek:** Viewing the most recently added element without removing it.
    
- **Overflow:** Trying to push when top has reached the maximum capacity.
    
- **Underflow:** Trying to pop when top is at index 0.
    

---

## 2. Core Operations

1. **push(x)**: Insert element x at the top index, then increment top.
    
2. **pop()**: Decrement top, then return the element at that position.
    
3. **peek()**: Return the element located at top - 1.
    
4. **isEmpty()**: Returns true if top is 0.
    
5. **isFull()**: Returns true if top equals the maximum size definition.
    

---

## 3. Implementation in C Language (Modified top Logic)

- **Push:** `stack[top++]`
    
- **Pop:** `stack[--top]`
    
- **Full Condition:** `top == MAX`
    
- **Empty Condition:** `top == 0`
    

```c
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX 100 // Maximum size of the stack

typedef struct {
    int items[MAX];
    int top; // Points to the NEXT available position
} Stack;

// Function to initialize the stack
void initStack(Stack *s) {
    s->top = 0; // 0 indicates the stack is empty (next write at index 0)
}

// Check if the stack is full
bool isFull(Stack *s) {
    // If top reaches MAX, valid indices (0 to MAX-1) are filled
    return s->top == MAX; 
}

// Check if the stack is empty
bool isEmpty(Stack *s) {
    // If top is 0, no elements have been pushed
    return s->top == 0; 
}

// Push operation
void push(Stack *s, int value) {
    if (isFull(s)) {
        printf("Stack Overflow! Cannot push %d\n", value);
    } else {
        // Use suffix increment: Assign value, then increase top
        s->items[s->top++] = value;
        printf("Pushed %d onto the stack\n", value);
    }
}

// Pop operation
int pop(Stack *s) {
    if (isEmpty(s)) {
        printf("Stack Underflow! Cannot pop\n");
        return -1; // Return error code
    } else {
        // Use prefix decrement: Decrease top, then access item
        return s->items[--s->top];
    }
}

// Peek operation
int peek(Stack *s) {
    if (isEmpty(s)) {
        printf("Stack is empty\n");
        return -1;
    } else {
        // Since top points to the next empty slot, the actual top element is at top-1
        return s->items[s->top - 1];
    }
}

// Main function to test the stack
int main() {
    Stack myStack;
    initStack(&myStack);

    push(&myStack, 10);
    push(&myStack, 20);
    push(&myStack, 30); // items[2] = 30, top becomes 3

    printf("Top element is %d\n", peek(&myStack)); // Accesses items[2]

    printf("Popped element: %d\n", pop(&myStack)); // Returns items[2], top becomes 2
    printf("Popped element: %d\n", pop(&myStack)); // Returns items[1], top becomes 1

    if (isEmpty(&myStack)) {
        printf("Stack is empty now.\n");
    } else {
        printf("Stack is not empty (Current size: %d).\n", myStack.top);
    }

    return 0;
}
```

---

## 4. Common Use Cases

Stacks are ubiquitous in computing due to their LIFO nature.

1. **Function Call Stack:**
	[[Anatomy of a function call in memory]]
    
    - Stores active subroutines. The most recently called function must finish before the previous one resumes.
        
2. **Expression Parsing:**
    
    - Evaluating mathematical expressions (Infix to Postfix conversion).
        
3. **Backtracking Algorithms:**
    
    - Used in maze solving or puzzles (like Sudoku) to remember the previous state.
        
4. **Browser History:**
    
    - The "Back" button functionality relies on a stack.
        
5. **Undo/Redo Operations:**
    
    - Text editors store modification history in a stack.
        

---

## 5. Important Analysis

### Time Complexity

- **Push:** $O(1)$
     - Constant time insertion.
    
- **Pop:** $O(1)$
     - Constant time removal.
    
- **Peek:** $O(1)$
     - Constant time access.
    

### Space Complexity

- $O(N)$: Linear space required relative to the number of elements.
    
