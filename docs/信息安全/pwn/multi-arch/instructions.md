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

```text
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

## 2. 常用数据搬运指令

## MOV

寄存器复制：

```text
mov x0,x1
```

等价：

```text
x0 = x1
```

立即数：

```text
mov x0,#0x100
```

---

## LDR

Load：

```text
ldr x0,[x1]
```

含义：

```text
x0 = *(x1)
```

---

带偏移：

```text
ldr x0,[x1,#8]
```

等价：

```text
x0 = *(x1+8)
```

---

## STR

Store：

```text
str x0,[sp,#16]
```

含义：

```text
*(sp+16)=x0
```

---

## LDP/STP

ARM64 特有：

Load Pair:

```text
ldp x29,x30,[sp]
```

一次加载两个寄存器。

Store Pair:

```text
stp x29,x30,[sp,#-16]!
```

一次保存：

```text
x29
x30
```

常用于函数入口。

---

## 3. 算术指令

## ADD

```text
add x0,x1,x2
```

:

```text
x0=x1+x2
```

---

立即数：

```text
add x0,x0,#1
```

---

## SUB

```text
sub x0,x0,#8
```

:

```text
x0-=8
```

---

## MUL

```text
mul x0,x1,x2
```

---

## MADD

乘加：

```text
madd x0,x1,x2,x3
```

:

```text
x0=x1*x2+x3
```

---

## 4. 比较和跳转

## CMP

实际上：

```text
cmp x0,x1
```

等价：

```text
subs xzr,x0,x1
```

设置flag。

---

## 条件跳转

相等：

```text
b.eq label
```

不等：

```text
b.ne label
```

大于：

```text
b.gt label
```

---

## 无条件跳转

```text
b func
```

---

## 函数调用

```text
bl func
```

作用：

```text
X30 = 下一条指令地址
PC = func
```

---

## 返回

```text
ret
```

实际：

```text
jump X30
```

---

## 5. ARM64 函数结构

## 标准函数序言

```text
func:

stp x29,x30,[sp,#-16]!
mov x29,sp
sub sp,sp,#0x40
```

执行：

```text
sp -=16

保存:
[xsp]   = old x29
[xsp+8] = old x30


x29 = sp

sp -=64
```

栈：

```text
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

## 6. 保存callee寄存器

例如：

```text
stp x19,x20,[sp,#-16]!
```

保存：

```text
x19
x20
```

因为：

```text
x19-x28
```

调用前后必须一致。

---

## 7. 参数访问

函数：

```text
foo(a,b,c)
```

入口：

```text
x0=a
x1=b
x2=c
```

例如：

```text
add x0,x0,x1
```

:

```text
return a+b
```

---

## 8. ARM64函数尾声

标准：

```text
add sp,sp,#0x40

ldp x29,x30,[sp],#16

ret
```

恢复：

```text
sp
x29
x30
```

返回：

```text
PC=x30
```

---

## 二、RISC-V64

---

## 1. 寄存器体系

32个整数寄存器：

```text
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

## 2. 数据移动

## LI

load immediate：

```text
li a0,10
```

:

```text
a0=10
```

---

## MV

```text
mv a0,a1
```

:

```text
a0=a1
```

---

## LD

64bit load:

```text
ld a0,8(sp)
```

:

```text
a0=*(sp+8)
```

---

## SD

store:

```text
sd ra,24(sp)
```

:

```text
*(sp+24)=ra
```

---

## 3. 算术

## ADD

```text
add a0,a1,a2
```

:

```text
a0=a1+a2
```

---

## ADDI

立即数：

```text
addi sp,sp,-32
```

:

```text
sp-=32
```

---

## SUB

```text
sub a0,a1,a2
```

---

## MUL

```text
mul a0,a1,a2
```

---

## 4. 逻辑指令

AND:

```text
and a0,a1,a2
```

OR:

```text
or a0,a1,a2
```

XOR:

```text
xor a0,a1,a2
```

---

## 5. 比较跳转

## BEQ

```text
beq a0,a1,label
```

:

```text
if(a0==a1)
```

---

## BNE

```text
bne a0,a1,label
```

---

## JAL

函数调用：

```text
jal ra,func
```

效果：

```text
ra = PC+4
PC=func
```

---

## JALR

返回：

```text
jalr zero,0(ra)
```

等价：

```text
return ra
```

---

## 6. RISC-V64函数序言

标准：

```text
func:

addi sp,sp,-32

sd ra,24(sp)

sd s0,16(sp)

addi s0,sp,32
```

布局：

```text
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

## 7. 参数

例如：

```text
int foo(int a,int b)
```

进入：

```text
a0=a
a1=b
```

返回：

```text
a0=result
```

---

## 8. 尾声

```text
ld ra,24(sp)

ld s0,16(sp)

addi sp,sp,32

jalr zero,0(ra)
```

---

## 三、MIPS32 O32

---

## 1. 寄存器体系

32个：

```text
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

## 2. 数据移动

## LI

```text
li $a0,10
```

---

## MOVE

```text
move $t0,$a0
```

---

## LW

load word：

```text
lw $t0,8($sp)
```

:

```text
t0=*(sp+8)
```

---

## SW

store word：

```text
sw $ra,28($sp)
```

---

## 3. 算术

## ADD

```text
add $t0,$t1,$t2
```

---

## ADDIU

立即数：

```text
addiu $sp,$sp,-32
```

---

## SUB

```text
sub $t0,$t1,$t2
```

---

## MULT

乘法：

```text
mult $a0,$a1
```

结果：

```text
HI/LO
```

取：

```text
mflo $v0
```

---

## 4. 分支

## BEQ

```text
beq $a0,$a1,label
```

---

## BNE

```text
bne $a0,$a1,label
```

---

## J

跳转：

```text
j label
```

---

## JAL

调用：

```text
jal func
```

执行：

```text
ra = PC+8
```

注意：

MIPS delay slot：

```text
jal func
nop
```

nop 会先执行。

---

## 5. MIPS函数序言

典型：

```text
foo:

addiu $sp,$sp,-32

sw $ra,28($sp)

sw $fp,24($sp)

move $fp,$sp
```

布局：

```text
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

## 6. 参数访问

C：

```text
foo(a,b,c,d)
```

进入：

```text
$a0=a
$a1=b
$a2=c
$a3=d
```

第五参数：

```text
stack
```

---

## 7. 返回

返回值：

```text
$v0
```

例如：

```text
move $v0,$t0
```

---

## 8. MIPS尾声

```text
lw $ra,28($sp)

lw $fp,24($sp)

addiu $sp,$sp,32

jr $ra

nop
```

---

## 四、三种架构关键指令对应表

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

## 五、逆向识别速查

## ARM64

看到：

```text
stp x29,x30,[sp,#-16]!
```

= 函数开始

看到：

```text
ldp x29,x30,[sp],#16
ret
```

= 函数结束

---

## RISC-V64

看到：

```text
sd ra,xx(sp)
sd s0,xx(sp)
addi s0,sp,...
```

= 函数序言

看到：

```text
ld ra,...
ld s0,...
jalr zero,0(ra)
```

= 返回

---

## MIPS32

看到：

```text
sw $ra,offset($sp)
sw $fp,offset($sp)
```

= 函数入口

看到：

```text
lw $ra,...
jr $ra
```

= 返回
