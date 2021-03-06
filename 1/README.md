# Node 简介
Node 是基于 V8 引擎的一个轻量级的 Web 服务器，并有相关的一套库。

## Node 的命名与起源
+ 由于高性能、符合事件驱动、没有历史包袱这 3 个主要原因，Javascript 成为了 Node 的实现语言。
+ 在 Node 中，Javascript 可以随心所欲地访问本地文件，可以搭建 WebSocket 服务器端，可以连接数据库，可以如 Web Workers 一样玩转多线程。

## Node 的特点
+ 异步I/O：异步调用中对于结果值的捕获是符合 "Don't call me, I will call you" 的原则的，这也是注重结果，不关注过程的一种表现。
+ 在 Node 中，绝大多数的操作都是以异步的方式进行调用。
+ Node 保持了 Javascript 在浏览器中单线程的特点。而且在 Node 中，Javascript 与其他线程是无法共享状态的。单线程的最大好处是不用像多线程那样处处在意状态的同步问题，这里没有死锁的存在，也没有线程上下文交换所带来的性能上的开销。
+ 单线程的缺点：
  + 无法利用多核 CPU；
  + 错误会引起整个应用退出，应用的健壮性值得考验；
  + 大量计算占用 CPU 会导致无法继续调用异步 I/O；

## Node 的应用场景
+ Node 面向网络且擅长并行 I/O，能够有效地组织起更多的硬件资源，从而提供更多好的服务。I/O 密集的优势主要在于 Node 利用事件循环的处理能力，而不是启动每一个线程为每一个请求服务，资源占用极少。
+ CPU 密集型应用给 Node 带来的挑战：由于 Javascript 单线程的原因，如果有长时间运行的计算（比如大循环），将会导致 CPU 时间片不能释放，使得后续 I/O 无法发起。但是适当调整和分解大型运算任务为多个小任务，使得运算能够适时释放，不阻塞 I/O 调用的发起，这样既可同时享受到并行异步 I/O 的好处，又能充分利用 CPU。

## Node 的使用者
+ 前后端编程语言环境统一；
+ Node 带来的高性能 I/O 用于实时应用；
+ 并行 I/O 使得使用者可以更高效地利用分布式环境；
+ 并行 I/O，有效利用稳定接口提升 Web 渲染能力；
+ 云计算平台提供 Node 支持；
+ 游戏开发领域；
+ 工具类应用；