
| Algorithm           | Time (Avg)    | Space        | Stability | Type    | Best For...                                            |
| ------------------- | ------------- | ------------ | --------- | ------- | ------------------------------------------------------ |
| **Bubble Sort**     | $O(N^2)$      | $O(1)$       | Yes       | Swap    | Teaching concepts; tiny datasets.                      |
| **Selection Sort**  | $O(N^2)$      | $O(1)$       | No        | Select  | When memory writes (swaps) are very expensive.         |
| **Insertion Sort**  | $O(N^2)$      | $O(1)$       | Yes       | Insert  | Small arrays ($N<50$) or **nearly sorted** data.       |
| **Merge Sort**      | $O(N\log ⁡N)$ | $O(N)$       | Yes       | D & C   | Linked Lists; when **stability** is guaranteed needed. |
| **Quick Sort**      | $O(N\log ⁡N)$ | $O(\log ⁡N)$ | No        | D & C   | **General purpose**; usually the fastest in practice.  |
| **Hash (Counting)** | $O(N+K)$      | $O(N+K)$     | Yes       | Hashing | **Integers** with a small range ($K$).                 |
- D & C -- Divide and Conquer  [[Divide-and-conquer]]