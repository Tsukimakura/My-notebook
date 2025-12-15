#### 1. 解释一些名称：

1. `href`

`href` 是 **Hypertext Reference（超文本引用）** 的缩写。它用于定义**超链接**所指向的目标地址。最常见的用法是在 `<a>`（锚点）标签和 `<link>` 标签中。
- 在 `<a>` 标签中，它指定了链接的目标URL。
- 在 `<link>` 标签中，它用于链接外部资源，如CSS样式表。

2. `rel`

`rel` 是 **Relationship** 的缩写。它用于描述**当前文档**与**链接的资源**之间的关系。它几乎总是与 `href` 属性一起使用，通常在 `<link>` 和 `<a>` 标签中。

- 在 `<link>` 标签中，它定义了外部资源与当前HTML文档的关系。
```html
    <!-- 链接到一个样式表，关系是“stylesheet” -->
    <link rel="stylesheet" href="styles.css">
    <!-- 链接到网站的图标，关系是“icon” -->
    <link rel="icon" href="favicon.ico">
    <!-- 提供预连接提示，优化性能 -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
```
- 在 `<a>` 标签中，它可以说明链接目标与当前页面的关系（例如，是一个外部网站、下一个页面等）。
```html
    <a href="next-page.html" rel="next">下一页</a>
    <a href="https://external.com" rel="nofollow noopener">外部网站</a>
```

3. `src`

`src` 是 **Source** 的缩写。它用于指定**要嵌入到当前文档中的外部资源的地址**。常见的标签有 `<img>`、`<script>`、`<iframe>` 等。

- 在 `<img>` 标签中，它指定图像的URL。
```html
 <img src="cat.jpg" alt="一只可爱的猫">
```
- 在 `<script>` 标签中，它指定要加载并执行的JavaScript文件。
```html 
<script src="app.js"></script>
```
- 在 `<iframe>` 标签中，它指定要嵌入的页面的URL。
```html
<iframe src="embedded-page.html"></iframe>
```
- **与 `href` 的关键区别**：
    
    - `src` 用于**嵌入**（Replace）：浏览器会暂停当前HTML的解析（对于脚本），去获取并处理 `src` 指向的资源，然后将其内容（如图片、脚本代码）放在当前位置。
        
    - `href` 用于**引用/链接**（Reference）：提供一个地址，浏览器不会立即处理它，只有在被激活（如点击）时才会导航到那里。

4. `alt`

`alt` 是 **Alternate Text** 的缩写。它用于为图像提供一段替代文本，当图像无法显示时（如图片链接失效、用户使用屏幕阅读器、或为了节省流量关闭了图片显示），这段文本就会被显示出来。

```html
<img src="company-logo.png" alt="深度求索公司标志">
```
- 作用：
    - **可访问性**：视障用户通过屏幕阅读器可以听到 `alt` 文本，从而理解图片的内容。
        
    - **容错性**：如果图片加载失败，用户可以看到 `alt` 文本，了解图片本应表达的信息。
        
    - **SEO**：搜索引擎会使用 `alt` 文本来理解图片内容。