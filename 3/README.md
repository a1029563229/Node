# 异步 I/O
+ 前端编程算 GUI 编程的一种，其中充斥了各种 Ajax 和事件，这些都是典型的异步应用场景。
+ PHP 对调用层不仅屏蔽了异步，甚至连多线程都不提供。PHP 语言从头到脚都是以同步阻塞的方式来执行的。它的优点十分明显，利于程序员顺序编写业务逻辑；它的缺点在小规模站点基本不存在，但是在复杂的网络应用中，阻塞导致它无法更好地并发。
+ 与 Node 的事件驱动、异步 I/O 设计理念比较相近的一个知名产品为 Nginx。Nginx 采用纯 C 编写，性能表现非常优异。
+ 高并发：高并发（High Concurrency）是互联网分布式系统架构设计中必须考虑的因素之一，它通常是指，通过设计保证系统能够同时并行处理很多请求。

# 为什么要异步 I/O
+ 用户体验
  + 因为在浏览器中 Javascript 在单线程上执行，而且它与 UI 渲染共用一个进程。这意味着 Javascript 在执行的时候 UI 渲染和响应是处于停滞状态的。如果网页临时需要获取一个网络资源，通过同步的方式获取，那么 Javascript 则需要等待资源完全从服务器端获取后才能继续执行，这期间 UI 将停顿，不再响应用户的交互行为。
  + 随着网站和应用不断膨胀，数据将会分布到多台服务器上，分布式将会是常态。I/O 是昂贵的，分布式 I/O 是更昂贵的。只有后端能够快速响应资源，才能让前端的体验编号。
+ 资源分配
  + 如果创建多线程的开销小于并行执行，那么多线程的方式是首选的。多线程的代价在于创建线程和执行期线程上下文切换的开销较大。另外，在复杂的业务中，多线程程序经常面临锁、状态同步问题。但是多线程在多核 CPU 上能够有效提升 CPU 的使用率。
  + 单线程顺序执行任务的方式在于性能，任意一个较慢的任务都会导致后续执行代码被阻塞。在计算机资源中，通常 I/O 与 CPU 计算之间是可以并行进行的。但是同步的编程模型导致的问题是，I/O 的进行会让后续任务等待，这造成资源不能被更好地利用。
  + Node 的方案：利用单线程，远离多线程死锁、状态同步等问题；利用异步 I/O，让单线程远离阻塞，以更好地使用 CPU。

## 异步 I/O 实现现状
+ 操作系统内核对于 I/O 只有两种方式：阻塞与非阻塞。在调用阻塞 I/O 时，应用程序需要等待 I/O 完成才返回结果。
+ 组合 I/O 造成 CPU 等待 I/O，浪费等待时间，CPU 的处理能力不能得到充分利用；非阻塞 I/O 立刻返回的并不是业务层期望的数据，而仅仅是当前调用的状态，为了获取完整的数据，应用程序需要进行轮询来获取完整的数据（查询 I/O 是否完成）。
+ 我们期望的完美的异步 I/O 应该是应用程序发起非阻塞调用，无需通过遍历或者事件唤醒等方式轮询，可以直接处理下一个任务，只需在 I/O 完成后通过信号或回调将数据传递给应用程序即可。
+ 多线程可以达到异步 I/O 的目标，通过让部分线程进行阻塞 I/O 或者非阻塞 I/O 加轮询技术来完成数据获取，让一个线程进行计算处理，通过线程之间的通信将 I/O 得到的数据进行传递，这就轻松实现了异步 I/O。（Node 自行实现了线程池来完成异步 I/O）
+ Node 提供了 libuv 作为抽象封装层，Node 在编译期间会判断平台条件，选择性编译 unix 目录或是 win 目录下的源文件到目标程序中，在 *nix 中使用的是 Node 自定义的线程池，在 Windows 平台使用的是是 IOCP（系统内核管理的线程池）。
+ Node 的单线程指的是 Javascript 执行在单线程，在 Node 中，无论是 *nix 还是 Windows 平台，内部完成 I/O 任务的另有线程池。

## Node 的异步 I/O
+ 在进程启动时，Node 便会创建一个类似于 while(true) 的循环，每执行一次循环体的过程称为 Tick。每个 Tick 的过程就是查看是否有事件待处理，如果有，就取出事件及其相关的回调函数。如果存在关联的回调函数，就执行它们。然后进入下个循环，如果不再有事件处理，就退出进程。（每一次 Tick 都会把观察者中可执行的事件执行完毕后，再进行下一次的 Tick）
+ 观察者
  + 每个事件循环中有一个或者多个观察者，而判断是否有事件要处理的过程就是向这些观察者询问是否有要处理的事件。
  + 事件循环是一个典型的生产者/消费者模型。异步 I/O、网络请求等则是事件的生产者，生产出的事件被传递到对应的观察者，事件循环从观察者中取出事件并处理（消费者）。
