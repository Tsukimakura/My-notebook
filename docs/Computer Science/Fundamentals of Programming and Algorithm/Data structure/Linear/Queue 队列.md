## 1. Concept & Definition

A **Queue** is a linear data structure that works on the **FIFO (First In, First Out)** principle.

- **FIFO Principle:** The first element added to the queue will be the first one to be removed.
    

### Key Terminology

- **Front:** The index of the element to be removed next.
    
- **Rear:** The index where the next element will be inserted.
    
- **Enqueue:** Adding an element to the rear.
    
- **Dequeue:** Removing an element from the front.
    
- **Overflow:** Trying to enqueue into a full queue.
    
- **Underflow:** Trying to dequeue from an empty queue.
    

---

## 2. Core Operations

1. **enqueue(x)**: Add element x at the rear index, then update rear.
    
2. **dequeue()**: Return element at front index, then update front.
    
3. **peek()**: Return the element at front without updating pointers.
    
4. **isEmpty()**: Check if front equals rear.
    
5. **isFull()**: Check if the queue has no space left (logic differs by implementation).
    

---

## 3. Implementation in C Language

The standard implementation is usually a **linear queue**, but because every time we enqueue or dequeue, the front and the rear are both moving backwards, which means the space before the front is wasted, which means, when the rear reach MAX, enqueuing will cause overflow, even though empty spaces may be  available before front. (false overflow). In order to solve the problem, we concatenate the beginning and the end of the array to form a loop, and this is so-called a **circular queue**.

We define a structure that can be used for both implementations.

- **front**: Points to the first valid element.
    
- **rear**: Points to the **next available** empty slot.
    
- **No count variable**: State is determined solely by pointer comparison.
    

```c
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX 5 // Capacity (For Circular Queue, usable space is MAX-1)

typedef struct {
    int items[MAX];
    int front;
    int rear;
} Queue;

// Initialization (Same for both)
void initQueue(Queue *q) {
    q->front = 0;
    q->rear = 0;
}

// Check Empty (Same for both)
// Condition: When front and rear point to the same index.
bool isEmpty(Queue *q) {
    return q->front == q->rear;
}
```

### A. Standard Linear Queue

In a standard array-based queue, we simply increment indices.

- **Problem:** Does not reuse freed space at the beginning ("False Overflow").
    

```c
// --- Standard Linear Queue Logic ---

// Check Full
bool isFull_Linear(Queue *q) {
    // Full when rear reaches the array limit
    return q->rear == MAX;
}

// Enqueue
void enqueue_Linear(Queue *q, int value) {
    if (isFull_Linear(q)) {
        printf("Queue Overflow (Linear)!\n");
        return;
    }
    q->items[q->rear++] = value; // Store then increment
    printf("Enqueued: %d\n", value);
}

// Dequeue
int dequeue_Linear(Queue *q) {
    if (isEmpty(q)) {
        printf("Queue Underflow!\n");
        return -1;
    }
    return q->items[q->front++]; // Return then increment
}
```

### B. Circular Queue (Sacrifice One Slot)

To solve the space waste of Linear Queues, we wrap the indices. To distinguish "Full" from "Empty" without a counter, we **sacrifice one storage slot**.

- **Empty:** front == rear
    
- **Full:** (rear + 1) % MAX == front (The next position after rear is front).
    

```c
// --- Circular Queue Logic (Key Differences) ---

// [DIFFERENCE] Check Full: Uses Modulo Arithmetic
bool isFull_Circular(Queue *q) {
    // Queue is full if the next step for rear lands on front
    return (q->rear + 1) % MAX == q->front;
}

// [DIFFERENCE] Enqueue: Wraps around using % MAX
void enqueue_Circular(Queue *q, int value) {
    if (isFull_Circular(q)) {
        printf("Queue Overflow (Circular)! Max capacity is %d\n", MAX - 1);
        return;
    }
    q->items[q->rear] = value;
    q->rear = (q->rear + 1) % MAX; // Circular increment
    printf("Enqueued: %d\n", value);
}

// [DIFFERENCE] Dequeue: Wraps around using % MAX
int dequeue_Circular(Queue *q) {
    if (isEmpty(q)) {
        printf("Queue Underflow!\n");
        return -1;
    }
    int val = q->items[q->front];
    q->front = (q->front + 1) % MAX; // Circular increment
    return val;
}
```

### Main Testing (Circular Example)

```c
int main() {
    Queue q;
    initQueue(&q);

    // Using Circular Functions
    enqueue_Circular(&q, 10);
    enqueue_Circular(&q, 20);
    enqueue_Circular(&q, 30);
    enqueue_Circular(&q, 40);

    // MAX is 5. We have 4 elements.
    // Next insert (50) will fail because we sacrifice 1 slot to detect "Full".
    if (isFull_Circular(&q)) {
        printf("Queue is strictly full (4 elements, 1 wasted slot).\n");
    }

    printf("Dequeued: %d\n", dequeue_Circular(&q)); // Removes 10, front moves
    
    // Now we can add again because front moved
    enqueue_Circular(&q, 50); 
    
    return 0;
}
```

---

## 4. Common Use Cases

1. **CPU Scheduling:** Processes waiting for execution.
    
2. **Breadth-First Search (BFS):** Graph traversal algorithms.
    
3. **Data Buffers:** Managing asynchronous data flow (e.g., IO buffers, keyboard inputs).
    
4. **Printer Spooling:** Managing print jobs in order.
    

---

## 5. Important Analysis

### Time Complexity

- **Enqueue/Dequeue/Peek:** $O(1)$ constant time.
    

### Space Complexity

- $O(N)$: Linear space.
    

### The "Sacrifice One Slot" Method

In a Circular Queue without a count variable:

- **Ambiguity:** If front == rear, it usually means the queue is **Empty**. However, if we fill the array completely, rear would wrap around and equal front again.
    
- **Solution:** We decide that the queue is "Full" when rear is one step behind front.
    
- **Trade-off:** We lose capacity for 1 element (Usable size = MAX - 1), but we save the memory and maintenance of a separate count variable.
    

| State     | Condition                 |
| --------- | ------------------------- |
| **Empty** | front == rear             |
| **Full**  | (rear + 1) % MAX == front |