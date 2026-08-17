## 1. 密码学基本概念

- **加密 (Encryption)**：将明文 (plaintext) 通过密钥 (key) 转换为密文 (ciphertext) 的过程，旨在防止数据在传输过程中被未经授权的访问。
    
- **解密 (Decryption)**：将密文 (ciphertext) 通过密钥 (key) 还原为原始明文 (plaintext) 的过程。
    

## 2. 单表密码 Monoalphabetic Ciphers

单表密码只使用一张密码字母表，明文字母与密文字母之间存在固定的对应关系。

- **弱点**：由于对应关系固定，此类密码极易受到**频率分析法**的攻击。
    

### 2.1 加法密码 Additive Cipher

以恺撒加密法 (Julius Caesar) 为代表，通过字母表的移位来实现加解密。

- **加密算法**：$y = (x - \text{'A'} + 3) \pmod{26} + \text{'A'}$。
    
- **解密算法**：利用加法逆元 $x = (y - \text{'A'} + 23) \pmod{26} + \text{'A'}$。
    

### 2.2 乘法密码 Multiplicative Cipher

- **加密算法**：$y = x \cdot k \pmod n$。
    
- **解密算法**：$x = y \cdot k^{-1} \pmod n$。
    

### 2.3 仿射密码 Affine Cipher

结合了加法和乘法操作，需要两个密钥 $k_1$ 和 $k_2$。

- **加密算法**：$y = (x \cdot k_1 + k_2) \pmod n$。
    
- **解密算法**：$x = (y - k_2) \cdot k_1^{-1} \pmod n$。
    

## 3. 多表密码 Polyalphabetic Ciphers

多表密码对每个明文字母采用不同的单表进行代换，即同一个明文字母在不同位置可能会对应多个不同的密文字母。

- 其他经典密码包括：Playfair、Beaufort、Vernam、Hill 等。
    

### 3.1 维吉尼亚密码 Vigenere Cipher

- **加密算法**：$y = (x + k_i) \pmod n$。
    
- **解密算法**：$x = (y - k_i) \pmod n$。
    
- **示例**：明文 `this crypto...` 与密钥 `cipher cipher...` **逐个字母**进行偏移计算。
    

---

## 4. Enigma 密码机

Enigma 密码机是一种极其复杂的机电加密设备，其加密过程涉及接线板、多个转子（齿轮）和反射板。

### 4.1 核心状态变量：Ring Setting 与 Message Key

齿轮的内部和外部状态决定了加密的偏移量（$\Delta$）。

- **Ring Setting (内部设置)**：齿轮内部的初始状态，在键盘敲击进行加密的过程中**不会**发生改变。
    
- **Message Key (外部设置)**：齿轮外部显示的状态，**会随着每一次按键而发生变化（步进）**。
    
- **差值计算 ($\Delta$)**：加密时的实际偏移量 $\Delta = \text{MessageKey} - \text{RingSetting}$。
    
    - _例如_：若 MessageKey=D，RingSetting=B，则 $\Delta = \text{'D'} - \text{'B'} = 2$。
        

### 4.2 加密信号流向与计算规则

加密过程经过 5 个元件：接线板 (Plugboard) $\rightarrow$ 齿轮 I $\rightarrow$ 齿轮 II $\rightarrow$ 齿轮 III $\rightarrow$ 反射板 (Reflector) $\rightarrow$ 齿轮 III $\rightarrow$ 齿轮 II $\rightarrow$ 齿轮 I $\rightarrow$ 接线板。

**按键触发步进**

当按下键盘输入字母时，右侧齿轮（如 1 号轮）会**先旋转一次**（即 Message Key 做递增），然后明文字母才进入最右侧齿轮开始加密。

**单齿轮内的加密计算逻辑（设输入为 $c$）**：

1. **进入齿轮前（加法偏移）**：$c = c + \Delta$（需处理字母表取模，即 $c = ((c - \text{'A'}) + \Delta + 26) \pmod{26} + \text{'A'}$）。
    
