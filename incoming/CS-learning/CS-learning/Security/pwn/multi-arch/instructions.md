下面整理 **AArch64、RISC-V64、MIPS32** 三种架构的：

1. **寄存器体系**
2. **常用汇编指令分类**
3. **寻址方式**
4. **函数调用流程**
5. **函数序言（prologue）**
6. **函数主体访问栈变量**
7. **函数尾声（epilogue）**
8. **逆向分析识别规律**

---

# 一、AArch64 (ARM64)

## 1. 寄存器体系

AArch64 有：

```
X0-X30   64 bit
W0-W30   32 bit
```

其中：

|寄存器|用途|
|---|---|
|X0-X7|函数参数/返回值|
|X8|间接返回地址|
|X9-X15|临时|
|X16-X17|IP临时|
|X19-X28|callee saved|
|X29|FP(frame pointer)|
|X30|LR(link register)|
|SP|stack pointer|
|PC|程序计数器|

---

# 2. 常用数据搬运指令

## MOV

寄存器复制：

```
mov x0,x1
```

等价：

```
x0 = x1
```

立即数：

```
mov x0,#0x100
```

---

## LDR

Load：

```
ldr x0,[x1]
```

含义：

```
x0 = *(x1)
```

---

带偏移：

```
ldr x0,[x1,#8]
```

等价：

```
x0 = *(x1+8)
```

---

## STR

Store：

```
str x0,[sp,#16]
```

含义：

```
*(sp+16)=x0
```

---

## LDP/STP

ARM64 特有：

Load Pair:

```
ldp x29,x30,[sp]
```

一次加载两个寄存器。

Store Pair:

```
stp x29,x30,[sp,#-16]!
```

一次保存：

```
x29
x30
```

常用于函数入口。

---

# 3. 算术指令

## ADD

```
add x0,x1,x2
```

:

```
x0=x1+x2
```

---

立即数：

```
add x0,x0,#1
```

---

## SUB

```
sub x0,x0,#8
```

:

```
x0-=8
```

---

## MUL

```
mul x0,x1,x2
```

---

## MADD

乘加：

```
madd x0,x1,x2,x3
```

:

```
x0=x1*x2+x3
```

---

# 4. 比较和跳转

## CMP

实际上：

```
cmp x0,x1
```

等价：

```
subs xzr,x0,x1
```

设置flag。

---

## 条件跳转

相等：

```
b.eq label
```

不等：

```
b.ne label
```

大于：

```
b.gt label
```

---

## 无条件跳转

```
b func
```

---

## 函数调用

```
bl func
```

作用：

```
X30 = 下一条指令地址
PC = func
```

---

## 返回

```
ret
```

实际：

```
jump X30
```

---

# 5. ARM64 函数结构

## 标准函数序言

```
func:

stp x29,x30,[sp,#-16]!
mov x29,sp
sub sp,sp,#0x40
```

执行：

```
sp -=16

保存:
[xsp]   = old x29
[xsp+8] = old x30


x29 = sp

sp -=64
```

栈：

```
高地址

caller frame

----------------
old x29
old x30
----------------
local variables


sp

低地址
```

---

# 6. 保存callee寄存器

例如：

```
stp x19,x20,[sp,#-16]!
```

保存：

```
x19
x20
```

因为：

```
x19-x28
```

调用前后必须一致。

---

# 7. 参数访问

函数：

```
foo(a,b,c)
```

入口：

```
x0=a
x1=b
x2=c
```

例如：

```
add x0,x0,x1
```

:

```
return a+b
```

---

# 8. ARM64函数尾声

标准：

```
add sp,sp,#0x40

ldp x29,x30,[sp],#16

ret
```

恢复：

```
sp
x29
x30
```

返回：

```
PC=x30
```

---

# 二、RISC-V64

---

# 1. 寄存器体系

32个整数寄存器：

```
x0-x31
```

ABI：

|寄存器|名称|用途|
|---|---|---|
|x0|zero|恒0|
|x1|ra|返回地址|
|x2|sp|栈|
|x3|gp|全局指针|
|x4|tp|线程指针|
|x5-x7|t0-t2|临时|
|x8|s0/fp|frame pointer|
|x9|s1|保存|
|x10-x17|a0-a7|参数|
|x18-x27|s2-s11|保存|
|x28-x31|t3-t6|临时|

---

# 2. 数据移动

## LI

load immediate：

```
li a0,10
```

:

```
a0=10
```

---

## MV

```
mv a0,a1
```

:

```
a0=a1
```

---

## LD

64bit load:

```
ld a0,8(sp)
```

:

```
a0=*(sp+8)
```

---

## SD

store:

```
sd ra,24(sp)
```

:

```
*(sp+24)=ra
```

---

# 3. 算术

## ADD

```
add a0,a1,a2
```

:

```
a0=a1+a2
```

---

## ADDI

立即数：

```
addi sp,sp,-32
```

:

```
sp-=32
```

---

## SUB

