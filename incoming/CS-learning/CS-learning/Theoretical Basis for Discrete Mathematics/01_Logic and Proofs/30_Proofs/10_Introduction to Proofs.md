## 1. Methods of Proving Conditional Statements ($p \rightarrow q$)

#### A. Edge-Case Proofs

- **Trivial Proof:** If we already know that the conclusion $q$ is universally true, then $p \rightarrow q$ is automatically true regardless of $p$.
    
    - _Example:_ "If it is raining, then $1=1$."
        
- **Vacuous Proof:** If we know that the premise $p$ is strictly false, then $p \rightarrow q$ is vacuously true.
    
    - _Example:_ "If I am both rich and poor, then $2+2=5$."
        

#### B. Direct Proof

In a direct proof, we assume the premise $p$ is true and logically deduce that the conclusion $q$ must also be true.

#### C. Proof by Contraposition (Indirect Proof)

Sometimes $p \rightarrow q$ is hard to prove directly, we can prove the contrapositive instead. Assume $\neg q$ is true, and show it inevitably leads to $\neg p$.

---

## 2. Proof by Contradiction (_Reductio ad absurdum_)

To prove a statement $p$ is true, we assume the opposite ($\neg p$) is true. We then logically deduce a contradiction so the assumption $\neg p$ must be wrong, meaning $p$ is true.

---

## 3. Proving Biconditional Statements ($p \leftrightarrow q$)

1. Prove $p \rightarrow q$
    
2. Prove $q \rightarrow p$
    
