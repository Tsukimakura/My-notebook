**Type conversion is the process of converting a variable from one data type to another.**

## 1. Implicit Conversion (Automatic) 

### Automatic Type Promotion 自动类型提升

```c
char c = 'A';
int i = c;           // char → int (自动)
float f = 3.14;
double d = f;        // float → double (自动)

// In expressions 表达式中
int a = 5;
double b = 2.5;
double result = a + b;  // a automatically converted to double
```
### Conversion Hierarchy 转换层次结构

```text
char → short → int → unsigned int → long → unsigned long → 
long long → float → double → long double
```
**Lower types are automatically promoted to higher types in expressions**  
**在表达式中，较低类型自动提升为较高类型**

## 2. Explicit Conversion (Casting)

### Cast Operator Syntax 强制转换运算符语法

```c
(target_type) expression
```
### Examples 示例

```c
#include <stdio.h>

int main() {
    // Float to int 浮点数转整数
    float pi = 3.14159;
    int int_pi = (int)pi;        // Truncates to 3 截断为3
    printf("(int)%.2f = %d\n", pi, int_pi);
    
    // Int to float 整数转浮点数
    int count = 10;
    float float_count = (float)count;  // Becomes 10.0 变为10.0
    printf("(float)%d = %.1f\n", count, float_count);
    
    // Char to int 字符转整数
    char letter = 'A';
    int ascii = (int)letter;     // Becomes 65 变为65
    printf("'%c' → ASCII %d\n", letter, ascii);
    
    return 0;
}
```
## 3. Common Conversion Scenarios 常见转换场景

### Integer Division vs Floating Division 整数除法 vs 浮点数除法

```c
int a = 7, b = 2;

int int_result = a / b;          // 3 (integer division 整数除法)
float float_result = (float)a / b; // 3.5 (floating division 浮点数除法)

printf("Integer division: %d\n", int_result);
printf("Floating division: %.1f\n", float_result);
```
### Pointer Type Casting 指针类型转换

```c
int value = 65;
void *void_ptr = &value;

// Cast void pointer back to int pointer
int *int_ptr = (int*)void_ptr;  // 空指针转整型指针
printf("Value: %d\n", *int_ptr);
```
## 4. Data Loss and Precision Issues 数据丢失和精度问题

### Potential Problems

```c
#include <stdio.h>
#include <limits.h>

int main() {
    // Overflow 溢出
    int big = INT_MAX;
    short small = (short)big;    // Data loss 数据丢失
    printf("%d → %d (overflow)\n", big, small);
    
    // Precision loss 精度丢失
    double precise = 123.456789;
    float less_precise = (float)precise;  // Precision loss 精度丢失
    printf("double: %.6f → float: %.6f\n", precise, less_precise);
    
    // Truncation 截断
    float decimal = 9.999;
    int truncated = (int)decimal;  // Truncates to 9 截断为9
    printf("%.3f → %d (truncation)\n", decimal, truncated);
    
    return 0;
}
```
## 5. Type Conversion Rules Table 类型转换规则表

| Conversion Type   | Behavior            | Example          |
| ----------------- | ------------------- | ---------------- |
| **int → float**   | Exact if possible   | `(float)5 → 5.0` |
| **float → int**   | Truncates decimal   | `(int)3.99 → 3`  |
| **char → int**    | ASCII value         | `(int)'A' → 65`  |
| **int → char**    | Keep lower 8 bits   | `(char)65 → 'A'` |
| **small → large** | No data loss        | `int → long`     |
| **large → small** | Potential data loss | `long → int`     |
## Key Points to Remember 关键要点

1. **Implicit conversion happens automatically in expressions**
2. **Explicit casting gives you control: `(type)variable`**
3. **Watch for data loss when converting to smaller types**
4. **Use parentheses to make casting clear**
5. **Integer division truncates - use casting for floating results**