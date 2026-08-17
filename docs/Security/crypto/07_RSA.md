# 07_RSA

## 1. RSA 算法简介

RSA 是一种**非对称密码体制（公钥密码体制）**，由 Ron Rivest, Adi Shamir, Leonard Adleman 于1977年提出。

- **对称密码体制（如 DES, AES）：** 加密和解密使用同一个密钥。

- **非对称密码体制：** 加密密钥和解密密钥不同。加密密钥公开（称为**公钥 Public Key**），解密密钥保密（称为**私钥 Private Key**）。

### 密钥生成与加解密流程

1. **选取素数：** 随机选择两个不相等的大素数 $p$ 和 $q$。

2. **计算模数：** 计算乘积 $n = p \times q$。（$n$ 公开，$p, q$ 保密）。

3. **计算欧拉函数：** 计算 $\phi(n) = (p-1)(q-1)$。

4. **选择公钥指数 $e$：** 随机选取加密密钥 $e$，使得 $e$ 和 $(p-1)(q-1)$ 互素。

5. **计算私钥指数 $d$：** 计算 $e$ 在模 $(p-1)(q-1)$ 下的逆元 $d$，即满足：$e \times d \equiv 1 \pmod{(p-1)(q-1)}$。

6. **分发密钥：**

    - **公钥：** $(e, n)$

    - **私钥：** $(d, n)$

**加解密公式：**

- **加密（已知公钥）：** 密文 $c \equiv m^e \pmod n$

- **解密（已知私钥）：** 明文 $m \equiv c^d \pmod n$

> **安全性基石：** 加解密过程不直接用到 $p, q$ 和 $(p-1)(q-1)$。只要 $n$ 足够大（如1024位以上），在合理时间内无法将 $n$ 质因数分解求出 $p$ 和 $q$，从而无法算出私钥 $d$。

## 2. RSA 算法的数学基础

1. **Euler（欧拉）函数 $\phi(n)$：** 小于 $n$ 且与 $n$ 互素的整数个数。

    - 例：$\phi(5) = 4$（互素数为1,2,3,4）。

2. **Euler 定理：** 若 $\gcd(x, n) = 1$（$x$与$n$互素），则 $x^{\phi(n)} \equiv 1 \pmod n$。

3. **Fermat（费马）小定理：** 若 $p$ 为素数且 $\gcd(x, p) = 1$，则 $x^{p-1} \equiv 1 \pmod p$。（这是 Euler 定理的特例）。

4. **中国剩余定理 (CRT)：**

    - 设 $m_1, m_2, \dots, m_r$ 两两互素，则同余方程组 $x \equiv a_i \pmod{m_i}$ 在模 $M = m_1 m_2 \dots m_r$ 下有唯一解。

    - 求解公式：$x = \sum (a_i \times M_i \times (M_i^{-1} \pmod{m_i})) \pmod M$，其中 $M_i = M / m_i$。

5. **Euler 函数的乘法性质：** 若 $n_1, n_2$ 互素，则 $\phi(n_1 \times n_2) = \phi(n_1) \times \phi(n_2)$。

6. **Euler 函数的乘积公式：** $\phi(n) = n \times \prod_{p|n} (1 - 1/p)$。

## 3. RSA 算法正确性证明

**目标：** 证明 $c \equiv m^e \pmod n$，解密后 $m \equiv c^d \pmod n$ 恒成立，即证明 $m^{ed} \equiv m \pmod n$。

**证明思路（基于中国剩余定理）：**

已知 $ed \equiv 1 \pmod{\phi(p \times q)}$，故 $ed - 1 = k(p-1)(q-1)$。

1. **模 $p$ 的情况：**

    - 若 $m \equiv 0 \pmod p$，则 $m^{ed} \equiv 0 \equiv m \pmod p$。

    - 若 $m \not\equiv 0 \pmod p$，由费马小定理，$(m^{p-1})^{k(q-1)} \times m \equiv 1 \times m \equiv m \pmod p$。

    - 综合可得：$m^{ed} \equiv m \pmod p$。

