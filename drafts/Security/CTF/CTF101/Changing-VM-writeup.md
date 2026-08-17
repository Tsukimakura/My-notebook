# Changing-VM writeup

> 出题人： 陈灵石（解题者本人）

> 写完导出才发现三十多页……代码放太多了其实分析的文字应该没那么夸张））能不能少扣点分）））

![[changingVM-wp-1.png]]

```bash
./challenge
Flag: AAA
Wrong
```

![[changingVM-wp-2.png]]

恢复几个变量，确定 flag 的长度是 31。

还有根据 sub_13C0 判定的逻辑，跟进 13C0 看看：

![[changingVM-wp-3.png]]

很明显找到了 dispatcher。

输入存在了 v10 的一部分里，v4 是经过两个函数得到的 64 位数据。 v10, v11, v4 被传进 sub_27C0，当 27C0 返回真时才继续后续逻辑，否则直接 Wrong。

继续的分支里显示一段何意味的伪代码不管他（，后面一堆地址构建 v12 的表，基本可以确定是 bytecode 到 handler 的映射，（另外作为出题人的上帝视角，v12 的小标是由 v11 中的值决定的，导致这个映射是动态的，不知道正常解题会不会在这里就推断出……），下面 jmp rsi 估计就是把 handler 地址放 rsi 里跳转了。（好像确实和正常的 switch 有点区别，但好像并没有增加什么难度，不知道出题的时候 AI 在说啥））），中间那段 v10 更具自己和 v11 更新，应该是表示状态的槽位。

后面有用到 v10 不存储输入的部分和 v11，前面  sub_27C0 应该对这两个变量做了修改。v4 和 v10 存储输入的部分可能作为修改依据/参数。跟进去详细看看：

```c
__int64 __fastcall sub_27C0(__int64 a1, __int64 a2, __int64 a3)
{
  __int64 v4; // rax
  __int64 v5; // rax

  v4 = sub_2840(0xE802073252104AA0LL, 17);
  v5 = sub_2860(v4 ^ 0x3E190CF06E6B189ELL);
  return sub_1E90(a1, a2, v5, 3LL, a3, 1LL);
}
```

只是一个包装层，继续分别跟进：

2840 就是循环左移。

2860：

```c
unsigned __int64 __fastcall sub_2860(unsigned __int64 a1)
{
  return (0x94D049BB133111EBLL
        * ((0xBF58476D1CE4E5B9LL * (a1 ^ (a1 >> 30))) ^ ((0xBF58476D1CE4E5B9LL * (a1 ^ (a1 >> 30))) >> 27))) ^ ((0x94D049BB133111EBLL * ((0xBF58476D1CE4E5B9LL * (a1 ^ (a1 >> 30))) ^ ((0xBF58476D1CE4E5B9LL * (a1 ^ (a1 >> 30))) >> 27))) >> 31);
}
```

整理一下：

```c
x = a1;
x = (x ^ (x >> 30)) * 0xBF58476D1CE4E5B9;
x = (x ^ (x >> 27)) * 0x94D049BB133111EB;
x = x ^ (x >> 31);
return x;
```

比较经典的 `fmix64` ，通过每一位扩散到多位产生随机数。

于是结合传参和变量，推断 sub_1E90 的调用：

```c
sub_1E90(
    状态块,  // 原 v10
    ??,     // 原 v11
    key,    // 伪随机
    3,
    外部传入, // 原 v4
    1
);
```

1E90 应该就是真正的装载原本 v11 v10 的函数，跟进：

复原参数：

```c
__int64 __fastcall sub_1E90(
	__int64 old_v10,
	__int64 old_v11,
	unsigned __int64 key,
	unsigned __int8 const1,
	__int64 extern_seed,
	int const2)
{
```

有一段：

```c
if ( const1 <= 11u )
{
	v94 = const1;
	v6 = dword_3040[2 * const1];
	v7 = dword_3040[2 * const1 + 1];
	if ( v7 <= 512 && (v7 & 7) == 0 && v6 + (unsigned __int64)v7 <= 2224 )
	{
```

显然 const1 在运行过程中应该是可变的，共有 0~11 共 12 个 stage，每个 stage 有两个 dword 存储相关数据（其实是 offset 和 size，就是对应 12 个块），判定第二个数据要 `<512`，是 8 的倍数，且两个数据相加小于一个神秘大数。

跟进 dword_3040 确实是 .rodata 段的一堆数据，比如这里 stage3 对应的是 `1E8h, 0A8h`。

下面：

```c
v11 = &v107;
v12 = (_DWORD *)((char *)&unk_30A0 + v6);
memcpy(local_buffer, unk_30A0 + offset, size);   // 这行是根据伪代码还原的
```

```text
目标地址 = 栈上 v107
源地址 = unk_30A0 + offset
把静态区 unk_30A0 + offset 的数据复制到栈上 v107（30A0 和 3040 在同一堆 blob 里）
```

后面还好多体力活…… AI 大人帮忙还原一部分源码））：

```c
v101 = sub_28A0(key, v94, 0LL, 0x73747265616D5F31LL);

for ( i = 0LL; i < v95; i += 8LL )
{
  v16 = *(_QWORD *)(&v107 + i);
  *(_QWORD *)(&v107 + i) = sub_2920(&v101) ^ v16; // 只修改 v107，没有修改 unk_30A0
}
```

↓

```c
seed = sub_28A0(key, stage, 0, 0x73747265616D5F31);

for (i = 0; i < size; i += 8)
    local_buffer_qword[i / 8] ^= sub_2920(&seed);
```

这是流加密（流解密）结构（密文 XOR 密钥流 = 明文，明文 XOR 相同密钥流 = 密文），

```text
unk_30A0：原始静态数据
v107：原始数据的副本，经逐 qword XOR 密钥流后得到的结果
```

因此前面的静态 blob 是加密 payload；`v107` 开始的栈上 buffer 才是这个 stage 解密后的数据。

看一眼 sub_28A0：

```c
unsigned __int64 __fastcall sub_28A0(__int64 a1, unsigned __int8 a2, __int64 a3, __int64 a4)
{
	unsigned __int64 v4; // rax
	unsigned __int64 v5; // rsi

	v4 = ((0xBF58476D1CE4E5B9LL * ((a4 + a3) ^ ((unsigned __int64)(a4 + a3) >> 30))) >> 27) ^ (0xBF58476D1CE4E5B9LL * ((a4 + a3) ^ ((unsigned __int64)(a4 + a3) >> 30)));
	v5 = ((0x94D049BB133111EBLL * v4) >> 31) ^ (0x94D049BB133111EBLL * v4) ^ a1 ^ (0x9E3779B97F4A7C15LL * a2);
	return ((0x94D049BB133111EBLL * (((0xBF58476D1CE4E5B9LL * (v5 ^ (v5 >> 30))) >> 27) ^ (0xBF58476D1CE4E5B9LL * (v5 ^ (v5 >> 30))))) >> 31) ^ (0x94D049BB133111EBLL * (((0xBF58476D1CE4E5B9LL * (v5 ^ (v5 >> 30))) >> 27) ^ (0xBF58476D1CE4E5B9LL * (v5 ^ (v5 >> 30)))));
}
```

