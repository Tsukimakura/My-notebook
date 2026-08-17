### 一、 堆栈和队列 (Stack and Queue)

#### 1. 堆栈：入栈/出栈 (Array-based Stack)

```c
#define MAX_SIZE 100
typedef struct {
    int data[MAX_SIZE];
    int top;
} Stack;

void initStack(Stack *S) {
    S->top = -1;
}

// 入栈 (Push)
int push(Stack *S, int val) {
    if (S->top == MAX_SIZE - 1) return 0; // 栈满
    S->data[++(S->top)] = val;
    return 1;
}

// 出栈 (Pop)
int pop(Stack *S, int *val) {
    if (S->top == -1) return 0; // 栈空
    *val = S->data[(S->top)--];
    return 1;
}
```

#### 2. 队列：入队列/出队列 (Circular Queue)

```c
typedef struct {
    int data[MAX_SIZE];
    int front;
    int rear;
} Queue;

void initQueue(Queue *Q) {
    Q->front = Q->rear = 0;
}

// 入队列 (Enqueue)
int enqueue(Queue *Q, int val) {
    if ((Q->rear + 1) % MAX_SIZE == Q->front) return 0; // 队满 (牺牲一个单元)
    Q->data[Q->rear] = val;
    Q->rear = (Q->rear + 1) % MAX_SIZE;
    return 1;
}

// 出队列 (Dequeue)
int dequeue(Queue *Q, int *val) {
    if (Q->front == Q->rear) return 0; // 队空
    *val = Q->data[Q->front];
    Q->front = (Q->front + 1) % MAX_SIZE;
    return 1;
}
```

### 二、 树 (Tree)

#### 1. 二叉树的遍历 (Traversals)

```c
typedef struct TreeNode {
    int val;
    struct TreeNode *left;
    struct TreeNode *right;
} TreeNode;

// 递归：先/中/后序 (Preorder, Inorder, Postorder)
void preorder(TreeNode* root) {
    if (!root) return;
    printf("%d ", root->val); // 先序
    preorder(root->left);
    preorder(root->right);
}
void inorder(TreeNode* root) {
    if (!root) return;
    inorder(root->left);
    printf("%d ", root->val); // 中序
    inorder(root->right);
}
void postorder(TreeNode* root) {
    if (!root) return;
    postorder(root->left);
    postorder(root->right);
    printf("%d ", root->val); // 后序
}

// 非递归中序遍历 (利用前面的栈)
void inorderNonRecursive(TreeNode* root) {
    TreeNode* stack[MAX_SIZE];
    int top = -1;
    TreeNode* curr = root;
    while (curr != NULL || top != -1) {
        while (curr != NULL) {
            stack[++top] = curr; // 一直向左走并入栈
            curr = curr->left;
        }
        if (top != -1) {
            curr = stack[top--]; // 出栈并访问
            printf("%d ", curr->val);
            curr = curr->right;  // 转向右子树
        }
    }
}
```

#### 2. 堆 (Min-Heap)：插入、删除

```c
#define MAX_HEAP 100
typedef struct {
    int data[MAX_HEAP];
    int size;
} MinHeap;

// 插入 (Up-heap / Percolate up)
void insertHeap(MinHeap *H, int val) {
    int i = ++(H->size); // 放在末尾
    // i/2 是父节点。如果比父节点小，则父节点下移
    for (; i > 1 && val < H->data[i / 2]; i /= 2) {
        H->data[i] = H->data[i / 2];
    }
    H->data[i] = val;
}

// 删除最小元素 (Down-heap / Percolate down)
int deleteMin(MinHeap *H) {
    int minItem = H->data[1]; // 根节点是最小的
    int lastItem = H->data[H->size--]; // 取出最后一个元素
    int child, i;
    
    // 从根节点开始向下过滤
    for (i = 1; i * 2 <= H->size; i = child) {
        child = i * 2;
        // 找到左右儿子中较小的一个
        if (child != H->size && H->data[child + 1] < H->data[child])
            child++;
        if (lastItem > H->data[child]) 
            H->data[i] = H->data[child]; // 小儿子上移
        else 
            break;
    }
    H->data[i] = lastItem;
    return minItem;
}
```

#### 3. 二分查找树 (BST)：查找、插入、删除

```c
// 查找 (FindMin / FindMax)
TreeNode* findMin(TreeNode* root) {
    if (root == NULL) return NULL;
    while (root->left != NULL) root = root->left;
    return root;
}

// 插入 (Insert)
TreeNode* insertBST(TreeNode* root, int val) {
    if (root == NULL) {
        root = (TreeNode*)malloc(sizeof(TreeNode));
        root->val = val; root->left = root->right = NULL;
    } else if (val < root->val) {
        root->left = insertBST(root->left, val);
    } else if (val > root->val) {
        root->right = insertBST(root->right, val);
    }
    return root;
}

// 删除 (Delete)
TreeNode* deleteBST(TreeNode* root, int val) {
    if (root == NULL) return NULL;
    if (val < root->val) root->left = deleteBST(root->left, val);
    else if (val > root->val) root->right = deleteBST(root->right, val);
    else { // 找到节点
        if (root->left && root->right) { // 有两个孩子
            TreeNode* temp = findMin(root->right); // 找右子树最小值替换
            root->val = temp->val;
            root->right = deleteBST(root->right, root->val);
        } else { // 只有一个孩子或无孩子
            TreeNode* temp = root;
            if (root->left == NULL) root = root->right;
            else if (root->right == NULL) root = root->left;
            free(temp);
        }
    }
    return root;
}
```

