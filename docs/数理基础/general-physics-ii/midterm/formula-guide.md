---
title: "期中公式速解 · 卷内公式与必备补充"
status: draft
tags: [math-physics, physics, midterm, formulas]
created: 2026-11-10
updated: 2026-11-10
sources:
  - "2023 midterm formula-sheet image supplied by the user, printed p. 2"
  - "General Physics II lectures 1–14 and classroom explanations; see ../source-map.md"
---

# 期中公式速解 · 卷内公式与必备补充

[期中目录](index.md) · [真题解答](solutions-2023.md) · [知识精要](essential-notes.md)

按计算题中选定律、建方程、求结果的通用性由高到低排列。**卷内**为图片中的 31 条关系；**补充**为未印出的常用公式。$q$ 带正负号；$e>0$，电子电荷为 $-e$。未注明介质时使用真空参数。

**原卷印错：**磁能密度应为 $u_B=B^2/(2\mu_0)$，不是 $\mu_0B^2/2$。

## 1. 电场、电势与电荷积分

| 来源 | 公式 | 含义、条件与符号 |
| --- | --- | --- |
| 卷内 | $\mathbf E=\dfrac{q}{4\pi\epsilon_0r^2}\hat{\mathbf r}$ | 静止点电荷的电场；$r$ 从源电荷量到场点，$\hat{\mathbf r}$ 沿此方向。$\epsilon_0$ 为真空介电常数；$q<0$ 时场反向。 |
| 卷内 | $\epsilon_0\oint_S\mathbf E\cdot d\mathbf A=q_{\rm enc}$ | 高斯定律：闭面向外电通量由面内净电荷决定；只有足够对称时才能把 $E$ 提到积分外。$q_{\rm enc}=0$ 不代表 $\mathbf E=0$。 |
| 卷内 | $V_f-V_i=-\int_i^f\mathbf E\cdot d\boldsymbol\ell$ | 静电场中沿 $i\to f$ 积分求电势差；顺电场方向电势降低。$V$ 单位 V，$E$ 单位 V/m。 |
| 卷内 | $\mathbf E=-\nabla V$ | 电势求电场；例如 $E_x=-\partial V/\partial x$。时变磁场产生的电场不能只用此式描述。 |
| 卷内 | $\nabla\cdot\mathbf E=\rho_q/\epsilon_0$ | 高斯定律的局部形式；$\rho_q$ 是体电荷密度，单位 C/m³，含自由与束缚电荷，**不是电阻率**。 |
| 补充 | $dq=\lambda\,dl,\quad dq=\sigma_s\,dA,\quad dq=\rho_q\,d\mathcal V$ | 线、面、体电荷微元；$\lambda,\sigma_s,\rho_q$ 分别为每米、每平方米、每立方米的电荷。$d\mathcal V$ 表示体积微元。 |
| 补充 | $k_e=1/(4\pi\epsilon_0),\quad V=k_e\int dq/r,\quad \mathbf E=k_e\int\hat{\mathbf r}\,dq/r^2$ | 连续源叠加：电势按标量相加，电场按矢量相加；$r$ 随源点变化。电势式取无穷远为零，要求积分收敛。 |
| 补充 | $\Delta U=q\Delta V,\quad W_E=-q\Delta V$ | 电势能变化与电场做功；缓慢移动、动能不变时，外力做功 $W_{\rm ext}=\Delta U$；保守力满足 $\mathbf F=-\nabla U$。 |
| 补充 | $\nabla\times\mathbf E=0,\quad \nabla^2V=-\rho_q/\epsilon_0$ | 静电场无环流；后一式由 $\mathbf E=-\nabla V$ 和高斯定律合成。无电荷区为 $\nabla^2V=0$。 |

### 常用几何结果 · 均为补充

