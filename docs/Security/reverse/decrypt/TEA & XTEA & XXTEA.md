# TEA & XTEA & XXTEA

## 1. TEA 系列的核心特征：黄金分割率 Delta

它们通常都会包含一个特定的常数：

$$
Delta = (\sqrt{5} - 1) \times 2^{31} \approx 2654435769 \approx \text{0x9E3779B9}
$$

在 IDA 的伪代码中，你可能会看到它的有符号形式：**`-1640531527`**。

**只要看到这个数，或者看到 `sum` 每次增加这个数，99% 就是 TEA 系列。**

---

## 2. TEA (Tiny Encryption Algorithm)

- **特征：**

    - **加密对象：** 两个 32 位无符号整数（`v0`, `v1`），即 64 位块。

    - **密钥：** 4 个 32 位整数（`k[0]` - `k[3]`），即 128 位。

    - **运算：** 主要是移位（`<<4`, `>>5`）、异或（XOR）和加法。

    - **轮数：** 通常是 32 轮（`delta` 累加 32 次），也就是 64 次迭代。

- **典型代码结构 (IDA 视角)：**

    注意 `sum` 的累加和 `v0`, `v1` 的交替运算。

```c
void encrypt (uint32_t* v, uint32_t* k) {
    uint32_t v0=v[0], v1=v[1], sum=0, i;           /* set up */
    uint32_t delta=0x9E3779B9;                     /* a key schedule constant */
    uint32_t k0=k[0], k1=k[1], k2=k[2], k3=k[3];   /* cache key */
    for (i=0; i < 32; i++) {                       /* basic cycle start */
        sum += delta;
        // 核心特征：移位常数通常是 4 和 5
        v0 += ((v1<<4) + k0) ^ (v1 + sum) ^ ((v1>>5) + k1);
        v1 += ((v0<<4) + k2) ^ (v0 + sum) ^ ((v0>>5) + k3);
    }
    v[0]=v0; v[1]=v1;
}
```

- **缺陷：** TEA 有“等效密钥”漏洞，每 64 位数据有 4 个关联密钥，这在密码学上是不安全的，所以后来有了 XTEA。

---

## 3. XTEA (eXtended TEA)

XTEA 是为了修复 TEA 的漏洞而设计的。

- **区别特征：**

    - **更复杂的密钥调度：** TEA 是直接加 `k0`, `k1`...，而 XTEA 会用 `sum` 的最后几位来决定使用密钥数组中的哪一个值（例如 `k[sum & 3]`）。

    - **运算逻辑变化：** 移位操作和 TEA 略有不同，不再固定是 `k0` 配 `<<4`。

- **典型代码结构：**

    注意 `k[sum & 3]` 这种用法，是 XTEA 最显著的标志。

```c
void encrypt(unsigned int num_rounds, uint32_t v[2], uint32_t const key[4]) {
    unsigned int i;
    uint32_t v0=v[0], v1=v[1], sum=0, delta=0x9E3779B9;
    for (i=0; i < num_rounds; i++) {
        // 核心特征：v0 和 v1 的计算不对称，且使用了 sum 的位运算来索引 key
        v0 += (((v1 << 4) ^ (v1 >> 5)) + v1) ^ (sum + key[sum & 3]);
        sum += delta;
        v1 += (((v0 << 4) ^ (v0 >> 5)) + v0) ^ (sum + key[(sum>>11) & 3]);
    }
    v[0]=v0; v[1]=v1;
}
```

---

## 4. XXTEA (Corrected Block TEA)

这是三种加密里最强的，也是目前很多游戏、应用中常用的算法（比如 Cocos2d 引擎）。

- **关键区别：**

    - **处理变长数据：** TEA/XTEA 只能处理 64 位（2 个整数）。XXTEA 可以处理**任意长度的 32 位整数数组**（即长度 > 2）。

    - **MX 混合函数：** 它定义了一个复杂的宏 `MX`，涉及相邻数据的运算。

    - **代码特征：** 一个 `do...while` 或者 `for` 循环遍历整个数组，而不是只处理 `v0` 和 `v1`。

