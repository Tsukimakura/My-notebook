# LaTeX 数学符号语法笔记

##  基础语法规则

- **行内公式**：`$公式$`
    
- **块级公式**：`$$公式$$`
    
- **注释**：`% 注释内容`
    
- **空格**：`\,`（小间距）`\;`（中间距）`\quad`（大间距）
    

---

## 📊 数学分析常用符号

### 1. 希腊字母

|符号|LaTeX|符号|LaTeX|
|---|---|---|---|
|α|`\alpha`|Α|`\Alpha`|
|β|`\beta`|Β|`\Beta`|
|γ|`\gamma`|Γ|`\Gamma`|
|δ|`\delta`|Δ|`\Delta`|
|ε|`\epsilon`|Ε|`\Epsilon`|
|ζ|`\zeta`|Ζ|`\Zeta`|
|η|`\eta`|Η|`\Eta`|
|θ|`\theta`|Θ|`\Theta`|
|ι|`\iota`|Ι|`\Iota`|
|κ|`\kappa`|Κ|`\Kappa`|
|λ|`\lambda`|Λ|`\Lambda`|
|μ|`\mu`|Μ|`\Mu`|
|ν|`\nu`|Ν|`\Nu`|
|ξ|`\xi`|Ξ|`\Xi`|
|π|`\pi`|Π|`\Pi`|
|ρ|`\rho`|Ρ|`\Rho`|
|σ|`\sigma`|Σ|`\Sigma`|
|τ|`\tau`|Τ|`\Tau`|
|υ|`\upsilon`|Υ|`\Upsilon`|
|φ|`\phi`|Φ|`\Phi`|
|χ|`\chi`|Χ|`\Chi`|
|ψ|`\psi`|Ψ|`\Psi`|
|ω|`\omega`|Ω|`\Omega`|

### 2. 微积分

latex

% 导数
$f'(x)$ 或 $f^{\prime}(x)$
$\frac{dy}{dx}$ 或 $\frac{\partial y}{\partial x}$
$\nabla f$  % 梯度

% 高阶导数
$f''(x)$
$f^{(n)}(x)$

% 偏导数
$\frac{\partial f}{\partial x}$
$\frac{\partial^2 f}{\partial x \partial y}$

% 积分
$\int f(x) dx$
$\int_{a}^{b} f(x) dx$
$\iint_D f(x,y) dA$
$\iiint_V f(x,y,z) dV$
$\oint_C f(z) dz$  % 环路积分

% 极限
$\lim_{x \to a} f(x)$
$\lim\limits_{x \to a} f(x)$
$\lim_{x \to a^+} f(x)$  % 右极限
$\lim_{x \to a^-} f(x)$  % 左极限

% 无穷
$\infty$
$+\infty$
$-\infty$

### 3. 级数与求和

latex

% 求和
$\sum_{i=1}^{n} a_i$
$\sum\limits_{i=1}^{n} a_i$

% 乘积
$\prod_{i=1}^{n} a_i$
$\prod\limits_{i=1}^{n} a_i$

% 级数收敛
$\sum_{n=1}^{\infty} a_n$
$\sum_{n=1}^{\infty} \frac{1}{n^2} = \frac{\pi^2}{6}$

% 收敛符号
$a_n \to 0$
$a_n \rightarrow \infty$
$a_n \sim b_n$  % 等价无穷小

### 4. 函数与算子

latex

% 常用函数
$\sin x$, $\cos x$, $\tan x$
$\arcsin x$, $\arccos x$, $\arctan x$
$\sinh x$, $\cosh x$, $\tanh x$
$\log x$, $\ln x$, $\lg x$
$\exp(x)$ 或 $e^x$

% 极限算子
$\limsup_{n \to \infty} a_n$
$\liminf_{n \to \infty} a_n$
$\sup_{x \in X} f(x)$
$\inf_{x \in X} f(x)$
$\max_{x \in X} f(x)$
$\min_{x \in X} f(x)$

% 微分算子
$\frac{d}{dx}$
$\frac{\partial}{\partial t}$
$\nabla$  % nabla算子
$\nabla^2$ 或 $\Delta$  % 拉普拉斯算子

### 5. 关系符号