2. **模 $q$ 的情况：** 同理可证 $m^{ed} \equiv m \pmod q$。

3. **合并：** 因为 $p, q$ 互素，且 $m^{ed} - m$ 同时能被 $p$ 和 $q$ 整除，故一定能被 $p \times q$ 整除。

    - 即 $m^{ed} \equiv m \pmod{p \times q}$，证明完毕。

_(注：无论 $\gcd(m, n)$ 是否等于 1，RSA 的解密公式都成立。)_

## 4. 数字签名 (Digital Signature)

数字签名用于验证信息的**完整性**和**来源的不可否认性**。利用“私钥加密，公钥解密”的特性实现。

**A 向 B 发送签名信件的流程：**

1. **生成摘要：** A 对信件内容 $L$ 使用哈希算法（如 MD5）计算摘要 $M = MD5(L)$。

2. **签名：** A 用**自己的私钥**对摘要 $M$ 进行加密，得到签名 $M' = RSA(M, \text{A的私钥})$。

3. **发送：** A 将原文 $L$ 和签名 $M'$ 一同发给 B。

4. **验签：**

    - B 收到后，用 **A 的公钥**对签名 $M'$ 解密，得到哈希值 $m = RSA(M', \text{A的公钥})$。

    - B 独立对原文 $L$ 计算哈希值 $MD5(L)$。

    - 若 $MD5(L) == m$，则证明信件确实由 A 发出且中途未被篡改。

## 5. 实际应用与 OpenSSL 库开发

### 5.1 混合加密体制 (AES + RSA)

由于 RSA 算法涉及大数幂乘，速度极慢，通常不用于直接加密大文件。

- **最佳实践：** 使用 AES（对称加密，速度快）加密文件数据；使用 RSA（非对称加密）加密 AES 的密钥。

- **勒索病毒案例：** 病毒生成随机的 AES 密钥加密受害者文件，然后用黑客内嵌的 RSA 公钥加密该 AES 密钥并存入文件。只有黑客手中的 RSA 私钥才能解密出 AES 密钥，进而恢复文件。

### 5.2 软件注册码机制验证

- 软件读取设备特征生成机器码 $m'$：$m' = RSA(mac, \text{公钥})$

- 开发者在后台计算注册码 $sn$：$sn = RSA(mac, \text{私钥})$

- 软件端验证：判断 $RSA(sn, \text{公钥}) == mac$ 是否成立。

### 5.3 OpenSSL 核心函数与 API 详解

_相关操作主要依赖于三个头文件：`<openssl/rsa.h>`（核心算法）、`<openssl/bn.h>`（大数处理）、`<openssl/md5.h>`（哈希算法）与 `<openssl/rand.h>`（随机数生成）。_

#### A. 核心数据结构与内存管理

1. **`RSA` 结构体：** 用于保存和管理 RSA 密钥的核心结构。其实际上是一个包含多个大数指针和配置标记的集合。

    - **核心成员：** 包含 `BIGNUM *n`（模数）、`BIGNUM *e`（公钥指数）、`BIGNUM *d`（私钥指数）、`BIGNUM *p`, `BIGNUM *q`（质因子）。

    - **控制成员：** `int flags` 用于控制底层的缓存与安全检查机制。

2. **`BIGNUM` 与 `BN_CTX`：** `BIGNUM` 专门用于表示任意精度的大整数。`BN_CTX` 是大数计算的上下文管理器，内部维护了计算中产生的海量临时大数变量。

3. **内存管理法则：** 必须调用 `RSA_new()`、`BN_new()` 进行分配，使用完毕后通过 `RSA_free()`、`BN_free()` 释放。涉及大数运算必须传入由 `BN_CTX_new()` 创建的上下文，结束后调用 `BN_CTX_free()` 防治内存泄漏。

#### B. 数据格式化与转换底层 API

