---
title: "ADS 期中复习 · 考前速查"
status: draft
tags: [cs, algorithms, midterm, reference]
created: 2026-11-16
updated: 2026-11-16
sources:
  - "Course notes: Lectures 1–9; see essential-notes.md for conditions and derivations"
---

# ADS 期中复习 · 考前速查

[180 分钟精要](essential-notes.md) · [英文原题自测](practice.md)

最后 5 分钟查条件、方向与边界。下表可作为自备 A4 的摘录底稿；完整解释见主复习稿。

## 1. 树与堆：不变量决定操作

| 结构 | 必记规则 | 成本／计数 |
| --- | --- | --- |
| AVL | 空高 −1；$BF=h_L-h_R$；LL 右旋、RR 左旋、LR 先左后右、RL 先右后左；中间子树转移 | 查增删最坏 log；插入一处≤2 旋，删除可多处。$n_h=1+n_{h-1}+n_{h-2}$：0,1,2,4,7,12,20,33 |
| Splay | Zig；zig-zag 先 x/p 后 x/g；**zig-zig 先 p/g 后 x/p**；访问后 x 到根 | 单次可 N，摊还 log；失败查找伸展最后点。删除根后伸展左树最大，再接右树 |
| RBT | 根／NIL 黑，无红红；每点到 NIL 黑数同。bh 不含自身、含 NIL | $N\ge2^{bh}-1$，$h\le2\log_2(N+1)$；bottom-up 插入≤2 旋，删除≤3 旋；总时间仍 log |
| B+ 阶 M | 非根 $\lceil M/2\rceil..M$ 孩子，非叶根 2..M；本课叶容量也 M；数据在叶、等深、叶链 | 内部 d 孩子 d−1 分隔键，取右子树最小；相等右走。叶分裂复制分隔键。CPU 查 log N、更新 $O((M/\log M)\log N)$；I/O $O(\log_MN)$ |
| Leftist | NPL(null)=−1，叶=0；左 NPL≥右，更新为右+1；唯一孩子在左 | 右路径 r 个真实点，$N\ge2^r-1$；合并／增／删最坏 log，整树高可 N；配对合并建堆 Θ(N) |
| Skew | 合并原右路径，**除最后节点外全部交换**；本课继续处理剩余尾段 | 单次可 N、摊还 log；无 NPL。重 iff $s(R)>s(L)$，势能=重节点数 |
| Binomial | $B_k$ 大小 $2^k$、高／根度 k；孩子阶 k−1..0；每阶至多一树 | ranks=N 的 1 位，根数 popcount(N)；Insert 摊还 1、最坏 log；Merge／DeleteMin 最坏 log；无缓存 FindMin 为 log |

**RBT 插入：**新红 → 父黑停；红叔：父叔黑、祖红上传；黑叔折线先转父，直线父黑祖红转祖；根黑。

**RBT 删除：**看实际移走点的原色。移红无事；移黑补红则黑化；否则补点缺黑。左亏缺时：红兄 → 兄黑父红、父左旋、重取兄；黑兄双黑侄 → 兄红、亏缺上移；近红远黑 → 转兄变远红；远红 → 兄取父色、父远侄黑、父左旋结束。右亏缺镜像。

**B+ 删键：**先更新变化的分隔最小值；下溢先借有余量邻兄弟，否则合并并修父；根仅一孩子则降高。本课 2-3 B+：$L=1+a+2b$，a／b 是二／三孩子内部节点数。

## 2. 摊还与递推：先列式

$$
\widehat c=c+\Delta\Phi,\qquad
\sum c=\sum\widehat c+\Phi_0-\Phi_m.
$$

| 势能 | 一行推导 |
| --- | --- |
| 栈大小 | Push 收 2；Pop／MultiPop 每弹一次消耗一个既有信用；空调用另计常数 |
| Buffer | 最终满：$\Phi=n-C$，每步摊还 2；任意前缀：$\Psi=2n-C+1$，摊还≤3 |
| Splay | $r=\log_2s$、$\Phi=\sum r$；Zig≤1+Δr，zag≤2Δr，zig≤3Δr；访问≤$1+3(r(root)-r(x))$ |
| Skew | $c\le l_1+h_1+l_2+h_2+O(1)$，ΔΦ≤$l_1+l_2-h_1-h_2$；右行经过轻点规模减半 |
| Binomial Insert | i 次 link：c=i+1、ΔΦ=1−i → 摊还 2；N 次 link 总 $N-popcount(N)$ |

初始非空结构要计初势能。Worst-case ≠ amortized ≠ expected。

**主定理：**$T=aT(n/b)+f$，$p=\log_ba$。f 多项式小于 $n^p$ → $n^p$；同阶 → $n^p\log n$；多项式大于且正则 → f。若 $f=n^k\log^qn,q\ge0$，比较 a 与 $b^k$：大取 $n^p$，等多一 log，小取 f。

$$
\begin{aligned}
8T(n/3)+n^2\log n&\to\Theta(n^2\log n),\\
8T(n/2)+n^3\log n&\to\Theta(n^3\log^2n),\\
2T(\sqrt n)+\log n&\to\Theta(\log n\log\log n).
\end{aligned}
$$

精确层比 K<1 根主导，K=1 多一 log，K>1 叶主导；递归树要计叶，代入法要用同一个常数闭合。最近点对：x 均分、维护 y 序、宽 2δ 条带、每点最多后续 7 点 → n log n；每层重排序则 n log²n。

## 3. DP：公式与填表方向