latex

% 等于与不等
$=$  % 等于
$\neq$  % 不等于
$\equiv$  % 恒等于
$\approx$  % 约等于
$\sim$  % 相似
$\cong$  % 全等
$\propto$  % 正比于

% 不等号
$<$  $>$
$\leq$ 或 `\le`
$\geq$ 或 `\ge`
$\ll$  % 远小于
$\gg$  % 远大于

% 趋向
$\to$ 或 `\rightarrow`
$\rightarrow$  % 右箭头
$\leftarrow$  % 左箭头
$\Rightarrow$  % 右双箭头
$\Leftarrow$  % 左双箭头
$\Leftrightarrow$  % 等价

---

## 📈 线性代数常用符号

### 1. 矩阵与向量

latex

% 向量
$\vec{a}$ 或 $\mathbf{a}$
$\overrightarrow{AB}$
$\hat{i}, \hat{j}, \hat{k}$  % 单位向量

% 矩阵 - 内联
$\begin{matrix} a & b \\ c & d \end{matrix}$

% 矩阵 - 各种括号
$\begin{pmatrix} a & b \\ c & d \end{pmatrix}$  % 圆括号
$\begin{bmatrix} a & b \\ c & d \end{bmatrix}$  % 方括号
$\begin{Bmatrix} a & b \\ c & d \end{Bmatrix}$  % 花括号
$\begin{vmatrix} a & b \\ c & d \end{vmatrix}$  % 行列式
$\begin{Vmatrix} a & b \\ c & d \end{Vmatrix}$  % 范数

% 分块矩阵
$\begin{pmatrix} A & B \\ C & D \end{pmatrix}$

% 特殊矩阵
$I_n$ 或 $\mathbf{I}_n$  % n阶单位矩阵
$0_{m \times n}$  % m×n零矩阵
$\text{diag}(a_1, \ldots, a_n)$  % 对角矩阵

### 2. 线性方程组

latex

% 方程组
$\begin{cases}
a_1x + b_1y = c_1 \\
a_2x + b_2y = c_2
\end{cases}$

% 矩阵形式
$A\mathbf{x} = \mathbf{b}$

### 3. 行列式与迹

latex

$\det(A)$ 或 $|A|$  % 行列式
$\text{tr}(A)$  % 迹
$\text{rank}(A)$  % 秩
$\text{diag}(A)$  % 对角线元素

### 4. 转置与共轭

latex

$A^T$ 或 $A^{\top}$  % 转置
$A^*$ 或 $A^{\dagger}$  % 共轭转置
$A^{-1}$  % 逆矩阵
$A^+$  % 伪逆

### 5. 向量运算

latex

% 点积
$\vec{a} \cdot \vec{b}$ 或 $\langle \vec{a}, \vec{b} \rangle$

% 叉积
$\vec{a} \times \vec{b}$

% 范数
$\|\vec{x}\|$  % 范数
$\|\vec{x}\|_2$  % 2-范数
$\|\vec{x}\|_1$  % 1-范数
$\|\vec{x}\|_\infty$  % 无穷范数

% 内积空间
$\langle x, y \rangle$  % 内积
$\|x\|$  % 由内积诱导的范数

### 6. 特殊符号

latex

% 集合
$\mathbb{R}$  % 实数集
$\mathbb{C}$  % 复数集
$\mathbb{Q}$  % 有理数集
$\mathbb{Z}$  % 整数集
$\mathbb{N}$  % 自然数集

% 复数
$z = a + bi$
$\Re(z)$ 或 $\operatorname{Re}(z)$  % 实部
$\Im(z)$ 或 $\operatorname{Im}(z)$  % 虚部
$\overline{z}$  % 共轭
$|z|$  % 模

% 张量积
$V \otimes W$
$\otimes$  % 张量积符号

% 直和
$V \oplus W$
$\oplus$  % 直和符号

% Kronecker积
$A \otimes B$  % 注意：也是⊗，根据上下文理解


### 7.常用集合符号

#### 1. **基本符号**

latex

\in           % ∈ 属于
\notin        % ∉ 不属于
\ni           % ∋ 包含（反向属于）
\owns         % ∋ 同 \ni
\notni        % ∌ 不包含

