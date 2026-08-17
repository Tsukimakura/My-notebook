# 四种架构函数调用 ABI 与栈帧布局对比

**架构：x86-64（System V ABI）、AArch64（AAPCS64）、RISC-V64（LP64 ABI）、32-bit MIPS（O32 ABI）**

本文以 Linux 常见 ABI 为准：

|架构|常见 ABI|
|---|---|
|x86-64|System V AMD64 ABI|
|AArch64|ARM64 Procedure Call Standard (AAPCS64)|
|RISC-V64|RISC-V ELF psABI (LP64)|
|MIPS32|MIPS O32 ABI|

---

# 1. 总体设计差异

|项目|x86-64|AArch64|RISC-V64|MIPS32|
|---|---|---|---|---|
|指令集|CISC|RISC|RISC|RISC|
|通用寄存器数量|16 × 64bit|31 × 64bit|32 × 64bit|32 × 32bit|
|栈增长方向|向低地址|向低地址|向低地址|向低地址|
|栈指针对齐|16 bytes|16 bytes|16 bytes|8 bytes|
|返回地址保存|寄存器|寄存器|寄存器|寄存器|
|默认参数传递|寄存器优先|寄存器优先|寄存器优先|寄存器优先|
|caller/callee 保存划分|明确|明确|明确|明确|

主要区别：

- **x86-64**
    
    - 历史包袱最大
    - 栈帧高度依赖编译器
    - 返回地址由 `call` 自动压栈
- **ARM64 / RISC-V / MIPS**
    
    - RISC 架构
    - `call` 本质是跳转 + 保存返回地址到寄存器
    - 是否保存返回地址由函数决定

---

# 2. x86-64 System V ABI

## 2.1 寄存器分类

### 参数寄存器

整数参数：

|参数|寄存器|
|---|---|
|1|RDI|
|2|RSI|
|3|RDX|
|4|RCX|
|5|R8|
|6|R9|

浮点：

```
XMM0-XMM7
```

超过数量：

```
stack
```

---

## 2.2 caller / callee 保存

### Caller-saved

调用者负责保存：

```
RAX
RCX
RDX
RSI
RDI
R8-R11
XMM0-XMM15
```

特点：

函数调用后可能被破坏。

---

### Callee-saved

被调用函数必须恢复：

```
RBX
RBP
R12-R15
```

---

# 2.3 栈帧布局

典型：

```
高地址
│
│ caller frame
│
├──────────────
│ 参数7+
│ 参数6+
├──────────────
│ 返回地址 RIP
├──────────────
│ old RBP
├──────────────
│ saved RBX/R12...
├──────────────
│ local variables
├──────────────
│ temporary
│
└──────────────
低地址
```

---

## 2.4 函数进入

汇编：

```
push rbp
mov rbp,rsp
sub rsp,0x40
```

执行后：

```
RBP -> old RBP
       return RIP
       local variables
RSP -> locals bottom
```

---

## 2.5 返回地址特点

x86：

```
call func
```

硬件：

```
rsp -= 8
[rsp] = next RIP
jmp func
```

所以：

```
return address 在栈上
```

---

# 3. AArch64 AAPCS64

---

# 3.1 寄存器

通用：

```
X0-X30
```

特殊：

|寄存器|用途|
|---|---|
|X0-X7|参数|
|X8|间接返回地址|
|X9-X15|caller saved|
|X16-X17|临时|
|X19-X28|callee saved|
|X29|FP|
|X30|LR|
|SP|栈指针|

---

# 3.2 参数传递

整数：

```
arg1 -> X0
arg2 -> X1
...
arg8 -> X7
```

超过：

```
stack
```

例如：

```
foo(a,b,c)
```

对应：

```
mov x0,a
mov x1,b
mov x2,c
bl foo
```

---

# 3.3 返回地址机制

调用：

```
bl func
```

效果：

```
X30 = return address
PC = func
```

因此：

```
LR保存返回地址
```

---

# 3.4 栈帧布局

典型：

```
高地址

previous frame

----------------
saved FP
saved LR
----------------
callee saved regs
----------------
local variables
----------------
temporary

低地址
```

汇编：

```
stp x29,x30,[sp,#-16]!
mov x29,sp
sub sp,sp,#64
```

布局：

```
sp ->
local variables

x29 ->
saved FP
saved LR
```

---

# 3.5 典型函数尾声

```
add sp,sp,#64
ldp x29,x30,[sp],#16
ret
```

其中：

```
ret
=
jump x30
```

---

# 4. RISC-V64 LP64 ABI

---

# 4.1 寄存器

32个整数寄存器：

```
x0-x31
```

ABI名称：

|寄存器|ABI名|用途|
|---|---|---|
|x0|zero|常量0|
|x1|ra|返回地址|
|x2|sp|栈指针|
|x8|s0/fp|frame pointer|
|x10-x17|a0-a7|参数|
|x5-x7|t0-t2|临时|
|x28-x31|t3-t6|临时|
|x8-x9|s0-s1|保存|

---

# 4.2 参数传递

整数：

```
a0-a7
```

即：

```
x10-x17
```

例如：

```
func(a,b,c)
```

:

```
a0=a
a1=b
a2=c
```

超过8个：

```
stack
```

---

# 4.3 返回地址

调用：

```
jal func
```

执行：

```
ra=x1=return address
PC=func
```

类似 ARM64。

---

# 4.4 栈帧

典型：

```
高地址

caller frame

----------------
arguments
----------------
saved ra
saved s0(fp)
----------------
saved s registers
----------------
locals
----------------

sp

低地址
```

---

函数入口：

```
addi sp,sp,-64

sd ra,56(sp)

sd s0,48(sp)

addi s0,sp,64
```

