## **1. Hashing Functions**

Hashing functions are used to assign memory locations (records) to specific keys for efficient data retrieval.

- **Definition:** A common hashing function takes the form $h(k) = k \bmod m$, where $k$ is the key and $m$ is the total number of available memory locations.
    
- **Collisions:** Because there are typically more possible keys than memory locations, the function is not one-to-one. When two keys map to the same location ($h(k_1) = h(k_2)$), a **collision** occurs.
    
- **Collision Resolution (Linear Probing):** A simple method to resolve collisions by assigning the record to the next available free location. The linear probing function is defined as:
    
    $$h(k, i) = (h(k) + i) \bmod m$$
    
    _(where $i$ runs from $0$ to $m - 1$ until an empty slot is found)._
    

---

## **2. Pseudorandom Numbers**

Randomly chosen numbers are essential for computer simulations, but computers generate them using systematic, deterministic mathematical formulas (hence, _pseudo_random).

- **Linear Congruential Method:** A widely used algorithm to generate a sequence of pseudorandom numbers $\{x_n\}$.
    
- **Parameters Required:**
    
    - Modulus $m$
        
    - Multiplier $a$ (where $2 \le a < m$)
        
    - Increment $c$ (where $0 \le c < m$)
        
    - Seed $x_0$ (where $0 \le x_0 < m$)
        
- **Recursive Function:**
    
    $$x_{n+1} = (ax_n + c) \bmod m$$
    
- **Pure Multiplicative Generator:** If the increment $c = 0$, the formula simplifies to $x_{n+1} = (ax_n) \bmod m$. (e.g., $m = 2^{31}-1, a = 7^5$).
    

---

## **3. Check Digits**

Congruences are used to append "check digits" to identification numbers to detect common input errors (like single-digit typos or transposition of adjacent digits).

- **Universal Product Codes (UPCs):** A 12-digit code used in retail. The 12th digit is the check digit, satisfying the following congruence:
    
    $$3x_1 + x_2 + 3x_3 + x_4 + 3x_5 + \dots + 3x_{11} + x_{12} \equiv 0 \pmod{10}$$
    
- **International Standard Book Numbers (ISBN-10):** A 10-digit code. The 10th digit is the check digit. The sequence is valid if:
    
    $$x_{10} \equiv \sum_{i=1}^{9} i \cdot x_i \pmod{11}$$
    
    _(Note: If $x_{10} = 10$, the character 'X' is used). Equivalently, the entire string validates if $\sum_{i=1}^{10} i \cdot x_i \equiv 0 \pmod{11}$._
    

---

## **4. Public Key Cryptography and The RSA Cryptosystem**

- **Classical vs. Public Key:** Classical ciphers (symmetric) require a shared private key between parties. **Public key cryptography** (asymmetric) utilizes two keys: a publicly known encryption key and a closely guarded private decryption key.
    
- **The RSA System:** Introduced in 1976 by Rivest, Shamir, and Adleman (and earlier secretly by Clifford Cocks).
    

**A. RSA Key Generation**

1. Choose two large prime numbers, $p$ and $q$ (typically ~300 digits each).
    
2. Compute the modulus $n = p \cdot q$.
    
3. Choose an encryption exponent $e$ that is relatively prime to $(p-1)(q-1)$.
    
    - **Public Key:** $(n, e)$
        

**B. RSA Encryption**

1. Translate the plaintext message $M$ into numerical equivalents (e.g., A=00, B=01).
    
2. Divide the digits into blocks of length $2N$, ensuring the block value is less than $n$.
    
3. Encrypt each block $M$ to create ciphertext $C$ using the public key:
    
    $$C = M^e \bmod n$$
    

**C. RSA Decryption**

1. Find the decryption key $d$, which is the modular inverse of $e$ modulo $(p-1)(q-1)$.
    
    $$de \equiv 1 \pmod{(p-1)(q-1)}$$
    
2. **Private Key:** $d$
    
3. Decrypt each ciphertext block $C$ back to plaintext $M$:
    
    $$M = C^d \bmod n$$
    

- **Mathematical Proof:** $C^d \bmod n = (M^e)^d \bmod n = M^{ed} \bmod n$. By Euler's Theorem, since $ed = k\phi(n) + 1$, $M^{ed} \bmod n = M \bmod n$.
    
- **Security Basis:** The security of RSA relies solely on the computational infeasibility of integer factorization. Finding $d$ requires knowing $(p-1)(q-1)$, which requires factoring the massive public modulus $n$ into $p$ and $q$.
    

---

## **5. Cryptographic Protocols**

**A. Diffie-Hellman Key Exchange**

A protocol allowing two parties to securely establish a shared secret key over an insecure channel.

1. Alice and Bob agree on a public prime $p$ and a primitive root $a$ of $p$.
    
2. Alice selects a secret integer $k_1$ and sends $a^{k_1} \bmod p$ to Bob.
    
3. Bob selects a secret integer $k_2$ and sends $a^{k_2} \bmod p$ to Alice.
    
4. **Shared Secret:** Both compute the shared key locally without transmitting it:
    
    - Alice computes $(a^{k_2})^{k_1} \bmod p$.
        
    - Bob computes $(a^{k_1})^{k_2} \bmod p$.
        

- **Security Basis:** Relies on the **Discrete Logarithm Problem**—it is computationally unfeasible for an eavesdropper to deduce $k_1$ or $k_2$ given only $p$, $a$, and the transmitted powers.
    

**B. Digital Signatures**

Used to authenticate the sender of a message, ensuring it was not forged.

- **Process:** The sender (Alice) encrypts a plaintext message $x$ using her _own private decryption key_ $d$.
    
    $$y = x^d \bmod n$$
    
- **Verification:** The recipient uses Alice's _public encryption key_ $e$ to decrypt $y$.
    
    $$x = y^e \bmod n$$
    
- Since only Alice knows her private key, successfully retrieving the readable message with her public key proves she sent it.
    

**C. Combining Digital Signatures and Encryption**

To achieve both confidentiality (only Bob can read it) and authentication (Bob knows Alice sent it).

1. Alice encrypts the message using Bob's Public Key. (Confidentiality)
    
2. Alice signs the resulting blocks using her Private Key. (Authentication)
    
3. Upon receipt, Bob verifies the message using Alice's Public Key, then decrypts the underlying message using his own Private Key.