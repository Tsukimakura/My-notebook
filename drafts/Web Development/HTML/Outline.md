### 什么是 HTML

HTML（HyperText Markup Language，超文本标记语言）是用来创建网页的标准标记语言。

---

### HTML 文档结构

#### 基本文档模板

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>页面标题</title>
</head>
<body>
    <!-- 页面内容 -->
</body>
</html>
```
#### 文档类型声明

```html
<!DOCTYPE html>  <!-- 声明为 HTML5 文档 -->
```
#### 根元素

```html
<html lang="zh-CN">  <!-- lang 属性定义页面主要语言 -->
```
#### 头部区域 (head)

```html
<head>
    <!-- 元数据：不会显示在页面中 -->
    <meta charset="UTF-8">  <!-- 字符编码 -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>文档标题</title>
    <link rel="stylesheet" href="styles.css">
</head>
```
#### 主体区域 (body)

```html
<body>
    <!-- 所有可见内容 -->
</body>
```
---

### 常用标签及用法

#### 文本标签

##### 标题标签

```html
<h1>一级标题</h1>
<h2>二级标题</h2>
<h3>三级标题</h3>
<h4>四级标题</h4>
<h5>五级标题</h5>
<h6>六级标题</h6>
```
##### 段落和文本格式

```html
<p>这是一个段落。</p>

<!-- 文本格式化 -->
<strong>加粗（重要）</strong>
<em>斜体（强调）</em>
<mark>标记文本</mark>
<small>小号文本</small>
<del>删除的文本</del>
<ins>插入的文本</ins>

<!-- 预格式化文本 -->
<pre>
    保留空格
    和换行
</pre>

<code>代码片段</code>
```
#### 链接和图片

##### 超链接

```html
<!-- 外部链接 -->
<a href="https://example.com" target="_blank">访问示例网站</a>

<!-- 内部链接 -->
<a href="about.html">关于我们</a>

<!-- 锚点链接 -->
<a href="#section1">跳转到第一节</a>
```
##### 图片

```html
<img src="image.jpg" alt="图片描述" width="300" height="200">
```
#### 列表

##### 无序列表

```html
<ul>
    <li>列表项1</li>
    <li>列表项2</li>
    <li>列表项3</li>
</ul>
```
##### 有序列表

```html
<ol>
    <li>第一步</li>
    <li>第二步</li>
    <li>第三步</li>
</ol>
```
#### 表格

##### 基础表格

```html

<table border="1">
    <tr>
        <th>姓名</th>
        <th>年龄</th>
        <th>城市</th>
    </tr>
    <tr>
        <td>张三</td>
        <td>25</td>
        <td>北京</td>
    </tr>
    <tr>
        <td>李四</td>
        <td>30</td>
        <td>上海</td>
    </tr>
</table>
```

---

### 表单与输入

#### 基础表单结构

```html
<form action="/submit" method="POST">
    <!-- 表单控件 -->
    <input type="text" name="username" required>
    <button type="submit">提交</button>
</form>
```
#### 输入类型

```html
<!-- 文本输入 -->
<input type="text" placeholder="请输入文本">

<!-- 密码输入 -->
<input type="password" placeholder="密码">

<!-- 邮箱输入 -->
<input type="email" placeholder="邮箱地址">

<!-- 数字输入 -->
<input type="number" min="1" max="100">

<!-- 日期选择 -->
<input type="date">

<!-- 文件上传 -->
<input type="file">

<!-- 单选按钮 -->
<input type="radio" name="gender" value="male" id="male">
<label for="male">男</label>

<!-- 复选框 -->
<input type="checkbox" name="hobby" value="reading" id="reading">
<label for="reading">阅读</label>
```
#### 其他表单元素

```html
<!-- 文本区域 -->
<textarea rows="4" cols="50" placeholder="多行文本输入"></textarea>

<!-- 下拉选择 -->
<select name="city">
    <option value="">请选择城市</option>
    <option value="beijing">北京</option>
    <option value="shanghai">上海</option>
</select>
```
---

### 基础页面结构标签

```html
<header>
    <!-- 页眉：网站标题、导航等 -->
</header>

<nav>
    <!-- 导航链接 -->
</nav>

<main>
    <!-- 页面主要内容 -->
</main>

<footer>
    <!-- 页脚：版权信息等 -->
</footer>
```