结果：

```
s0
 |
 +-- old s0
 +-- old ra
 +-- locals
 |
sp
```

---

# 5. MIPS32 O32 ABI

MIPS 与前三者差异最大。

---

# 5.1 寄存器

32个：

```
$0-$31
```

ABI名称：

| 寄存器     | 用途           |
| ------- | ------------ |
| $a0-$a3 | 参数           |
| $v0-$v1 | 返回值          |
| $ra     | 返回地址         |
| $sp     | 栈指针          |
| $fp/$s8 | 帧指针          |
| $s0-$s7 | callee saved |
| $t0-$t9 | caller saved |

---

# 5.2 参数传递

前4个：

```
$a0
$a1
$a2
$a3
```

例如：

```
foo(a,b,c,d)
```

:

```
$a0=a
$a1=b
$a2=c
$a3=d
```

第五个：

```
stack
```

---

# 5.3 返回地址

调用：

```
jal func
```

效果：

```
$ra = PC+8
PC = func
```

注意：

MIPS 有 delay slot。

例如：

```
jal func
nop
```

执行顺序：

```
保存ra
执行nop
进入func
```

---

# 5.4 栈帧布局

典型：

```
高地址

argument area
----------------
saved arguments
----------------
saved $ra
----------------
saved $fp
----------------
saved $s0-$s7
----------------
local variables
----------------
temporary

低地址
```

---

函数入口：

```
addiu sp,sp,-32

sw ra,28(sp)

sw fp,24(sp)

move fp,sp
```

---

# 6. 四种 ABI 参数传递对比

## 整数参数

|参数序号|x86-64|ARM64|RISCV64|MIPS32|
|---|---|---|---|---|
|1|RDI|X0|A0|A0|
|2|RSI|X1|A1|A1|
|3|RDX|X2|A2|A2|
|4|RCX|X3|A3|A3|
|5|R8|X4|A4|stack|
|6|R9|X5|A5|stack|
|7|stack|X6|A6|-|
|8|stack|X7|A7|-|

---

# 7. 返回值 ABI

## 小整数

|架构|返回寄存器|
|---|---|
|x86-64|RAX|
|ARM64|X0|
|RISCV64|A0|
|MIPS32|V0|

---

## 双返回值

|架构|寄存器|
|---|---|
|x86|RAX,RDX|
|ARM64|X0,X1|
|RISCV|A0,A1|
|MIPS|V0,V1|

---

# 8. Frame Pointer 差异

|架构|FP|
|---|---|
|x86-64|RBP|
|ARM64|X29|
|RISCV64|S0|
|MIPS32|FP/S8|

---

区别：

## x86

很多时候：

```
-fomit-frame-pointer
```

直接：

```
rsp访问变量
```

---

## ARM64

FP使用较普遍：

```
x29 -> frame base
```

---

## RISCV

FP不是必须：

```
s0既保存寄存器又作为fp
```

---

## MIPS

传统 ABI 强依赖：

```
$fp
```

---

# 9. 栈对齐要求

|架构|要求|
|---|---|
|x86-64 SysV|16 bytes|
|ARM64|16 bytes|
|RISCV64|16 bytes|
|MIPS32 O32|8 bytes|

---

# 10. 函数调用过程对比

## x86-64

```
caller:

push return address
call

callee:

save rbp
allocate stack
...
ret
```

返回：

```
pop RIP
```

---

## ARM64

```
caller:

bl func

callee:

save x30
allocate stack

return:

ret x30
```

---

## RISCV

```
caller:

jal func

callee:

save ra
allocate stack

return:

jalr zero,ra
```

---

## MIPS

```
caller:

jal func

callee:

save ra
save fp

return:

jr ra
```

---

# 11. 栈溢出利用视角区别（CTF/pwn）

## x86-64

常见：

```
buffer
padding
saved RBP
saved RIP
```

覆盖：

```
RIP hijack
```

---

## ARM64

结构：

```
buffer
saved x29
saved x30
```

攻击目标：

```
overwrite LR(x30)
```

---

## RISC-V64

结构：

```
buffer
saved s0
saved ra
```

攻击目标：

```
overwrite ra
```

---

## MIPS32

结构：

```
buffer
saved fp
saved ra
```

攻击目标：

```
overwrite $ra
```

---

# 12. 核心区别总结表

|特性|x86-64|ARM64|RISCV64|MIPS32|
|---|---|---|---|---|
|返回地址位置|栈|LR(X30)|ra(x1)|ra($31)|
|call机制|硬件压栈|寄存器保存|寄存器保存|寄存器保存|
|参数寄存器数量|6|8|8|4|
|FP|RBP|X29|S0|S8|
|保存返回地址|callee通常不保存|callee保存LR|callee保存ra|callee保存ra|
|栈帧复杂度|最高|低|低|中|
|ROP难度|较低|较高|较高|中等|
|逆向识别难度|低|低|中|中|

---

# 13. 逆向分析时的识别规律

## x86-64

看到：

```
push rbp
mov rbp,rsp
```

基本确定：

```
函数开始
```

---

## ARM64

看到：

```
stp x29,x30,[sp,#-16]!
```

确定：

```
保存FP/LR
```

---

## RISCV64

看到：

```
sd ra, offset(sp)
sd s0, offset(sp)
```

确定：

```
函数序言
```

---

## MIPS

看到：

```
sw ra,offset(sp)
sw fp,offset(sp)
```

确定：

```
建立栈帧
```

---


> x86 攻击 RIP；ARM64 攻击 LR(X30)；RISC-V 攻击 ra(x1)；MIPS 攻击 $ra。栈布局的核心变化来自“返回地址到底保存在哪里”。