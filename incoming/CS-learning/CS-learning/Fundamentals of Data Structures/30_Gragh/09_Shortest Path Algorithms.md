## 1. Core Concepts

- **Digraph and Path Length**: Given a digraph $G = (V, E)$ and a cost function $c(e)$. The length of a path $P$ from the source to the destination is the sum of the costs of all edges on that path, $\sum c(e_i)$ (also known as the weighted path length).
    
- **Single-Source Shortest-Path Problem**: Given a weighted graph $G = (V, E)$ and a distinguished vertex $s$, find the shortest weighted path from $s$ to every other vertex in $G$.
    
- **Negative-Cost Cycle**: If there is no negative-cost cycle, the shortest path from $s$ to $s$ is defined to be zero.
    

## 2. Unweighted Shortest Paths

- **Core Idea**: Breadth-first search (BFS).
    
- **Data Structure Maintenance**:

```c
#define Infinity 2147483647
#define NotAVertex -1        /* A marker to indicate no valid previous vertex */

typedef int Vertex;          /* Vertices are typically represented by integer indices */

/* Structure representing the state of a single vertex */
struct TableEntry {
    int Dist;      /* Distance from the source vertex 's' to this vertex */
    bool Known;    /* true (1) if the vertex is checked/processed, false (0) otherwise */
    Vertex Path;   /* The previous vertex on the shortest path (for path tracking) */
};

/* The Table is defined as an array of TableEntry structures */
/* (NumVertex represents the total number of vertices in the graph) */
typedef struct TableEntry Table[NumVertex];
```

**Initialization:**

```c
/**
 * Initialize the table for shortest path algorithms.
 * @param S: The source vertex to start the search from.
 * @param T: The table structure to be initialized.
 */
void InitTable(Vertex S, Table T) {
    int i;

    /* Step 1: Iterate through all vertices to set default values */
    for (i = 0; i < NumVertex; i++) {
        /* Set all vertices to 'unknown' since none are processed yet */
        T[i].Known = false;

        /* Initialize distance to a very large value (Infinity) */
        T[i].Dist = Infinity;

        /* Initialize path to -1 or 0 to indicate no predecessor exists */
        T[i].Path = NotAVertex;
    }

    /* Step 2: Set the source vertex's own distance to 0 */
    /* This ensures the algorithm starts processing from vertex S */
    T[S].Dist = 0;
}
```

**Strategy**: Iteratively scan the entire table to find vertices that match the current distance level (`CurrDist`).

```c
/* Basic O(|V|^2) algorithm for unweighted shortest paths */
void UnweightedBasic(Table T) {
    int CurrDist;
    Vertex V, W;
    
    /* Iterate through all possible path lengths (0 to NumVertex - 1) */
    for (CurrDist = 0; CurrDist < NumVertex; CurrDist++) {
        
        /* Step 1: Scan all vertices in the graph to find those at CurrDist */
        for (each vertex V) {
            
            /* Check if V is unvisited and its distance matches the current level */
            if (!T[V].Known && T[V].Dist == CurrDist) {
                T[V].Known = true; /* Mark vertex V as fully processed */
                
                /* Step 2: Update all adjacent vertices of V */
                for (each W adjacent to V) {
                    
                    /* If W is undiscovered, its distance is either CurrDist or CurrDist + 1 */
                    if (T[W].Dist == Infinity) {
                        T[W].Dist = CurrDist + 1; /* Update to the new shortest distance */
                        T[W].Path = V;            /* Track the predecessor for the path */
                    }
                } /* end-for each W */
                
            }
        } /* end-for each V */
        
    } /* end-for CurrDist */
}
```

- **Time Complexity**:
    
    - Basic array scan: $T = O(|V|^2)$
        
    - **Improved Implementation**: Using a Queue to enqueue and dequeue vertices reduces the complexity to $T = O(|V| + |E|)$.

