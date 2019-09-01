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
+ 可以通过延迟 res.end() 的方式实现客户端与服务器端之间的长连接，但结束时务必关系连接。

## 构建 WebSocket 服务
+ Node 与 WebSocket
  + WebSocket 客户端基于事件的编程模型与 Node 中自定义事件相差无几；
  + WebSocket 实现了客户端与服务器端之间的长连接，而 Node 事件驱动的方式十分擅长于大量的客户端保持高并发连接。
+ WebSocket 与传统 HTTP 有如下好处：
  + 客户端与服务器端只建立一个 TCP 连接，可以使用更少的连接；
  + WebSocket 服务器端可以推送数据到客户端，这远比 HTTP 请求响应模式更灵活、更高效；
  + 有更轻量级的协议头，减少数据传送量；
+ WebSocket 协议主要分为两个部分：握手和数据传输。WebSocket 的握手部分是由 HTTP 完成的。

## 网络服务与安全
+ SSL（Secure Sockets Layer, 安全套接层） 作为一种安全协议，它在传输层提供对网络连接加密的功能。对于应用层而言，它是透明的，数据在传递到应用层之前就完成了加密和解密的过程。
  + TLS/SSL 是一个公钥/私钥的结构，它是一个非对称的结构，每个服务器端和客户端都有自己的公私钥。公钥用来加密要传输的数据，私钥用来解密接收到的数据。公钥和私钥是配对的，通过公钥加密的数据，只有通过私钥才能解密，所以在建立安全传输之前，客户端与服务器之间需要互换公钥。客户端发送数据时要通过服务器端的公钥进行加密，服务器端发送数据时则需要客户端的公钥进行加密，如此才能完成加密解密的过程。
+ HTTPS 服务：HTTPS 服务就是工作在 TLS/SSL 上的 HTTP。