| 源或积分微元 | 结果与适用范围 |
| --- | --- |
| 球面与球层 | $A=4\pi r^2$；纬度条带 $dA=2\pi R^2\sin\theta\,d\theta$；球体薄层 $d\mathcal V=4\pi r^2dr$。$\theta$ 从极轴量起。 |
| 均匀球壳；无外部源的孤立导体球 | 半径 $R$、总电荷 $Q$：内部 $E=0,V=k_eQ/R$；外部 $E_r=k_eQ/r^2,V=k_eQ/r$。 |
| 均匀体带电绝缘球 | $r<R$ 时 $E_r=k_eQr/R^3$；外部仍为点电荷结果。不能套用球壳的内部零场。 |
| 无限长线电荷 | $E_r=\lambda/(2\pi\epsilon_0r)$；$r$ 为到轴距离。电势只能选有限参考半径：$\Delta V=-\lambda\ln(r_2/r_1)/(2\pi\epsilon_0)$。 |
| 无限大均匀面电荷 | 两侧场大小各为 $\lvert\sigma_s\rvert/(2\epsilon_0)$。两张等量异号平行面之间为 $\lvert\sigma_s\rvert/\epsilon_0$，外侧抵消。 |
| 均匀圆环轴线 | $V=k_eQ/\sqrt{R^2+z^2}$；$E_z=k_eQz/(R^2+z^2)^{3/2}$。$R$ 为环半径，$z$ 从环心沿轴量起。 |
| 均匀圆盘轴线 | 圆环微元 $dq=\sigma_s2\pi s\,ds$；$z>0$ 时 $E_z=\dfrac{\sigma_s}{2\epsilon_0}\left(1-\dfrac z{\sqrt{z^2+R^2}}\right)$。$s$ 是积分环半径，$R$ 是圆盘外半径。 |

## 2. 导体、电容、电阻与放电