好像也是  `fmix64` 基础上改的，大概和哈希的各个块加密叠加差不多，反正是把四个参数都揉进去生成了一个种子。~~（具体算法不重要反正脚本不是我写）~~

AI 也是一眼瞪出这个大常数 `0x73747265616D5F31` 是 `stream_1` 的 ASCII……这个 tag 也说明了同一 key 用在不同用途（错误的执行流）时，会加一个不同常数，不会生成相同随机序列。

继续看后面：

```c
if ( v95 > 0x17 )
{
	v97 = v109;
	v98 = v108;
	HIBYTE(v99) = v110;
	v96 = v111;

	if ( (unsigned __int8)(v108 - 1) <= 0x1F && v107 == 1 )
	{
	v18 = 16LL * v108;
	if ( v17 == v18 + 24 )
```

offset 作为相对于解密 buffer 起点 `&v107` 的偏移，则有

```text
offset +0: v107
offset +1: v108
offset +2: v109
offset +3: v110
```

`v111` 位于后面的 qword 对齐位置，结合其栈偏移可知是 payload 的 `+8`。（`  char v110; // [rsp+193h] [rbp-245h] unsigned __int64 v111; // [rsp+198h] [rbp-240h]`）

后面判断解密是否正确：

```c
v97 = v109;
v98 = v108;
HIBYTE(v99) = v110;
v96 = v111;

if ( (unsigned __int8)(v108 - 1) <= 0x1F && v107 == 1 )
{
  v18 = 16LL * v108;
  if ( v17 == v18 + 24 )
```

```c
v107 == 1
1 <= v108 <= 32  // 一个数量字段；后面参与 16 * v108，应该是指令/record数量之类的
v18 = 16 * v108;
v17 == v18 + 24
```

`v17` 是 payload 总长度 `v95`，即 总长度 = 24 + count × 16，开头固定占 16 字节，末尾固定占 8 字节，中间有 `count` 条 16-byte 记录。

类似方法还原出解密后的 payload 结构：

```c
struct Payload {
    uint8_t version;      // +0，必须为 1
    uint8_t count;        // +1，1 到 32
    uint8_t next_stage;   // +2  这个还没有完全证据，之后验证
    uint8_t metadata;     // +3
    uint32_t padding;     // +4
    uint64_t nonce;       // +8
    uint8_t records[][16];// +0x10，共 count 条
    uint64_t checksum;    // +0x10 + count*16
};
```

继续往后看：

```c
v19 = v18 + 16;
v21 = *(_QWORD *)(&v107 + v19);

v22 = v19 ^ 0x636865636B5F3634LL;
do
{
  v23 = *(_QWORD *)(&v107 + v20) ^ v22;
  v20 += 8;
  v22 = sub_2860(v23);
}
while ( v20 < v19 );

if ( v21 == v22 )
{
    // 继续处理
}
```

这里对 payload 前面的所有 qword 做混合，最后与 payload 末尾 qword 比较。因此解密 key 错 → header 不对 / checksum 不对；解密成功 → 进入后续 VM 构造。

然后有两次变换：

第一次：

```c
v103 = 0x706050403020100LL;
v24 = (__int64 *)((char *)&v103 + 7);

do
{
  v25 = sub_2920(&v101);
  ...
  v27 = *((_BYTE *)v24 + 1);
  v28 = &v104[v25 % v26 - 7];
  *((_BYTE *)v24 + 1) = *v28;
  *v28 = v27;
}
while ( v24 != &v103 );
```

反编译出一堆变量重叠，但 AI 太好用了😋~

v103 小端序排列就是 `00 01 02 03 04 05 06 07`

AI 已经成功一眼瞪出来是 Fisher-Yates Shuffle，一共八个值的打乱，身为出题人自然反应出来是寄存器映射，但我先假装不知道（），这里就是产生了0 到 7 的随机排列。

第二次的反编译出来一堆丑陋的 SSE 伪代码，

```c
do
{
	v37 = si128;
	++v34;
	si128 = _mm_add_epi32(si128, v31);
	v38 = _mm_add_epi32(v37, v32);
	v39 = _mm_unpackhi_epi16(v37, v38);
	v40 = _mm_unpacklo_epi16(v37, v38);
	v41 = _mm_unpacklo_epi16(v40, v39);
	v42 = _mm_unpackhi_epi16(v40, v39);
	v43 = v37;
	v44 = _mm_add_epi32(v37, v35);
	v45 = _mm_unpacklo_epi16(v41, v42);
	v46 = _mm_add_epi32(v43, v33);
	v47 = _mm_unpacklo_epi16(v46, v44);
	v48 = _mm_unpackhi_epi16(v46, v44);
	v34[-1] = _mm_packus_epi16(
			  _mm_and_si128(v45, v36),
			  _mm_and_si128(
				_mm_unpacklo_epi16(_mm_unpacklo_epi16(v47, v48), _mm_unpackhi_epi16(v47, v48)),
				v36));
}
while ( &v107 != (char *)v34 );
```

直接丢给 AI 读）是在 `v105[0] ... v105[254], v106` 里写入 `00 01 02 03 04 05 06 07 ... FE FF`

```c
v49 = &v106;
do
{
  v50 = sub_2920(&v101);
  v51 = *v49;
  v52 = v50 % (unsigned __int64)&(v49--)[1LL - (_QWORD)v105];
  v53 = &v105[v52];
  v49[1] = *v53;
  *v53 = v51;
}
while ( v105 != v49 );
```

Fisher-Yates shuffle

```c
*(_QWORD *)v104 = *(_QWORD *)v105;
*(_QWORD *)&v104[7] = *(_QWORD *)&v105[7];
```

取前 15 项

结合前面 13C0 里的跳转表，

```c
v12[LOBYTE(v11[64])] = &loc_16A8;
v12[BYTE1(v11[64])]  = &loc_1820;
...
v12[BYTE6(v11[65])]  = &loc_1888;
```

`v11[64]` 的地址是：v11 + 64 * 8 = v11 + 0x200(512)

加上后面的

```c
*(_QWORD *)(old_v11 + 512) = *(_QWORD *)v104;
*(_QWORD *)(old_v11 + 519) = *(_QWORD *)&v104[7];
```

`dispatch[随机 byte] = 对应 handler 地址`

总归第一次 shuffle 生成逻辑寄存器 → 物理槽位的映射，第二次打乱 256 字节取前 15 字节有效，生成逻辑 opcode → 实际 bytecode 低字节的映射。

整体逻辑类似：

```text
sub_1E90：
  logical ADD -> 0x44

sub_13C0：
  dispatch[0x44] = ADD handler

执行 bytecode：
  当前指令低 byte = 0x44
  -> 跳到 ADD handler
```

