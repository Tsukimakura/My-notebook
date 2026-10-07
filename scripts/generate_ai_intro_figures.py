#!/usr/bin/env python3
"""Reproduce original AI introduction teaching figures (Matplotlib + Pillow).

SVG files preserve editable vector elements; WebP files are website assets.
Requires optional figure-authoring dependencies matplotlib, numpy, Pillow.
"""
from pathlib import Path
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.font_manager import FontProperties
from matplotlib.patches import FancyBboxPatch
from PIL import Image
import numpy as np

DEST = Path(__file__).resolve().parents[1] / 'docs/计算机科学/introduction-to-artificial-intelligence/assets'
FONT = FontProperties(fname='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc')
plt.rcParams.update({'svg.fonttype': 'none', 'font.size': 12, 'figure.facecolor':'white'})
BLUE, TEAL, RED, GRAY = '#2463a0', '#13877e', '#bd4141', '#536476'

def txt(ax,x,y,s,size=12,color=GRAY,**kw):
    return ax.text(x,y,s,ha='center',va='center',fontproperties=FONT,fontsize=size,color=color,**kw)

def box(ax,x,y,s,w=2.5,h=.85,color=BLUE):
    ax.add_patch(FancyBboxPatch((x-w/2,y-h/2),w,h,boxstyle='round,pad=0.06',edgecolor=color,facecolor='#f3f7fb',lw=1.5))
    txt(ax,x,y,s,color=color)

def arrow(ax,a,b,label='',color=GRAY,dashed=False,offset=(0,0)):
    ax.annotate('',xy=b,xytext=a,arrowprops={'arrowstyle':'->','lw':1.8,'color':color,'linestyle':'--' if dashed else '-'})
    if label:txt(ax,(a[0]+b[0])/2+offset[0],(a[1]+b[1])/2+offset[1],label,10,color, bbox={'facecolor':'white','edgecolor':'none','pad':2})

def canvas(w=12,h=6):
    fig,ax=plt.subplots(figsize=(w,h));ax.set(xlim=(0,12),ylim=(0,6));ax.axis('off');return fig,ax

def save(fig,name):
    DEST.mkdir(parents=True,exist_ok=True)
    fig.savefig(DEST/(name+'.svg'),bbox_inches='tight')
    png=DEST/(name+'.png');fig.savefig(png,dpi=160,bbox_inches='tight')
    with Image.open(png) as im:im.convert('RGB').save(DEST/(name+'.webp'),quality=94)
    png.unlink();plt.close(fig)

fig,ax=canvas()
txt(ax,6,5.6,'人工智能：表示问题，计算答案，检验结果',18,BLUE)
for x,y,s in [(2,4.4,'知识与规则\nKnowledge / Rules'),(6,4.4,'数据与模型\nData / Models'),(10,4.4,'环境与反馈\nEnvironment / Feedback')]:box(ax,x,y,s,3)
for x,y,s in [(2,2.8,'逻辑推理与搜索\nReasoning / Search'),(6,2.8,'机器学习与深度学习\nML / Deep Learning'),(10,2.8,'策略学习与博弈\nRL / Games')]:box(ax,x,y,s,3);arrow(ax,(x,3.9),(x,3.3))
box(ax,6,1.1,'应用、系统与算力、伦理与安全贯穿全过程',9,.9,TEAL)
for x in [2,6,10]:arrow(ax,(x,2.3),(x,1.65))
save(fig,'ai-method-map')

fig,ax=canvas()
txt(ax,6,5.6,'图灵机：有限规则控制逐步读、写和移动',18,BLUE)
for i,s in enumerate(['…','1','0','1','□','□','…']):box(ax,2+i*1.3,3.5,s,1.15,.8)
box(ax,4.6,1.5,'有限控制器：当前状态 q',4,.85,TEAL)
arrow(ax,(4.6,2),(4.6,3.05),'读写头',offset=(1.0,0))
txt(ax,8.6,1.5,'δ(q, a) = (q′, b, 移动方向)\n读 a → 写 b → 改状态 → 左/右移',12)
txt(ax,6,4.5,'纸带按需延伸；实际计算只访问有限部分',12)
save(fig,'turing-machine')

fig,ax=canvas()
txt(ax,6,5.6,'家庭知识图谱：已知关系与待推断关系',18,BLUE)
pos={'James':(3,4.2),'David':(9,4.2),'Ann':(3,1.4),'Mike':(9,1.4)}
for name,(x,y) in pos.items():box(ax,x,y,name,1.7,.7)
arrow(ax,(8.1,4.2),(3.9,4.2),'Couple',offset=(0,.25))
arrow(ax,(3,3.75),(3,1.85),'Mother',offset=(-.65,0))
arrow(ax,(3.8,3.85),(8.2,1.8),'Mother',offset=(-.7,0))
arrow(ax,(9,3.75),(9,1.85),'Father',offset=(.65,0))
arrow(ax,(3.9,1.4),(8.1,1.4),'Sibling',offset=(0,-.25))
arrow(ax,(8.2,3.85),(3.8,1.8),'Father ?（待推断）',RED,True,offset=(.7,0))
save(fig,'family-knowledge-graph')

