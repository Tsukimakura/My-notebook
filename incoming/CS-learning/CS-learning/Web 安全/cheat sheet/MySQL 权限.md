### 1. 核心数据操作权限 (DML - Data Manipulation)

这是最常见的基础权限，决定了用户能对数据做什么。

|**权限 (Privilege)**|**权限级别 (Scope)**|**权限说明 (Description)**|
|---|---|---|
|**SELECT**|Global, DB, Table, Column|**查询数据**。允许使用 `SELECT` 语句读取表中的数据。这是 SQL 注入泄露数据的基础。|
|**INSERT**|Global, DB, Table, Column|**插入数据**。允许向表中添加新行。可用于向数据库写入恶意管理员账号。|
|**UPDATE**|Global, DB, Table, Column|**修改数据**。允许修改现有数据。可用于篡改密码或修改配置表。|
|**DELETE**|Global, DB, Table|**删除数据**。允许删除表中的行。可用于破坏数据或清除日志。|
|**FILE**|**Global (全局)**|**⚠️ 高危：文件读写**。允许使用 `LOAD_FILE()` 读取服务器文件，或使用 `INTO OUTFILE` 写入 WebShell。**这是数据库攻防中最重要的权限之一。**|

---

### 2. 结构与定义权限 (DDL - Data Definition)

这些权限涉及数据库结构的变更（建表、删库等）。

|**权限 (Privilege)**|**权限级别 (Scope)**|**权限说明 (Description)**|
|---|---|---|
|**CREATE**|Global, DB, Table|**创建**。允许创建新的数据库或表。|
|**DROP**|Global, DB, Table|**删除**。允许删除现有的数据库、表或视图。极具破坏性。|
|**ALTER**|Global, DB, Table|**修改结构**。允许修改表结构（如添加列、重命名列、更改列类型）。|
|**INDEX**|Global, DB, Table|**索引**。允许创建或删除索引。|
|**CREATE TEMPORARY TABLES**|Global, DB|**创建临时表**。允许使用 `CREATE TEMPORARY TABLE`。在某些复杂的注入或存储过程中很有用。|
|**CREATE VIEW** / **SHOW VIEW**|Global, DB, Table|**视图操作**。允许创建视图或查看视图的定义代码。|
|**CREATE ROUTINE** / **ALTER ROUTINE**|Global, DB|**存储过程**。允许创建或修改存储过程/函数。攻击者可能利用存储过程进行提权。|

---

### 3. 管理与高危权限 (Administration)

这些通常是 DBA（数据库管理员）拥有的权限，攻击者一旦获取，危害极大。

|**权限 (Privilege)**|**权限级别 (Scope)**|**权限说明 (Description)**|
|---|---|---|
|**ALL PRIVILEGES**|Global, DB, Table|**上帝模式**。除了 `GRANT OPTION` 外的所有权限。如果在 `mysql.user` 表中查到某用户拥有此权限，基本等同于拿下了数据库。|
|**GRANT OPTION**|Global, DB, Table|**授权**。允许把自己的权限赋予给其他用户。可用于创建后门账号。|
|**SUPER**|**Global (全局)**|**⚠️ 高危：超级权限**。允许修改全局变量（如开启日志记录写 Shell）、终止其他用户线程、关闭服务器验证等。在 MySQL 8.0+ 中被拆分为多个动态权限。|
|**PROCESS**|**Global (全局)**|**进程查看**。允许执行 `SHOW PROCESSLIST` 查看所有用户的当前执行语句。可用于窃取其他用户的查询内容（包含明文密码等）。|
|**SHUTDOWN**|Global|**关闭服务**。允许执行 `mysqladmin shutdown` 关闭数据库服务器（造成拒绝服务 DoS）。|
|**RELOAD**|Global|**重载配置**。允许执行 `FLUSH` 语句（如刷新日志、权限表）。常用于清空日志或使写入的 Shell 生效。|
|**LOCK TABLES**|Global, DB|**锁表**。允许在有 `SELECT` 权限的表上使用 `LOCK TABLES`。|
|**REPLICATION CLIENT / SLAVE**|Global|**主从复制**。允许查看主从服务器的位置或读取二进制日志（Binlog），Binlog 中可能包含历史修改数据的明文记录。|

---

### 补充：如何查看当前用户的权限？

在 SQL 注入或数据库操作中，了解自己当前的权限至关重要。

1. **最直观的方法（查看授权语句）：**
	
    ```sql
    SHOW GRANTS;
    -- 或者查看特定用户
    SHOW GRANTS FOR 'user'@'localhost';
    ```
    
2. **SQL 注入常用方法（查询元数据表）：**
    
    如果你无法直接看到回显，或者想通过 SQL 语句判断是否有 `FILE` 权限，可以查 `information_schema.user_privileges` 表：
	
    ```sql
    SELECT * FROM information_schema.user_privileges 
    WHERE GRANTEE = "'root'@'localhost'" AND PRIVILEGE_TYPE = 'FILE';
    ```
    
    _(注意：这通常需要你已经拥有较高的读取权限)_
    
3. **简单粗暴的测试：**
    
    直接尝试读取文件，如果报错 `Access denied`，就是没权限；如果报错 `File not found`，说明有权限但文件不存在。
	
    ```sql
    SELECT LOAD_FILE('/etc/passwd');
    ```
    

### 总结

对于攻击者（学习者）来说，最关注的权限级别是 **Global（全局）**，最关注的具体权限是 **FILE**（读写文件）和 **SUPER**（修改配置）。

- **SELECT** 是入门。
    
- **FILE** 是 Getshell 的关键。
    
- **SUPER** 是提权的关键。
    