#### 4. 线段树 (Segment Tree)：建树、查询、更新 (区间求和为例)

```c
int tree[MAX_SIZE * 4]; 
int arr[MAX_SIZE];

// 建树
void buildSegTree(int node, int start, int end) {
    if (start == end) {
        tree[node] = arr[start];
        return;
    }
    int mid = (start + end) / 2;
    int leftNode = 2 * node;
    int rightNode = 2 * node + 1;
    buildSegTree(leftNode, start, mid);
    buildSegTree(rightNode, mid + 1, end);
    tree[node] = tree[leftNode] + tree[rightNode];
}

// 查询 (Query)
int querySegTree(int node, int start, int end, int L, int R) {
    if (R < start || L > end) return 0; // 完全不在区间内
    if (L <= start && end <= R) return tree[node]; // 完全包含
    int mid = (start + end) / 2;
    return querySegTree(2 * node, start, mid, L, R) + 
           querySegTree(2 * node + 1, mid + 1, end, L, R);
}

// 更新 (单点更新 Update)
void updateSegTree(int node, int start, int end, int idx, int val) {
    if (start == end) {
        tree[node] = val;
        arr[idx] = val;
        return;
    }
    int mid = (start + end) / 2;
    if (start <= idx && idx <= mid)
        updateSegTree(2 * node, start, mid, idx, val);
    else
        updateSegTree(2 * node + 1, mid + 1, end, idx, val);
    tree[node] = tree[2 * node] + tree[2 * node + 1];
}
```

### 三、 图 (Graph)

#### 1. 图的 DFS 与 BFS (基于邻接矩阵表示)

```c
#define MAX_V 100
int G[MAX_V][MAX_V];
int visited[MAX_V];
int V; // 顶点数

// 深度优先搜索 (DFS)
void DFS(int v) {
    visited[v] = 1;
    printf("%d ", v);
    for (int i = 0; i < V; i++) {
        if (G[v][i] && !visited[i]) {
            DFS(i);
        }
    }
}

// 广度优先搜索 (BFS)
void BFS(int start) {
    int q[MAX_V], front = 0, rear = 0;
    q[rear++] = start;
    visited[start] = 1;
    
    while (front < rear) {
        int v = q[front++];
        printf("%d ", v);
        for (int i = 0; i < V; i++) {
            if (G[v][i] && !visited[i]) {
                visited[i] = 1;
                q[rear++] = i;
            }
        }
    }
}
```

#### 2. Dijkstra Algorithm & Unweighted Shortest Path & Topological Sort

```c
#define INF 999999
// 无权最短路径 (Unweighted Shortest Path - 本质是 BFS)
void unweighted(int start, int dist[]) {
    int q[MAX_V], front = 0, rear = 0;
    for(int i=0; i<V; i++) dist[i] = INF;
    dist[start] = 0;
    q[rear++] = start;
    
    while(front < rear) {
        int v = q[front++];
        for(int w=0; w<V; w++) {
            if(G[v][w] && dist[w] == INF) {
                dist[w] = dist[v] + 1;
                q[rear++] = w;
            }
        }
    }
}

// 迪杰斯特拉算法 (Dijkstra - 有权图单源最短路)
void Dijkstra(int start, int dist[]) {
    int known[MAX_V] = {0};
    for (int i = 0; i < V; i++) dist[i] = INF;
    dist[start] = 0;
    
    for (int i = 0; i < V; i++) {
        // 找未知集合中距离最小的顶点
        int minD = INF, v = -1;
        for (int j = 0; j < V; j++) {
            if (!known[j] && dist[j] < minD) {
                minD = dist[j]; v = j;
            }
        }
        if (v == -1) break; 
        known[v] = 1;
        
        // 更新邻接点
        for (int w = 0; w < V; w++) {
            if (!known[w] && G[v][w] > 0) {
                if (dist[v] + G[v][w] < dist[w]) {
                    dist[w] = dist[v] + G[v][w];
                }
            }
        }
    }
}

// 拓扑排序 (Topological Sort)
void TopSort(int indegree[]) {
    int q[MAX_V], front = 0, rear = 0;
    int count = 0;
    // 将所有入度为0的顶点入队
    for (int i = 0; i < V; i++) {
        if (indegree[i] == 0) q[rear++] = i;
    }
    
    while (front < rear) {
        int v = q[front++];
        printf("%d ", v);
        count++;
        // 将所有邻接点入度减1
        for (int w = 0; w < V; w++) {
            if (G[v][w]) {
                if (--indegree[w] == 0) q[rear++] = w;
            }
        }
    }
    if (count != V) printf("Graph has a cycle!\n");
}
```

