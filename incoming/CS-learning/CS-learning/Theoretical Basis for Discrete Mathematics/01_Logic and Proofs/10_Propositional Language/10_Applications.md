## 1. Overview

**Key Applications Include:**

- Translating English to Propositional Logic
    
- Designing and verifying System Specifications
    
- Boolean Searching
    
- Solving Logic Puzzles
    
- Designing Logic Circuits
    
- AI Diagnosis Methods
    

---

## 2. Translating English Sentences

Converting an English sentence into a logical expression involves two main steps:

1. **Identify atomic propositions** and represent them using propositional variables (e.g., $p, q, r$).
    
2. **Determine appropriate logical connectives** ($\wedge, \vee, \neg, \rightarrow, \leftrightarrow$) based on the meaning of the sentence.
    

---

## 3. System Specifications

System specifications define the rules and constraints a system must follow. Propositional logic is used to ensure these rules are logically sound.

**Example Translation:**

- **Specification:** "The automated reply cannot be sent when the file system is full."
    
- **Variables:**
    
    - $p$: The automated reply can be sent.
        
    - $q$: The file system is full.
        
- **Logical Expression:** $q \rightarrow \neg p$ _(If the file system is full, then the reply cannot be sent)_.
    

### Consistent System Specifications

**Definition:** A list of propositions is **consistent** if it is possible to assign truth values (True or False) to the proposition variables so that _every single proposition in the list evaluates to True simultaneously_.

**Example Check for Consistency:**

Consider the following three system specifications:

1. "The diagnostic message is stored in the buffer or it is retransmitted." ($p \vee q$)
    
2. "The diagnostic message is not stored in the buffer." ($\neg p$)
    
3. "If the diagnostic message is stored in the buffer, then it is retransmitted." ($p \rightarrow q$)
    

Let $p$ = message stored in buffer, $q$ = message retransmitted.

- From statement 2 ($\neg p$), we know $p$ must be **False**.
    
- If $p$ is False, for statement 1 ($p \vee q$) to be True, $q$ must be **True**.
    
- Let's check statement 3 ($p \rightarrow q$) with $p=\mathbf{F}, q=\mathbf{T}$: $\mathbf{F} \rightarrow \mathbf{T}$ evaluates to **True**.
    
- **Conclusion:** Since all three statements can be True when $p$ is False and $q$ is True, these specifications are **consistent**.
    

---

## 4. Boolean Searches

Logical connectives are widely used in web and database searches to filter results.

- **Example:** To find webpages dealing with universities in either New Mexico or Arizona, the search engine query would utilize Boolean logic:
    
    `(NEW AND MEXICO OR ARIZONA) AND UNIVERSITIES`
    

---

## 5. Logic Puzzles

Logic puzzles test our ability to draw deductions using propositional truth values.

### Type A: Knights and Knaves

In these puzzles, an island has two types of inhabitants:

- **Knights:** Always tell the truth (their statements evaluate to True).
    
- **Knaves:** Always lie (their statements evaluate to False).
    

**Puzzle 1:** You meet A and B. A says "B is a knight." B says "The two of us are of opposite types." What are they?

- Let $p$: A is a knight, $q$: B is a knight.
    
- **Deduction:** * Assume A is a Knight ($p$ is T). This means B is a Knight ($q$ is T). If B is a Knight, B tells the truth. But B says they are opposite types, which contradicts them both being Knights. Thus, our assumption is wrong. **A must be a Knave ($\neg p$ is T).**
    
    - Since A is a Knave, A's statement ("B is a knight") is a lie. Therefore, **B is also a Knave ($\neg q$ is T).**
        
    - _Result:_ Both A and B are Knaves.
        

**Puzzle 2:**

A says "At least one of us is a knave." B says nothing. What are they?

- A's statement logically is $\neg p \vee \neg q$.
    
- **Deduction:**
    
    - If A is a Knave ($p$ is F), then A's statement ("at least one is a knave") is actually true! But a Knave cannot tell the truth. This is a contradiction.
        
    - Therefore, **A must be a Knight ($p$ is T).**
        
    - Since A is a Knight, A's statement is true. So, at least one of them _must_ be a knave. Since A is a Knight, **B must be the Knave ($q$ is F).**
        

### Type B: The Muddy Forehead Puzzle

**Premise:** A father tells his son and daughter to play. Both get muddy foreheads. The father states: "At least one of you has a muddy forehead" (Let $s$: son is muddy, $d$: daughter is muddy. So, $s \vee d$ is True). He asks them simultaneously: "Do you know whether you have a muddy forehead?" Assume both are honest and can see the other's forehead but not their own.

**The Logical Progression:**

1. **First Question:** The son sees the daughter's muddy forehead ($d$ is T) and the daughter sees the son's muddy forehead ($s$ is T). Because they only see the _other_ person's mud, neither can be 100% sure about their _own_ forehead. Therefore, they **both answer "No"**.
    
2. **Second Question:** * The daughter reasons: "I know at least one of us is muddy ($s \vee d$). If _my_ forehead were clean ($\neg d$), my brother would have seen a clean forehead on me. Knowing $s \vee d$ is true, he would have instantly deduced that _his_ forehead must be muddy, and he would have answered 'Yes' the first time. Since he answered 'No', my forehead must _not_ be clean."
    
    - The son uses the exact same reasoning.
        
    - Therefore, upon the father asking the second time, they **both answer "Yes"**.
        
