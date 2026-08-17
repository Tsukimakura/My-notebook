## 1. 变量与作用域

- **`const`**: 声明常量（块级作用域）。声明时必须初始化，引用类型（对象、数组）的内部属性可变。
    
- **`let`**: 声明变量（块级作用域）。
    
- **`var`**: 避免使用。具有函数级作用域和“变量提升”（Hoisting）特性，容易引发 Bug。
    

```javascript
const PI = 3.14;
let count = 0;
const obj = { key: 'value' };
obj.key = 'new value'; // 允许：修改了对象内部属性，而非重新赋值
```

## 2. 数据类型与相等判断

JS 分为**基本数据类型**（按值传递）和**引用数据类型**（按共享传递/指针传递）。

- **基本类型 (Primitives)**: `String`, `Number` (所有数字都是浮点数), `Boolean`, `Null`, `Undefined`, `Symbol`, `BigInt`。
    
- **引用类型**: `Object` (包括 `Array`, `Function`, `Date`, `RegExp` 等)。
    

**相等运算符**

使用严格相等 `===` 和严格不等 `!==`。双等号 `==` 会触发隐式类型转换。

```javascript
1 == '1';   // true (隐式转换)
1 === '1';  // false (类型不同)
null === undefined; // false
```

### 3. 对象与数组 (解构与扩展)

ES6 引入了极大地简化对象和数组操作的语法糖。

**解构赋值 (Destructuring):**

```javascript
// 对象解构
const user = { id: 1, name: 'Alice', age: 25 };
const { name, age } = user;

// 数组解构
const coords = [10, 20];
const [x, y] = coords;
```

**扩展运算符 (Spread) `...`:**

用于浅拷贝或合并。

```javascript
const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4]; // [1, 2, 3, 4]

const obj1 = { a: 1 };
const obj2 = { ...obj1, b: 2 }; // { a: 1, b: 2 }
```

### 4. 函数与 `this` 指向

JS 中函数可作为参数传递和返回。

**常规函数 vs 箭头函数:**

```javascript
// 1. 声明式
function add(a, b) { return a + b; }

// 2. 函数表达式
const multiply = function(a, b) { return a * b; };

// 3. 箭头函数 (Arrow Function) - 简写且没有自己的 this
const divide = (a, b) => a / b;
```

**`this` 关键字的陷阱:**

- **常规函数**: `this` 指向**调用**该函数的对象（动态绑定）。
    
- **箭头函数**: `this` 是词法绑定的，指向**定义**时所在上下文的 `this`（继承自外层作用域），适合作为回调函数。
    

### 5. 高阶数组方法

摒弃传统的 `for` 循环，推荐使用声明式的数组方法：

- **`map`**: 映射并返回新数组。
    
- **`filter`**: 过滤并返回新数组。
    
- **`reduce`**: 累加/聚合为一个值。
    
- **`forEach`**: 仅遍历，无返回值。
    

```javascript
const nums = [1, 2, 3, 4];
const doubled = nums.map(n => n * 2);       // [2, 4, 6, 8]
const evens = nums.filter(n => n % 2 === 0); // [2, 4]
const sum = nums.reduce((acc, curr) => acc + curr, 0); // 10
```

### 6. 异步编程 (核心重点)

JS 是单线程的，依赖非阻塞的异步模型（Event Loop）。

**1. Promise:** 代表一个异步操作的最终完成（或失败）及其结果值。

```javascript
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('出错了:', error));
```

**2. Async / Await:** Promise 的语法糖，让异步代码看起来像同步代码（推荐写法）。

```javascript
async function getData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('出错了:', error);
  }
}
```

### 7. 类与面向对象

JS 的继承本质上是**基于原型链 (Prototype Chain)** 的。ES6 引入了 `class` 关键字，但它只是语法糖。

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    console.log(`${this.name} makes a noise.`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // 必须先调用 super
    this.breed = breed;
  }
  speak() {
    console.log(`${this.name} barks.`);
  }
}
```

### 8. 模块化 (ES Modules)

现代 JS 原生支持模块化（使用 `import` 和 `export`）。

```javascript
// math.js
export const pi = 3.14; // 命名导出
export default function add(a, b) { return a + b; } // 默认导出

// app.js
import add, { pi } from './math.js';
```
