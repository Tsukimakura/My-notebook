##  文件和目录操作

### 基本导航

| 命令      | 作用       | 示例                   |
| ------- | -------- | -------------------- |
| `pwd`   | 显示当前工作目录 | `pwd` → `/home/user` |
| `ls`    | 列出目录内容   | `ls -la` (详细列表)      |
| `cd`    | 切换目录     | `cd /var/www`        |
| `mkdir` | 创建目录     | `mkdir new_folder`   |
| `rmdir` | 删除空目录    | `rmdir empty_dir`    |

### 文件操作

| 命令              | 作用          | 示例                       |
| --------------- | ----------- | ------------------------ |
| `cp`            | 复制文件/目录     | `cp file1.txt file2.txt` |
| `mv`            | 移动/重命名文件    | `mv old.txt new.txt`     |
| `rm`            | 删除文件        | `rm file.txt`            |
| `touch`         | 创建空文件/更新时间戳 | `touch new_file.txt`     |
| `cat`           | 查看文件内容      | `cat config.txt`         |
| `less` / `more` | 分页查看文件      | `less long_file.txt`     |
| `file`          | 探测文件类型      | `file README.md`         |

##  文件内容查看

| 命令     | 作用       | 示例                       |
| ------ | -------- | ------------------------ |
| `head` | 显示文件开头   | `head -n 10 file.log`    |
| `tail` | 显示文件末尾   | `tail -f app.log` (实时跟踪) |
| `grep` | 文本搜索     | `grep "error" logfile`   |
| `wc`   | 统计行数/单词数 | `wc -l file.txt`         |

##  搜索和查找

|命令|作用|示例|
|---|---|---|
|`find`|查找文件|`find . -name "*.js"`|
|`locate`|快速文件查找|`locate nginx.conf`|
|`which`|查找命令位置|`which python`|

##  权限管理

|命令|作用|示例|
|---|---|---|
|`chmod`|修改文件权限|`chmod 755 script.sh`|
|`chown`|修改文件所有者|`chown user:group file`|
|`sudo`|以管理员权限执行|`sudo apt update`|

##  系统信息

|命令|作用|示例|
|---|---|---|
|`ps`|显示进程|`ps aux \| grep nginx`|
|`top` / `htop`|实时系统监控|`top`|
|`df`|磁盘空间使用|`df -h` (人类可读格式)|
|`du`|目录空间使用|`du -sh /home`|
|`free`|内存使用|`free -h`|
|`uname`|系统信息|`uname -a`|

##  网络操作

|命令|作用|示例|
|---|---|---|
|`ping`|测试网络连接|`ping google.com`|
|`curl`|数据传输工具|`curl -O http://example.com/file`|
|`wget`|文件下载|`wget http://example.com/file.zip`|
|`ssh`|远程登录|`ssh user@server.com`|
|`scp`|安全文件传输|`scp file.txt user@server:/path`|

##  压缩和解压

|命令|作用|示例|
|---|---|---|
|`tar`|归档文件|`tar -czvf archive.tar.gz folder/`|
|`gzip`|文件压缩|`gzip file.txt`|
|`zip` / `unzip`|ZIP压缩解压|`unzip archive.zip`|

##  进程管理

|命令|作用|示例|
|---|---|---|
|`&`|后台运行|`python app.py &`|
|`jobs`|查看后台任务|`jobs`|
|`fg`|切换到前台|`fg %1`|
|`bg`|后台继续运行|`bg %1`|
|`kill`|终止进程|`kill 1234`|

##  文本处理

|命令|作用|示例|
|---|---|---|
|`sed`|流编辑器|`sed 's/old/new/g' file.txt`|
|`awk`|文本处理语言|`awk '{print $1}' file.txt`|
|`sort`|排序|`sort file.txt`|
|`uniq`|去重|`uniq sorted.txt`|
|`cut`|提取列|`cut -d',' -f1 data.csv`|

##  输入输出重定向

|符号|作用|示例|
|---|---|---|
|`>`|输出重定向|`ls > files.txt`|
|`>>`|追加输出|`echo "new" >> file.txt`|
|`<`|输入重定向|`sort < input.txt`|
|`\|`|管道|`ps aux \| grep python`|

##  历史记录

|命令|作用|示例|
|---|---|---|
|`history`|命令历史|`history`|
|`!!`|上一条命令|`sudo !!`|
|`!n`|执行历史第n条|`!105`|
|`Ctrl + R`|反向搜索历史|(按组合键搜索)|

##  实用技巧

### 快捷键

|快捷键|作用|
|---|---|
|`Ctrl + C`|终止当前命令|
|`Ctrl + D`|退出shell/文件结束|
|`Ctrl + Z`|暂停进程|
|`Ctrl + A`|移动到行首|
|`Ctrl + E`|移动到行尾|
|`Tab`|自动补全|

### 变量和环境

|命令|作用|示例|
|---|---|---|
|`echo`|输出文本|`echo $PATH`|
|`export`|设置环境变量|`export JAVA_HOME=/path`|
|`alias`|命令别名|`alias ll='ls -la'`|

##  常用组合命令

```bash
# 查找并删除旧文件
find . -name "*.tmp" -mtime +7 -delete

# 统计代码行数
find . -name "*.py" -exec wc -l {} + | tail -1

# 监控日志中的错误
tail -f app.log | grep -i error

# 批量重命名文件
for file in *.txt; do mv "$file" "backup_$file"; done

# 下载并解压
curl -O http://example.com/file.tar.gz && tar -xzf file.tar.gz
```


##  使用提示

1. **使用 Tab 补全** - 减少输入错误
    
2. **善用 man 手册** - `man command` 查看详细帮助
    
3. **测试危险命令** - 先用 `echo` 预览效果
    
4. **定期清理** - 使用 `df` 和 `du` 监控磁盘空间