| 来源 | 公式 | 含义、条件与符号 |
| --- | --- | --- |
| 补充 | $\mathbf E_{\rm metal}=0,\quad V_{\rm metal}=V_c$ | 静电平衡时金属内部无场、连通导体等势。孤立导体固定总电荷；接地导体固定 $V_c=0$、允许交换电荷。载流或运动导体不直接套此条件。 |
| 补充 | $E_{\rm out,n}=\sigma_s/\epsilon_0$ | 导体表面外侧的法向场，法向由金属朝外，外部为真空；表面切向场为零。 |
| 补充 | $q'=-qR/d,\quad a=R^2/d$ | 接地球半径 $R$，外部点电荷 $q$ 距球心 $d>R$：镜像 $q'$ 放在球心朝向 $q$ 的距离 $a$ 处。只代表球外区域；球面总感应电荷等于 $q'$。 |
| 补充 | $C=Q/\Delta V,\quad C_{\rm plate}=\epsilon A/d,\quad C_{\rm sphere}=4\pi\epsilon ab/(b-a)$ | $C$ 为电容，单位 F；$Q$ 为正极板电荷大小。平行板忽略边缘；同心球形电容内、外半径为 $a<b$。$\epsilon=\epsilon_0\epsilon_r$。 |
| 补充 | $C_{\rm isolated\ sphere}=4\pi\epsilon R$ | 无外部源、半径 $R$ 的孤立导体球相对于无穷远的电容；不同于两个球面组成的电容器。 |
| 卷内 | $\rho_{\rm res}=1/\sigma=m_e/(ne^2\tau_{\rm coll})$ | 电阻率，单位 Ω·m；$\sigma$ 是电导率，单位 S/m。Drude 模型中 $n$ 为电子数密度，$m_e$ 为电子质量，$\tau_{\rm coll}$ 为平均散射间隔。 |
| 卷内 | $\mathbf E=\rho_{\rm res}\mathbf J$ | 静止、线性、各向同性欧姆材料的局部关系；等价于 $\mathbf J=\sigma\mathbf E$。$\mathbf J$ 为电流密度，单位 A/m²。 |
| 补充 | $\mathbf J=nq_c\mathbf v_d,\quad I=\int\mathbf J\cdot d\mathbf A$ | $q_c$ 是单个载流子的带符号电荷，$\mathbf v_d$ 为平均漂移速度。均匀垂直截面上 $I=JA$；电子漂移与正电流反向。 |
| 补充 | $\mathbf v_d=-e\tau_{\rm coll}\mathbf E/m_e,\quad\partial_t\rho_q+\nabla\cdot\mathbf J=0$ | 前者为稳态自由电子 Drude 漂移；后者为局部电荷守恒：电流净流出使当地电荷减少。 |
| 补充 | $R=\rho_{\rm res}l/A,\quad dR=dr/[\sigma A(r)]$ | 第一式用于均匀等截面导线；变截面沿电流方向积 $R=\int dR$。球形径向导电用 $A(r)=4\pi r^2$，不能用固定截面积。 |
| 卷内 | $\mathcal E=dW/dq$ | 电动势：电源等非静电作用每单位电荷提供的能量，单位 V；不是“力”，也不必等于电源端电压。 |
| 补充 | $\Delta V=IR,\quad \sum I_{\rm in}=\sum I_{\rm out},\quad \sum\Delta V_{\rm loop}=0$ | 欧姆定律、节点与集中参数回路方程；若有外加感应电动势，须作为回路电源项计入。电阻串联相加、并联加倒数；电容相反。 |
| 卷内 | $P=I^2R$ | 电阻焦耳热功率，单位 W；也可用 $P=I\Delta V=(\Delta V)^2/R$。这里的 $I$ 必须是流过该电阻的电流。 |
| 卷内 | $U_C=Q^2/(2C)$ | 线性电容储能，单位 J；等价于 $U_C=C(\Delta V)^2/2=Q\Delta V/2$。 |
| 卷内 | $u_E=\epsilon_0E^2/2$ | 真空电场能密度，单位 J/m³；总能量 $U_E=\int u_E\,d\mathcal V$。线性、无色散介质改用 $\epsilon E^2/2$。 |
| 补充 | $I_C=dQ/dt=C\,dV_C/dt,\quad V_C(0^+)=V_C(0^-)$ | 电流正方向取流入正极板；有限电流下电容电压不能突变。若定义放电流向外，则 $I_{\rm out}=-dQ/dt$。 |
| 补充 | $X(t)=X_\infty+(X_0-X_\infty)e^{-t/\tau_{RC}},\quad\tau_{RC}=R_{\rm eq}C$ | 一阶 RC 响应；$X$ 可取电容电压或电荷。$R_{\rm eq}$ 是电容两端看到的等效电阻：独立电压源短路、独立电流源开路。 |
| 补充 | $Q=Q_0e^{-t/(RC)},\quad RC=\epsilon/\sigma$ | 后一个等式用于均匀介质同时承担漏电与储能的理想电容。能量、功率按 $e^{-2t/(RC)}$ 衰减。 |
| 卷内 | $R_H=E_H/(BJ)=1/(nq_c)$ | 单载流子 Hall 系数；取 $\mathbf J\parallel+x,\mathbf B\parallel+z$，$E_H=E_y$。符号反映载流子正负；稳态横向平衡为 $\mathbf E_H+\mathbf v_d\times\mathbf B=0$。矩形样品沿磁场方向厚度为 $t$ 时，Hall 电压大小为 $\lvert V_H\rvert=\lvert IB/(nq_ct)\rvert$。 |

## 3. 磁力、运动与电流产生的磁场

