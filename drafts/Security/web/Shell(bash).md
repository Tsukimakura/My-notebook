# Shell(bash)

## 1. 基础结构与执行

- **Shebang**：文件首行必须指定解释器。如 `#!/bin/bash` 或 `#!/usr/bin/env bash`（推荐，兼容性更好）。

- **执行方式**：

    - **子 Shell 运行**：`./script.sh`（需先执行 `chmod +x script.sh` 赋予执行权限）或 `bash script.sh`。

    - **当前 Shell 运行**：`source script.sh` 或 `. script.sh`（脚本内的变量改变会影响当前终端环境）。

- **注释**：仅支持单行注释，以 `#` 开头。

## 2. 变量 (Variables)

Shell 中的变量默认都是字符串类型。

- **定义与赋值**：等号两侧**绝对不能有空格**。`VAR_NAME="value"`

- **引用变量**：`$VAR_NAME` 或 `${VAR_NAME}`（推荐加上花括号以明确边界，如 `${VAR_NAME}_file`）。

- **单双引号的区别**：

    - **单引号 `''`**：强引用，原样输出，不解析变量和转义字符。

    - **双引号 `""`**：弱引用，解析变量和转义字符（如 `\n`）。

- **内置特殊变量**：

    - `$0`：当前脚本的文件名。

    - `$1` ~ `$9`：第 1 到第 9 个命令行参数（`${10}` 以上需加花括号）。

    - `$#`：传递给脚本或函数的参数个数。

    - `$@`：传递给脚本的所有参数列表（带双引号时 `"$@"` 会保留每个参数的独立性，最常用）。

    - `$*`：传递给脚本的所有参数列表（作为一个整体单字符串）。

    - `$?`：上一个命令的退出状态码（`0` 表示成功，非 `0` 表示失败）。

    - `$$`：当前脚本的进程 PID。

## 3. 命令替换 (Command Substitution)

将命令的输出结果赋值给变量。

- **推荐语法**：`$(command)`（支持嵌套，易读性好，如 `DATE=$(date +%F)`）。

- **传统语法**：`` `command` ``（反引号，不推荐，易与单引号混淆且不支持嵌套）。

## 4. 算术运算

Bash 并非为数学运算设计，原生仅支持整数运算。

- **推荐语法**：`$(( expression ))`。例如：`RESULT=$(( 5 + 3 * 2 ))`。

- **其他方式**：`let "A = 5 + 3"` 或使用 `expr`。

- **浮点数运算**：需借助外部工具 `bc` 或 `awk`。

    - `echo "scale=2; 10 / 3" | bc`

## 5. 条件测试与比较

- **测试结构**：推荐使用现代的 `[[ condition ]]`（支持模式匹配、逻辑操作符 `&&` 和 `||`，且无需严格转义），避免使用老旧的 `[ condition ]` 或 `test`。

- **整数比较**：`-eq` (等于), `-ne` (不等于), `-gt` (大于), `-ge` (大于等于), `-lt` (小于), `-le` (小于等于)。

- **字符串比较**：`==` (等于), `!=` (不等于), `-z "$str"` (长度为0/为空), `-n "$str"` (长度非0/非空)。

- **文件测试**：

    - `-e`：文件或目录存在。

    - `-f`：存在且为普通文件。

    - `-d`：存在且为目录。

    - `-r`, `-w`, `-x`：存在且当前用户有读、写、执行权限。

## 6. 控制流

- **条件分支 (if-else)**：

    ```bash
    if [[ condition1 ]]; then
        # code
    elif [[ condition2 ]]; then
        # code
    else
        # code
    fi
    ```

- **多分支 (case)**：类似于 switch-case，支持通配符。

    ```bash
    case "$VAR" in
        "start"|"up")
            echo "Starting..."
            ;; # 双分号表示 break
        "stop")
            echo "Stopping..."
            ;;
        *)     # 默认分支
            echo "Usage: start|stop"
            ;;
    esac
    ```

- **循环 (for / while / until)**：

    ```bash
    # 遍历列表
    for item in a b c; do echo "$item"; done

    # C语言风格
    for ((i=0; i<5; i++)); do echo "$i"; done

    # while 循环（常用于按行读取文件）
    while read -r line; do
        echo "$line"
    done < "filename.txt"
    ```

## 7. 数组 (Arrays)

- **索引数组**：`arr=(val1 val2 val3)`。

    - 读取单个元素：`${arr[0]}`

    - 读取全部元素：`${arr[@]}`

    - 获取数组长度：`${#arr[@]}`

    - 追加元素：`arr+=("new_val")`

- **关联数组（字典）**（Bash 4.0+）：需显式声明。

    - `declare -A dict`

    - `dict["key"]="value"`

## 8. 函数 (Functions)

Shell 函数没有显式的形参列表，参数通过位置变量获取。

- **定义**：

    ```bash
    my_func() {
        local name=$1  # 使用 local 声明局部变量，防止污染全局
        echo "Hello $name"
        return 0       # 只能返回 0-255 的整数状态码
    }
    ```

- **调用**：直接写函数名加参数。`my_func "World"`

- **获取字符串返回值**：在函数内 `echo`，在外部用命令替换接收。`RESULT=$(my_func "World")`

## 9. 输入输出与重定向

- **文件描述符**：`0` (标准输入 STDIN), `1` (标准输出 STDOUT), `2` (标准错误 STDERR)。

- **重定向符**：

    - `>`：覆盖写入到文件。

    - `>>`：追加写入到文件。

    - `2>`：仅重定向错误输出。

    - `2>&1` 或 `&>`：将错误输出与标准输出合并重定向（如 `script.sh > output.log 2>&1`）。

    - `/dev/null`：黑洞设备，丢弃一切写入其中的数据（如 `cmd > /dev/null 2>&1` 静默执行）。

- **管道符 (`|`)**：将前一个命令的 STDOUT 作为后一个命令的 STDIN。

## 10. 健壮性与调试 (防御性编程)

推荐在生产级脚本开头启用以下 `set` 选项（Unofficial Bash Strict Mode）：

- `set -e`：任何命令执行失败（返回非 0 状态码）时，脚本立即退出。

- `set -u`：使用未初始化的变量时报错并退出。

- `set -o pipefail`：管道中任意一个命令失败时，整个管道的退出状态码才为非 0（默认只看管道最后一个命令）。

- _组合使用_：`set -euo pipefail`

- **调试模式**：使用 `bash -x script.sh` 或在脚本中写入 `set -x`，可在执行时打印每一行展开后的命令。
