# 构建 Web 应用

## 基础功能
+ 请求的基本方法：req.method；
+ 路径解析：url.parse(req.url)；
+ 查询字符串：url.parse(req.url, true).query；

### Cookie 
+ Cookie 的处理步骤：
  + 服务器向客户端发送 Cookie；
  + 浏览器将 Cookie 缓存；
  + 之后每次浏览器都会将 Cookie 发向服务器端；
+ 响应的 Cookie 格式
  ```bash
  Set-Cookie: name=value; Path=/; Expires=Sun, 23-Apr-23 09:01:35 GMT; Domain=.domain.com;
  ```
  + path 表示这个 Cookie 影响到的路径，当前访问的路径不满足该匹配时，浏览器则不发送这个 Cookie；
  + Expires 和 Max-Age 是用来告知浏览器这个 Cookie 何时过期的，如果不设置该选项，在关闭浏览器时会丢失掉这个 Cookie；
  + HttpOnly 告知浏览器不允许通过脚本 document.cookie 去更改这个 Cookie 值；
  + Secure：当 Secure 值为 true 时，在 HTTP 中是无效的，在 HTTPS 中才有效。
+ Cookie 的性能影响
  + 减小 Cookie 的大小：如果在域名的根节点设置 Cookie，几乎所有子路径下的请求都会带上这些 Cookie。
  + 为静态组件使用不同的域名：为不需要 Cookie 的组件换个域名可以实现减少无效 Cookie 的传输。所以很多网站的静态文件会有特别的域名，使得业务相关的 Cookie 不再影响静态资源。当然换用额外的域名带来的好处不止这点，还可以突破浏览器下载线程数量的限制，因为域名不同，可以将下载线程数翻倍。但是换用额外域名还是有一定缺点的，那就是将域名转换为 IP 需要进行 DNS 查询，多一个域名就多一次 DNS 查询。不过如今的浏览器都会进行 DNS 缓存，以削弱这个副作用的影响。

### Session
+ 在用户登录后用私钥创建一个 session 并存在在服务器端，将 session 传递给客户端，客户端进行存储后在后续请求将 session 带上，每次请求会校验和更新 session，从而达到校验用户身份的作用。
+ XSS：跨站脚本攻击（Cross Site Scripting）。

### 缓存
+ 提高性能的几条缓存规则
  + 添加 Expires 或 Cache-Control 到报文头中；
  + 配置 ETags；
  + 让 Ajax 可缓存；
+ 通常来说，POST、DELETE、PUT 这类带行为性的请求操作一般不做任何缓存，大多数缓存只应用在 GET 请求中。
+ 清除缓存：大体来说，根据文件内容的 hash 值进行缓存淘汰会更加高效，因为文件内容不一定随着 Web 应用的版本而更新，而内容没有更新时，版本号的改动导致的更新毫无意义，因此以文件内容形成的 hash 值更精确。

### Basic 认证
+ 通过账号密码登录网站（有太多漏洞）

### 数据上传
- 通过报文头部的 Transfer-Encoding 或 Content-Length 即可判断请求中是否带有内容。
- 表单数据：使用 queryString 即可解析；
- 其他数据：JSON 格式使用自带 API 可解析；
- 附件上传
  - 在前端中，特殊表单和普通表单的差异在于该表单可以含有 file 类型的控件，以及需要指定表单属性 enctype 为 multipart/form-data；
  - 我们可以通过 formidable 模块去解析数据；
- 数据上传及安全
  - 内存限制：限制上传内容的大小，防止服务器崩溃；尽量缩减处理文件的大小；
  - CSRF：全称 Cross-Site Request Forgery，跨站请求伪造。通过引诱已登录用户到第三站点，伪造非法请求，盗用用户的 cookie，造成对用户账户的损害。防止的办法是在表单提交中添加随机值并在服务器端校验，让跨站攻击者无法伪造。

## 路由解析
- 静态文件；
- 动态文件；

### MVC
+ 主要思想
  + 控制器（Controller），一组行为的集合；
  + 模型（Model），数据相关的操作和封装；
  + 视图（View），视图的渲染；
+ 目前经典的分层模式
  + 路由解析，根据 URL 寻找到对应的控制器和行为；
  + 行为调用相关的模型，进行数据操作；
  + 数据操作结束后，调用视图和相关数据进行页面渲染，输出到客户端；
+ 手工映射
  + 正则匹配；
  + 参数解析；
+ 自然映射
  
### RESTful
+ REST 的全称是 Representational State Transfer，中文含义为表现层状态转化。
+ RESTful 与 MVC 设计并不冲突，而且是更好的改进。相比 MVC，Restful 只是将 HTTP 请求方法也加入了路由的过程，以及在 URL 路径上体现得更资源化。

## 中间件
+ 实现使用 Next + 尾调用的形式
+ 提升性能
  + 编写高效的中间件
  + 合理利用路由，避免不必要的中间件执行

## 页面渲染
## 模板（需要实践练习）
+ 模板引擎；
+ with 的应用；
+ 模板逻辑（if else）；
+ 集成文件系统；
+ 子模板；
+ 布局视图；
+ 模板性能；

## BigPipe 异步渲染