```c
if ( const2 )
{
	v54 = BYTE6(v103);
	*(_OWORD *)old_v10 = 0LL;
	*(_OWORD *)(old_v10 + 16) = 0LL;
	*(_OWORD *)(old_v10 + 32) = 0LL;
	*(_OWORD *)(old_v10 + 48) = 0LL;
	*(_QWORD *)(old_v10 + 8 * v54) = extern_seed;
}
else
{
	v68 = (__int64 *)((char *)&v102 + 7);
	v101 = sub_28A0(
		*(_QWORD *)(old_v10 + 192),
		*(_BYTE *)(old_v10 + 208),
		*(_QWORD *)(old_v10 + 200),
		0x7265675F6D61705FLL);
	v102 = 0x706050403020100LL;
	do
	{
		v69 = sub_2920(&v101);
		v70 = *(_BYTE *)v68;
		v71 = v69 % ((unsigned __int64)v68 + 1LL - (_QWORD)&v102);
		v68 = (__int64 *)((char *)v68 - 1);
		v72 = (char *)&v102 + v71;
		*((_BYTE *)v68 + 1) = *v72;
		*v72 = v70;
	}
	while ( v68 != &v102 );
	if ( (*(_BYTE *)(old_v10 + 209) & 1) != 0 )
	{
		v84 = BYTE6(v102);
		v85 = sub_29F0();
		*(_QWORD *)(old_v10 + 8 * v84) = sub_2970(*(_QWORD *)(old_v10 + 8 * v84), v85, 1LL);
	}
	for ( j = 0LL; j != 8; ++j )
	{
		v74 = *((unsigned __int8 *)&v102 + j);
		v75 = v104[j - 7];
		v105[v74] = v75;
	}
	v76 = 0LL;
	v77 = 0;
	do
	{
	while ( ((unsigned __int8)(1 << v76) & (unsigned __int8)v77) != 0 )
	{
	  if ( ++v76 == 8 )
		goto LABEL_61;
	}
	v78 = *(_QWORD *)(old_v10 + 8 * v76);
	v79 = v76;
	do
	{
	  v80 = v79;
	  v81 = v78;
	  v82 = (unsigned __int8)v105[v79];
	  v79 = (unsigned __int8)v82;
	  v83 = (__int64 *)(old_v10 + 8 * v82);
	  v78 = *v83;
	  *v83 = v81;
	  v77 |= 1 << v80;
	}
	while ( (_DWORD)v76 != v79 );
	++v76;
	}
	while ( v76 != 8 );
LABEL_61:
	sub_29D0(v105, 8LL);
}
```

const2 == 0 时进入 else 分支，里面会：

1. 根据上一层 state 的 metadata 再生成一张 8 项映射；
2. metadata 满足条件时调用 `sub_29F0()`；
3. 对 `old_v10` 前 8 个 qword 做循环置换。

总之先跳过一会儿再看）

```c
v55 = &v112;

while ( 1 )
{
	v62 = (unsigned __int8)*v55;
	v63 = (unsigned __int8)v55[1];
	v64 = v55[2];
	v65 = v55[3];
	v66 = *((_QWORD *)v55 + 1);
	...
	v55 += 16;
	...
	*(_QWORD *)(v92 + 8 * v57++) = ...;
}
```

把解密 payload 的 16-byte records 变成 64-bit 指令。还原指令结构：

```asm
249F  movzx r12d, byte ptr [rbp+0] ; record[0]
24A4  movzx ebx,  byte ptr [rbp+1] ; record[1]
24A8  movzx r10d, byte ptr [rbp+2] ; record[2]
24AD  movzx r13d, byte ptr [rbp+3] ; record[3]
24B2  mov    rax,  [rbp+8]         ; record[8..15]
```

```asm
24B6  cmp r12b, 0Eh  ; 第一个 byte 不能超过 14
24BC  cmp bl, 3      ; 第二个 byte 不能超过 3
24C7  or  edx, r13d
24CA  cmp dl, 7      ; 第三个、第四个 byte 都不能超过 7
```

还原出来

```c
struct RawInstruction {
    uint8_t op;       // +0，范围 0..14
    uint8_t mode;     // +1，范围 0..3
    uint8_t reg_a;    // +2，范围 0..7
    uint8_t reg_b;    // +3，范围 0..7
    uint8_t aux;      // +4，后面用于移位数等
    uint8_t pad[3];
    uint64_t imm;     // +8
};
```

同时可以通过判定逻辑对 mode 做出一定的推断假设：

|mode|当前证据|
|---|---|
|0|不使用立即数；很可能是寄存器对寄存器|
|1|使用完整 `imm64`，存入常数池|
|2|使用 `imm` 的低 16 位，编码到指令 bit 24 起|
|3|当前指令格式允许，但具体语义等 handler 证实|

差不多可以开始动调了：

静态的时候有分析到一个反调试函数 sub_29F0：

```c
open("/proc/self/status")
read(...)
strstr(..., "TracerPid:")
strtoul(...)
return TracerPid != 0
```

正常运行时返回 0，gdb 内运行通常返回 1。`sub_29F0` 所有正常路径都会在 `0x2AC2` 附近汇合并返回。设置断点：

```gdb
brva 0x2ac2
commands
  silent
  set $eax = 0
  continue
end
```

再在解密 payload 的循环结束处下断： `brva 0x207c`

此时运行到这里解密完 payload 但还没验证，查看解密后的 payload。payload 临时缓冲区起点是 rsp + 0x190。

![[changingVM-wp-4.png]]

对应：

```gdb
version    = 1
count      = 9          // 此 stage 有 9 条原始指令
next_stage = 0          // 验证后将进入 stage 0
metadata   = 0
padding    = 0
nonce = 0xd34bc5ab0f000de1
```

在把 64 位指令写入程序缓冲区处下断：

```gdb
brva 0x248e
```

![[changingVM-wp-5.png]]

bytecode: `0x69bc1f000000763d`

|字段|值|含义|
|---|---|---|
|opcode|`0x3d`|实际分派 byte；不是逻辑 opcode 编号|
|reg_a|`6`|目标是物理寄存器槽 6|
|reg_b|`6`|此条指令中不重要|
|mode|`1`|使用完整 `imm64` 常数池|
|aux|`0`|无额外参数|
|constant index|`0`|取常数池第 0 项|
|高 24 位|`0x69bc1f`|`mix(material + GOLD * pc)` 的低 24 位|
```text
逻辑指令：LOAD_CONST logical_r0, 0xa0761d6478bd642f
实际编码：opcode 0x3d，目标物理槽 6，使用常数池 0
```

这个 stage 有 `reg_map[0] = 6`，逻辑 `r0` 实际存放在 state 前 8 个 qword 中的第 6 个槽位（动态机制）。且验证了静态分析的 record 结构，以及 mode=1 的常数池机制。

