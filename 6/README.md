# 理解 Buffer

## Buffer 结构
+ Buffer 是一个像 Array 的对象，但它主要用于操作字节。
+ Buffer 是一个典型的 Javascript 与 C++ 结合的模块，它将性能相关部分用 C++ 实现，将非性能相关的部分用 Javascript 实现。
+ Buffer 对象类似于数组，它的元素为 16 进制的两位数，即 0 到 255 的数值。
+ 不同编码的字符串占用的元素个数各不相同，中文字在 UTF-8 编码下占用 3 个元素，字母和半角标点符号占用 1 个元素。
+ 给元素的赋值如果小于 0，就将该值主次加 256，直到得到一个 0 到 255 之间的整数。如果得到的数值大于 255，就逐次减 256，直到得到 0~255 区间内的数值。如果是小数，舍弃小数部分，只保留整数部分。
+ Buffer 内存分配
  + Buffer 对象的内存分配不是在 V8 的堆内存中，而是在 Node 的 C++ 层实现内存的申请的。
  + Node 采用了 slab 分配机制来管理 Buffer 的内存分配。（类似于 *nix 中的内存管理机制）
  + 每一个 slab 的大小是 8KB。
  + 真正的内存是在 Node 的 C++ 层面提供的，Javascript 层面只是使用它。

## Buffer 的转换
+ Buffer 对象可以与字符串之间相转换，目前支持这几种：ASCII、UTF-8、Base64、Binary、Hex....

## Buffer 与性能
+ Buffer 在文件 I/O 和网络 I/O 中运用广泛，尤其在网络传输中，它的性能举足轻重。
+ 在 Node 构建的 Web 应用中，可以选择将页面中的动态内容和静态内容分离，静态内容部分可以通过预先转换为 Buffer 的方式，使性能得到提升。由于文件本身是二进制数据，所以在不需要改变内容的场景下，尽量只读取 Buffer，然后直接传输，不做额外的转换，避免损耗。