#### 2. **子集关系**

latex

\subset       % ⊂ 子集
\subseteq     % ⊆ 子集或等于
\subsetneq    % ⊊ 真子集（不等子集）
\supset       % ⊃ 超集
\supseteq     % ⊇ 超集或等于
\supsetneq    % ⊋ 真超集

#### 3. **集合运算**

latex

\cap          % ∩ 交集
\cup          % ∪ 并集
\setminus     % \ 差集
\bigcap       % ⋂ 大交集
\bigcup       % ⋃ 大并集
\sqcap        % ⊓ 方交集
\sqcup        % ⊔ 方并集

#### 4. **其他集合符号**

latex

\emptyset     % ∅ 空集
\varnothing   % ∅ 另一种空集样式
\complement   % ∁ 补集
\partial      % ∂ 边界
\wp           % ℘ 幂集

#### 5. **数集符号**

latex

\mathbb{N}    % ℕ 自然数集
\mathbb{Z}    % ℤ 整数集
\mathbb{Q}    % ℚ 有理数集
\mathbb{R}    % ℝ 实数集
\mathbb{C}    % ℂ 复数集


## 重要说明

1. **需要宏包**：
    
    - `amssymb` 提供大部分扩展符号
        
    - `amsfonts` 提供 `\mathbb` 黑体符号
        
    - 也可以使用 `amsmath`（包含在 `amssymb` 中）
        
2. **真子集问题**：
    
    - 传统上 `\subset` 表示真子集，`\subseteq` 表示子集（包含相等）
        
    - 现代用法中，为清晰起见，建议：
        
        - 用 `\subsetneq` 表示真子集
            
        - 用 `\subseteq` 表示子集
            
3. **大小写区别**：
    
    - `\in` 和 `\ni` 方向相反
        
    - `\subset` 和 `\supset` 方向相反
---

## 🎯 综合示例

### 数学分析示例

latex

$$
f(x) = \sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!}(x-a)^n
$$

$$
\lim_{x \to 0} \frac{\sin x}{x} = 1
$$

$$
\frac{d}{dx} \int_{a}^{x} f(t) dt = f(x)
$$

$$
\nabla \cdot \mathbf{F} = \frac{\partial F_x}{\partial x} + \frac{\partial F_y}{\partial y} + \frac{\partial F_z}{\partial z}
$$

### 线性代数示例

latex

$$
A = \begin{pmatrix}
a_{11} & a_{12} & \cdots & a_{1n} \\
a_{21} & a_{22} & \cdots & a_{2n} \\
\vdots & \vdots & \ddots & \vdots \\
a_{m1} & a_{m2} & \cdots & a_{mn}
\end{pmatrix}
$$

$$
\det(A - \lambda I) = 0
$$

$$
\mathbf{x} = \begin{pmatrix} x_1 \\ x_2 \\ \vdots \\ x_n \end{pmatrix}
$$

$$
\| \mathbf{x} \|_2 = \sqrt{x_1^2 + x_2^2 + \cdots + x_n^2}
$$

---

## 💡 实用技巧

1. **自动编号公式**：
    

latex

\begin{equation}
e^{i\pi} + 1 = 0
\end{equation}

2. **多行公式对齐**：
    

latex

\begin{align}
f(x) &= (x+1)^2 \\
     &= x^2 + 2x + 1
\end{align}

3. **括号自适应大小**：
    

latex

\left( \frac{1}{1 + \frac{1}{x}} \right)
\big( \Big( \bigg( \Bigg(

4. **分段函数**：
    

latex

f(x) = \begin{cases}
x^2 & \text{if } x \geq 0 \\
-x^2 & \text{if } x < 0
\end{cases}

5. **上下标组合**：
    

latex

${}^{m}_{n}C^{k}_{l}$  % 复杂上下标

---

## 📝 Obsidian 专用提示

1. **开启数学渲染**：设置 → 编辑器 → 启用数学渲染
    
2. **快捷键**：`Ctrl/Cmd + M` 插入公式块
    
3. **实时预览**：在编辑时即可看到渲染结果
    
4. **复制为纯文本**：公式也可以复制为LaTeX源码