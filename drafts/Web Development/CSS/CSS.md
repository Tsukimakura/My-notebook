## What CSS

CSS（层叠样式表）是用来**控制网页外观和布局**的语言。它决定 HTML 元素在页面上的显示方式 - 包括颜色、大小、位置等。

## Why CSS

- 让网页变得美观
    
- 实现响应式设计（适配不同设备）
    
- 提高用户体验
    
- 内容与样式分离，便于维护
    

## 基础语法

### 基本结构

```css
选择器 {
    属性: 值;
    属性: 值;
}
```
### 示例

```css
h1 {
    color: blue;
    font-size: 24px;
    text-align: center;
}
```
## 引入 CSS 的三种方式

### 1. 内联样式（不推荐）

```html
<p style="color: red; font-size: 16px;">这段文字是红色的</p>
```

### 2. 内部样式表

```html
<head>
    <style>
        body {
            background-color: #f0f0f0;
        }
        p {
            color: #333;
        }
    </style>
</head>
```
### 3. 外部样式表（推荐）

```html
<head>
    <link rel="stylesheet" href="styles.css">
</head>
```
## 常用选择器

### 基本选择器

```css
/* 元素选择器 */
p { color: black; }

/* 类选择器 */
.class-name { font-size: 16px; }

/* ID选择器 */
#element-id { background: white; }
```
### 组合选择器

```css
/* 多个元素 */
h1, h2, h3 { color: blue; }

/* 后代元素 */
div p { margin: 10px; }

/* 直接子元素 */
div > p { color: red; }
```
## 核心概念

### 盒模型

每个 HTML 元素都是一个盒子，包含：

- **内容** (content)
    
- **内边距** (padding)
    
- **边框** (border)
    
- **外边距** (margin)
    

```css
.box {
    width: 300px;
    padding: 20px;
    border: 2px solid black;
    margin: 10px;
}
```
### 常用属性

#### 文本样式

```css
p {
    color: #333333;
    font-size: 16px;
    font-family: Arial, sans-serif;
    text-align: center;
    line-height: 1.5;
}
```
#### 背景和边框

```css
.element {
    background-color: #f8f8f8;
    border: 1px solid #ccc;
    border-radius: 5px;
}
```
#### 尺寸和间距

```css
.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}
```
## 布局基础

### Flexbox（弹性盒子）

```css
.container {
    display: flex;
    justify-content: center; /* 水平对齐 */
    align-items: center;    /* 垂直对齐 */
}

.item {
    flex: 1; /* 弹性比例 */
}
```

### 定位

```css
.element {
    position: relative; /* 相对定位 */
    position: absolute; /* 绝对定位 */
    position: fixed;    /* 固定定位 */
}
```
## 添加交互性

### 伪类

```css
/* 鼠标悬停 */
button:hover {
    background-color: blue;
    color: white;
}

/* 链接状态 */
a:link { color: blue; }     /* 未访问 */
a:visited { color: purple; } /* 已访问 */
a:active { color: red; }    /* 点击时 */
```
### 过渡效果

```css
.button {
    transition: all 0.3s ease;
}

.button:hover {
    transform: scale(1.05);
}
```
## 响应式设计

### 媒体查询

```css
/* 默认样式 */
.container {
    width: 100%;
    padding: 20px;
}

/* 平板设备 */
@media (min-width: 768px) {
    .container {
        width: 750px;
        margin: 0 auto;
    }
}

/* 桌面设备 */
@media (min-width: 1200px) {
    .container {
        width: 1140px;
    }
}
```
## 实用技巧

### 重置默认样式

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
```
### 响应式图片

```css
img {
    max-width: 100%;
    height: auto;
}
```
### 居中元素

```css
/* 水平居中 */
.center {
    margin: 0 auto;
    text-align: center;
}

/* 完全居中 */
.centered {
    display: flex;
    justify-content: center;
    align-items: center;
}
```
