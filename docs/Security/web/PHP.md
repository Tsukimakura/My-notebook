# PHP

## 1. 基础标记与执行

- **标准标签**：`<?php ... ?>`。纯 PHP 文件末尾建议**省略**闭合标签 `?>`，以防止意外输出空格导致 Header 报错。

- **短输出标签**：`<?= $var ?>`（等同于 `<?php echo $var; ?>`，无论 `short_open_tag` 设置如何均可用）。

- **语句结束**：必须以分号 `;` 结尾。

- **注释**：单行 `//` 或 `#`，多行 `/* ... */`。

## 2. 变量与数据类型

- **变量声明**：以 `$` 开头（如 `$name`）。PHP 是动态类型语言，但支持类型声明。

- **变量作用域**：

    - 局部变量与全局变量隔离。

    - 函数内访问全局变量需使用 `global $var;` 关键字，或通过超全局数组 `$GLOBALS['var']`。

- **数据类型**：

    - 标量：`int`, `float`, `string`, `bool`

    - 复合：`array`, `object`, `callable`, `iterable`

    - 特殊：`null`, `resource`

- **严格类型**：在文件顶部使用 `declare(strict_types=1);` 强制执行严格的类型匹配。

## 3. 字符串 (String)

- **单引号 `''`**：原样输出，不解析变量和转义字符（除了 `\'` 和 `\\`）。速度略快。

- **双引号 `""`**：解析变量（如 `"Hello $name"` 或 `"Hello {$name}"`）和转义字符（如 `\n`, `\t`）。

- **字符串拼接**：使用点号 `.`，而不是 `+`。如 `$a . $b`。

- **Heredoc (`<<<EOF`)**：多行字符串，行为类似双引号。

- **Nowdoc (`<<<'EOF'`)**：多行字符串，行为类似单引号。

## 4. 特殊与现代操作符

- **太空船操作符 (`<=>`)**：用于比较，返回 `-1`, `0`, 或 `1`。常用于自定义排序（PHP 7+）。

- **Null 合并操作符 (`??`)**：`$a ?? $b`。如果 `$a` 存在且不为 `null`，返回 `$a`，否则返回 `$b`。

- **Null 安全操作符 (`?->`)**：`$obj?->method()`。如果 `$obj` 为 `null`，直接返回 `null` 而不抛出致命错误（PHP 8+）。

- **执行操作符**：反引号 `` `ls -l` ``，等同于 `shell_exec()`。

## 5. 控制结构

- **条件分支**：

    - `if / elseif / else`。

    - `switch`：松散比较（`==`）。

    - **`match` (PHP 8+)**：严格比较（`===`），且有返回值。支持多个条件匹配和无贯穿（No fall-through）。

        ```php
        $result = match($status) {
            1, 2 => 'Active',
            3 => 'Pending',
            default => 'Unknown',
        };
        ```

- **文件包含**：

    - `include` / `include_once`：找不到文件时抛出 Warning，脚本继续执行。

    - `require` / `require_once`：找不到文件时抛出 Fatal Error，脚本终止。

## 6. 数组 (Array)

PHP 的数组本质上是有序的哈希表（Hash Table），同时兼具列表（List）和字典（Dictionary）的功能。

- **定义**：`$arr = [1, 2, 3];` 或 `$arr = ['a' => 1, 'b' => 2];`

- **遍历**：

    ```php
    foreach ($arr as $key => $value) { ... }
    // 引用遍历，可修改原数组元素
    foreach ($arr as &$value) { ... }
    ```

- **数组展开 (Spread Operator)**：`$new = [...$arr1, ...$arr2];` (PHP 7.4+)

## 7. 函数 (Function)

- **类型提示与返回值**：

    ```php
    function add(int $a, int $b): int { return $a + $b; }
    ```

    _PHP 8+ 支持联合类型 `int|float` 和命名参数 `add(b: 2, a: 1)`。_

- **引用传递**：参数前加 `&`，如 `function foo(&$var)`。

- **匿名函数 (Closure)**：需使用 `use` 关键字显式继承父作用域变量。

    ```php
    $multiplier = 2;
    $func = function($x) use ($multiplier) { return $x * $multiplier; };
    ```

- **箭头函数 (PHP 7.4+)**：`fn($x) => $x * $multiplier;`。自动按值捕获外部变量，只能包含单行表达式。

- **可变参数**：`function sum(...$numbers) {}`。

## 8. 面向对象 (OOP)

- **可见性**：`public`, `protected`, `private`。

- **构造器属性提升 (PHP 8+)**：极大简化类属性声明。

    ```php
    class User {
        public function __construct(public string $name, private int $age) {}
    }
    ```

- **静态方法绑定 (Late Static Binding)**：使用 `static::method()` 代替 `self::method()`，以调用子类重写的方法。

- **Trait**：解决 PHP 单继承限制的水平代码复用机制。

    ```php
    trait Loggable { public function log() { ... } }
    class User { use Loggable; }
    ```

- **魔术方法 (Magic Methods)**：以 `__` 开头的特定触发方法。

    - `__construct()` / `__destruct()`

    - `__get($name)` / `__set($name, $value)`：拦截不可访问属性。

    - `__call($name, $args)`：拦截不可访问方法。

    - `__invoke()`：将对象当作函数调用时触发。

## 9. 常量

- **全局常量**：`define('MAX_SIZE', 100);`（运行时计算）。

- **类/编译时常量**：`const MAX_SIZE = 100;`。

- **魔术常量**：随代码位置变化的预定义常量，如 `__LINE__`（当前行号）、`__FILE__`（完整路径和文件名）、`__DIR__`（当前目录）、`__CLASS__`、`__METHOD__`。

## 10. 命名空间与自动加载 (Namespaces & Autoloading)

- **命名空间 (`namespace`)**：解决类名冲突。必须是文件中的第一条有效代码。

- **引入 (`use`)**：导入外部命名空间的类、函数或常量。

    ```php
    namespace App\Controllers;
    use App\Models\User;

    $user = new User(); // 否则需要 new \App\Models\User();
    ```

- **自动加载**：现代 PHP 不使用手工 `require` 引入类文件，而是依靠 Composer 实现基于 **PSR-4** 规范的自动加载（映射命名空间前缀到目录）。

## 11. 错误与异常处理

- **`Throwable` 接口**：PHP 7+ 中，所有的 Error（致命错误）和 Exception（异常）都实现了 `Throwable` 接口。

- **捕获结构**：

    ```php
    try {
        // 可能抛出异常的代码
    } catch (\Throwable $e) {
        // 捕获异常和大多数严重错误
        echo $e->getMessage();
    } finally {
        // 无论是否发生异常都会执行（常用于释放资源）
    }
    ```
