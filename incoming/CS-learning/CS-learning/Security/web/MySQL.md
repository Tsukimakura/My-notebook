### 1. DDL (Data Definition Language) - 数据定义

_用于定义或修改数据库、表、索引的结构。_

**数据库操作：**

```sql
-- 查看所有数据库
SHOW DATABASES;

-- 创建数据库 (指定字符集防止乱码)
CREATE DATABASE IF NOT EXISTS my_db DEFAULT CHARSET utf8mb4;

-- 切换/使用数据库
USE my_db;

-- 删除数据库 (危险操作！)
DROP DATABASE my_db;
```

**数据表操作：**

```sql
-- 查看当前库的所有表
SHOW TABLES;

-- 查看表结构
DESCRIBE users; 
-- 或者 DESC users;

-- 创建数据表 (包含主键、自增、非空约束)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    age INT DEFAULT 18,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 删除表
DROP TABLE IF EXISTS users;

-- 修改表结构
ALTER TABLE users ADD email VARCHAR(100);       -- 添加列
ALTER TABLE users DROP COLUMN age;              -- 删除列
ALTER TABLE users MODIFY username VARCHAR(100); -- 修改列属性
```

### 2. DML (Data Manipulation Language) - 数据操作

_用于对表中的数据进行增、删、改。_

```sql
-- 插入单条数据
INSERT INTO users (username, email) VALUES ('Alice', 'alice@test.com');

-- 插入多条数据 (批量插入效率更高)
INSERT INTO users (username, email) VALUES 
('Bob', 'bob@test.com'),
('Charlie', 'charlie@test.com');

-- 更新数据 (务必带上 WHERE 条件，否则会更新全表)
UPDATE users SET email = 'new@test.com' WHERE id = 1;

-- 删除数据 (务必带上 WHERE 条件)
DELETE FROM users WHERE id = 2;

-- 清空整张表 (速度比 DELETE 快，且重置自增 ID)
TRUNCATE TABLE users;
```

### 3. DQL (Data Query Language) - 数据查询 (核心)

_日常开发中使用频率最高的部分：查。_

**基础查询与条件：**

```sql
-- 查询所有列 (生产环境中尽量避免使用 *)
SELECT * FROM users;

-- 查询指定列，并起别名（AS 可省略）
SELECT username AS '姓名', email FROM users;

-- 条件查询
SELECT * FROM users WHERE age >= 18 AND age <= 30;
SELECT * FROM users WHERE username LIKE 'A%';     -- 模糊查询 (以 A 开头)
SELECT * FROM users WHERE id IN (1, 3, 5);        -- 范围匹配
SELECT * FROM users WHERE email IS NOT NULL;      -- 空值判断
```

**排序与分页：**

```sql
-- 排序 (ORDER BY：ASC 升序，DESC 降序)
SELECT * FROM users ORDER BY created_at DESC;

-- 分页 (LIMIT 偏移量, 取几条) - 常用于网页的"下一页"
SELECT * FROM users LIMIT 0, 10;  -- 取第 1~10 条
SELECT * FROM users LIMIT 10, 10; -- 取第 11~20 条
```

**聚合与分组统计：**

```sql
-- 聚合函数 (COUNT, MAX, MIN, SUM, AVG)
SELECT COUNT(*) FROM users;                -- 统计总人数
SELECT AVG(age) FROM users;                -- 计算平均年龄

-- 分组查询 (GROUP BY) 与 分组后过滤 (HAVING)
-- 例子：查询每个部门的平均薪资，且只看平均薪资大于 10000 的部门
SELECT department_id, AVG(salary) 
FROM employees 
GROUP BY department_id 
HAVING AVG(salary) > 10000;
```

**多表连接 (JOIN)：**

```sql
-- 内连接 (交集：只返回两张表都能匹配上的数据)
SELECT u.username, o.order_no 
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- 左连接 (以左表为主：返回左表所有数据，右表没匹配上的用 NULL 填充)
SELECT u.username, o.order_no 
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;
```

### 4. DCL (Data Control Language) - 数据控制

_主要用于 DBA (数据库管理员) 进行权限和安全管理。_

```sql
-- 创建新用户
CREATE USER 'new_user'@'localhost' IDENTIFIED BY 'password123';

-- 授予权限 (将 my_db 的所有权限给该用户)
GRANT ALL PRIVILEGES ON my_db.* TO 'new_user'@'localhost';

-- 刷新权限使其生效
FLUSH PRIVILEGES;

-- 撤销权限
REVOKE ALL PRIVILEGES ON my_db.* FROM 'new_user'@'localhost';
```

### 一个完整的查询骨架

如果需要写一个非常复杂的查询，它的语法执行顺序和书写顺序严格如下：

```sql
SELECT 字段
FROM 表名
JOIN 另一张表 ON 连接条件
WHERE 基础过滤条件
GROUP BY 分组字段
HAVING 分组后的过滤条件
ORDER BY 排序字段
LIMIT 分页参数;
```
