#!/usr/bin/env python3
"""Reproduce lecture-four AI search figures (Matplotlib, NumPy, Pillow).

SVG sources remain editable; WebP files are used by the notes.
"""
from pathlib import Path
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.font_manager import FontProperties
from matplotlib.patches import FancyBboxPatch, Circle, Rectangle
from PIL import Image
import numpy as np

DEST = Path(__file__).resolve().parents[1] / 'docs/计算机科学/introduction-to-artificial-intelligence/assets'
FONT = FontProperties(fname='/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc')
plt.rcParams.update({'svg.fonttype': 'none', 'figure.facecolor': 'white'})
BLUE, TEAL, RED, GRAY = '#2463a0', '#13877e', '#bd4141', '#536476'

def txt(ax,x,y,s,size=12,color=GRAY,**kw):
    return ax.text(x,y,s,ha='center',va='center',fontproperties=FONT,fontsize=size,color=color,**kw)

def box(ax,x,y,s,w=2.5,h=.8,color=BLUE):
    ax.add_patch(FancyBboxPatch((x-w/2,y-h/2),w,h,boxstyle='round,pad=0.06',edgecolor=color,facecolor='#f3f7fb',lw=1.5))
    txt(ax,x,y,s,color=color)

def arrow(ax,a,b,color=GRAY):
    ax.annotate('',xy=b,xytext=a,arrowprops={'arrowstyle':'->','lw':1.8,'color':color})

def canvas(w=12,h=7):
    fig,ax=plt.subplots(figsize=(w,h));ax.set(xlim=(0,12),ylim=(0,7));ax.axis('off');return fig,ax

def save(fig,name):
    DEST.mkdir(parents=True,exist_ok=True)
    fig.savefig(DEST/(name+'.svg'),bbox_inches='tight')
    png=DEST/(name+'.png');fig.savefig(png,dpi=160,bbox_inches='tight')
    with Image.open(png) as im:im.convert('RGB').save(DEST/(name+'.webp'),quality=94)
    png.unlink();plt.close(fig)

# Original course graph; all edges are undirected.
POS={'A':(1.2,4.8),'B':(2.8,5.8),'C':(4.3,4.9),'D':(1.2,3.1),
     'E':(3.1,3.6),'F':(2.5,1.5),'G':(5.3,1.2),'H':(6.3,3.3),
     'I':(6.3,5.3),'J':(8.6,4.2),'K':(8.2,2.2),'L':(10.3,1.2)}
EDGES=[('A','B',5),('B','C',5),('A','D',3),('A','E',6),('D','F',4),
       ('E','I',7),('I','J',5),('E','H',4),('H','J',7),('J','K',3),
       ('E','G',3),('H','G',3),('F','G',4),('G','K',5),('K','L',6)]
HEURISTIC=dict(zip('ABCDEFGHIJKL',[13,10,6,12,7,8,5,3,6,3,0,6]))
fig,ax=canvas();txt(ax,6,6.7,'课堂交通图：贪婪路线 20，A* 最短路线 14',18,BLUE)
for a,b,c in EDGES:
    x,y=POS[a];u,v=POS[b]
    color=TEAL if {a,b} in [{'A','E'},{'E','G'},{'G','K'}] else GRAY
    ax.plot([x,u],[y,v],color=color,lw=3 if color==TEAL else 1.3,zorder=1)
    txt(ax,(x+u)/2,(y+v)/2,str(c),11,color,bbox={'facecolor':'white','edgecolor':'none','pad':2})
for a,(x,y) in POS.items():
    ax.add_patch(Circle((x,y),.24,facecolor='#eef5fb',edgecolor=BLUE,lw=1.5,zorder=3));txt(ax,x,y,a,12,BLUE,zorder=4)
    txt(ax,x+.1,y-.44,f'h={HEURISTIC[a]}',10)
txt(ax,6,.25,'绿色：A → E → G → K；贪婪：A → E → H → J → K',12,TEAL)
save(fig,'lecture-04-road-search')

# Full course minimax tree, evaluated left-to-right; pruned leaves are marked.
fig,ax=canvas(13,7)
ax.set_xlim(-.3,12.3)
txt(ax,6,6.7,'Alpha–Beta：根值保持为 3，部分叶子无需访问',18,BLUE)
levels=[[(6,5.7,'MAX=3')],[(3,4.5,'MIN=3'),(9,4.5,'MIN≤2')],
        [(1.5,3.3,'MAX=3'),(4.5,3.3,'MAX≥13'),(7.5,3.3,'MAX≤2'),(10.5,3.3,'剪去')],
        [(0.7,2.1,'MIN=3'),(2.3,2.1,'MIN≤2'),(3.7,2.1,'MIN=13'),(5.3,2.1,'剪去'),(7.5,2.1,'MIN≤2'),(9.7,2.1,'剪去'),(11.3,2.1,'剪去')]]
for k,items in enumerate(levels):
    for x,y,s in items:box(ax,x,y,s,1.2,.48,RED if s=='剪去' else BLUE)