| 来源 | 公式 | 含义、条件与符号 |
| --- | --- | --- |
| 卷内 | $\mathbf F=q\mathbf E+q\mathbf v\times\mathbf B$ | Lorentz 力；先对正电荷判断叉乘，再乘带符号的 $q$。磁力垂直速度，不做功；电场功率为 $q\mathbf E\cdot\mathbf v$。 |
| 卷内 | $\mathbf F_B=I\mathbf L\times\mathbf B$ | 匀强磁场内直导线受力；$\mathbf L$ 沿正电流、长度等于导线段长度。一般用 $d\mathbf F=I\,d\boldsymbol\ell\times\mathbf B$ 再积分。 |
| 补充 | $r_L=mv_\perp/(\lvert q\rvert B),\quad\omega_c=\lvert q\rvert B/m$ | 非相对论粒子在匀强磁场中的回旋半径、角频率。$v_\parallel$ 不产生磁力，沿场匀速；螺距为 $v_\parallel T$。 |
| 卷内 | $\omega=2\pi/T$ | 角频率，单位 rad/s；$T$ 为周期，$f=1/T$ 为频率，单位 Hz。刚体转动的线速度为 $v=\omega r_\perp$。 |
| 补充 | $\mathbf v_D=\mathbf E\times\mathbf B/B^2$ | 匀强、相互垂直的交叉场中的平均漂移速度；不是粒子的瞬时速度，与电荷正负无关。无受力直线运动还允许任意沿 $\mathbf B$ 的恒定速度分量。 |
| 卷内 | $d\mathbf B=\dfrac{\mu_0}{4\pi}\dfrac{I\,d\boldsymbol\ell\times\hat{\mathbf r}}{r^2}$ | Biot–Savart 定律；稳恒电流产生磁场，$\hat{\mathbf r}$ 从电流元指向场点。先找对称性，再积分未抵消的分量。 |
| 卷内 | $\oint\mathbf B\cdot d\boldsymbol\ell=\mu_0I_{\rm enc}$ | 静磁 Ampère 定律；正绕行与穿面正电流按右手定则配对。只在足够对称时直接提出 $B$；变化电通量时须加位移电流项。 |
| 卷内 | $\oint_S\mathbf B\cdot d\mathbf A=0$ | 任意闭面净磁通为零；穿入与穿出抵消，不代表面上处处 $B=0$。 |
| 卷内 | $\nabla\cdot\mathbf B=0$ | 上式的局部形式：磁场无净磁单极源。 |
| 卷内 | $\boldsymbol\mu=NI\mathbf A$ | 线圈磁矩，单位 A·m²；$\mathbf A=A\hat{\mathbf n}$，法向由电流右手定则确定，$N$ 为匝数。分布电流分成小环，用 $d\mu=A_{\rm ring}\,dI$。 |
| 卷内 | $\boldsymbol\tau_B=\boldsymbol\mu\times\mathbf B$ | 外磁场对磁偶极子的力矩，单位 N·m；不是粒子的平移受力。$\tau_B=\mu B\sin\theta$，$\theta$ 为磁矩与场的夹角。 |

### 常用磁场与环积分 · 均为补充

| 情形 | 公式与条件 |
| --- | --- |
| 无限长直导线 | $B=\mu_0I/(2\pi r)$；$r$ 为到导线的距离，方向绕线。 |
| 圆线圈轴线 | $B_z=\mu_0NIR^2/[2(R^2+z^2)^{3/2}]$；环心 $z=0$，才可化为 $\mu_0NI/(2R)$。 |
| 长螺线管；理想环形线圈 | 内部 $B\simeq\mu_0n_tI$；环形线圈内部 $B=\mu_0NI/(2\pi r)$。$n_t=N/l$ 为每米匝数，不是载流子密度。 |
| 旋转电荷环 | $dI=dq/T=\omega\,dq/(2\pi)$；先算电荷微元，再转成电流微元。磁矩乘环围成的平面面积，不乘球面条带面积。 |

## 4. 感应、电感与能量转化