```gdb
pwndbg> x/16bx $r11+0x200
0x7fffffffc9c0: 0xff    0x3d    0x24    0x6e    0x44    0x4c    0x34    0x38
0x7fffffffc9c8: 0x30    0x82    0x29    0xf5    0xb4    0x33    0x2c    0x00
pwndbg> x/4gx  $r11+0x100
0x7fffffffc8c0: 0xa0761d6478bd642f      0x0000000000000000
0x7fffffffc8d0: 0x0000000000000000      0x0000000000000000
pwndbg> x/2hx  $r11+0x210
0x7fffffffc9d0: 0x0009  0x0001
pwndbg> x/1bx  $r11+0x214
0x7fffffffc9d4: 0x00
```

结合汇编

```asm
2362 mov [rbx+0x200], rax
2371 mov [rbx+0x207], rax
237F mov word ptr [rbx+0x210], ax
2393 mov byte ptr [rbx+0x214], al
```

```c
program + 0x000：编码后的 VM 指令数组
program + 0x100：imm64 常数池
program + 0x200：15 个 opcode 映射 byte
program + 0x210：指令总数
program + 0x212：已使用常数池数量
program + 0x214：payload 的 next_stage  // 推断
```

然后跟进第一条 handler `loc_1820`

先静态看一下逻辑，可以归纳位 `LOAD_CONST dst, constant_pool[index]`

```c
handler 运行前：
pwndbg> p/x $r13
$11 = 0x69bc1f000000763d
pwndbg> x/8gx $rsp+0x20
0x7fffffffc6e0: 0x0000000000000000      0x0000000000000000
0x7fffffffc6f0: 0x0000000000000000      0x884df553fdd41123
0x7fffffffc700: 0x0000000000000000      0x0000000000000000
0x7fffffffc710: 0x0000000000000000      0xe1a8948de671b682
pwndbg> x/1gx $rsp + 0x20 + 6*8
0x7fffffffc710: 0x0000000000000000

写入前：
pwndbg> brva 0x186a
Breakpoint 5 at 0x55555555586a

pwndbg> p/d $rdx
$12 = 6
pwndbg> p/x $rsi
$13 = 0xa0761d6478bd642f
pwndbg> x/8gx $rsp+0x20
0x7fffffffc700: 0x0000000000000000      0x0000000000000000
0x7fffffffc710: 0x0000000000000000      0xe1a8948de671b682

写入后：
pwndbg> si

pwndbg> x/8gx $rsp+0x20
0x7fffffffc6e0: 0x0000000000000000      0x0000000000000000
0x7fffffffc6f0: 0x0000000000000000      0x884df553fdd41123
0x7fffffffc700: 0x0000000000000000      0x0000000000000000
0x7fffffffc710: 0xa0761d6478bd642f      0xe1a8948de671b682
```

`state[6] = 0xa0761d6478bd642f`

对第一条指令验证成功。可写为：

```text
逻辑：LOAD_CONST r0, 0xa0761d6478bd642f
物理：state[6] = 0xa0761d6478bd642f
```

以此类推，有

|逻辑 op|handler|语义|
|---|---|---|
|0|`0x16A8`|`MOV dst, src`|
|1|`0x1820`|`LOAD_CONST dst, constants[index]`|
|2|`0x1D03`|`LOAD dst, memory[imm16]`|
|3|`0x17B0`|`STORE memory[imm16], src`|
|4|`0x1C80`|`ADD dst, src/imm`|
|5|`0x1CC1`|`SUB dst, src/imm`|
|6|`0x1C40`|`XOR dst, src/imm`|
|7|`0x1750`|`OR dst, src`|
|8|`0x1BE3`|`AND dst, src`|
|9|`0x1B9F`|`MUL dst, src/imm`|
|10|`0x1B70`|`ROL dst, aux`|
|11|`0x1B25`|`ROR dst, aux`|
|12|`0x1ACA`|`SWAP reg_a, reg_b`|
|13|`0x18A8`|`GUARD`，装载下一层 VM|
|14|`0x1888`|`HALT`，测试指定寄存器是否为零|

stage3 解密后的 header：

```text
version    = 1
count      = 9
next_stage = 0
metadata   = 0
```

9 条指令查表可解释为：

```text
0: LOAD_CONST r0, 0xa0761d6478bd642f
1: LOAD_CONST r1, 0xe7037ed1a0b428db
2: ADD        r0, r1
3: XOR        r1, r0
4: ROL        r1, 7
5: MOV        r2, r1
6: STORE      memory[0x40], r2
7: LOAD       r3, memory[0x40]
8: GUARD
```

`逻辑 r0 → 物理 state[6]`，所以阅读算法时要使用逻辑名，调试 state 时再变成物理下标。

计算 stage3 的数据变化，在 guard 前，有：

```c
r0 = 0x87799c3619718d0a
r1 = 0x3d7173dce2d2e8b0
r2 = 0x3d7173dce2d2e8b0
r3 = 0x3d7173dce2d2e8b0
```

然后观察一次 guard 行为：

```c
pwndbg> info break
Num     Type           Disp Enb Address            What
1       breakpoint     keep y   0x0000555555556ac2
        breakpoint already hit 1 time
2       breakpoint     keep y   0x000055555555607c
        breakpoint already hit 1 time
3       breakpoint     keep n   0x000055555555648e
        breakpoint already hit 1 time
4       breakpoint     keep y   0x0000555555555820
        breakpoint already hit 1 time
5       breakpoint     keep y   0x000055555555586a
        breakpoint already hit 1 time
pwndbg> disable 4
pwndbg> disable 5
pwndbg> brva 0x18a8
Breakpoint 6 at 0x5555555558a8
pwndbg> c

pwndbg> p/x $r13
$14 = 0x96ddb8000000f633
pwndbg> p/x $r13 & 0xff
$15 = 0x33
pwndbg> x/8gx $rsp+0x20
0x7fffffffc6e0: 0x3d7173dce2d2e8b0      0x0000000000000000
0x7fffffffc6f0: 0x3d7173dce2d2e8b0      0x884df553fdd41123
0x7fffffffc700: 0x0000000000000000      0x3d7173dce2d2e8b0
0x7fffffffc710: 0x87799c3619718d0a      0xeee110c86034e5d2
pwndbg> x/2gx $rsp+0xe0
0x7fffffffc7a0: 0x70db19cf9e44c494      0xd34bc5ab0f000de1
pwndbg> x/4bx $rsp+0xf0
0x7fffffffc7b0: 0x03    0x00    0x07    0x01
pwndbg> x/1bx $rsp+0x314
0x7fffffffc9d4: 0x00
```

确定：

```text
物理寄存器：
state[6] = 0x87799c3619718d0a  ← 逻辑 r0
state[2] = 0x3d7173dce2d2e8b0  ← 逻辑 r1
state[5] = 0x3d7173dce2d2e8b0  ← 逻辑 r2
state[0] = 0x3d7173dce2d2e8b0  ← 逻辑 r3

metadata:
key      = 0x70db19cf9e44c494
nonce    = 0xd34bc5ab0f000de1
stage    = 3
metadata = 0
key_reg  = 7
valid    = 1
```

`program + 0x214 = 0x00`，guard 进入 stage 0。

