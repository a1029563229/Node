# 内存控制

## V8 的垃圾回收机制与内存限制
+ Node 是一个构建在 Chrome 的 Javascript 运行时上的平台，V8 作为 Node 的 Javascript 脚本引擎，给 Node 带来了性能的优势。
+ 在 Node 中通过 Javascript 使用内存时会发现只能使用部分内存（64 位系统下约为 1.4 GB，32 位系统下约为 0.7 GB），这是因为 Node 中使用的 Javascript 对象基本上都是通过 V8 自己的方式来进行分配和管理的。
+ process.memoryUsage() 可查看内存相关信息；