```c
/* BFS-based algorithm for unweighted shortest paths */
void Unweighted(Table T) {
    Queue Q;
    Vertex V, W;
    Q = CreateQueue(NumVertex); 
    MakeEmpty(Q);
    
    /* Enqueue the source vertex to start traversal */
    Enqueue(S, Q); 
    
    while (!IsEmpty(Q)) {
        V = Dequeue(Q);
        T[V].Known = true; /* Mark vertex as visited */ /* not really necessary */
        
        for (each W adjacent to V) {
            /* Only update distance if W has not been reached yet */
            if (T[W].Dist == Infinity) {
                T[W].Dist = T[V].Dist + 1;
                T[W].Path = V;
                Enqueue(W, Q);
            }
        }
    }
    DisposeQueue(Q); /* Free memory */
}
```

---

## 3. Dijkstra's Algorithm (For Weighted Shortest Paths)

- **Core Idea**: Greedy Method.
    
    - Let $S$ be the set of vertices whose shortest paths have already been found.
        
    - For any vertex $u \notin S$, define its distance as the minimal length of a path from $s$ to $u$ passing _only_ through vertices in $S$.
        
    - **Update Operation**: When a vertex $v$ is added to $S$, check its adjacent vertices $w$. If $distance[v] + C_{vw} < distance[w]$, update $distance[w]$ to $distance[v] + C_{vw}$.
        
- **Limitation**: Does **not** work for graphs with negative-cost edges.

```c
/* Dijkstra's algorithm for graphs with non-negative edge costs */
void Dijkstra(Table T) {
    Vertex V, W;
    for ( ; ; ) {
        /* Find the vertex with the smallest distance among unknown vertices */
        V = smallest unknown distance vertex; 
        if (V == NotAVertex) 
            break; /* All reachable vertices processed */
            
        T[V].Known = true;
        for (each W adjacent to V) {
            if (!T[W].Known) {
                /* Relax the edge: check if path via V is shorter */
                if (T[V].Dist + Cvw < T[W].Dist) {
                    Decrease(T[W].Dist to T[V].Dist + Cvw);
                    T[W].Path = V;
                }
            }
        }
    }
}
```

- **Time Complexity**:
    
    - **Dense Graphs**: Scanning the table to find the smallest unknown distance vertex yields $T = O(|V|^2 + |E|)$.
        
    - **Sparse Graphs**: Keeping distances in a Priority Queue.
        
        - Method 1 (Using DecreaseKey): $T = O(|E| \log |V|)$.
            
        - Method 2 (Inserting $W$ with updated `Dist` into the queue): $T = O(|E| \log |V|)$, but requires $O(|E|)$ space to perform `DeleteMin` operations until an unknown vertex emerges.
            

---

## 4. Graphs with Negative Edge Costs and Acyclic Graphs

- **Graphs with Negative Edge Costs**:
    
    - Implementation uses a Queue. Each vertex can dequeue at most $|V|$ times.
        
    - Time Complexity: $T = O(|V| \times |E|)$.
        
    - **Crucial Note**: A negative-cost cycle will cause an indefinite loop.

```c
/* Algorithm for weighted graphs that may contain negative edges */
void WeightedNegative(Table T) {
    Queue Q;
    Vertex V, W;
    Q = CreateQueue(NumVertex); 
    MakeEmpty(Q);
    Enqueue(S, Q);
    
    while (!IsEmpty(Q)) {
        V = Dequeue(Q);
        for (each W adjacent to V) {
            /* If a shorter path is found, update and re-queue */
            if (T[V].Dist + Cvw < T[W].Dist) {
                T[W].Dist = T[V].Dist + Cvw;
                T[W].Path = V;
                if (W is not already in Q)
                    Enqueue(W, Q);
            }
        }
    }
    DisposeQueue(Q);
    /* Warning: Negative-cost cycles will cause an infinite loop */
}
```