_(核心概念区分：十六进制字符串是供人类阅读的 ASCII 字符，例如字符串 `"FF"` 在内存中占 2 个字节；而原始二进制字节流是底层的机器数据，十六进制的 `0xFF` 仅占 1 个字节。针对这两类数据，OpenSSL 提供了两套完全不同的互转 API。)_

1. **`BN_hex2bn()` —— 十六进制字符串转大数**

        - **函数原型：** `int BN_hex2bn(BIGNUM **a, const char *str);`

        - 注意第一个参数是 `BIGNUM` 的二级指针。这样设计的原因是：即使传入的解引用为 NULL，函数内部也能自动分配内存并将新地址绑定到指针上。

        - **工作原理：** 将 16 进制格式的 ASCII 字符串 `str` 解析并转换为大整数结构。常用于读取程序中硬编码的可见密钥字符串。

    	- **返回值：** 成功返回解析的有效字符数，失败返回 0。

2. **`BN_bn2hex()` —— 大数转十六进制字符串**

    - **函数原型：** `char *BN_bn2hex(const BIGNUM *a);`

    - **工作原理：** 将大数提取为可见的十六进制字符串进行打印调试。返回的字符串需要在使用后通过 `OPENSSL_free()` 手动释放内存。

3. **`BN_bin2bn()` —— 原始字节数组转大数**

    - **函数原型：** `BIGNUM *BN_bin2bn(const unsigned char *s, int len, BIGNUM *ret);`

    - **工作原理：** 将长度为 `len` 的原始二进制字节数组 `s`（按大端序排列，如 `{0x1A, 0x2B}`）转化为大整数。常用来将内存中解密前、后剥离出的纯二进制明/密文送入数学引擎。

4. **`BN_bn2bin()` —— 大数转原始字节数组**

    - **函数原型：** `int BN_bn2bin(const BIGNUM *a, unsigned char *to);`

    - **返回值：** 返回转换后实际写入 `to` 缓冲区的**精确字节数**（`int` 类型）。

    - **工作原理与陷阱：** 将大数 `a` 还原为大端序的二进制字节数组。但由于数学大数没有“前导零”概念，该函数输出时会**自动抹除所有最高位的 `0x00` 字节**。在处理强格式依赖的数据（如 RSA 签名解密后的格式校验）时，不能主观假设输出长度，**必须依据此函数的返回值**来判断前导零是否丢失，从而决定是否需要手动进行内存移位并补全 `0x00`。

#### C. 高阶加解密与签名 API

OpenSSL 严格分离了公钥和私钥的作用，四个核心 API 的最后参数均为填充模式（如 `RSA_PKCS1_PADDING`）。

1. **`RSA_public_encrypt()` —— 公钥加密**

    - **函数原型：** `int RSA_public_encrypt(int flen, const unsigned char *from, unsigned char *to, RSA *rsa, int padding);`

    - **工作原理：** 使用对方的公钥 `N` 和 `e` 对长度为 `flen` 的明文 `from` 进行加密。底层会自动按照 `padding` 指定的规则补充随机数（如 Type 2 型填充）。

    - **返回值：** 成功返回生成的密文长度（即密钥的字节长度），失败返回 -1。

2. **`RSA_private_decrypt()` —— 私钥解密**

    - **函数原型：** `int RSA_private_decrypt(int flen, const unsigned char *from, unsigned char *to, RSA *rsa, int padding);`

    - **工作原理：** 使用自己的私钥 `N` 和 `d` 对长度为 `flen` 的密文 `from` 进行解密，并自动剥离外层的 Padding 填充数据。

    - 返回值是**精确的有效明文字节数**。解密出的明文是纯粹的二进制流，不包含字符串末尾的结束符 `\0`。获取明文长度**严禁使用 `strlen(to)`**，必须使用该函数的返回值！