2. **查表替换（A-Z 字母表对应的单表加密）**：
    
    - 从右向左（正向）：在齿轮的字符数组中查找对应位置的字母。
        
    - 从左向右（逆向）：在齿轮的字符数组中反向查找对应位置的字母。
        
3. **离开齿轮时（减法偏移）**：$c = c - \Delta$。
    

**接线板 (Plugboard) 的作用**：

只影响最初进入最右侧齿轮的信号，以及最终从最右侧齿轮出来的信号，不影响中间的计算。接线一对按键时，交换两个按键与输入的映射（即 A 连 B 时，A 变 B，B 也变 A）。

### 4.3 齿轮步进机制与 “双步进” (Double Stepping) 现象

齿轮的旋转是由棘爪 (pawl) 和卡口 (notch) 机械驱动的。当某个齿轮的 Message Key 达到特定字母时，下一次按键不仅会推动该齿轮，还会推动其左侧的齿轮。

- **5 个齿轮的卡口位置与触发字母 (Royal Flags Wave Kings Above)**：
    
    - 齿轮 I：在 **Q** 变成 **R** 时带动左侧。
        
    - 齿轮 II：在 **E** 变成 **F** 时带动左侧。
        
    - 齿轮 III：在 **V** 变成 **W** 时带动左侧。
        
    - 齿轮 IV：在 **J** 变成 **K** 时带动左侧。
        
    - 齿轮 V：在 **Z** 变成 **A** 时带动左侧。
        
- **双步进现象 (Double Stepping)**：
    
    该现象由 Enigma 的机械结构决定，**只出现在两边都存在其他齿轮的齿轮上**（例如排列为 III-II-I 时的齿轮 II）。
    
    归纳起来，中间齿轮 (设为 II) 会在以下两种情况转动：
    
    1. 右侧齿轮 (I) 从 Q 转到 R 时，带动 II 转动。
        
    2. **当 II 当前正处于其卡口位置（如 E）时**，无论右侧齿轮 (I) 的 Message Key 是多少，只要敲击键盘，位于 II 和 III 之间的棘爪就会推动 II 和 III 同时旋转。
        
    
    - **后果**：如果 I 将 II 推到了 E，下一次按键时 II 自己又会发生转动并带动 III。这导致齿轮 II 连续转动了两次。
        

### 4.4 密钥传递协议 (Message Key 传递)

由于每日的初始设置固定，为了安全，通讯双方需要为每条消息生成随机密钥：

1. 发送方随机想出 3 个齿轮的外部状态 (Message Key)，例如 `ABC`。
    
2. 以明文形式将 `ABC` 发送给对方。
    
3. 发送方想出真正用于加密的齿轮初始状态（如 `ZJU`），在当前 `ABC` 的状态下，连续按下 `ZJU`，得到加密后的密文（如 `Z'J'U'`），发送给对方。
    
4. 对方收到后，在齿轮状态为 `ABC` 的情况下，输入 `Z'J'U'` 解密出真实的通讯密钥 `ZJU`。
    
5. 双方将齿轮 Message Key 设为 `ZJU`，开始正式通讯。
    

### 4.5 附录：各组件转换表参考

以下为模拟实验用到的齿轮及反射板的标准字符映射表（下标0-25对应A-Z）：

- **Rotor I**: `EKMFLGDQVZNTOWYHXUSPAIBRCJ`
    
- **Rotor II**: `AJDKSIRUXBLHWTMCQGZNPYFVOE`
    
- **Rotor III**: `BDFHJLCPRTXVZNYEIWGAKMUSQO`
    
- **Rotor IV**: `ESOVPZJAYQUIRHXLNFTGKDCMWB`
    
- **Rotor V**: `VZBRGITYUPSDNHLXAWMJQOFECK`
    
- **Reflector**: `YRUHQSLDPXNGOKMIEBFZCWVJAT`