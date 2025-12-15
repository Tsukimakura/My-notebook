### 1. Git 基础概念

#### 1.1 什么是 Git？

- **版本控制系统**：记录文件内容变化，以便查阅特定版本修订情况
    
- **分布式系统**：每个开发者都有完整的代码仓库副本
    
- **快照机制**：每次提交都是项目文件的完整快照，而非差异比较
    

#### 1.2 核心概念解析

- **仓库（Repository）**：项目及其版本历史的存储位置
    
- **工作区**：直接编辑文件的目录
    
- **暂存区**：准备下次提交的更改的中间区域
    
- **提交（Commit）**：永久的版本快照
    

#### 1.3 Git 三区工作流
```text
工作区 → git add → 暂存区 → git commit → 版本库
```
### 2. 环境配置与初始化

#### 2.1 WSL + VS Code 完美配置

```bash
# 1. 安装 Git
sudo apt update && sudo apt install git

# 2. 配置用户信息
git config --global user.name "你的姓名"
git config --global user.email "你的邮箱"

# 3. 设置 VS Code 为默认编辑器
git config --global core.editor "code --wait"
```
#### 2.2 VS Code 扩展推荐

- **GitLens**：增强的 Git 功能
    
- **Git Graph**：可视化提交历史
    
- **Remote - WSL**：在 WSL 中无缝使用 VS Code
    

#### 2.3 初始化 Git 仓库
```bash
# 创建项目目录
mkdir my-project && cd my-project

# 初始化 Git 仓库
git init

# 验证初始化
git status

**初始化创建的 `.git` 目录结构：**

text

.git/
├── HEAD              # 当前分支指针
├── config            # 仓库配置
├── objects/          # 所有数据对象
├── refs/             # 分支和标签引用
└── hooks/            # 客户端钩子脚本
```
### 3. 基础操作命令

#### 3.1 文件生命周期管理
```bash
# 查看状态
git status

# 添加文件到暂存区
git add filename.txt
git add .                      # 添加所有文件
git add *.js                   # 添加所有 js 文件

# 提交更改
git commit -m "描述性提交信息"

# 查看提交历史
git log
git log --oneline              # 简洁显示
git log --graph --all          # 图形化显示
```
#### 3.2 实用的 Git 别名配置
```bash
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
```
### 第 4 章：分支管理

#### 4.1 分支基础操作
```bash
# 查看分支
git branch
git branch -av                 # 查看所有分支（包括远程）

# 创建分支
git branch new-feature
git checkout -b new-feature    # 创建并切换
git switch -c new-feature      # 新式命令

# 切换分支
git checkout branch-name
git switch branch-name         # 新式命令

# 删除分支
git branch -d branch-name      # 安全删除
git branch -D branch-name      # 强制删除
```
#### 4.2 分支合并策略
```bash
# 合并分支
git checkout main
git merge feature-branch

# 解决冲突后
git add .
git commit -m "合并feature-branch"
```
#### 4.3 分支工作流模型

- **功能分支**：每个新功能在独立分支开发
    
- **Git Flow**：main、develop、feature、release、hotfix 分支
    
- **GitHub Flow**：简化的工作流，适合持续交付
    

### 第 5 章：远程仓库协作

#### 5.1 GitHub 连接配置
```bash

# 生成 SSH 密钥
ssh-keygen -t ed25519 -C "your_email@example.com"

# 测试连接
ssh -T git@github.com
```
#### 5.2 远程仓库操作
```bash
# 添加远程仓库
git remote add origin https://github.com/user/repo.git

# 查看远程仓库
git remote -v

# 推送到远程
git push -u origin main        # 首次推送
git push                       # 后续推送

# 从远程拉取
git pull
git pull --rebase              # 变基式拉取

# 克隆仓库
git clone https://github.com/user/repo.git
```
#### 5.3 标签管理
```bash
# 创建标签
git tag -a v1.0.0 -m "版本1.0.0发布"

# 推送标签
git push origin v1.0.0
git push origin --tags         # 推送所有标签
```
### 第 6 章：高级技巧

#### 6.1 提交历史管理
```bash
# 修改最新提交
git commit --amend -m "新的提交信息"

# 交互式变基（整理最近3次提交）
git rebase -i HEAD~3

# 找回丢失的提交
git reflog
```
#### 6.2 临时保存更改
```bash
# 保存工作进度
git stash
git stash push -m "保存信息"

# 查看保存列表
git stash list

# 恢复进度
git stash pop
git stash apply stash@{1}
```
#### 6.3 调试技巧
```bash
# 二分查找定位问题提交
git bisect start
git bisect bad
git bisect good <commit-hash>
git bisect reset
```
### 第 7 章：GitHub 协作功能

#### 7.1 Pull Request 工作流

1. **Fork** 目标仓库
    
2. **Clone** 自己 Fork 的仓库
    
3. 创建**功能分支**进行开发
    
4. **Push** 分支到自己的仓库
    
5. 创建 **Pull Request**
    
6. 代码审查和合并
    

#### 7.2 GitHub 功能特性

- **Issues**：问题跟踪和管理
    
- **Projects**：看板式项目管理
    
- **Actions**：自动化 CI/CD
    
- **Wiki**：项目文档
    
- **Discussions**：社区讨论
    

### 第 8 章：最佳实践与故障处理

#### 8.1 提交信息规范
```bash
# 约定式提交格式
git commit -m "feat: 添加用户认证功能"
git commit -m "fix: 修复登录页面样式问题"
git commit -m "docs: 更新API使用文档"
```
#### 8.2 .gitignore 文件
```gitignore
# 依赖目录
node_modules/
vendor/

# 环境配置
.env
config/secrets.yml

# 系统文件
.DS_Store
Thumbs.db

# 日志文件
*.log
```
#### 8.3 常见问题解决

```bash
# 撤销工作区修改
git checkout -- filename

# 撤销暂存区文件
git reset HEAD filename

# 回退到指定提交
git reset --hard <commit-hash>
```