| 来源 | 公式 | 含义、条件与符号 |
| --- | --- | --- |
| 补充 | $\Phi_B=\int_S\mathbf B\cdot d\mathbf A$ | 磁通，单位 Wb；均匀场和平面用 $BA\cos\theta$，$\theta$ 是场与面积法向的夹角。$N$ 匝等效线圈的磁通链为 $\Lambda=N\Phi_B$。 |
| 卷内 | $\oint\mathbf E\cdot d\boldsymbol\ell=-\dfrac d{dt}\int_S\mathbf B\cdot d\mathbf A$ | 固定回路的 Faraday 定律；变化磁通对应有环流的电场。正绕行与面积法向按右手配对，负号表示反对磁通变化。 |
| 补充 | $\mathcal E=\oint(\mathbf E+\mathbf u\times\mathbf B)\cdot d\boldsymbol\ell$ | 运动回路中每单位电荷的驱动力积分，$\mathbf u$ 是导体材料速度。单段运动导体取相应路径积分；不能只看圆盘自身磁通是否变化。 |
| 补充 | $\mathcal E_{\rm rod}=Blv,\quad\mathcal E_{\rm disk}=B\omega a^2/2$ | 前者要求杆、速度、磁场互相垂直；后者为半径 $a$ 的匀速圆盘、$\mathbf B\parallel\boldsymbol\omega$，沿**盘心到盘边**积分 $\int_0^aB\omega r\,dr$。 |
| 卷内 | $L=N\Phi_B/I$ | 自感，单位 H；自身电流产生的磁通链除以电流。几何固定、线性响应时 $L$ 为常数。 |
| 补充 | $\mathcal E_L=-L\dot I,\quad V_L=L\dot I$ | 前者是反对电流变化的自感电动势；后者按电流流入电压正端的被动约定定义端电压。有限电压下电感电流连续。 |
| 卷内 | $M=N_2\Phi_{21}/I_1$ | 互感，单位 H；$\Phi_{21}$ 为电流 $I_1$ 在第 2 线圈每匝产生的磁通。绕向决定代数符号；感应电动势 $\mathcal E_2=-M\dot I_1$。 |
| 卷内 | $U_L=LI^2/2$ | 线性电感储能。两个互感线圈为 $U=\tfrac12L_1I_1^2+\tfrac12L_2I_2^2+MI_1I_2$，$M$ 与电流正向必须一致。 |
| 卷内·更正 | $u_B=B^2/(2\mu_0)$ | 真空磁能密度，单位 J/m³；线性、无色散磁介质为 $B^2/(2\mu)$。总能量须再对体积积分。 |
| 补充 | $L\dot I+RI=\mathcal E,\quad\tau_{RL}=L/R$ | 串联 RL 一阶回路；恒定电源时 $I_\infty=\mathcal E/R$，$I=I_\infty+(I_0-I_\infty)e^{-t/\tau_{RL}}$。 |
| 补充 | $\boldsymbol\tau=\int\mathbf r\times d\mathbf F,\quad\mathcal I\dot\omega=\tau_{\rm net},\quad P_{\rm mech}=\tau\omega$ | 求转动力矩要乘力臂；$\mathcal I$ 是转动惯量，不是电流。圆盘 $\mathcal I=ma^2/2$；磁制动常先用 $\tau_{\rm ext}\omega=I^2R$ 求维持匀速所需力矩。 |

## 5. LC、RLC 与交流

| 来源 | 公式 | 含义、条件与符号 |
| --- | --- | --- |
| 卷内 | $\omega_0=1/\sqrt{LC}$ | 理想 LC 固有角频率；由 $L,C$ 决定，不由初始振幅决定。$q=q_m\cos(\omega_0t+\phi_0)$，取电流流入所标极板时 $I=\dot q$。 |
| 补充 | $L\ddot q+R\dot q+q/C=\mathcal E(t)$ | 串联 RLC 方程，取 $I=\dot q$。无源欠阻尼时 $q\propto e^{-Rt/(2L)}\cos(\omega_dt+\phi)$，$\omega_d=\sqrt{1/(LC)-(R/2L)^2}$。 |
| 补充 | $R_c=2\sqrt{L/C}$ | 无源串联 RLC 的临界电阻；$0<R<R_c$ 衰减振荡，$R=R_c$ 临界阻尼，$R>R_c$ 无振荡。 |
| 补充 | $Z_R=R,\quad Z_L=j\omega L,\quad Z_C=1/(j\omega C)$ | 复阻抗，单位 Ω，$j^2=-1$；串联相加，并联加倒数。用于正弦稳态，不直接描述刚接通的瞬态。 |
| 补充 | $Z=R+jX,\quad X=\omega L-1/(\omega C),\quad I_m=V_m/\sqrt{R^2+X^2}$ | 串联 RLC 电流峰值。$X>0$ 感性、电流滞后；$X<0$ 容性、电流超前。 |
| 补充 | $I(t)=I_m\cos(\omega t-\phi),\quad\tan\phi=X/R$ | 电源取 $V_m\cos\omega t$，$R>0$。共振时 $X=0,\omega=\omega_0$，电流同相且幅度最大。 |
| 补充 | $I_{\rm rms}=I_m/\sqrt2,\quad\langle P\rangle=I_{\rm rms}^2R=I_m^2R/2$ | 正弦交流的有效值与电阻平均功率；电压有效值同理。一般还可用 $V_{\rm rms}I_{\rm rms}\cos\phi$。 |
| 补充 | $\Delta\omega=R/L,\quad Q_{\rm qual}=\omega_0L/R$ | 串联 RLC 电流共振的半功率带宽与品质因数；这里 $Q_{\rm qual}$ 不是电荷。 |