`state[3] = 0x884df553fdd41123`，应该是前面的反调试没 patch 掉。

检查了下发现是 commands 里带 continue 有点问题…… 重新 patch 了以下正常了：

```text
逻辑 r0 = state[6] = 0x87799c3619718d0a
逻辑 r1 = state[2] = 0x3d7173dce2d2e8b0
逻辑 r2 = state[5] = 0x3d7173dce2d2e8b0
逻辑 r3 = state[0] = 0x3d7173dce2d2e8b0

stage = 3
metadata = 0
key-register physical index = 7
next_stage = 0
```

读一下 guard handler 的逻辑，

```text
读取本层 header 中的 next_stage；
结合当前 VM state 导出 child key；
装载 child stage 的 payload；
重新编码 child stage 的指令；
返回 dispatcher，继续运行 child stage。
```

接下来 trace 得到完整 stage 链：

![[changingVM-wp-6.png]]

很遗憾 commands end 块又报错……只能一键生成脚本啦（

**pwndbg_vm_trace.py**

```python
"""Load from GDB after setting $base to trace Changing-VM without commands blocks.

Usage:
  source pwndbg_vm_trace.py
  vmtrace 0x5555...        # the PIE base from vmmap
"""

import gdb

INF = gdb.selected_inferior()

def read_u8(address):
    return int.from_bytes(INF.read_memory(address, 1).tobytes(), "little")

def read_u64(address):
    return int.from_bytes(INF.read_memory(address, 8).tobytes(), "little")

class ForceNormalAntiDebug(gdb.Breakpoint):
    def stop(self):
        gdb.execute("set $eax = 0", to_string=True)
        return False

class GuardTrace(gdb.Breakpoint):
    def stop(self):
        rsp = int(gdb.parse_and_eval("$rsp"))
        instruction = int(gdb.parse_and_eval("$r13"))
        regs = [read_u64(rsp + 0x20 + 8 * i) for i in range(8)]
        key = read_u64(rsp + 0xE0)
        nonce = read_u64(rsp + 0xE8)
        stage = read_u8(rsp + 0xF0)
        meta = read_u8(rsp + 0xF1)
        keyreg = read_u8(rsp + 0xF2)
        valid = read_u8(rsp + 0xF3)
        next_stage = read_u8(rsp + 0x314)

        print("\n--- GUARD ---")
        print(f"instruction = 0x{instruction:016x}")
        print(f"stage = {stage}, next_stage = {next_stage}, meta = {meta}, keyreg = {keyreg}, valid = {valid}")
        print(f"key = 0x{key:016x}, nonce = 0x{nonce:016x}")
        print("state = " + " ".join(f"{value:016x}" for value in regs))
        return True

class InstallVmTrace(gdb.Command):
    """Install trace breakpoints: vmtrace PIE_BASE"""

    def __init__(self):
        super().__init__("vmtrace", gdb.COMMAND_USER)

    def invoke(self, argument, from_tty):
        try:
            base = int(argument.strip(), 0)
        except ValueError:
            print("Usage: vmtrace 0xPIE_BASE")
            return
        ForceNormalAntiDebug(f"*0x{base + 0x2AC2:x}", internal=False)
        GuardTrace(f"*0x{base + 0x18A8:x}", internal=False)
        print("Installed Python breakpoints: anti-debug forced to 0; guard trace stops for inspection.")

InstallVmTrace()
```

第一次断下的输出如下：

```text
--- GUARD ---
instruction = 0x-692247ffffff09cd
stage = 3, next_stage = 0, meta = 0, keyreg = 7, valid = 1
key = 0x70db19cf9e44c494, nonce = 0xd34bc5ab0f000de1
state = 3d7173dce2d2e8b0 0000000000000000 3d7173dce2d2e8b0 d48f405ea3e32acd 0000000000000000 3d7173dce2d2e8b0 87799c3619718d0a eee110c86034e5d2
```

重复记录 `stage = X, next_stage = Y`，得到 stage 的变化 `3 → 0 → 10 → 8 → 6 → 11 → 9 → 5 → 4 → 2 → 1 → 7`

查看最后的 halt：

```gdb
brva 0x1888
c

pwndbg> p/x $r13
$1 = 0xcb74fa000000c383
pwndbg> set $halt_reg = ($r13 >> 8) & 7
pwndbg> p/d $halt_reg
$2 = 3
pwndbg> x/1gx $rsp + 0x20 + 8*$halt_reg
0x7fffffffc698: 0x3fbbf7ffffffffff
```

得到

```text
halt instruction = 0xcb74fa000000c383
halt_reg = 3
state[3] = 0x3fbbf7ffffffffff
```

即最终 halt handler 就是 `return state[3] == 0;`

---

目前已经确认：

```text
静态 blob → XOR 解密 → 16-byte 原始记录 → 64-bit VM 指令 → handler
```

stage 3 已经基本清晰，先只解 stage 3：

**decode_one.py**

```python
from pathlib import Path
import struct

MASK = (1 << 64) - 1
GOLD = 0x9e3779b97f4a7c15
TAG_STREAM = 0x73747265616d5f31

raw = Path("challenge").read_bytes()

def mix(x):
    x ^= x >> 30
    x = (x * 0xbf58476d1ce4e5b9) & MASK
    x ^= x >> 27
    x = (x * 0x94d049bb133111eb) & MASK
    return (x ^ (x >> 31)) & MASK

def derive(key, stage, nonce, tag):
    # C 中这里是 uint64_t 乘法；Python 整数不会自动溢出，必须截断。
    return mix((key ^ ((stage * GOLD) & MASK) ^ mix((nonce + tag) & MASK)) & MASK)

def decode(stage, key):
    # .rodata 的 file offset 与本题 RVA 相同
    offset, size = struct.unpack_from("<II", raw, 0x3040 + stage * 8)
    data = bytearray(raw[0x30a0 + offset : 0x30a0 + offset + size])

    seed = derive(key, stage, 0, TAG_STREAM)
    for pos in range(0, size, 8):
        seed = (seed + GOLD) & MASK
        word = struct.unpack_from("<Q", data, pos)[0]
        struct.pack_into("<Q", data, pos, word ^ mix(seed))
    return data

data = decode(3, 0x70db19cf9e44c494)

version, count, next_stage, metadata = data[:4]
nonce = struct.unpack_from("<Q", data, 8)[0]

print(version, count, next_stage, metadata, hex(nonce))

# 先验证 payload header；不要让错误的 count 进入记录遍历。
if version != 1:
    raise ValueError(f"bad version {version}: decryption key/stream is wrong")
if not 1 <= count <= 32:
    raise ValueError(f"bad instruction count {count}: decryption key/stream is wrong")
if len(data) != 16 * count + 24:
    raise ValueError(f"size mismatch: got {len(data)}, expected {16 * count + 24}")

for pc in range(count):
    pos = 16 + pc * 16
    op, mode, a, b, aux = data[pos:pos+5]
    imm = struct.unpack_from("<Q", data, pos + 8)[0]
    print(pc, op, mode, a, b, aux, hex(imm))
```

