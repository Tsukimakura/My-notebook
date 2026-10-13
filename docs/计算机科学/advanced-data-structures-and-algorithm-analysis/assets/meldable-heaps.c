/* Merge routines for Lecture 4; disjoint, exclusively owned inputs required.
 * Leftist NPL(NULL) = -1. A singleton is initialized with Npl = 0.
 * SkewMerge follows the course's complete-right-path tracing convention.
 */
#include <stddef.h>

typedef struct TreeNode *PriorityQueue;
struct TreeNode {
    int Element;
    PriorityQueue Left, Right;
    int Npl;
};

static void SwapChildren(PriorityQueue h)
{
    PriorityQueue tmp = h->Left;
    h->Left = h->Right;
    h->Right = tmp;
}

PriorityQueue Merge(PriorityQueue H1, PriorityQueue H2)
{
    if (H1 == NULL) return H2;
    if (H2 == NULL) return H1;
    if (H1->Element > H2->Element) {
        PriorityQueue tmp = H1;
        H1 = H2;
        H2 = tmp;
    }
    if (H1->Left == NULL)
        H1->Left = H2;
    else {
        H1->Right = Merge(H1->Right, H2);
        if (H1->Left->Npl < H1->Right->Npl)
            SwapChildren(H1);
        H1->Npl = H1->Right->Npl + 1;
    }
    return H1;
}

/* No NPL field: skew nodes store only a key and two child pointers. */
typedef struct SkewNode *SkewHeap;
struct SkewNode {
    int Element;
    SkewHeap Left, Right;
};

SkewHeap SkewMerge(SkewHeap A, SkewHeap B)
{
    if (A == NULL) {
        A = B;
        B = NULL;
    }
    if (A == NULL) return NULL;
    if (B != NULL && A->Element > B->Element) {
        SkewHeap tmp = A;
        A = B;
        B = tmp;
    }
    /* Keep only the last node of the merged original right paths unswapped.
     * A common alternative returns immediately whenever either heap is NULL;
     * that produces different exercise trees if the remaining tail is long.
     */
    if (B == NULL && A->Right == NULL) return A;
    A->Right = SkewMerge(A->Right, B);
    SkewHeap tmp = A->Left;
    A->Left = A->Right;
    A->Right = tmp;
    return A;
}
