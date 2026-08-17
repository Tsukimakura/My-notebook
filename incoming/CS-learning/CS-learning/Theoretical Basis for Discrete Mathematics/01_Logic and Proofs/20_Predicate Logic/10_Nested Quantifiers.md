## 1. Introduction to Nested Quantifiers

- **Definition:** Two quantifiers are nested if one is within the scope of the other. They are frequently used to express complex mathematical concepts and precise English sentences.
    
    - _Example:_ "Every real number has an inverse" translates to $\forall x \exists y (x + y = 0)$, where the domains of $x$ and $y$ are real numbers.
        
- **Conceptualizing as Nested Loops:** 
	
	* To evaluate $\forall x \forall y P(x, y)$, imagine an outer loop stepping through all values of $x$, and an inner loop stepping through all values of $y$. If $P(x, y)$ is true for every step, the statement is true.
    
    - To evaluate $\forall x \exists y P(x, y)$, the outer loop steps through $x$. The inner loop steps through $y$ and terminates as soon as a $y$ is found that makes $P(x, y)$ true. If the outer loop finishes successfully for all $x$, the statement is true.
        

## 2. The Order of Quantifiers

The order of nested quantifiers is critical. Switching them can change the meaning and truth value of the statement.

- **When Order Doesn't Matter:** Quantifiers of the _same_ type can be swapped without changing the truth value.
    
    - $\forall x \forall y P(x, y) \equiv \forall y \forall x P(x, y)$
        
    - $\exists x \exists y P(x, y) \equiv \exists y \exists x P(x, y)$
        
- **When Order Matters:** Swapping _different_ quantifiers usually changes the statement's logical meaning.
    
    - $\forall x \exists y P(x, y) \not\equiv \exists y \forall x P(x, y)$
        


## 3. Truth Conditions for Quantifications of Two Variables

Let $P(x,y)$ be a propositional function.

|**Statement**|**When is it True?**|**When is it False?**|
|---|---|---|
|$\forall x \forall y P(x,y)$|$P(x,y)$ is true for **every** pair $x, y$.|There is **at least one** pair $x, y$ where $P(x,y)$ is false.|
|$\forall x \exists y P(x,y)$|For **every** $x$, there is a $y$ making $P(x,y)$ true.|There is **an** $x$ for which $P(x,y)$ is false for **every** $y$.|
|$\exists x \forall y P(x,y)$|There is **an** $x$ for which $P(x,y)$ is true for **every** $y$.|For **every** $x$, there is a $y$ making $P(x,y)$ false.|
|$\exists x \exists y P(x,y)$|There is **at least one** pair $x, y$ making $P(x,y)$ true.|$P(x,y)$ is false for **every** pair $x, y$.|

## 4. Translating Statements

Translating requires defining domains, predicates, and carefully applying quantifiers.

**English to Logical Expressions:**

- **Expressing "Exactly One":** "Everyone has exactly one best friend."
    
    Let $B(x,y)$ be "$y$ is the best friend of $x$".
    
    Translation: $\forall x \exists y \forall z (B(x, y) \wedge ((z \neq y) \rightarrow \neg B(x, z)))$
    
    _(Meaning: For every person $x$, there is a person $y$ who is their best friend, and if anyone else $z$ exists, $z$ is not the best friend of $x$.)_
    
- **Complex Relationships:** "There is a woman who has taken a flight on every airline in the world."
    
    Let $P(w, f)$ be "$w$ has taken $f$" and $Q(f, a)$ be "$f$ is a flight on $a$".
    
    Translation: $\exists w \forall a \exists f (P(w, f) \wedge Q(f, a))$
    

**Mathematical Statements to Predicate Logic:**

- **Implicit Domains:** "The sum of two positive integers is always positive."
    
    Translation: $\forall x \forall y ((x > 0) \wedge (y > 0) \rightarrow (x + y > 0))$
    
- **Restricted Domains:**
    
    - Universal bounds act as conditionals: $\forall x < 0 (x^2 > 0) \equiv \forall x (x < 0 \rightarrow x^2 > 0)$
        
    - Existential bounds act as conjunctions: $\exists y > 0 (y^2 = 2) \equiv \exists y (y > 0 \wedge y^2 = 2)$
        

**Calculus in Logic (Optional Application):**

- Definition of a limit $\lim_{x \to a} f(x) = L$:
    
    $\forall \epsilon > 0 \exists \delta > 0 \forall x (0 < |x - a| < \delta \rightarrow |f(x) - L| < \epsilon)$
    

## 5. Negating Nested Quantifiers

To negate nested quantifiers, apply De Morgan's Laws for quantifiers successively, pushing the negation symbol inward until it reaches the predicate.

- $\neg \forall x \equiv \exists x \neg$
    
- $\neg \exists x \equiv \forall x \neg$
    

**Example 1: Negating a Mathematical Expression**

Negate $\forall x \exists y (xy = 1)$:

1. $\neg (\forall x \exists y (xy = 1))$
    
2. $\exists x \neg (\exists y (xy = 1))$
    
3. $\exists x \forall y \neg (xy = 1)$
    
4. $\exists x \forall y (xy \neq 1)$
    

**Example 2: Negating the Limit Definition**

Express that $\lim_{x \to a} f(x) \neq L$:

$\neg (\forall \epsilon > 0 \exists \delta > 0 \forall x (0 < |x - a| < \delta \rightarrow |f(x) - L| < \epsilon))$

$\equiv \exists \epsilon > 0 \forall \delta > 0 \exists x \neg (0 < |x - a| < \delta \rightarrow |f(x) - L| < \epsilon)$

$\equiv \exists \epsilon > 0 \forall \delta > 0 \exists x (0 < |x - a| < \delta \wedge |f(x) - L| \geq \epsilon)$

_(Using the equivalence $\neg(p \rightarrow q) \equiv p \wedge \neg q$)_

## 6. Distributing Quantifiers over Connectives

#### 1. Valid Equivalences (When Distribution Works)

- **Universal Quantifier ($\forall$) distributes over Conjunction ($\wedge$):**
    
    $$\forall x (P(x) \wedge Q(x)) \equiv \forall x P(x) \wedge \forall x Q(x)$$
    
- **Existential Quantifier ($\exists$) distributes over Disjunction ($\vee$):**
    
    $$\exists x (P(x) \vee Q(x)) \equiv \exists x P(x) \vee \exists x Q(x)$$
    

#### 2. Invalid Equivalences (Common Pitfalls)

- **Universal Quantifier ($\forall$) DOES NOT distribute over Disjunction ($\vee$)**
    
- **Existential Quantifier ($\exists$) DOES NOT distribute over Conjunction ($\wedge$)**
    
- **Implications ($\rightarrow$):** distributing over an implication ($\rightarrow$) is generally **invalid** for both quantifiers because implications are fundamentally asymmetric, unlike $\wedge$ and $\vee$.