输出：

```text
1 9 0 0 0xd34bc5ab0f000de1
0 1 1 0 0 0 0xa0761d6478bd642f
1 1 1 1 0 0 0xe7037ed1a0b428db
2 4 0 0 1 0 0x0
3 6 0 1 0 0 0x0
4 10 1 1 0 7 0x0
5 0 0 2 1 0 0x0
6 3 2 2 0 8 0x40
7 2 2 3 0 8 0x40
8 13 3 0 0 0 0x0
```

和之前手工得到的 stage 3 逻辑指令一致，把脚本扩展为：读取 guard trace 中记录的每层 `stage → key`，依次解出全部 12 个 payload：

**decode_all.py**

```python
#!/usr/bin/env python3
"""Decode and print every static Changing-VM stage (no execution, no solver)."""
from pathlib import Path
import struct

MASK = (1 << 64) - 1
GOLD = 0x9e3779b97f4a7c15
TAG_STREAM = 0x73747265616d5f31
TAG_CHECK = 0x636865636b5f3634

# These are the per-stage keys printed by the normal-path guard trace.
# If analysing a fresh copy, replace values as they are observed at guards.
STAGE_KEYS = {
    3: 0x70db19cf9e44c494,
    0: 0xc669173835f8ca35,
    10: 0xcec373fbdd73d085,
    8: 0xc075257ac2689256,
    6: 0x9c2ff023e79cc736,
    11: 0xd32572972f739bd6,
    9: 0x808a47ffb0537450,
    5: 0x727782c08c770769,
    4: 0x21effc31dfd50796,
    2: 0x20f4794471bba079,
    1: 0x2e3ad39e09c0a7d4,
    7: 0xb36f2b3ffa1e3812,
}

ORDER = [3, 0, 10, 8, 6, 11, 9, 5, 4, 2, 1, 7]
OPNAME = {
    0: "MOV", 1: "LOAD_CONST", 2: "LOAD", 3: "STORE",
    4: "ADD", 5: "SUB", 6: "XOR", 7: "OR", 8: "AND", 9: "MUL",
    10: "ROL", 11: "ROR", 12: "SWAP", 13: "GUARD", 14: "HALT",
}

def mix(x):
    x ^= x >> 30
    x = (x * 0xbf58476d1ce4e5b9) & MASK
    x ^= x >> 27
    x = (x * 0x94d049bb133111eb) & MASK
    return (x ^ (x >> 31)) & MASK

def derive(key, stage, nonce, tag):
    return mix((key ^ ((stage * GOLD) & MASK) ^ mix((nonce + tag) & MASK)) & MASK)

def decode_stage(raw, stage, key):
    offset, size = struct.unpack_from("<II", raw, 0x3040 + stage * 8)
    encrypted = raw[0x30a0 + offset:0x30a0 + offset + size]
    if len(encrypted) != size or size > 0x200 or size % 8:
        raise ValueError(f"stage {stage}: invalid descriptor offset={offset:#x}, size={size:#x}")

    data = bytearray(encrypted)
    seed = derive(key, stage, 0, TAG_STREAM)
    for pos in range(0, size, 8):
        seed = (seed + GOLD) & MASK
        value = struct.unpack_from("<Q", data, pos)[0] ^ mix(seed)
        struct.pack_into("<Q", data, pos, value)

    version, count, next_stage, metadata = data[:4]
    nonce = struct.unpack_from("<Q", data, 8)[0]
    if version != 1 or not 1 <= count <= 32 or len(data) != 16 * count + 24:
        raise ValueError(f"stage {stage}: invalid decrypted header: {data[:16].hex()}")

    checksum_offset = 16 + count * 16
    state = checksum_offset ^ TAG_CHECK
    for pos in range(0, checksum_offset, 8):
        state = mix(struct.unpack_from("<Q", data, pos)[0] ^ state)
    expected = struct.unpack_from("<Q", data, checksum_offset)[0]
    if state != expected:
        raise ValueError(f"stage {stage}: checksum mismatch ({state:#x} != {expected:#x})")

    records = []
    for pc in range(count):
        pos = 16 + 16 * pc
        op, mode, a, b, aux = data[pos:pos + 5]
        imm = struct.unpack_from("<Q", data, pos + 8)[0]
        records.append((op, mode, a, b, aux, imm))
    return next_stage, metadata, nonce, records

def format_record(record):
    op, mode, a, b, aux, imm = record
    name = OPNAME.get(op, f"OP_{op}")
    if op == 1:
        return f"{name:<10} r{a}, 0x{imm:016x}"
    if op in (2, 3):
        return f"{name:<10} r{a}, [0x{imm:x}]"
    if op in (10, 11):
        return f"{name:<10} r{a}, {aux}"
    if op == 12:
        return f"{name:<10} r{a}, r{b}"
    if op in (13, 14):
        return f"{name:<10} r{a}"
    return f"{name:<10} r{a}, r{b}" if mode == 0 else f"{name:<10} r{a}, 0x{imm:016x}"

def main():
    raw = Path("challenge").read_bytes()
    for stage in ORDER:
        key = STAGE_KEYS[stage]
        next_stage, metadata, nonce, records = decode_stage(raw, stage, key)
        print(f"\nstage {stage}: key=0x{key:016x}, nonce=0x{nonce:016x}, "
              f"next={next_stage}, meta={metadata}, count={len(records)}")
        for pc, record in enumerate(records):
            print(f"  {pc:02}: {format_record(record)}")

if __name__ == "__main__":
    main()
```

输出：

