> 可以选择在线靶场或本地搭建靶场进行练习。

- 我选择 Windows + phpstudy + [sqli-labs](https://github.com/Audi-1/sqli-labs)

> 要更好地演研究 SQL 注入，必须深入了解每种数据库的 SQL 语法及特性。虽然大多数数据库遵循 SQL 标准，但每种数据库有自己的单行函数及特性。

形成原因：用户输入的数据被当作 SQL 代码执行了。

常见数据库种类：

| **数据库**                | **常见环境**                         | **默认端口** | **特点**                                   |
| ---------------------- | -------------------------------- | -------- | ---------------------------------------- |
| **MySQL**              | PHP 网站, WordPress, **sqli-labs** | 3306     | 最常见，语法灵活，拥有 `information_schema` 库（神助攻）。 |
| **SQL Server (MSSQL)** | ASP.NET, Windows 服务器             | 1433     | 微软系，系统表丰富，权限通常较高（xp_cmdshell）。           |
| **Oracle**             | 银行、大型企业、Java                     | 1521     | 语法极其严格，必须有 FROM 子句（dual 表），报错信息晦涩。       |
| **PostgreSQL**         | Python/Django, 高级 Web 应用         | 5432     | 严谨，支持堆叠查询，语法接近 Oracle 但更现代。              |