3. **`RSA_private_encrypt()` —— 私钥签名**

    	- **函数原型：** `int RSA_private_encrypt(int flen, const unsigned char *from, unsigned char *to, RSA *rsa, int padding);`

    	- **工作原理与底层 Padding 智能切换：** 本质是签名操作。使用自己的私钥对长度为 `flen` 的数据（通常是哈希摘要，如 MD5）进行加密。

    	- **多态行为（重点）：** 同样是传入 `RSA_PKCS1_PADDING` 作为最后一个参数，OpenSSL 引擎会根据调用的函数类型智能切换填充方案。当调用此私钥加密函数时，底层会自动应用 **Type 1 型填充**（即 `0x00, 0x01` 加上内部全 `0xFF` 的确定性填充规则）；而调用公钥加密（`RSA_public_encrypt`）时，该宏则代表应用 **Type 2 型填充**（包含随机数）。

4. **`RSA_public_decrypt()` —— 公钥验签**

    - **函数原型：** `int RSA_public_decrypt(int flen, const unsigned char *from, unsigned char *to, RSA *rsa, int padding);`

    - **工作原理：** 使用对方的公钥对签名进行解密验证。由于内部绑定了严格的格式检查，当参数为 `RSA_PKCS1_PADDING` 时，它只能解密标准 Type 1 型签名的内容，遇到非标格式会直接报错。

#### D. 安全标记控制 (Flags)

在自己手动构建 `RSA` 结构体（分配 `N, E, D`）之后，调用加密/解密 API 之前，必须对引擎的机制进行人工干预：

1. **关闭旁路攻击的盲化模式：`prsa->flags |= RSA_FLAG_NO_BLINDING;`**

    - **作用与原理：** 旁路攻击（Side-channel attack）通过测量解密时的功耗推算私钥。OpenSSL 默认开启盲化防御，强制要求使用私钥解密时必须提供公钥 `E` 混入随机数。

    - **时机：** 如果只掌握私钥 `D` 和模数 `N`，**必须在解密前**加上此句关闭盲化模式，否则解密函数会直接报错返回 -1。

2. **刷新密钥缓存：`prsa->flags &= ~RSA_FLAG_CACHE_PUBLIC;` 与 `~RSA_FLAG_CACHE_PRIVATE;`**

    - **作用与原理：** OpenSSL 为加速运算会默认缓存上一次使用的密钥。

    - **时机：** 如果程序中重用了同一个 `RSA` 结构体指针，并在运行中动态改变了内部的 `N, E, D` 值，**必须在加解密前**清除缓存，强制引擎读取最新密钥。

#### E. 底层大数模幂 API 与哈希函数

当遭遇非标格式（如强行使用 Type 2 加密填充做签名），导致 `RSA_public_decrypt()` 内部校验报错时，必须降级使用最底层的数学函数自己算：

1. **`BN_mod_exp()` —— 大数模幂运算**

    - **函数原型：** `int BN_mod_exp(BIGNUM *r, const BIGNUM *a, const BIGNUM *p, const BIGNUM *m, BN_CTX *ctx);`

    - **工作原理：** 纯粹的数学计算函数，实现 $r = a^p \pmod m$。没有任何 Padding 的包装或校验，剥离了全部工程学防护，用于底层解密或非标签名破解。

2. **`MD5()` —— 哈希摘要提取**

    - **函数原型：** `unsigned char *MD5(const unsigned char *d, size_t n, unsigned char *md);`

    - **工作原理：** 将长度为 `n` 字节的输入数据 `d` 进行单向散列，计算出固定长度 16 字节（128位）的 MD5 摘要，存放在 `md` 指向的缓冲区中。

#### F. 填充技术 (Padding) 标准结构与内存映射

以 **1024位密钥模数（128字节）** 且内部包裹 **16字节 MD5 哈希值** 为例：

- **Type 1 型（标准签名专用）：** 确定性填充，无随机数。内存排布为 `0x00, 0x01`（2字节头） + **109字节 `0xFF`** + `0x00`（分隔符） + `16字节 MD5`。