```text
stage 3: key=0x70db19cf9e44c494, nonce=0xd34bc5ab0f000de1, next=0, meta=0, count=9
  00: LOAD_CONST r0, 0xa0761d6478bd642f
  01: LOAD_CONST r1, 0xe7037ed1a0b428db
  02: ADD        r0, r1
  03: XOR        r1, r0
  04: ROL        r1, 7
  05: MOV        r2, r1
  06: STORE      r2, [0x40]
  07: LOAD       r3, [0x40]
  08: GUARD      r0

stage 0: key=0xc669173835f8ca35, nonce=0x82350830ecda9bcc, next=10, meta=0, count=9
  00: SUB        r3, r0
  01: ROR        r3, 11
  02: LOAD_CONST r4, 0xd6e8feb86659fd93
  03: MUL        r3, r4
  04: LOAD_CONST r4, 0x00ffffffffffffff
  05: AND        r3, r4
  06: OR         r2, r3
  07: SWAP       r2, r3
  08: GUARD      r0

stage 10: key=0xcec373fbdd73d085, nonce=0x75ab113b3a477162, next=8, meta=0, count=7
  00: LOAD       r0, [0x0]
  01: LOAD       r1, [0x8]
  02: LOAD       r2, [0x10]
  03: LOAD       r3, [0x18]
  04: LOAD_CONST r4, 0x0000000000000000
  05: LOAD_CONST r5, 0x0000000000000000
  06: GUARD      r0

stage 8: key=0xc075257ac2689256, nonce=0xe271f884bbb11a18, next=6, meta=0, count=13
  00: MOV        r4, r2
  01: ADD        r4, 0x597bb1547c7c9aa1
  02: ROL        r4, 17
  03: XOR        r4, r3
  04: MOV        r5, r3
  05: ADD        r5, 0x95175c646455e66a
  06: ROL        r5, 41
  07: ADD        r5, r2
  08: XOR        r0, r4
  09: XOR        r1, r5
  10: SWAP       r0, r2
  11: SWAP       r1, r3
  12: GUARD      r0

stage 6: key=0x9c2ff023e79cc736, nonce=0x31cc768652b7976c, next=11, meta=0, count=13
  00: MOV        r4, r2
  01: ADD        r4, 0x33689714332ce789
  02: ROL        r4, 17
  03: XOR        r4, r3
  04: MOV        r5, r3
  05: ADD        r5, 0x29ad97d29c6cfce9
  06: ROL        r5, 41
  07: ADD        r5, r2
  08: XOR        r0, r4
  09: XOR        r1, r5
  10: SWAP       r0, r2
  11: SWAP       r1, r3
  12: GUARD      r0

stage 11: key=0xd32572972f739bd6, nonce=0xceb477b78b579c7b, next=9, meta=1, count=13
  00: MOV        r4, r2
  01: ADD        r4, 0xc6cd12499a741c5f
  02: ROL        r4, 17
  03: XOR        r4, r3
  04: MOV        r5, r3
  05: ADD        r5, 0xd9f7478c1b7af0dd
  06: ROL        r5, 41
  07: ADD        r5, r2
  08: XOR        r0, r4
  09: XOR        r1, r5
  10: SWAP       r0, r2
  11: SWAP       r1, r3
  12: GUARD      r0

stage 9: key=0x808a47ffb0537450, nonce=0xc4d3100d5ef2e43e, next=5, meta=0, count=13
  00: MOV        r4, r2
  01: ADD        r4, 0xa69189fb74ee4ac5
  02: ROL        r4, 17
  03: XOR        r4, r3
  04: MOV        r5, r3
  05: ADD        r5, 0x481fbf3cb6c97dd6
  06: ROL        r5, 41
  07: ADD        r5, r2
  08: XOR        r0, r4
  09: XOR        r1, r5
  10: SWAP       r0, r2
  11: SWAP       r1, r3
  12: GUARD      r0

stage 5: key=0x727782c08c770769, nonce=0x19b62546b2d4f2ec, next=4, meta=0, count=13
  00: MOV        r4, r2
  01: ADD        r4, 0xf862141e373e67a5
  02: ROL        r4, 17
  03: XOR        r4, r3
  04: MOV        r5, r3
  05: ADD        r5, 0xd121b1817551a9a7
  06: ROL        r5, 41
  07: ADD        r5, r2
  08: XOR        r0, r4
  09: XOR        r1, r5
  10: SWAP       r0, r2
  11: SWAP       r1, r3
  12: GUARD      r0

stage 4: key=0x21effc31dfd50796, nonce=0xb0f32e45c0153265, next=2, meta=0, count=13
  00: MOV        r4, r2
  01: ADD        r4, 0xb7d095a802966df4
  02: ROL        r4, 17
  03: XOR        r4, r3
  04: MOV        r5, r3
  05: ADD        r5, 0x7d6f32db6d20cba4
  06: ROL        r5, 41
  07: ADD        r5, r2
  08: XOR        r0, r4
  09: XOR        r1, r5
  10: SWAP       r0, r2
  11: SWAP       r1, r3
  12: GUARD      r0

stage 2: key=0x20f4794471bba079, nonce=0x0439e6d7c501c5aa, next=1, meta=0, count=8
  00: LOAD_CONST r5, 0x0000000000000000
  01: LOAD_CONST r4, 0x571e0ac0bf43f997
  02: XOR        r4, r0
  03: OR         r5, r4
  04: LOAD_CONST r4, 0xdcd2daf5efd6078f
  05: XOR        r4, r1
  06: OR         r5, r4
  07: GUARD      r0

stage 1: key=0x2e3ad39e09c0a7d4, nonce=0xd03e9e0f21aeb746, next=7, meta=0, count=9
  00: LOAD_CONST r4, 0x488b6bfc81ef1355
  01: XOR        r4, r2
  02: OR         r5, r4
  03: MOV        r4, r6
  04: XOR        r4, 0xbae4ba7cc26ae4b8
  05: XOR        r4, 0xe5497b704ac60273
  06: XOR        r4, r3
  07: OR         r5, r4
  08: GUARD      r0

stage 7: key=0xb36f2b3ffa1e3812, nonce=0xcf7c4021fefe8fa5, next=255, meta=0, count=1
  00: HALT       r5
```

观察还原的指令（结合之前的分析结果）：

```text
stage 10：把输入 4 个 little-endian qword 装入 r0..r3
stage 8、6、11、9、5、4：六轮同构 ARX 网络
stage 2、1：构造“必须为零”的约束
stage 7：HALT r5
```

末端的约束可以化简成：

```c
stage 2:
r5 = 0
r5 |= 0x571e0ac0bf43f997 ^ r0
r5 |= 0xdcd2daf5efd6078f ^ r1
```

因此最终判定 `r5 == 0` 必有

```c
r0 = 0x571e0ac0bf43f997
r1 = 0xdcd2daf5efd6078f
```

stage 1 又要求：

```c
r2 = 0x488b6bfc81ef1355

r3 = r6
   ^ 0xbae4ba7cc26ae4b8
   ^ 0xe5497b704ac60273
```

现在还缺少 `r6` 的真实值，因为 stage 11 的 header 里 meta=1，在进入 stage 9 前会对 r6 做注入。

回去看 sub_1E90 的递归分支：（之前保留跳过的那个 else 分支）

直接写几个重要的结论吧）：

```text
初始时逻辑 r6 = outer_seed

逻辑 r7 不是普通数据寄存器；
每层都会被写入新的 stage seed；
dispatcher 还会在每条指令前更新它。

递归时重新生成的是父层 map
它从 state 里保存的是：
parent key
parent stage
parent nonce
说明 map 不需要长期单独保存，只要保存 key、stage、nonce，就能重建

递归置换的语义：
new_regs[current_map[i]] = old_regs[parent_map[i]]
保持逻辑寄存器身份，比如 stage 3 -> stage 0：
parent_map  = [6,2,5,0,1,4,3,7]
current_map = [7,4,1,6,5,2,0,3]
old = [
  3d7173dce2d2e8b0,
  0,
  3d7173dce2d2e8b0,
  d48f405ea3e32acd,
  0,
  3d7173dce2d2e8b0,
  87799c3619718d0a,
  eee110c86034e5d2
]
new = [
  d48f405ea3e32acd,
  3d7173dce2d2e8b0,
  0,
  eee110c86034e5d2,
  3d7173dce2d2e8b0,
  0,
  3d7173dce2d2e8b0,
  87799c3619718d0a
]
然后 stage 0 的公共初始化会覆盖逻辑 r7，即覆盖 current_map[7] = 3 对应的 new[3]

metadata 注入：
先修改父逻辑 r6；
再将所有逻辑寄存器搬到 child map；
最后给 child 逻辑 r7 写 stage seed。
```