```
sub a0,a1,a2
```

---

## MUL

```
mul a0,a1,a2
```

---

# 4. 逻辑指令

AND:

```
and a0,a1,a2
```

OR:

```
or a0,a1,a2
```

XOR:

```
xor a0,a1,a2
```

---

# 5. 比较跳转

## BEQ

```
beq a0,a1,label
```

:

```
if(a0==a1)
```

---

## BNE

```
bne a0,a1,label
```

---

## JAL

函数调用：

```
jal ra,func
```

效果：

```
ra = PC+4
PC=func
```

---

## JALR

返回：

```
jalr zero,0(ra)
```

等价：

```
return ra
```

---

# 6. RISC-V64函数序言

标准：

```
func:

addi sp,sp,-32

sd ra,24(sp)

sd s0,16(sp)

addi s0,sp,32
```

布局：

```
高地址

old stack

----------------
saved ra
----------------
saved s0
----------------
locals

sp
低地址
```

---

# 7. 参数

例如：

```
int foo(int a,int b)
```

进入：

```
a0=a
a1=b
```

返回：

```
a0=result
```

---

# 8. 尾声

```
ld ra,24(sp)

ld s0,16(sp)

addi sp,sp,32

jalr zero,0(ra)
```

---

# 三、MIPS32 O32

---

# 1. 寄存器体系

32个：

```
$0-$31
```

ABI名称：

|寄存器|用途|
|---|---|
|$zero|0|
|$at|汇编器|
|$v0-$v1|返回值|
|$a0-$a3|参数|
|$t0-$t9|临时|
|$s0-$s7|保存|
|$gp|全局|
|$sp|栈|
|$fp/$s8|帧|
|$ra|返回地址|

---

# 2. 数据移动

## LI

```
li $a0,10
```

---

## MOVE

```
move $t0,$a0
```

---

## LW

load word：

```
lw $t0,8($sp)
```

:

```
t0=*(sp+8)
```

---

## SW

store word：

```
sw $ra,28($sp)
```

---

# 3. 算术

## ADD

```
add $t0,$t1,$t2
```

---

## ADDIU

立即数：

```
addiu $sp,$sp,-32
```

---

## SUB

```
sub $t0,$t1,$t2
```

---

## MULT

乘法：

```
mult $a0,$a1
```

结果：

```
HI/LO
```

取：

```
mflo $v0
```

---

# 4. 分支

## BEQ

```
beq $a0,$a1,label
```

---

## BNE

```
bne $a0,$a1,label
```

---

## J

跳转：

```
j label
```

---

## JAL

调用：

```
jal func
```

执行：

```
ra = PC+8
```

注意：

MIPS delay slot：

```
jal func
nop
```

nop 会先执行。

---

# 5. MIPS函数序言

典型：

```
foo:

addiu $sp,$sp,-32

sw $ra,28($sp)

sw $fp,24($sp)

move $fp,$sp
```

布局：

```
高地址

arguments

----------------
saved ra
----------------
saved fp
----------------
locals

sp
低地址
```

---

# 6. 参数访问

C：

```
foo(a,b,c,d)
```

进入：

```
$a0=a
$a1=b
$a2=c
$a3=d
```

第五参数：

```
stack
```

---

# 7. 返回

返回值：

```
$v0
```

例如：

```
move $v0,$t0
```

---

# 8. MIPS尾声

```
lw $ra,28($sp)

lw $fp,24($sp)

addiu $sp,$sp,32

jr $ra

nop
```

---

# 四、三种架构关键指令对应表

| 功能    | ARM64      | RISC-V64 | MIPS32 |
| ----- | ---------- | -------- | ------ |
| 立即数移动 | mov        | li       | li     |
| 寄存器移动 | mov        | mv       | move   |
| load  | ldr        | ld       | lw     |
| store | str        | sd       | sw     |
| 加法    | add        | add      | add    |
| 立即数加  | `add #imm` | addi     | addiu  |
| 减法    | sub        | sub      | sub    |
| 乘法    | mul        | mul      | mult   |
| 比较    | cmp        | sub/slti | slt    |
| 条件跳转  | b.eq       | beq      | beq    |
| 无条件跳转 | b          | jal      | j      |
| 函数调用  | bl         | jal      | jal    |
| 返回    | ret        | jalr     | jr ra  |

---

# 五、逆向识别速查

## ARM64

看到：

```
stp x29,x30,[sp,#-16]!
```

= 函数开始

看到：

```
ldp x29,x30,[sp],#16
ret
```

= 函数结束

---

## RISC-V64

看到：

```
sd ra,xx(sp)
sd s0,xx(sp)
addi s0,sp,...
```

= 函数序言

看到：

```
ld ra,...
ld s0,...
jalr zero,0(ra)
```

= 返回

---

## MIPS32

看到：

```
sw $ra,offset($sp)
sw $fp,offset($sp)
```

= 函数入口

看到：

```
lw $ra,...
jr $ra
```

= 返回