## 6. Maxwell 方程与电磁波

| 来源 | 公式 | 含义、条件与符号 |
| --- | --- | --- |
| 卷内 | $\nabla\times\mathbf E=-\partial\mathbf B/\partial t$ | Faraday 定律的局部形式：变化磁场对应电场环流。右侧是局部偏导，不是粒子运动的导数。 |
| 卷内 | $\nabla\times\mathbf B=\mu_0\mathbf J+\mu_0\epsilon_0\partial\mathbf E/\partial t$ | 真空形式的 Ampère–Maxwell 定律；$\mathbf J$ 为总物质电流密度，后一项为电场变化的贡献。 |
| 补充 | $\oint\mathbf B\cdot d\boldsymbol\ell=\mu_0(I_{\rm enc}+\epsilon_0\,d\Phi_E/dt)$ | 固定回路的积分形式。真空间隙中位移电流 $I_d=\epsilon_0\,d\Phi_E/dt$；它不是电荷穿越真空的电流。 |
| 补充 | $c=1/\sqrt{\mu_0\epsilon_0},\quad c=f\lambda_{\rm wave},\quad k_{\rm wave}=2\pi/\lambda_{\rm wave}=\omega/c$ | 真空波速、波长、波数；$k_{\rm wave}$ 不是真空库仑常数 $k_e$。$\cos(kx-\omega t)$ 向 $+x$ 传播，正号则向 $-x$。 |
| 补充 | $\mathbf B=\hat{\mathbf k}\times\mathbf E/c,\quad B_m=E_m/c$ | 单一真空平面行波；$\hat{\mathbf k}$ 为传播方向。电、磁场同相且互相垂直，$\mathbf E\times\mathbf B$ 指向传播方向。 |
| 补充 | $\mathbf S=\mathbf E\times\mathbf B/\mu_0,\quad\langle S\rangle=\epsilon_0cE_m^2/2$ | Poynting 矢量是能流密度，单位 W/m²；后一式为正弦真空平面行波的平均强度，$E_m$ 是峰值。 |
| 补充 | $\partial_t(u_E+u_B)+\nabla\cdot\mathbf S=-\mathbf J\cdot\mathbf E$ | 真空形式的局部能量守恒；$\mathbf J\cdot\mathbf E$ 是单位体积物质获得的电功率。平面行波中 $u_E=u_B$。 |
| 补充 | $p_{\rm abs}=\langle S\rangle/c,\quad p_{\rm refl}=2\langle S\rangle/c$ | 正入射、完全吸收或理想镜面反射的平均辐射压；受光面积 $A$ 上平均法向力 $F=pA$。 |

## 7. 偶极子与材料响应

