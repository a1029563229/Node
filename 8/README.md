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