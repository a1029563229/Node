# Node v12.10 API

## assert 断言
- assert 模块提供了一组简单的断言测试，可用于测试不变量。 该模块提供了建议的严格模式和更宽松的遗留模式。
- 测试框架一般用到了这个模块，提供了可视化的输出。

## async_hooks - 异步钩子
- 用于追踪应用中的异步资源。

## Buffer
- 在引入 TypedArray 之前，JavaScript 语言没有用于读取或操作二进制数据流的机制。 Buffer 类是作为 Node.js API 的一部分引入的，用于在 TCP 流、文件系统操作、以及其他上下文中与八位字节流进行交互。
- Buffer 主要用于操作字节流。

## child_process - 子进程
- 一般用于创建子进程用于执行脚本命令

## cluster - 集群
- 单个 Node.js 实例运行在单个线程中。 为了充分利用多核系统，有时需要启用一组 Node.js 进程去处理负载任务。
- 一般用于显式利用多线程，创建多个子进程来调用不同的线程，在进程之间构建 IPC 通道进行通信，实现充分利用多线程。

## crypto - 加密
- 加密模块，功能很全，提供加密功能。

## dgram - 数据报
- dgram 模块提供了 UDP 数据包 socket 的实现。
- 用来熟悉 UDP 协议还不错，还有多播功能。

## net - tcp
- net 模块用于创建基于流的 TCP 或 IPC 的服务器（net.createServer()）与客户端（net.createConnection()）。
用来熟悉 TCP 协议。

## dns - 域名系统
- 实现了 DNS 协议，可以解析域名得到 IP 地址，也可以逆向解析 IP 地址得到域名。

## events - 事件触发器
- 大多数 Node.js 核心 API 构建于惯用的异步事件驱动架构，其中某些类型的对象（又称触发器，Emitter）会触发命名事件来调用函数（又称监听器，Listener）。
- 一般用于实现事件驱动，发布/订阅模式。

## fs - 文件系统
- 操作文件首选模块。

## os - 操作系统
- 获取操作系统相关信息首选模块。

## path - 路径
- 获取分析路径拼接路径首选。

## perf_hooks - 性能钩子
- 性能分析首选模块。

## process - 进程
- 获取进程相关信息，管理进程，首选模块。

## querystring - 查询字符串
- 分析 query 字符串首选模块。

## readline - 逐行读取
- 获取用户命令行输入首选，通常用于脚手架构建时询问用户。

## repl - 交互解释器
- 一般用于实现 --help。

## stream - 流
- 流（stream）是 Node.js 中处理流式数据的抽象接口。 stream 模块用于构建实现了流接口的对象。
- Node.js 提供了多种流对象。 例如，HTTP 服务器的请求和 process.stdout 都是流的实例。
- 流可以是可读的、可写的、或者可读可写的。 所有的流都是 EventEmitter 的实例。

## string_decoder - 字符串解码器
- string_decoder 模块提供了一个 API，用于以保留编码的多字节 UTF-8 和 UTF-16 字符的方式将 Buffer 对象解码为字符串。 它可以使用以下方式访问：

## tls - ssl 层
- tls 模块是对安全传输层（TLS）及安全套接层（SSL）协议的实现，建立在OpenSSL的基础上。

## trace_events - 跟踪事件
- 用于 debug .

## url - URL
- url 模块用于处理与解析 URL，需要操作 URL 和获取相关信息首选模块。

## util - 使用工具
util 模块主要用于支持 Node.js 内部 API 的需求。大部分实用工具也可用于应用程序与模块开发者。
- 转化回调函数为 promise 风格
- 检测数据类型 `util.types.isXXX`

## v8 - v8 引擎部分 API
- v8 模块暴露了特定于内置到 Node.js 二进制文件中的 V8 版本的 API。

## vm - 虚拟机
- vm 模块提供了在 V8 虚拟机上下文中编译和运行代码的一系列 API。vm 模块不是一个安全的虚拟机。不要用它来运行不受信任的代码。在这些文档中 "sanbox" 这个术语仅仅是为了表示一个单独的上下文，并不提供任何安全保障。
- JavaScript 代码可以被编译并立即运行，也可以编译、保存，以后再运行。
- 一个常见的场景是在沙盒中运行代码。沙盒中的代码使用不同的 V8 上下文，这意味着它具有与其余代码不同的全局对象。
- 可以通过上下文隔离化一个沙箱对象来提供上下文。沙盒代码将沙盒中的任何属性视为全局对象。由沙盒代码引起的任何全局变量的更改都将反映到沙盒对象中。

## worker_threads - 工作线程
类似于 web worker，实现多线程协作。

## zlib - 压缩
zlib 模块提供通过 Gzip 和 Deflate/Inflate 实现的压缩功能，Brotli 也是如此。 可以通过这样使用它：