| 来源 | 公式 | 含义、条件与符号 |
| --- | --- | --- |
| 卷内 | $\mathbf p=q\mathbf d$ | 电偶极矩，单位 C·m；两电荷为 $\pm q$、$q>0$，$\mathbf d$ 从负电荷指向正电荷。 |
| 卷内 | $\boldsymbol\tau_E=\mathbf p\times\mathbf E$ | 外电场对电偶极子的力矩；均匀场中合力为零，但力矩可不为零。$\tau_E=pE\sin\theta$。 |
| 补充 | $U_p=-\mathbf p\cdot\mathbf E,\quad U_\mu=-\boldsymbol\mu\cdot\mathbf B$ | 固定偶极矩在外场中的取向势能；顺场能量最低。 |
| 补充 | $V_p\simeq k_e\mathbf p\cdot\hat{\mathbf r}/r^2,\quad\mathbf E_p\simeq\dfrac{k_e}{r^3}[3(\mathbf p\cdot\hat{\mathbf r})\hat{\mathbf r}-\mathbf p]$ | 点电偶极子的远场；真实双电荷需 $r\gg d$，$r$ 从偶极中心量起。 |
| 补充 | $\mathbf D=\epsilon_0\mathbf E+\mathbf P,\quad\oint\mathbf D\cdot d\mathbf A=Q_{\rm free,enc}$ | $\mathbf P$ 是单位体积电偶极矩，$\mathbf D$ 的通量只数自由电荷；两者单位均为 C/m²。线性各向同性材料中 $\mathbf D=\epsilon\mathbf E$。 |
| 补充 | $\rho_b=-\nabla\cdot\mathbf P,\quad\sigma_b=\mathbf P\cdot\hat{\mathbf n}$ | 极化产生的体、面束缚电荷密度；法向 $\hat{\mathbf n}$ 朝介质外。$\mathbf P=\epsilon_0(\epsilon_r-1)\mathbf E$ 另要求线性各向同性。 |
| 补充 | $\mathbf H=\mathbf B/\mu_0-\mathbf M,\quad\mathbf M=\chi_m\mathbf H,\quad\mu=\mu_0(1+\chi_m)$ | $\mathbf M$ 为单位体积磁矩，$\mathbf H,\mathbf M$ 单位 A/m；后两式要求线性各向同性。$\mathbf M$ 不是互感 $M$。 |
| 补充 | $M=n_a\mu_a\tanh[\mu_aB/(k_BT)]\simeq n_a\mu_a^2B/(k_BT)$ | 课件独立两态磁矩模型；$n_a$ 为原子数密度，$\mu_a$ 为单个磁矩。近似要求 $\mu_aB\ll k_BT$，$T$ 必须用 K；固定弱场时温度加倍，$M$ 减半。不能套用于完整铁磁磁滞回线。 |

## 8. 常数与单位

| 量 | 数值与识别 |
| --- | --- |
| 卷内：元电荷大小 $e$ | $1.6\times10^{-19}\ \mathrm C$；电子带 $-e$。 |
| 卷内：电子质量 $m_e$ | $0.91\times10^{-30}\ \mathrm{kg}=9.1\times10^{-31}\ \mathrm{kg}$。 |
| 卷内：Boltzmann 常数 $k_B$ | $1.38\times10^{-23}\ \mathrm{J/K}$；$k_BT$ 是热运动能量尺度。 |
| 卷内：真空介电常数 $\epsilon_0$ | $8.85\times10^{-12}\ \mathrm{F/m}$；等价于 $\mathrm{C^2/(N\,m^2)}$。 |
| 卷内：真空磁导率 $\mu_0$ | 按课内近似取 $4\pi\times10^{-7}\ \mathrm{H/m}$；等价于 $\mathrm{T\,m/A}$。 |
| 补充：$k_e,c$ | $k_e\approx8.99\times10^9\ \mathrm{N\,m^2/C^2}$；$c\approx3.00\times10^8\ \mathrm{m/s}$。 |
| 单位换算 | $1\ \mathrm V=1\ \mathrm{J/C}$；$1\ \Omega=1\ \mathrm{V/A}$；$1\ \mathrm{Wb}=1\ \mathrm{T\,m^2}$；$1\ \mathrm H=1\ \mathrm{Wb/A}$。 |
