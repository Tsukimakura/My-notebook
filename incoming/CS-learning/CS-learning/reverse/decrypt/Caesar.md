### 1. 概念

凯撒密码得名于古罗马的尤利乌斯·凯撒（Julius Caesar），据称他当年使用这种方式与将军们进行秘密通信。

它的核心原理非常简单：**位移（Shift）**。

将明文中的每一个字母，按照字母表顺序向后（或向前）移动固定的位数，替换成新的字母。

### 2. 加密原理与过程

假设我们要发送信息，我们首先需要约定一个**密钥（Key）**，也就是偏移量。

- **明文 (Plaintext):** 原始信息。
    
- **密钥 (Key):** 移动的位数（例如：3）。
    
- **密文 (Ciphertext):** 加密后的信息。
    

#### 示例演示

假设 **密钥 = 3**（这是凯撒当年最常用的偏移量）：

1. **A** 向后移动 3 位 $\rightarrow$ **D**
    
2. **B** 向后移动 3 位 $\rightarrow$ **E**
    
3. **C** 向后移动 3 位 $\rightarrow$ **F**
    
4. ...
    
5. **X** 向后移动 3 位 $\rightarrow$ **A** （注意：这里发生了“回绕”，到了字母表末尾这就回到开头）
    

**实际例子：**

- **明文：** `HELLO WORLD`
    
- **加密：**
    
    - H (+3) $\rightarrow$ K
        
    - E (+3) $\rightarrow$ H
        
    - L (+3) $\rightarrow$ O
        
    - L (+3) $\rightarrow$ O
        
    - O (+3) $\rightarrow$ R
        
    - ...
        
- **密文：** `KHOOR ZRUOG`
    

### 3. 数学表达（模运算）

在计算机科学和CTF竞赛中，我们通常用数学公式来描述它。

首先将字母映射为数字：$A=0, B=1, C=2, ..., Z=25$。

- **加密公式：**
    
    $$E_n(x) = (x + n) \mod 26$$
    
    (其中 $x$ 是明文数字，$n$ 是密钥，$E_n(x)$ 是密文)
    
- **解密公式：**
    
    $$D_n(x) = (x - n) \mod 26$$
    
    (如果减法结果为负数，需要加 26 使其变为正数)
    

> **关键点：模运算 (Mod)**
> 
> 之所以要 $\mod 26$，是为了处理“Z”之后的越界问题，让字母表形成一个闭环。

### 4. 常见的变体：ROT13

在程序员社区和网络论坛中，最著名的凯撒密码变体是 **ROT13**。

它的密钥固定为 **13**。

- **特点：** 因为 26 的一半是 13，所以加密和解密是同一个操作。
    
    - 加密：$x + 13$
        
    - 再加密（即解密）：$(x + 13) + 13 = x + 26 = x$
        
- **用途：** 常用于隐藏剧透内容或简单的谜题，因为它不需要解密密钥，再执行一次ROT13就能看到原文。
    

### 5. 如何破解凯撒密码？

由于凯撒密码极其简单，它没有任何安全性可言。主要有两种破解方法：

#### A. 暴力破解

英语字母表只有 26 个字母。如果不算移动 0 位（即原文），可能的密钥只有 **25 个**。

攻击者只需要把这 25 种情况全部列出来，肉眼观察哪一行是有意义的单词即可。

#### B. 频率分析法

如果密文非常长，我们可以统计密文中每个字母出现的频率。

- 在标准英语中，字母 **E** 的出现频率是最高的（约 12.7%），其次是 T, A, O, I, N。
    
- **破解逻辑：** 如果你统计密文，发现字母 **H** 出现的次数最多，那么很有可能 **H** 就是明文中的 **E**。
    
- 计算偏移量：$H (7) - E (4) = 3$。那么密钥很可能就是 3。
    

### 6. Python 代码实现

这是CTF中常用的脚本结构，包含了加密和解密功能：

```python
def caesar_cipher(text, shift, mode='encrypt'):
    result = ""
    
    # 如果是解密，将偏移量变为负数
    if mode == 'decrypt':
        shift = -shift
        
    for char in text:
        # 处理大写字母
        if char.isupper():
            # ord('A') = 65. 将字符转为0-25范围，位移，取模，再转回ASCII
            new_char = chr((ord(char) - 65 + shift) % 26 + 65)
            result += new_char
        # 处理小写字母
        elif char.islower():
            new_char = chr((ord(char) - 97 + shift) % 26 + 97)
            result += new_char
        # 非字母字符（如空格、标点）保持不变
        else:
            result += char
            
    return result

# 测试
plaintext = "Hello, World!"
key = 3

# 加密
ciphertext = caesar_cipher(plaintext, key, mode='encrypt')
print(f"加密后: {ciphertext}")  # 输出: Khoor, Zruog!

# 解密
decrypted = caesar_cipher(ciphertext, key, mode='decrypt')
print(f"解密后: {decrypted}")  # 输出: Hello, World!
```
