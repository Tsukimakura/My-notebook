## 1. DFS Fundamentals

* DFS is a generalization of preorder traversal.
* Must mark vertices as `visited` (`visited[V] = true`) to avoid infinite loops caused by cycles.
* **Time Complexity**: $T = O(|E| + |V|)$ when using adjacency lists.
* **Application**: Easily lists connected components in undirected graphs.

## 2. Biconnectivity & Articulation Points

* **Articulation Point**: A vertex $v$ is an articulation point if removing $v$ (and its incident edges) splits the graph into at least 2 disconnected components.
* **Biconnected Graph**: A connected graph that has *no* articulation points.
* **Biconnected Component**: A maximal biconnected subgraph. Edges cannot be shared by two or more biconnected components.

**Finding Articulation Points (Using DFS):**

1. Run DFS to create a Depth-First Spanning Tree and assign a Depth First Number (`Num`) to each vertex based on visit order.

2. Identify **Back Edges**: An edge $(u, v)$ not in the tree where $u$ is an ancestor/descendant of $v$.

3. Compute **Low(u)** for each vertex. It is the minimum of:
* $\text{Num}(u)$
* $\min\{\text{Low}(w) \mid w \text{ is a child of } u\}$
* $\min\{\text{Num}(w) \mid (u, w) \text{ is a back edge}\}$

4. **Identification Rules**:
* **Root Node Rule**: The root $u$ is an articulation point if and only if it has $\ge 2$ children.
* **General Rule**: Any non-root vertex $u$ is an articulation point if it has at least one child where $\text{Low}(\text{child}) \ge \text{Num}(u)$. (Meaning the child has no back-edge "shortcuts" to an ancestor above $u$).

```c
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX_VERTICES 1000

/* Structure for an adjacency list node */
typedef struct Node {
    int vertex;
    struct Node* next;
} Node;

/* Structure for the Graph */
typedef struct Graph {
    int numVertices;
    Node** adjLists;
} Graph;

/* Global arrays for the DFS algorithm */
bool Visited[MAX_VERTICES];
int Num[MAX_VERTICES];    /* Discovery time / DFS Number */
int Low[MAX_VERTICES];    /* Lowest Num reachable via back edges */
int Parent[MAX_VERTICES]; /* Parent node in the DFS tree */
bool is_AP[MAX_VERTICES]; /* Flag to mark if a vertex is an Articulation Point */
int Counter = 0;          /* Timer for assigning Num */

/* Function to create a new adjacency list node */
Node* createNode(int v) {
    Node* newNode = (Node*)malloc(sizeof(Node));
    newNode->vertex = v;
    newNode->next = NULL;
    return newNode;
}

/* Function to create a graph with n vertices */
Graph* createGraph(int vertices) {
    Graph* graph = (Graph*)malloc(sizeof(Graph));
    graph->numVertices = vertices;
    graph->adjLists = (Node**)malloc(vertices * sizeof(Node*));

    for (int i = 0; i < vertices; i++) {
        graph->adjLists[i] = NULL;
    }
    return graph;
}

/* Function to add an undirected edge to the graph */
void addEdge(Graph* graph, int src, int dest) {
    /* Add edge from src to dest */
    Node* newNode = createNode(dest);
    newNode->next = graph->adjLists[src];
    graph->adjLists[src] = newNode;

    /* Add edge from dest to src (since it's an undirected graph) */
    newNode = createNode(src);
    newNode->next = graph->adjLists[dest];
    graph->adjLists[dest] = newNode;
}

/* Utility function to get the minimum of two integers */
int min(int a, int b) {
    return (a < b) ? a : b;
}

/**
 * Core DFS algorithm to find Articulation Points.
 * u: The current vertex being visited
 */
void FindArticulationPoints(Graph* graph, int u) {
    int children = 0; /* Count of children in the DFS tree */
    
    /* Mark the current node as visited */
    Visited[u] = true;
    
    /* Initialize discovery time and low value */
    Num[u] = Low[u] = ++Counter;

    /* Traverse all adjacent vertices of u */
    Node* temp = graph->adjLists[u];
    while (temp != NULL) {
        int v = temp->vertex;

        /* If v is not visited yet, then it is a child of u in DFS tree */
        if (!Visited[v]) {
            children++;
            Parent[v] = u;
            
            /* Recursively call DFS for the child */
            FindArticulationPoints(graph, v);

            /* Check if the subtree rooted at v has a connection back to one of the ancestors of u */
            Low[u] = min(Low[u], Low[v]);

            /* Rule 1: u is the root of the DFS tree and has two or more independent children. */
            if (Parent[u] == -1 && children > 1) {
                is_AP[u] = true;
            }

            /* Rule 2: u is NOT the root, and the lowest reachable vertex from its child v is below or equal to u (meaning no back-edge bypasses u). */
            if (Parent[u] != -1 && Low[v] >= Num[u]) {
                is_AP[u] = true;
            }
        } 
        /**
         * Update Low value of u for back edge function calls.
         * Ignore if v is the direct parent of u.
         */
        else if (v != Parent[u]) {
            Low[u] = min(Low[u], Num[v]);
        }
        
        temp = temp->next;
    }
}

int main() {
    /* Example: Create a graph with 5 vertices (0 to 4) */
    int V = 5;
    Graph* graph = createGraph(V);

    /* * Constructing the Graph:
     * 1 --- 0 --- 3
     * |   /       |
     * |  /        |
     * 2           4
     */
    addEdge(graph, 1, 0);
    addEdge(graph, 0, 2);
    addEdge(graph, 2, 1);
    addEdge(graph, 0, 3);
    addEdge(graph, 3, 4);

    /* Initialize global arrays */
    for (int i = 0; i < V; i++) {
        Parent[i] = -1;
        Visited[i] = false;
        is_AP[i] = false;
    }

    /**
     * Call the recursive helper function to find articulation points.
     * We use a loop to ensure we cover disconnected graphs as well.
     */
    for (int i = 0; i < V; i++) {
        if (!Visited[i]) {
            FindArticulationPoints(graph, i);
        }
    }

    /* Print the results */
    printf("Articulation Points in the graph are:\n");
    bool found = false;
    for (int i = 0; i < V; i++) {
        if (is_AP[i] == true) {
            printf("Vertex %d\n", i);
            found = true;
        }
    }
    
    if (!found) {
        printf("No Articulation Points found. (The graph is Biconnected)\n");
    }

    /* Free allocated memory */
    for (int i = 0; i < V; i++) {
        Node* temp = graph->adjLists[i];
        while (temp != NULL) {
            Node* prev = temp;
            temp = temp->next;
            free(prev);
        }
    }
    free(graph->adjLists);
    free(graph);

    return 0;
}
```

## 3. Circuits and Cycles

* **Euler Tour**: Drawing every edge exactly once without lifting the pen. Possible iff exactly **two vertices have an odd degree** (the tour must start at one of them).
* **Euler Circuit**: An Euler tour that finishes exactly at the starting point. Possible iff the graph is connected and **every vertex has an even degree**.
* *Complexity*: $T = O(|E| + |V|)$ using linked lists to maintain the path.
* **Hamilton Cycle**: Finding a simple cycle in an undirected graph that visits **every vertex** exactly once (fundamentally different and harder than Euler, which visits every *edge*).