+ 请求对象
  + 以 fs.open 为例
  ```es6
    fs.open = function(path, flags, mode, callback) {
      // ...
      // process.binding 调用 Node 内建模块
      binding.open(pathModule._makeLong(path), stringToFlags(flags), mode, callback);
    }
  ```
  + 调用流程如下
    + lib/fs.js -> fs.open ==> src/node_file.cc -> Open ==> 平台判断（libuv） -> deps/uv/src/(unix|win)/fs.c -> uv_fs_open() ==> 结束
  + 从 Javascript 调用 Node 的核心模块，核心模块调用 C++ 内建模块，内建模块通过 libuv 进行单系统调用，这是 Node 里经典的调用方式。
  + 在 uv_fs_open() 的调用过程中，我们创建了一个 FSReqWrap 请求对象，回调函数被设置在这个对象的 oncomplete_sym 属性上：req_wrap->object_->Set(oncomplete_sym, callback)
  + 对象包装完毕后，在 Windows 下，则调用 QueueUserWorkItem() 方法将这个 FSReqWrap 对象推入线程池中等待执行：QueueUserWorkItem(&uv_fs_thread_proc, req, WT_EXECUTE_DEFAULT)（当线程池有可用线程时，我们会调用 uv_fs_thread_proc() 方法，该方法会调用相应的底层函数，uv_fs_open() 实际上调用的是 fs__open()（Windows 系统提供的 API）方法
  + 至此，Javascript 调用立即返回，由 Javascript 层面发起的异步调用的第一阶段就此结束。Javascript 线程可以继续执行当前任务的后续操作。当前的 I/O 操作在线程池中等待执行，不管它是否阻塞 I/O，都不会影响到 Javascript 线程的后续执行，如此就达到了异步的目的。
  + 请求对象（ReqWrap）是异步 I/O 过程中的重要中间产物，所有的状态都保存在这个对象中，包括送入线程池等待执行以及 I/O 操作完毕后的回调处理。
+ 执行回调
  + 线程池的 I/O 操作调用完毕之后，会将获取的结果储存在 req->result 属性上，然后调用 PostQueuedCompletionStatus() 向 IOCP 提交执行状态，并将线程归还线程池。
  + 在这个过程中，我们其实还动用了事件循环的 I/O 观察者。在每次 Tick 的执行中，它会调用 IOCP 相关的 GetQueuedCompletionStatus() 方法检查线程池中是否有执行完的请求，如果存在，会将请求对象假如到 I/O 观察者的队列中，然后将其当做事件处理。
  + I/O 观察者回调函数的行为就是取出请求对象的 result 属性作为参数，取出 oncomplete_sym 属性作为方法，然后调用执行，以此达到调用 Javascript 中传入的回调函数的目的。
+ 异步 I/O 的流程
  + 异步调用 => 开始 => 发起异步调用 => 封装请求对象（ReqWrap） => 设置参数和回调函数 => 将请求对象放入线程池等待执行 => 结束
  + 线程池 => 开始 => 线程可用 => 执行请求对象中的 I/O 操作 => 将执行完成的结果放在请求对象中 =>  通知 IOCP 调用完成 => 归还线程 => 结束
  + 事件循环 => 开始 => 创建主循环 => 从 I/O 观察者取到可用的请求对象 => 取出回调函数和结果调用执行 => 获取完成的 I/O 交给 I/O 观察者 => 第三步
+ 事件循环、观察者、请求对象、I/O 线程池这四者沟通构成了 Node 异步 I/O 模型的基本要素。
+ 在 Node 中，除了 Javascript 是单线程外，Node 自身其实是多线程的，只是 I/O 线程使用的 CPU 较少。

## 非 I/O 的异步 API
+ 定时器
  + 调用 setTimeout() 或者 setInterval() 创建的定时器会被插入到定时器观察者内部的一个红黑树中。每次 Tick 执行时，会从该红黑树中迭代取出定时器对象，检查是否超过定时时间，如果超过，就形成一个事件，它的回调函数将立即执行。（不需要 I/O 线程池的参与）
  + （并非精确）尽管事件循环十分快，但是如果某一次循环占用的时间较多，那么下次循环时，它也许已经超时很久了。
+ process.nextTick()
  + 由于事件循环本身的特点，定时器的精确度不够。而事实上，采用定时器需要动用红黑树，创建定时器对象和迭代等操作，而 setTimeout(fn, o) 的方式较为浪费性能。实际上， process.nextTick() 方法的操作相对较为轻量。
  ```es6
    process.nextTick = function(callback) {
      if (process._exiting) return;

      if (tickDepth >= process.maxTickDepth) {
        maxTickWarn();
      }

      var tock = { callback: callback };
      if (process.domain) tock.domain = process.domain;
      nextTickQueue.push(tock);
      if (nextTickQueue.length) {
        process._needTickCallback();
      }
    };
  ```
  + 每次调用 process.nextTick() 方法，只会将回调函数放入队列中，在下一轮 Tick 时取出执行，定时器中采用红黑树的操作时间复杂度为 O(lg(n))，nextTick() 的时间复杂度为 O(1)。相较之下，process.nextTick() 更高效。
+ setImmediate()
  + process.nextTick() 中的回调函数执行的优先级要高于 setImmediate()。这里的原因在于事件循环对观察者的检查是有先后顺序的，process.nextTick() 属于 idle 观察者，setImmediate() 属于 check 观察者。在每一轮循环检查中，idle 观察者先与 I/O 观察者，I/O 观察者先于 check 观察者。
  + 在具体表现上，process.nextTick() 的回调函数保存在一个数组里，setImmediate() 的结果则是保存在链表上。在行为上，process.nextTick() 在每轮循环中会将数组中的回调函数全部执行完，而 setImmediate() 在每轮循环中执行链表中的一个回调函数。之所以这样设计，是为了保证每轮循环能够尽快地执行结束，防止 CPU 占用过多而阻塞后续 I/O 调用的情况。
+ 执行顺序：同步函数（当前 tick） > process.nextTick（idle 观察者） > Promise（I/O 观察者） > setTimeout(callback, 0)（定时器红黑树检查，check 观察者） > setImmediate（check 观察者）

## 事件驱动与高性能服务器