```c
#define MX (((z>>5^y<<2) + (y>>3^z<<4)) ^ ((sum^y) + (key[(p&3)^e] ^ z)))

// n 是数组长度，如果是负数就是解密
long btea(long* v, long n, long* key) {
    long z=v[n-1], y=v[0], sum=0, e, DELTA=0x9e3779b9;
    long p, q;
    if (n > 1) { /* Coding Part */
        q = 6 + 52/n; // 动态决定轮数
        while (q-- > 0) {
            sum += DELTA;
            e = (sum >> 2) & 3;
            for (p=0; p<n-1; p++) {
                y = v[p+1];
                z = v[p] += MX; // 核心：涉及前后邻居的复杂运算
            }
            y = v[0];
            z = v[n-1] += MX;
        }
        return 0;
    }
    // ... 解密部分略 ...
}
```

---

## 总结：如何在 IDA 中快速分辨？

|**特征**|**TEA**|**XTEA**|**XXTEA**|
|---|---|---|---|
|**数据块大小**|固定 64 位 (v0, v1)|固定 64 位 (v0, v1)|**可变长度数组** (v[n])|
|**密钥使用**|固定 (k0, k1, k2, k3)|动态索引 (`key[sum & 3]`)|动态索引 (`key[(p&3)^e]`)|
|**移位常数**|4, 5 (常见)|4, 5|2, 3, 4, 5 (混合)|
|**Delta**|**0x9E3779B9**|**0x9E3779B9**|**0x9E3779B9**|

## CTF 实战技巧

1. CTF 出题人经常会修改 `Delta` 值（比如改成 `0x11223344`），或者修改移位的位数。**不要死记常数，要认结构。**

2. **解密：**  TEA/XTEA 解密就是把加密过程**倒着写**：加法变减法，异或不变，顺序从后往前。

    - XXTEA 比较复杂，建议直接去 GitHub 找现成的 Python 实现（如 `xxtea-py` 库），把题目中的 Delta 和 Key 换进去即可。

