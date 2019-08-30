# 网络编程

## 构建 TCP 服务
+ TCP（Transfer Control Protocol，传输控制协议）；
+ 对于通过 net.createServer() 创建的服务器而言，传输层使用了 TCP 协议，而应用层支持 HTTP、TELNET 等部分协议；它是一个 EventEmitter 实例。
  + 服务器事件；
  + 连接事件；

## 构建 UDP 服务

## 构建 HTTP 服务
```es6
const http = require('http');
http.createServer((req, res) => {
  res.end('Hello World');
}).listen(8888, '0.0.0.0');
```
+ HTTP 服务只做两件事情：处理 HTTP 请求和发送 HTTP 响应。