| 题型 | 转移与边界 | 顺序／时间 |
| --- | --- | --- |
| 矩阵链 | $m_{ij}=\min_{i\le k<j}(m_{ik}+m_{k+1,j}+r_{i-1}r_kr_j)$；单矩阵 0 | 长度↑；n³，存 split |
| OBST 成功概率 | $C_{ij}=W_{ij}+\min_{i\le k\le j}(C_{i,k-1}+C_{k+1,j})$；空 0，单键 $p_i$ | 长度↑；前缀和 W；n³，存 root |
| Floyd | $D_{ij}=\min(D_{ij},D_{ik}+D_{kj})$；对角 0、无边 ∞ | **中间点最外**；V³。可负边，负环无有限解 |
| 装配线 | $f_{\ell,j}=a_{\ell,j}+\min(f_{\ell,j-1},f_{1-\ell,j-1}+t_{1-\ell,j-1})$ | j↑；n。含进入／离开；已含加工边权别重复加 |
| 钢条 | $R_n=\max_l(P_l+R_{n-l})$，$1\le l\le\min(n,M)$；$R_0=0$ | n↑；NM |
| LCS | 相同字符左上+1，否则 max(上,左)；空前缀 0 | 行列↑；mn |
| Decode | 单位 dp[i+1]；两位 10..25 再加 dp[i+2]；空后缀 1 | i↓；L。0 可单独，07 不成两位；空输入 API 返回 0 |
| Contest | $dp[s]=\min(dp[s],dp[\max(0,s-score)]+time)$；dp[0]=0，其余∞ | 每题 s↓；nH，伪多项式；不可达 −1 |
| 分段工序 | $F[i,b]=\min_l(F[l-1,b-1]+cost(l,i))$；F[0,0]=(0,0) | 前缀／块数依赖；n³ 或 n²K；最多 K 合并取 b≥n−K，时间／费用按字典序 |

状态必须保留影响未来的信息；依赖成环不能直接制表。求值可滚动不代表路径重建也零空间。最高概率根未必最优；括号方案指数多不代表矩阵链状态也指数多。

## 4. 索引、回溯与贪心：选择题的条件

- **Index：**term→postings；df=文档数、tf=文内次数；AND 交集先小 df，phrase 还需位置。按词分区存部分词全表；按文档分区存部分文档全部词。主／辅助索引都要查，删除标记后合并。
- **Compression：**gap + 变长编码；块重启点支持随机访问；插一个 ID 只改相邻逻辑 gap，但可能搬字节。Hash 不支持廉价范围查；分词、词干规则在查询与建索引时一致；HW3 保留停用词。
- **Metrics：**$P=TP/(TP+FP)$ 找对／找出，$R=TP/(TP+FN)$ 找对／应找出。P 高≠误报绝对数更少。HW3 文档夹角为 $\arccos(\text{点积}/\text{两欧氏范数之积})$，词频非集合，弧度、非零向量。
- **Backtracking：**apply → recurse → undo；只剪掉不可能补全／改进的分支。N 皇后检查列与两斜线；Turnpike 用多重集，最大剩余 d 试 d／L−d，重数完整恢复。
- **α–β：**MAX 更新 α，MIN 更新 β，**α≥β** 剪剩余孩子；界随递归传入。不是只取严格大于。Werewolf：恰 M 狼、L 谎，且 1≤说谎狼<M。
- **Activity：**最多活动数按结束；最少房间按开始 + 最小结束堆；加权活动用 DP。半开区间结束=开始兼容。证明某个最优解可包含选择，不能换成所有最优解。
- **Huffman：**字符在叶、前缀无歧义、正权最优树无单孩子；反复合并两最小，WPL=所有合并权和。频率平局可多解；正权 C≥2 时最长码≤C−1。
- **Fuel：**满箱范围内第一个不贵站 → 只买够到它；全更贵 → 加满去其中最便宜站；保留余油。起点空箱，终点设 0 价；走不了时最远=当前点+满箱范围。
- **Greedy：**安全选择需交换证明；含 1 的币制不一定可贪心，`1,3,4` 凑 6 是反例。

## 5. 代码填空：按不变量补指针／状态

**AVL RR（左旋）：**假设 R=T.right。顺序是 `T.right=R.left; R.left=T;`，先更新 T.height，再更新 R.height，返回 R。LR／RL 是两个单旋组合。

**B+ FindKey：**非叶循环条件 `!isLeaf`；跨过分隔键的条件 `key >= separator[i]`；定位到叶后再检查相等。

```c
/* Leftist Merge: smaller root first. */
if (H1->Element > H2->Element) swap(H1, H2);
if (H1->Left == NULL) H1->Left = H2;
else {
    H1->Right = Merge(H1->Right, H2);
    if (H1->Left->Npl < H1->Right->Npl) SwapChildren(H1);
    H1->Npl = H1->Right->Npl + 1;
}
/* Entry checks for either NULL heap precede this fragment. */
```

**Binomial Insert：**`Carry=CombineTrees(Carry,H->TheTrees[i])`；清槽、i++；空槽后 `H->TheTrees[i]=Carry`。Find 外层先判根槽非空，再 `X>=T->Element`；递归兄弟条件 `T->NextSibling!=NULL`，不能因某兄弟根大而跳过整串。

**Knapsack：**递归 `W-s[i].w*x[i], n, ..., val, r, i+1, ...`；回退 `val-=s[i].p*x[i]`，不是 W−1、n−1 或把 val+r 当已选利润。

**Decode：**两位合法才 `(dp[i+1]+dp[i+2])%BASE`，否则 `dp[i+1]`；加法先扩成 long long。**0–1 DP：**目标 s 倒序，防止本轮重复用同一物品。
