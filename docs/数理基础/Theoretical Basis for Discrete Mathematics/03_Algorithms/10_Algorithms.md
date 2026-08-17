# 10_Algorithms

## **1. Core Concepts and Properties**

- **Definition:** An algorithm is a finite set of precise instructions for performing a computation or solving a problem. It takes a valid input and produces a desired output.

**Properties of a Valid Algorithm:**

1. **Input:** Has input values from a specified set.

2. **Output:** Produces output values from a specified set.

3. **Correctness:** Produces the correct output for every valid set of inputs.

4. **Finiteness:** Must terminate and produce output after a finite number of steps.

5. **Effectiveness:** Each step must be exactly executable in a finite amount of time.

6. **Generality:** Should solve all problems of the desired form, not just specific test cases.

---

## **2. Classes of Algorithmic Problems**

This section studies three primary problem domains:

1. **Searching Problems:** Finding the position of a specific element in a list (or determining it does not exist).

2. **Sorting Problems:** Arranging elements of a list into an increasing (or decreasing) order.

3. **Optimization Problems:** Determining the optimal value (maximum or minimum) of a particular quantity over all possible inputs.

---

## **3. Searching Algorithms**

- **Linear Search**

- **Binary Search**

---

## **4. Sorting Algorithms**

- **Bubble Sort**

- **Insertion Sort**

---

## **5. Greedy Algorithms (Optimization)**

- **Definition:** Algorithms that make the "best" or most optimal local choice at each step, hoping that these local choices will lead to a global optimum.

- **Note:** Greedy algorithms do _not_ always guarantee an optimal solution. One must prove mathematically that the greedy choice yields the global optimum or find a counterexample where it fails.

---

## **6. The Halting Problem**

- **The Problem:** Can we write a universal procedure (program) that takes _any_ computer program $P$ and its input $I$, and determines whether $P$ will eventually halt (stop) or run in an infinite loop?

- **Conclusion:** The Halting Problem is **unsolvable**.

- **Proof by Contradiction:**

    1. Assume a solver program $H(P, I)$ exists. It outputs "halt" if $P$ stops, and "loops forever" if $P$ doesn't.

    2. Create a malicious program $K(P)$ that takes $H$'s output and does the exact opposite: If $H(P,P)$ says "loops forever", $K$ halts. If $H(P,P)$ says "halt", $K$ goes into an infinite loop.

    3. Feed $K$ into itself: Execute $K(K)$.

    4. **The Paradox:**

        		- If $H(K,K)$ predicts $K$ will "halt", $K(K)$ actively enters an infinite loop (contradiction).

                - If $H(K,K)$ predicts $K$ will "loop forever", $K(K)$ actively halts (contradiction).

    5. Therefore, the theoretical program $H$ cannot exist.