### 四、 排序 (Sorting)

```c
void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }

// 1. 基本插入排序 (Insertion Sort)
void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int temp = arr[i];
        int j;
        for (j = i; j > 0 && arr[j - 1] > temp; j--) {
            arr[j] = arr[j - 1];
        }
        arr[j] = temp;
    }
}

// 2. 希尔排序 (Shell Sort)
void shellSort(int arr[], int n) {
    for (int gap = n / 2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i++) {
            int temp = arr[i];
            int j;
            for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
                arr[j] = arr[j - gap];
            }
            arr[j] = temp;
        }
    }
}

// 3. 冒泡排序 (Bubble Sort)
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n - 1; i++) {
        int flag = 0; // 优化：无交换则已排序
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(&arr[j], &arr[j + 1]);
                flag = 1;
            }
        }
        if (!flag) break;
    }
}

// 4. 快速排序 (Quick Sort)
void quickSort(int arr[], int left, int right) {
    if (left >= right) return;
    int pivot = arr[left];
    int i = left, j = right;
    while (i < j) {
        while (i < j && arr[j] >= pivot) j--;
        arr[i] = arr[j];
        while (i < j && arr[i] <= pivot) i++;
        arr[j] = arr[i];
    }
    arr[i] = pivot;
    quickSort(arr, left, i - 1);
    quickSort(arr, i + 1, right);
}

// 5. 归并排序 (Merge Sort)
void merge(int arr[], int tmp[], int L, int R, int RightEnd) {
    int LeftEnd = R - 1;
    int tmpPos = L;
    int numElements = RightEnd - L + 1;
    while (L <= LeftEnd && R <= RightEnd) {
        if (arr[L] <= arr[R]) tmp[tmpPos++] = arr[L++];
        else tmp[tmpPos++] = arr[R++];
    }
    while (L <= LeftEnd) tmp[tmpPos++] = arr[L++];
    while (R <= RightEnd) tmp[tmpPos++] = arr[R++];
    for (int i = 0; i < numElements; i++, RightEnd--)
        arr[RightEnd] = tmp[RightEnd];
}

void mSort(int arr[], int tmp[], int left, int right) {
    if (left < right) {
        int center = (left + right) / 2;
        mSort(arr, tmp, left, center);
        mSort(arr, tmp, center + 1, right);
        merge(arr, tmp, left, center + 1, right);
    }
}
void mergeSort(int arr[], int n) {
    int *tmp = (int*)malloc(n * sizeof(int));
    if (tmp != NULL) {
        mSort(arr, tmp, 0, n - 1);
        free(tmp);
    }
}

// 6. 堆排序 (Heap Sort)
void percDown(int arr[], int i, int n) {
    int child, tmp;
    for (tmp = arr[i]; i * 2 + 1 < n; i = child) {
        child = i * 2 + 1; // 左儿子 (0-indexed)
        if (child != n - 1 && arr[child + 1] > arr[child]) child++;
        if (tmp < arr[child]) arr[i] = arr[child];
        else break;
    }
    arr[i] = tmp;
}
void heapSort(int arr[], int n) {
    // 建立 Max-Heap
    for (int i = n / 2 - 1; i >= 0; i--) percDown(arr, i, n);
    // 排序
    for (int i = n - 1; i > 0; i--) {
        swap(&arr[0], &arr[i]); // 最大值放最后
        percDown(arr, 0, i);    // 调整剩余堆
    }
}
```

### 五、 并查集 (Disjoint Set)

#### 1. 路径压缩 (Path Compression) 与 按秩/大小合并 (Union-by-Size/Height)

```c
#define MAX_SET 100
int parent[MAX_SET]; // 初始化时，parent[i] = -1 (代表它是根，且树大小为1)

// 查找并进行路径压缩 (Path Compression)
int find(int x) {
    if (parent[x] < 0) return x; // 找到根
    else {
        // 递归寻找根并将当前节点直接连到根上
        return parent[x] = find(parent[x]); 
    }
}

// 按大小合并 (Union-by-size)
void unionBySize(int root1, int root2) {
    // root1 和 root2 是 find() 找到的根节点索引
    if (root1 == root2) return;
    // parent 数组存的是负的 size 数值
    if (parent[root2] < parent[root1]) { // root2 的 size 更大 (更负)
        parent[root2] += parent[root1];  // 更新规模
        parent[root1] = root2;           // root1 连到 root2 上
    } else {
        parent[root1] += parent[root2];
        parent[root2] = root1;
    }
}

// 按高度合并 (Union-by-height / rank)
void unionByHeight(int root1, int root2) {
    if (root1 == root2) return;
    // parent 数组存的是负的高度的估计值 (rank)
    if (parent[root2] < parent[root1]) { // root2 更深
        parent[root1] = root2;
    } else {
        if (parent[root1] == parent[root2]) {
            parent[root1]--; // 高度相同，作为新根的 root1 高度 + 1 (变得更负)
        }
        parent[root2] = root1;
    }
}
```