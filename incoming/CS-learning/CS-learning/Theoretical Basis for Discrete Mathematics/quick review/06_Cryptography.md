## 一、 整除与同余基础 (Divisibility and Modular Arithmetic)

### 1. 整除定义与性质

- **定义**：对于整数 $a \neq 0$ 和 $b$，若存在整数 $c$ 使得 $b = ac$，则称 $a$ 整除 $b$，记作 $a \mid b$。
    
- **核心性质**：
    
    - 若 $a \mid b$ 且 $a \mid c$，则 $a \mid (b + c)$。
        
    - 若 $a \mid b$，则对于任意整数 $c$ 有 $a \mid bc$。
        
    - **传递性**：若 $a \mid b$ 且 $b \mid c$，则 $a \mid c$。
        
    - **线性组合**：若 $a \mid b$ 且 $a \mid c$，则 $a$ 整除它们的任意线性组合 $a \mid (mb + nc)$。
        

### 2. 除法算法 (The Division Algorithm)

- 若 $a$ 为整数，$d$ 为正整数，则存在**唯一**的商 $q$ 和余数 $r$（$0 \leq r < d$），使得 $a = dq + r$。
    
- 数学表示为：$q = a \text{ div } d$，$r = a \bmod d$。
    

### 3. 同余关系 (Congruence)

- **定义**：若 $m \mid (a - b)$，则称 $a$ 和 $b$ 模 $m$ 同余，记作 $a \equiv b \pmod{m}$。
    
- **等价条件**：$a \equiv b \pmod{m}$ 当且仅当存在整数 $k$ 使得 $a = b + km$，或等价于 $a \bmod m = b \bmod m$。
    
- **运算规则**：同余关系下的加法和乘法保持有效（$a+c \equiv b+d \pmod{m}$ 且 $ac \equiv bd \pmod{m}$），但**除法不一定有效**。
    
- **$\mathbb{Z}_m$ 集合**：包含 $\{0, 1, \dots, m-1\}$。其模 $m$ 加法和乘法满足封闭性、结合律、交换律和分配律。每个非零元素 $a$ 都有加法逆元 $(m - a)$，但乘法逆元不一定存在。
    

---

## 二、 整数表示与运算算法 (Integer Representations and Algorithms)

- **$b$ 进制表示**：任意正整数 $n$ 可唯一表示为 $n = a_kb^k + a_{k-1}b^{k-1} + \dots + a_1b + a_0$，其中 $0 \le a_i < b$ 且 $a_k \neq 0$。计算机中常用二进制 (Base 2)、八进制 (Base 8) 和十六进制 (Base 16)。
    
- **基础运算复杂度**：两个 $n$ 位整数的二进制加法时间复杂度为 $O(n)$，二进制乘法为 $O(n^2)$。
    
- **快速模幂算法 (Binary Modular Exponentiation)**：用于高效计算 $b^n \bmod m$。通过将指数 $n$ 展开为二进制并连续平方，其位运算时间复杂度降至 $O((\log m)^2 \log n)$，是密码学的核心支撑。
    

---

## 三、 素数与最大公约数 (Primes and GCD)

### 1. 素数定理与生成

- **算术基本定理**：每个大于 1 的正整数都可以唯一地分解为素数的乘积（不计次序）。
    
- **埃拉托斯特尼筛法 (Sieve of Eratosthenes)**：通过剔除素数的倍数来寻找素数，优化后只需筛至 $\sqrt{n}$。
    
- **素数定理 (Prime Number Theorem)**：不超过 $x$ 的素数个数 $\pi(x)$ 渐近于 $x / \ln(x)$。
    

### 2. 最大公约数 (GCD) 与最小公倍数 (LCM)

- **互质 (Relatively Prime)**：若 $\gcd(a, b) = 1$，则 $a$ 和 $b$ 互质。
    
- **核心定理**：$ab = \gcd(a, b) \cdot \text{lcm}(a, b)$。
    
- **欧几里得算法 (Euclidean Algorithm)**：基于引理 $a = bq + r \implies \gcd(a, b) = \gcd(b, r)$，通过连续相除取余，最后一个非零余数即为 GCD。时间复杂度为 $O(\log b)$。
    

### 3. 裴蜀定理 (Bézout's Theorem)

- 若 $a, b$ 为正整数，则必定存在整数 $s, t$ 使得 $\gcd(a, b) = sa + tb$。可通过反向推导欧几里得算法求得 $s$ 和 $t$。
    