- **Type 2 型（标准加密）：** 随机填充，抗重放攻击。内存排布为 `0x00, 0x02`（2字节头） + **109字节 非零随机数** + `0x00`（分隔符） + `16字节 MD5/明文`。

- **手工解密的“前导零”陷阱规避：** 在利用 `BN_mod_exp()` 算出上述大数并用 `BN_bn2bin()` 导出时，首字节 `0x00` 必然丢失（返回长度 127）。此时必须在代码中手动将 127 字节的数据整体后移 1 位，并在下标 0 处强制赋值 `0x00` 补全 128 字节，方可进行后续的 `0x00, 0x02` 格式解析。

## 6. RSA 算法的安全性评估

- **分解难度：** RSA 的安全性完全依赖于大整数分解的难度。

- **密钥长度：** `rsatool` 等工具利用筛法可以快速分解 128 位的 $N$。目前工业界一般认为 **1024 位或 2048 位**的 $N$ 是相对安全的。

- **填充方案 (Padding)：** 基础的 RSA 算法存在确定性问题（相同明文生成相同密文），在实际工程中必须结合安全的填充算法（如 OAEP 或 PKCS#1 v1.5）来保证语义安全。

## 7. OpenSSL 版本的演进与兼容性差异 (1.0.x vs 1.1.0+)

在进行密码学程序开发时，必须明确当前运行的 OpenSSL 版本。从 OpenSSL 1.1.0 版本（包含目前的 3.x 版本）开始，官方对底层库进行了一次极其重要的安全架构升级，这导致许多旧版（1.0.x 及更早版本）的直接操作内存的代码在现代编译器中会直接报错（如引发 `incomplete type "struct rsa_st" is not allowed` 错误）。

### 7.1 核心结构体的不透明化 (Opaque Structures)

- **旧版本 (1.0.x 时代)：** `RSA`、`BIGNUM`、`EVP_MD_CTX` 等核心结构体的内部细节完全对外公开。开发者可以像操作普通结构体一样，直接使用指针解引用（`->`）去读写内部成员。

    - _旧版写法示例：_ `rsa->n = BN_new();` 或 `rsa->flags |= RSA_FLAG_NO_BLINDING;`

- **新版本 (1.1.0+ 及 3.x 时代)：** 为了强化安全封装并防止开发者直接篡改底层内存导致泄漏或崩溃，官方将这些核心结构体变为了**不透明（Opaque）结构**。结构体的内部成员对开发者彻底隐藏，直接使用 `->` 访问将导致编译失败。

### 7.2 新版 API 的 Setter/Getter 替代方案

在新版环境中，必须使用官方提供的专用函数来进行数值的注入与提取、标志位的控制。

#### A. 密钥大数 ($N, e, d$) 的注入

- **旧版写法：** 直接赋值。

    ```c
    rsa->n = n_bn;
    rsa->d = d_bn;
    ```

- **新版写法：** 使用 `RSA_set0_key()`。

    ```c
    // 将 N, e, d 统一注入 RSA 结构体。若某项不需要（如 e），可传 NULL。
    // 注意：此函数会自动接管传入的 BIGNUM 内存，后续调用 RSA_free() 时会自动释放它们，切勿手动再调用 BN_free()，否则会导致 Double Free 崩溃。
    RSA_set0_key(rsa, n_bn, e_bn, d_bn);
    ```

#### B. 安全标志位 (Flags) 的控制

- **旧版写法：** 强行进行位运算（如 `&~` 清除，`|` 设置）。

    ```c
    rsa->flags &= ~RSA_FLAG_CACHE_PRIVATE;
    rsa->flags |= RSA_FLAG_NO_BLINDING;
    ```

- **新版写法：** 使用专用的标志位管理函数。

    ```c
    // 清除特定的 Flag
    RSA_clear_flags(rsa, RSA_FLAG_CACHE_PRIVATE);
    // 设置特定的 Flag
    RSA_set_flags(rsa, RSA_FLAG_NO_BLINDING);
    ```
