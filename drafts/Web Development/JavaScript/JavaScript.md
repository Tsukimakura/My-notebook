## 1. JavaScript 基本介绍

### 什么是 JavaScript？

- **解释型脚本语言**：无需编译，由浏览器直接解释执行
    
- **动态类型语言**：变量类型在运行时确定
    
- **基于原型的面向对象**：与 C++/Java 的类继承不同
    
- **单线程但非阻塞**：通过事件循环处理异步操作
    

### JavaScript 的主要特点

- **客户端执行**：在用户浏览器中运行
    
- **事件驱动**：响应用户交互
    
- **跨平台**：所有现代浏览器都支持
    
- **与 DOM 交互**：可以动态修改网页内容
    

## 2. 基础语法（与 C 语言对比）

### 变量声明

```javascript
// C 语言风格
int x = 10;
char name[] = "John";

// JavaScript 风格
let x = 10;              // 可变变量
const name = "John";     // 常量
var oldWay = "deprecated"; // 旧方式，不推荐
```
### 数据类型

```javascript
// 基本类型
let number = 42;         // 数字
let string = "Hello";    // 字符串
let boolean = true;      // 布尔值
let nullValue = null;    // 空值
let undefinedValue;      // 未定义

// 引用类型
let array = [1, 2, 3];   // 数组
let object = {           // 对象
    name: "John",
    age: 30
};
```
### 控制结构（与 C 类似）

```javascript
// 条件语句
if (condition) {
    // 代码
} else if (otherCondition) {
    // 代码
} else {
    // 代码
}

// 循环
for (let i = 0; i < 10; i++) {
    console.log(i);
}

while (condition) {
    // 代码
}
```
### 函数

```javascript
// 函数声明
function add(a, b) {
    return a + b;
}

// 函数表达式
const multiply = function(a, b) {
    return a * b;
};

// 箭头函数 (ES6+)
const divide = (a, b) => a / b;
```
## 3. JavaScript 特有概念

### DOM 操作

```javascript
// 选择元素
const element = document.getElementById("myId");
const elements = document.querySelectorAll(".myClass");

// 修改内容
element.textContent = "新内容";
element.innerHTML = "<strong>加粗文本</strong>";

// 修改样式
element.style.color = "red";
element.classList.add("new-class");

// 事件处理
element.addEventListener("click", function() {
    alert("元素被点击了！");
});
```
### 异步编程

```javascript
// 回调函数
setTimeout(function() {
    console.log("2秒后执行");
}, 2000);

// Promise
fetch('https://api.example.com/data')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('错误:', error));

// async/await (推荐)
async function getData() {
    try {
        const response = await fetch('https://api.example.com/data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('错误:', error);
    }
}
```
## 4. 重要注意事项

### 变量作用域

```javascript
// 块级作用域 (let/const)
if (true) {
    let x = 10;    // 只在块内有效
}
// console.log(x); // 错误: x未定义

// 函数作用域 (var)
if (true) {
    var y = 20;    // 提升到函数顶部
}
console.log(y);     // 20
```
### 相等比较

```javascript
// 严格相等 (推荐)
"5" === 5;   // false
"5" !== 5;   // true

// 抽象相等 (避免使用)
"5" == 5;    // true (类型转换)
"5" != 5;    // false
```
### 模板字符串

```javascript
const name = "John";
const age = 25;

// 错误方式
const message1 = 'Hello, ' + name + '. You are ' + age + ' years old.';

// 正确方式
const message2 = `Hello, ${name}. You are ${age} years old.`;
```