- **Acyclic Graphs**:
    
    - Vertices can be selected in **topological order**. Once a vertex is selected, its distance can no longer be lowered because there are no incoming edges from unknown nodes.
        
    - No priority queue is needed. Time Complexity drops to $T = O(|E| + |V|)$.
        

---

## 5. AOE Networks and the Critical Path Method (CPM)

The Critical Path Method is a core algorithm used for project scheduling and performance analysis, typically applied to **AOE (Activity On Edge)** networks.

### 5.1 AOE Network Fundamentals

An AOE network is a weighted Directed Acyclic Graph (DAG) used to model complex projects:

- **Vertices (Events)**: Represent the completion of certain phases or signals. An event can only occur when _all_ incoming activities pointing to it have finished.
    
- **Edges (Activities)**: Represent the actual tasks to be performed.
    
- **Edge Weights ($C_{v,w}$)**: Represent the time duration required to complete the activity from vertex $v$ to vertex $w$.
    
- **Dummy Activities**: Edges with a weight of 0, used strictly to represent logical dependencies between events without consuming actual time.
    

### 5.2 Core Time Parameters

To find the critical path, the algorithm calculates four key parameters, divided into Vertex (Event) times and Edge (Activity) times.

**A. Vertex Parameters (Event Times)**

- **$EC[j]$ (Earliest Completion Time)**:
    
    - **Definition**: The earliest possible time event $j$ can occur. It represents the **longest path** from the start vertex to $j$ because an event must wait for its _slowest_ preceding activity to finish.
        
    - **Calculation (Forward Pass)**: Computed in topological order.
        
    - **Formula**: $EC[w] = \max_{(v,w) \in E} \{EC[v] + C_{v,w}\}$
        
- **$LC[j]$ (Latest Completion Time)**:
    
    - **Definition**: The latest possible time event $j$ can occur without delaying the overall project completion time.
        
    - **Calculation (Backward Pass)**: Computed in reverse topological order.
        
    - **Formula**: $LC[v] = \min_{(v,w) \in E} \{LC[w] - C_{v,w}\}$
        

**B. Edge Parameters (Activity Times)**

- **Slack Time**:
    
    - **Definition**: The maximum amount of time an activity can be delayed without affecting the total project duration. It is the difference between the latest time the task _must_ finish and the earliest time it _can_ start, minus its own duration.
        
    - **Formula**: For an edge $\langle v,w \rangle$, $Slack = LC[w] - EC[v] - C_{v,w}$
        
- **Critical Path**:
    
    - **Definition**: Any path from the start vertex to the finish vertex consisting entirely of edges with **zero slack time** ($Slack = 0$). A delay in any activity on this path strictly delays the entire project.
        

### 5.3 Algorithm Execution Steps

1. **Topological Sort & Forward Pass**: Traverse the graph in topological order. Initialize the start vertex $EC[start] = 0$. Calculate the $EC$ for all vertices. The $EC$ of the final vertex is the minimum total duration of the project.
    
2. **Reverse Topological Sort & Backward Pass**: Initialize the final vertex's latest completion time to match its earliest: $LC[finish] = EC[finish]$. Traverse the graph backwards to calculate the $LC$ for all vertices.
    
3. **Compute Slack**: Iterate through every edge in the graph and calculate its Slack time using the computed $EC$ and $LC$ values.
    
4. **Identify Critical Path(s)**: Extract all edges where $Slack == 0$. These edges form the critical path(s) of the network.

---

## 6. All-Pairs Shortest Path Problem

- **Problem Definition**: For all pairs of $v_i$ and $v_j$ ($i \neq j$), find the shortest path between them.
    
- **Solutions**:
    
    - **Method 1**: Run a single-source algorithm $|V|$ times. Time Complexity: $T = O(|V|^3)$. This works fast on sparse graphs.
        
    - **Method 2**: Use a specific $O(|V|^3)$ algorithm (like Floyd-Warshall), which works faster on dense graphs.