fig,ax=canvas()
txt(ax,6,5.6,'FOIL：先归纳规则，再演绎新事实',18,BLUE)
for x,y,s in [(2.5,4.2,'正例 E+ / 反例 E−\n背景知识 B'),(8.7,4.2,'规则头：Father(x,y)\n初始规则体：True'),(8.7,2.5,'枚举候选文字，计算增益\n选择并加入规则体'),(2.5,2.5,'检查反例覆盖\n仍有反例则继续细化'),(6,0.8,'规则学得后代入 David、Ann、James\n推导 Father(David, Ann)')]:box(ax,x,y,s,4,.95)
arrow(ax,(4.6,4.2),(6.6,4.2));arrow(ax,(8.7,3.65),(8.7,3.05));arrow(ax,(6.6,2.5),(4.6,2.5));arrow(ax,(2.5,1.95),(4.7,1.35),'无反例',offset=(-.8,-.1));arrow(ax,(4.6,2.9),(6.6,2.9),'继续细化',offset=(0,.35))
save(fig,'foil-learning-loop')

fig,ax=canvas()
txt(ax,6,5.6,'贝叶斯网络：联合分布按父节点分解',18,BLUE)
for x,y,s in [(6,4.4,'C：多云 Cloudy'),(3,2.8,'S：洒水车 Sprinkler'),(9,2.8,'R：下雨 Rain'),(6,1.2,'W：路湿 Wet')]:box(ax,x,y,s,3,.75)
for a,b in [((5.1,3.95),(3.8,3.25)),((6.9,3.95),(8.2,3.25)),((3.8,2.35),(5.1,1.65)),((8.2,2.35),(6.9,1.65))]:arrow(ax,a,b)
txt(ax,6,.3,'P(C,S,R,W) = P(C) P(S|C) P(R|C) P(W|S,R)',12)
save(fig,'bayesian-network')

fig,ax=canvas()
txt(ax,6,5.6,'关联结构与因果干预',18,BLUE)
for x,label in [(2,'因果：T → Y'),(6,'混杂：T ← Z → Y'),(10,'碰撞点：T → S ← Y')]:txt(ax,x,4.8,label,12,TEAL)
for x in [2,6,10]:box(ax,x-.9,3.4,'T',.6,.6);box(ax,x+.9,3.4,'Y',.6,.6)
arrow(ax,(1.5,3.4),(2.5,3.4))
box(ax,6,4.15,'Z',.6,.6);arrow(ax,(5.7,3.95),(5.25,3.75));arrow(ax,(6.3,3.95),(6.75,3.75))
box(ax,10,4.15,'S',.6,.6);arrow(ax,(9.25,3.75),(9.7,3.95));arrow(ax,(10.75,3.75),(10.3,3.95))
for x in [3,9]:
 box(ax,x,2.0,'Z',.7,.6);box(ax,x-.9,.8,'X',.7,.6);box(ax,x+.9,.8,'Y',.7,.6)
 arrow(ax,(x+.3,1.7),(x+.7,1.1));arrow(ax,(x-.45,.8),(x+.45,.8))
arrow(ax,(2.7,1.7),(2.3,1.1));txt(ax,3,.1,'观测：Z 影响用药 X 与恢复 Y',10)
arrow(ax,(8.7,1.7),(8.3,1.1),color=RED,dashed=True);txt(ax,8.1,1.5,'×',20,RED);txt(ax,9,.1,'do(X=x)：切断入边，保留 X → Y',10)
save(fig,'causal-structures-and-intervention')

fig,ax=plt.subplots(figsize=(10,5))
labels=['男性','女性','合并观测','统一权重调整'];a=np.array([234/270,55/80,289/350,(234/270)*.51+(55/80)*.49]);b=np.array([81/87,192/263,273/350,(81/87)*.51+(192/263)*.49]);xs=np.arange(4)
ax.bar(xs-.18,a,.36,label='不用药',color=BLUE);ax.bar(xs+.18,b,.36,label='用药',color=TEAL)
ax.set_xticks(xs,labels,fontproperties=FONT);ax.set_ylim(0,1.08);ax.set_ylabel('恢复率',fontproperties=FONT);ax.set_title('辛普森悖论：分层、合并与统一权重调整',fontproperties=FONT,fontsize=17)
for x,v in zip(xs,a):ax.text(x-.18,v+.02,f'{v:.1%}',ha='center',fontsize=11)
for x,v in zip(xs,b):ax.text(x+.18,v+.02,f'{v:.1%}',ha='center',fontsize=11)
ax.legend(prop=FONT);ax.spines[['top','right']].set_visible(False);fig.tight_layout();save(fig,'simpson-reversal')

fig,ax=canvas()
txt(ax,6,5.6,'状态图与搜索树：一个状态可以对应多个节点',18,BLUE)
for x,y,s in [(1.5,3.7,'A'),(3.7,4.5,'B'),(3.7,2.9,'C'),(5.5,3.7,'G')]:box(ax,x,y,s,.7,.6)
for a,b,l in [((1.9,3.85),(3.3,4.35),'1'),((1.9,3.55),(3.3,3.05),'2'),((4.1,4.35),(5.1,3.85),'5'),((4.1,3.05),(5.1,3.55),'1')]:arrow(ax,a,b,l,offset=(0,.12))
txt(ax,3,1.8,'同一目标状态 G\nA→B→G：代价 6\nA→C→G：代价 3',12)
for x,y,s in [(9,4.6,'A'),(7.7,3.3,'B'),(10.3,3.3,'C'),(7.7,2,'G'),(10.3,2,'G')]:box(ax,x,y,s,.7,.6)
for a,b in [((8.7,4.25),(7.9,3.65)),((9.3,4.25),(10.1,3.65)),((7.7,2.95),(7.7,2.35)),((10.3,2.95),(10.3,2.35))]:arrow(ax,a,b)
txt(ax,9,1,'两个 G 节点的父节点、路径和 g 值不同',11)
save(fig,'state-graph-and-search-tree')
print('Generated 8 SVG sources and 8 WebP figures.')