for a,b in [(levels[0][0],v) for v in levels[1]]+[(levels[1][i//2],v) for i,v in enumerate(levels[2])]+[(levels[2][i],levels[3][j]) for i,js in enumerate([[0,1],[2,3],[4],[5,6]]) for j in js]:
    arrow(ax,(a[0],a[1]-.3),(b[0],b[1]+.3),RED if b[2]=='剪去' else GRAY)
leaf_groups=[[(.35,3), (1.05,20)],[(1.95,2),(2.65,10)],[(3.7,13)],[(4.95,22),(5.65,1)],[(7.15,2),(7.85,10)],[(9.35,2),(10.05,5)],[(11.3,3)]]
pruned={2.65,4.95,5.65,7.85,9.35,10.05,11.3}
for node,group in zip(levels[3],leaf_groups):
    for x,val in group:
        arrow(ax,(node[0],1.8),(x,1.25),RED if x in pruned else GRAY)
        box(ax,x,1,str(val)+(' ×' if x in pruned else ''),.58,.42,RED if x in pruned else TEAL)
txt(ax,6,.3,'左至右访问 3、20、2、13、2；× 表示剪去的叶子',12)
save(fig,'lecture-04-alpha-beta')

fig,ax=plt.subplots(figsize=(10,5));n=np.array([50,5,50]);means=np.array([.25,.6,.6]);bonus=np.sqrt(2*np.log(n.sum())/n)
x=np.arange(3)
ax.errorbar(x,means,yerr=bonus,fmt='o',capsize=9,color=BLUE,ecolor=TEAL,lw=2)
for i,(m,b) in enumerate(zip(means,bonus)):
    ax.text(i+.08,m+b,f'UCB={m+b:.3f}',fontsize=11)
ax.set_xticks(x,['动作 1：N=50','动作 2：N=5','动作 3：N=50'],fontproperties=FONT)
ax.set_ylabel('样本均值 ± 探索项',fontproperties=FONT);ax.set_title('相同均值，少访问的动作拥有更大的探索奖励',fontproperties=FONT,fontsize=16)
ax.spines[['top','right']].set_visible(False);ax.axhline(1,color=GRAY,ls=':',lw=1)
ax.text(.04,.03,'示意参数，C=1；UCB 可超过 1，不是概率',transform=ax.transAxes,fontproperties=FONT,fontsize=11)
fig.tight_layout();save(fig,'lecture-04-ucb-exploration')

fig,ax=canvas();txt(ax,6,6.7,'MCTS：在树内选择，把模拟结果回传',18,BLUE)
for x,y,s in [(3,5.4,'① 选择 Selection\n按 UCT 遍历已有子树'),(9,5.4,'② 扩展 Expansion\n增加一个未扩展动作'),(9,3.3,'③ 模拟 Rollout\n简单策略对局至终局'),(3,3.3,'④ 回传 Backup\n沿树路径更新 N 与 W')]:box(ax,x,y,s,4,.95)
arrow(ax,(5.1,5.4),(6.9,5.4));arrow(ax,(9,4.85),(9,3.85));arrow(ax,(6.9,3.3),(5.1,3.3));arrow(ax,(3,3.85),(3,4.85))
box(ax,6,1.2,'预算耗尽 → 在根节点选择实际动作\n常用：选择访问次数最多的孩子',8,.95,TEAL)
arrow(ax,(3,2.75),(4.5,1.75));txt(ax,6,2.4,'一次迭代只扩展少量节点；模拟路径不必全部存入树',11)
save(fig,'lecture-04-mcts-cycle')

fig,axs=plt.subplots(1,2,figsize=(11,5));board=np.zeros((8,8),dtype=int)
board[3,3]=board[4,4]=-1;board[3,4]=board[4,3]=1
legal={(2,3),(3,2),(4,5),(5,4)}
after=board.copy();after[2,3]=1;after[3,3]=1
for ax,b,title in [(axs[0],board,'初始局面：黑方可落 D3、C4、F5、E6'),(axs[1],after,'黑方落 D3：D4 的白棋翻为黑棋')]:
 ax.set_aspect('equal');ax.set(xlim=(-.7,8),ylim=(8,-.7));ax.axis('off')
 for r in range(8):
  for c in range(8):
   ax.add_patch(Rectangle((c,r),1,1,facecolor='#dceee3',edgecolor='#9aafa5',lw=.8))
   if b[r,c]:ax.add_patch(Circle((c+.5,r+.5),.35,facecolor='#202b35' if b[r,c]==1 else 'white',edgecolor=GRAY))
   elif ax is axs[0] and (r,c) in legal:ax.add_patch(Circle((c+.5,r+.5),.13,facecolor=TEAL))
 for i in range(8):txt(ax,i+.5,-.3,chr(65+i),11);txt(ax,-.3,i+.5,str(i+1),11)
 ax.set_title(title,fontproperties=FONT,fontsize=13)
fig.tight_layout();save(fig,'lecture-04-reversi-move')
print('Generated 5 lecture-four SVG sources and WebP figures.')