- **重要推论 (同余除法)**：若 $ac \equiv bc \pmod{m}$ 且 $\gcd(c, m) = 1$（即 $c$ 与模数互质），则可以安全地消除 $c$，得出 $a \equiv b \pmod{m}$。
    

---

## 四、 求解同余方程 (Solving Congruences)

### 1. 线性同余与逆元

- **乘法逆元**：对于 $ax \equiv b \pmod{m}$，若 $\gcd(a, m) = 1$，则存在唯一的逆元 $\bar{a}$ 使得 $\bar{a}a \equiv 1 \pmod{m}$。
    
- **求解方法**：利用扩展欧几里得算法求出裴蜀系数，该系数即为逆元，方程两边同乘逆元即可解出 $x$。
    

### 2. 中国剩余定理 (CRT)

- 用于求解模数两两互质的同余方程组（如 $x \equiv a_i \pmod{m_i}$）。
    
- 方程组在模 $m = m_1 m_2 \dots m_n$ 下有唯一解。
    
- **公式法**：$x = \sum a_i M_i y_i$，其中 $M_i = m / m_i$，$y_i$ 是 $M_i$ 模 $m_i$ 的逆元。也可以通过逐个代入的**回代法**求解。
    

### 3. 费马小定理与欧拉定理

- **费马小定理**：若 $p$ 为素数且 $p \nmid a$，则 $a^{p-1} \equiv 1 \pmod{p}$。对于任意 $a$ 均有 $a^p \equiv a \pmod{p}$。
    
- **欧拉定理 (推广)**：若 $\gcd(a, n) = 1$，则 $a^{\varphi(n)} \equiv 1 \pmod{n}$，其中 $\varphi(n)$ 为欧拉函数。
    
- **伪素数与卡迈克尔数**：满足 $b^{n-1} \equiv 1 \pmod{n}$ 的合数 $n$ 称为伪素数；若对所有与 $n$ 互质的 $b$ 均成立，则称为卡迈克尔数 (Carmichael Numbers，如 561)。
    

### 4. 原根与离散对数

- **原根 (Primitive Root)**：若素数 $p$ 的某个元素 $r$ 的幂可以生成 $\mathbb{Z}_p$ 中的所有非零元素，则 $r$ 为原根。
    
- **离散对数 (Discrete Logarithm)**：求解方程 $r^e \bmod p = a$ 中的指数 $e$，记作 $\log_r a = e$。计算离散对数具有**极高的计算难度（无已知多项式时间算法）**，这是非对称密码学的重要数学基础。
    

---

## 五、 同余的实际应用 (Applications of Congruences)

### 1. 数据结构与校验

- **哈希函数**：$h(k) = k \bmod m$。常使用线性探测法 $h(k, i) = (h(k) + i) \bmod m$ 解决哈希冲突 (Collisions)。
    
- **伪随机数生成**：线性同余法 $x_{n+1} = (ax_n + c) \bmod m$。
    
- **校验码 (Check Digits)**：例如 UPC (模 10 校验) 和 ISBN-10 (模 11 校验)，用于检测输入错误。
    

### 2. RSA 公钥密码体制

基于大整数分解的计算不可行性。

- **密钥生成**：选择两大素数 $p, q$，计算 $n = p \cdot q$。选择与 $(p-1)(q-1)$ 互质的公钥指数 $e$。求 $e$ 模 $(p-1)(q-1)$ 的逆元得到私钥 $d$。公钥为 $(n, e)$，私钥为 $d$。
    
- **加密**：$C = M^e \bmod n$。
    
- **解密**：$M = C^d \bmod n$。
    

### 3. 密码学协议

- **Diffie-Hellman 密钥交换**：允许双方在不安全的信道上建立共享密钥。双方利用公共素数 $p$ 和原根 $a$ 及各自的私密数字 $k_1, k_2$，最终计算出共享密钥 $(a^{k_2})^{k_1} \bmod p$。安全性依赖于离散对数难题。
    
- **数字签名 (Digital Signatures)**：发送方用自己的**私钥**加密消息 ($y = x^d \bmod n$)，接收方用发送方的**公钥**解密验证 ($x = y^e \bmod n$)，确保消息未被伪造且不可抵赖。可与公钥加密结合，同时实现身份认证和机密性。