# 异步 I/O
+ 前端编程算 GUI 编程的一种，其中充斥了各种 Ajax 和事件，这些都是典型的异步应用场景。
+ PHP 对调用层不仅屏蔽了异步，甚至连多线程都不提供。PHP 语言从头到脚都是以同步阻塞的方式来执行的。它的优点十分明显，利于程序员顺序编写业务逻辑；它的缺点在小规模站点基本不存在，但是在复杂的网络应用中，阻塞导致它无法更好地并发。
+ 与 Node 的事件驱动、异步 I/O 设计理念比较相近的一个知名产品为 Nginx。Nginx 采用纯 C 编写，性能表现非常优异。