下面动态验证一次置换方向（stage 3 -> stage 0）

第一处断点在 `0x25D3`，但它停在 `mov r13, [saved_parent_state]` 执行前，`r13 = 父 map 的临时地址`，

```text
pwndbg> x/8gx $r13
0x7fffffffc2f0: 0x0703040100050206      0x0300020506010407
0x7fffffffc300: 0xafcbe49ff4784f30      0xfd0fd406569c67ec
0x7fffffffc310: 0x0000000000000000      0x0000000000000000
0x7fffffffc320: 0x0000000000000000      0x0000000000000000
pwndbg> x/8ub $r14
0x7fffffffc2f8: 7       4       1       6       5       2       0       3
pwndbg> x/8ub $r15
0x7fffffffc2f0: 6       2       5       0       1       4       3       7
```

第二处 `0x2680` 时置换已完成，`r13` 恢复为真正 state：

```text
pwndbg> x/8gx $r13
0x7fffffffc680: 0xd48f405ea3e32acd      0x3d7173dce2d2e8b0
0x7fffffffc690: 0x0000000000000000      0xeee110c86034e5d2
0x7fffffffc6a0: 0x3d7173dce2d2e8b0      0x0000000000000000
0x7fffffffc6b0: 0x3d7173dce2d2e8b0      0x87799c3619718d0a
```

验证正确。

---

OK，万事俱备，~~Codex~~ 按照下面的逻辑（结合之前的结果）写脚本就行：

```text
stage 2/1 的 OR-to-zero
→ 得到六轮 ARX 结束时的 r0..r3
→ 逆 stage 4、5、9、11、6、8
→ 得到 stage 10 刚读入的四个输入 qword
→ little-endian 打包为 31 字节输入
```

输出：

**invert_arx.py**

```python
#!/usr/bin/env python3
"""Analytically invert the six logical ARX rounds of Changing-VM.
No symbolic execution or constraint solver is used.  Every inverse step is
the algebraic inverse of one decoded VM round.
"""
import struct

MASK = (1 << 64) - 1
GOLD = 0x9e3779b97f4a7c15
OUTER_SEED = 0xd48f405ea3e32acd

# Stage order: 8, 6, 11, 9, 5, 4.
ROUNDS = [
    (8,  0x597bb1547c7c9aa1, 0x95175c646455e66a),
    (6,  0x33689714332ce789, 0x29ad97d29c6cfce9),
    (11, 0xc6cd12499a741c5f, 0xd9f7478c1b7af0dd),
    (9,  0xa69189fb74ee4ac5, 0x481fbf3cb6c97dd6),
    (5,  0xf862141e373e67a5, 0xd121b1817551a9a7),
    (4,  0xb7d095a802966df4, 0x7d6f32db6d20cba4),
]

def rol(x, amount):
    return ((x << amount) | (x >> (64 - amount))) & MASK

def keyed(value, anti_debug, count):
    salt = 0x13198a2e03707344 if anti_debug else 0x243f6a8885a308d3
    mixed = value ^ salt ^ ((count * GOLD) & MASK)
    return (rol(mixed, 7 * count + 9) + 0x67756172645f7631) & MASK

def forward_round(words, add_a, add_b):
    """Decoded common stage body, from r0..r3 before the round to after it."""
    r0, r1, r2, r3 = words
    t0 = rol((r2 + add_a) & MASK, 17) ^ r3
    t1 = (rol((r3 + add_b) & MASK, 41) + r2) & MASK
    return (r2, r3, r0 ^ t0, r1 ^ t1)

def inverse_round(words, add_a, add_b):
    """Algebraic inverse of forward_round; no search is involved."""
    end_r0, end_r1, end_r2, end_r3 = words
    old_r2, old_r3 = end_r0, end_r1          # undo the two swaps
    t0 = rol((old_r2 + add_a) & MASK, 17) ^ old_r3
    t1 = (rol((old_r3 + add_b) & MASK, 41) + old_r2) & MASK
    old_r0 = end_r2 ^ t0                     # undo XORs
    old_r1 = end_r3 ^ t1
    return old_r0, old_r1, old_r2, old_r3

def show(label, words):
    print(f"{label:<20}" + " ".join(f"{word:016x}" for word in words))

def main():
    # Stage 11 metadata branch: logical r6 = keyed(r6, anti=0, count=1).
    r6 = keyed(OUTER_SEED, anti_debug=0, count=1)
    print(f"r6 after stage-11 metadata injection = 0x{r6:016x}")

    # Directly from stage 2 and stage 1 OR-to-zero constraints.
    terminal = (
        0x571e0ac0bf43f997,
        0xdcd2daf5efd6078f,
        0x488b6bfc81ef1355,
        r6 ^ 0xbae4ba7cc26ae4b8 ^ 0xe5497b704ac60273,
    )
    show("after stage 4", terminal)

    words = terminal
    for stage, add_a, add_b in reversed(ROUNDS):
        words = inverse_round(words, add_a, add_b)
        show(f"before stage {stage}", words)

    candidate = struct.pack("<4Q", *words)[:31]
    print(f"candidate hex = {candidate.hex()}")
    print(f"candidate ascii = {candidate.decode('ascii')}")

    # Independent forward verification of exactly the six decoded rounds.
    check = words
    for _, add_a, add_b in ROUNDS:
        check = forward_round(check, add_a, add_b)
    assert check == terminal
    print("forward ARX verification: OK")

if __name__ == "__main__":
    main()
```

```text
r6 after stage-11 metadata injection = 0xbae4ba7cc26ae4b8
after stage 4       571e0ac0bf43f997 dcd2daf5efd6078f 488b6bfc81ef1355 e5497b704ac60273
before stage 4      d48832bda12f0907 a18d0a0509999e23 571e0ac0bf43f997 dcd2daf5efd6078f
before stage 5      7b24b01f5783fe60 77c51d571170118b d48832bda12f0907 a18d0a0509999e23
before stage 9      d778b70e22155be0 4fce799a28a4bbd3 7b24b01f5783fe60 77c51d571170118b
before stage 11     a645b0978f587938 61170a36bce7b9e3 d778b70e22155be0 4fce799a28a4bbd3
before stage 6      393838325f71515f 007d303730383039 a645b0978f587938 61170a36bce7b9e3
before stage 8      7535377b67616c66 3472756b346d316b 393838325f71515f 007d303730383039
candidate hex = 666c61677b3735756b316d346b7572345f51715f323838393930383037307d
candidate ascii = flag{75uk1m4kur4_Qq_2889908070}
forward ARX verification: OK
```

flag: `flag{75uk1m4kur4_Qq_2889908070}` 输入验证正确。