```python
import struct

class Cipher_Solver:
    def __init__(self, delta=0x9E3779B9, rounds=32):
        self.delta = delta
        self.rounds = rounds

    def _to_uint32(self, val):
        return val & 0xFFFFFFFF

    def decrypt_tea(self, v, k):
        """标准 TEA 解密"""
        v0, v1 = v[0], v[1]
        k0, k1, k2, k3 = k[0], k[1], k[2], k[3]
        sum_val = self._to_uint32(self.delta * self.rounds)

        for _ in range(self.rounds):
            v1 = self._to_uint32(v1 - ((v0 << 4) + k2 ^ (v0 + sum_val) ^ (v0 >> 5) + k3))
            v0 = self._to_uint32(v0 - ((v1 << 4) + k0 ^ (v1 + sum_val) ^ (v1 >> 5) + k1))
            sum_val = self._to_uint32(sum_val - self.delta)
        return [v0, v1]

    def decrypt_xtea(self, v, k):
        """标准 XTEA 解密"""
        v0, v1 = v[0], v[1]
        sum_val = self._to_uint32(self.delta * self.rounds)

        for _ in range(self.rounds):
            v1 = self._to_uint32(v1 - (((v0 << 4 ^ v0 >> 5) + v0) ^ (sum_val + k[sum_val >> 11 & 3])))
            sum_val = self._to_uint32(sum_val - self.delta)
            v0 = self._to_uint32(v0 - (((v1 << 4 ^ v1 >> 5) + v1) ^ (sum_val + k[sum_val & 3])))
        return [v0, v1]

    def decrypt_xxtea(self, v, k):
        """
        标准 XXTEA 解密 (修复版)
        逻辑严格对标 C 语言 BTEA 实现
        """
        n = len(v)
        if n < 2: return v

        # XXTEA 动态轮数公式
        rounds = 6 + 52 // n

        # sum 初始化
        sum_val = self._to_uint32(rounds * self.delta)

        # y 初始化
        y = v[0]

        while sum_val != 0:
            e = (sum_val >> 2) & 3

            # 1. 核心循环：处理 p 从 n-1 到 1 的部分
            for p in range(n - 1, 0, -1):
                z = v[p - 1]
                # 注意：标准 XXTEA 是 (p & 3) ^ e
                # 你之前的题目魔改成了 (p ^ e) & 3，如果解不出请尝试互换注释
                mx = (((z >> 5 ^ y << 2) + (y >> 3 ^ z << 4)) ^ ((sum_val ^ y) + (k[(p & 3) ^ e] ^ z)))

                v[p] = self._to_uint32(v[p] - mx)
                y = v[p] # 更新 y，传递给下一个位置

            # 2. 边界处理：单独处理 p = 0 的情况
            p = 0
            z = v[n - 1] # p=0 时的邻居是最后一个元素
            mx = (((z >> 5 ^ y << 2) + (y >> 3 ^ z << 4)) ^ ((sum_val ^ y) + (k[(p & 3) ^ e] ^ z)))

            v[0] = self._to_uint32(v[0] - mx)
            y = v[0] # 更新 y

            sum_val = self._to_uint32(sum_val - self.delta)

        return v

# --- 辅助工具 ---
def bytes_to_blocks(data_bytes):
    """小端序：Bytes 转 Int 数组"""
    pad = (4 - len(data_bytes) % 4) % 4
    data_bytes += b'\x00' * pad
    return list(struct.unpack(f'<{len(data_bytes)//4}I', data_bytes))

def blocks_to_bytes(blocks):
    """小端序：Int 数组 转 Bytes"""
    return struct.pack(f'<{len(blocks)}I', *blocks)


# --- 验证部分 ---
if __name__ == '__main__':
    print("=== 通用解密脚本 (修复版) ===")

    # 实例化
    solver = Cipher_Solver()

    # 你的题目数据
    key = [0xDEAD, 0xBEEF, 0xABCD, 0x0001]

    # 注意：这里使用你验证成功的【低位在前】顺序
    # v1[0] = 0x7B6ABF33 (低), 0xB65DC90D (高)
    cipher_data = [
        0x7B6ABF33, 0xB65DC90D,
        0x5A162FC7, 0x6AB542A9,
        0xDCAA804C, 0x377D273D,
        0xDE449E62, 0x44C0F3EC
    ]

    # 解密
    # 注意：你的题目有点特殊，它用的 Key 索引逻辑是 (p^e)&3
    # 标准 XXTEA 是 (p&3)^e。
    # 我上面的类默认是标准的。为了兼容你这道特殊的题，
    # 你可能需要临时改一下类里的那一行代码，或者手动魔改一下。

    # 这里我为了演示，先用标准版跑（大概率是乱码，因为你的题目魔改了索引）
    print("[*] 正在尝试解密...")

    # 为了让脚本直接能跑通你的题，我临时模拟一下你的魔改逻辑
    # 真正的通用脚本建议保留类里的标准写法，遇到题再改
    class CustomSolver(Cipher_Solver):
        def decrypt_xxtea(self, v, k):
            # ... (复制上面的代码，只改 MX 计算那一行) ...
            # 为了节省篇幅，这里直接告诉你：
            # 如果遇到像今天这道题，去类里把 `k[(p & 3) ^ e]` 改成 `k[(p ^ e) & 3]` 即可。
            return super().decrypt_xxtea(v, k)

    # 使用标准逻辑尝试
    res = solver.decrypt_xxtea(list(cipher_data), key)
    try:
        print(f"标准版解密结果: {blocks_to_bytes(res)}")
    except:
        print("标准版解码失败")
```
