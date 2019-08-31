# 模块机制

## CommonJS 规范

- Javascript 早期的缺陷：
  - 没有模块系统
  - 标准库较少
  - 没有标准接口
  - 缺乏包管理系统
- CommonJS 的模块规范
  - 模块引用：const math = require('math');
  - 模块定义：module.exports = math;
  - 模块标识
- Node 引入模块，需要经历 3 个步骤
  - 路径分析
  - 文件定位
  - 编译执行

## Node 中的模块实现

- Node 中的两类模块
  - 核心模块：核心模块部分在 Node 源代码的编译过程中，编译进了二进制执行文件。在 Node 进程启动时，部分核心模块就被直接加载进内存中，所以这部分核心模块引入时，文件定位和编译执行这两个步骤可以省略掉，并且在路径分析中优先判断，所以它是加载速度是最快的。
  - 文件模块则是在运行时动态加载，需要完整的路径分析、文件定位、编译执行过程，速度比核心模块慢。
- 与前端浏览器会缓存静态脚本文件以提高性能一样，Node 对引入过的模块都会进行缓存，以减少二次引入时的开销。不同的地方在于，浏览器仅仅缓存文件，而 Node 缓存的是编译和执行之后的对象。
- 模块标识符分析
  - 核心模块：核心模块的优先级仅次于缓存加载，它在 Node 源代码编译过程中已经编译为二进制代码，其加载过程最快。
  - 路径形式的文件模块：以.、..和/开始的标识符，这里都被当做文件模块来处理。在分析路径模块时，require() 方法会将路径转为真实路径，并以真实路径为索引，将编译执行后的结果存放到缓存中，以使二次加载时更快。
  - 自定义模块：自定义模块指的是非核心模块，也不是路径形式的标识符。它是一种特殊的文件模块，可能是一个文件或者包的形式。这类模块的查找是最费时的，也是所有方式中最慢的一种。在加载过程中，Node 会逐个尝试模块路径中的路径，直到找到目标文件或到达最顶级目录仍未找到文件为止。寻找路径如下
    - 当前文件目录下的 node_modules 目录；
    - 父目录下的 node_modules 目录；
    - 父目录的父目录下的 node_modules 目录；
    - 沿路径向上逐级递归，直到根目录下的 node_modules 目录；
- 文件定位
  - 从缓存加载的优化策略使得二次引入时不需要路径分析、文件定位和编译执行的过程，大大提高了再次加载模块时的效率。
  - require() 在分析标识符的过程中，会出现标识符不包含文件扩展名的情况。这种情况下，Node 会按 .js、.json、.node 的次序补足扩展名，依次尝试。
  - 目录分析和包：如果得到一个目录，Node 会将目录当做一个包来处理。Node 在当前目录下查找 package.json，通过 JSON.parse() 解析出包描述对象，从中取出 main 属性指定的文件名进行定位。如果 main 属性指定的文件名有误，或者压根没有 package.json 文件，Node 会将 index 当做默认文件名，然后依次查找 index.js、index.json、index.node。
- 模块编译
  - 在 Node 中，每个文件模块都是一个对象，它的定义如下
    ```es6
    function Module(id, parent) {
      this.id = id;
      this.exports = {};
      this.parent = parent;
      if (parent && parent.children) {
        parent.children.push(this);
      }
      this.filename = null;
      this.loaded = false;
      this.children = [];
    }
    ```
  - 不同文件的载入方法
    - .js 文件：通过 fs 模块同步读取文件后编译执行；
    - .node 文件：这是用 C/C++ 编写的扩展文件，通过 dlopen() 方法加载最后编译生成的文件；
    - .json 文件：通过 fs 模块同步读取文件后，用 JSON.parse() 解析返回结果；
    - 其余扩展名文件：它们都被当做 .js 文件载入；
  - Javascript 模块的编译
    - 在编译的过程中，Node 对获取的 Javascript 文件内容进行了头尾包装。
    ```es6
    (function(exports, require, module, __filename, __dirname) {
      const math = require("math");
      exports.area = function(radius) {
        return Math.PI * radius * radius;
      };
    });
    ```
  - C/C++ 模块的编译
    - .node 的模块文件通过 process.dlopen() 进行加载和执行，并不需要编译，因为它是通过 C/C++ 模块之后编译生成的。
    - C/C++ 模块给 Node 使用者带来的优势主要是执行效率方面的，劣势则是 C/C++ 模块的编写门槛要比 Javascript 高。
  - JSON 文件的编译
    - .json 文件的编译是 3 中编译方式中最简单的。Node 利用 fs 模块同步读取 JSON 文件的内容之后，调用 JSON.parse() 方法得到对象，然后将它赋给模块对象的 exports，以供外部调用。

## 核心模块

Node 的核心模块再编译成可执行文件的过程中被编译进了二进制文件。核心模块分为 C/C++ 编写的和 Javascript 编写的两部分，其中 C/C++ 文件存放在 Node 项目的 src 目录下，Javascript 文件存放在 lib 目录下。

- Javascript 核心模块的编译过程
  - 转存为 C/C++ 代码：Node 采用 V8 附带的 js2c.py 工具，将所有内置的 Javascript 代码（src/node.js 和 lib/\*.js）转换成 C++ 里的数组，生成 node_natives.h 头文件。在这个过程中，Javascript 代码以字符串的形式存储在 node 命名空间中，是不可执行的。（启动 Node 进程时，Javascript 代码直接加载进内存中，查找速度快）
  ```C++
    // node_natives.h
    namespace node {
      const char node_native[] = { 47, 47, ..};
      const char dgram_native[] = { 47, 47, ..};
      const char console_native[] = { 47, 47, ..};
      const char buffer_native[] = { 47, 47, ..};
      const char querystring_native[] = { 47, 47, ..};
      const char punycode_native[] = { 47, 42, ..};
      ...
      struct _native {
      const char* name;
      const char* source;
      size_t source_len;
      };
      static const struct _native natives[] = {
      { "node", node_native, sizeof(node_native)-1 },
      { "dgram", dgram_native, sizeof(dgram_native)-1 },
      ...
      };
    }
  ```
  - 编译 Javascript 核心模块：在引入 Javascript 核心模块的过程中，也经历了头尾包装的过程，然后才执行和导出了 exports 对象。Javascript 核心 OK 的定义如下面的代码所示，源文件通过 process.binding('natives')取出，编译成功的模块缓存到 NativeModule.\_cache 对象上，文件模块则缓存到 Module.\_cahce 对象上：
  ```es6
  function NativeModule(id) {
    this.filename = id + ".js";
    this.id = id;
    this.exports = {};
    this.loaded = false;
  }
  NativeModule._source = process.binding("natives");
  NativeModule._cache = {};
  ```
  - 在核心模块中，有些模块全部由 C/C++ 编写，有些模块则由 C/C++ 完成核心部分，其他部分则由 Javascript 实现包装或者向外导出，以满足性能需求。脚本语言的开发速度优于静态语言，但是其性能则弱于静态语言，而 Node 的这种复合模式可以在开发速度和性能之间找到平衡点。Node 的 buffer、crypto、evals、fs、os 等模块都是部分通过 C/C++ 编写的。（纯 C/C++ 编写的模块为内建模块）
    - 内建模块的组织形式
    ```c++
      // 内建模块的内部结构定义
      struct node_module_struct {
        int version;
        void *dso_handle;
        const char *filename;
        void (*register_func) (v8::Handle<v8::Object> target);
        const char *modname
      }
    ```
    每一个内建模块在定义之后，都通过 MODE_MODULE 宏将模块定义到 node 命名空间中，模块的具体初始化方法挂载为结构的 register_func 成员：
    ```c++
    #define NODE_MODULE(modname, regfunc) \
    extern "C" { \
    NODE_MODULE_EXPORT node::node_module_struct modname ## _module = \
    { \
    NODE_STANDARD_MODULE_STUFF, \
    regfunc, \
    NODE_STRINGIFY(modname) \
    }; \
    }
    ```
      - node_extensions.h 文件将这些散列的内建模块统一放进了一个叫 node_module_list 的数组中，这些模块有 node_buffer、node_crypto、node_evals...
      - Node 提供了 get_builtin_module() 方法从 node_module_list 数组中取出这些模块。
      - 内建模块的优势在于：首先，它们本身由 C/C++ 编写，性能上优于脚本语言；其次，在进行文件编译时，它们被编译进二进制文件。一旦 Node 开始执行，它们被直接加载进内存中，无须再次做标识符定位、文件定位、编译等过程，直接就可执行。
    - 内建模块的导出
      - 在 Node 的所有模块类型中，依赖关系是这样的：文件模块 -> 核心模块（Javascript）-> 内建模块（C/C++）
      - 通常不推荐文件模块直接调用内建模块。如需调用，直接调用核心模块即可，因为核心模块中基本都封装了内建模块。
      - Node 在启动时，会生成一个全局变量 process，并提供 Binding() 方法来协助加载内建模块。
      - 在加载内建模块时，我们先创建一个 exports 空对象，然后调用 get_builtin_module() 方法取出内建模块对象，通过执行 register_func() 填充 exports 对象，最后将 exports 对象按模块名缓存，并返回给调用方完成导出。
    - 核心模块的引入流程
      - require('os');
      - NativeModule.require('os');
      - process.binding('os');
      - get_builtin_module('node_os');
      - NODE_MODULE(node_os, reg_func);
    - 编写核心模块：略

## C/C++ 扩展模块
+ Javascript 一个典型弱点就是位运算（Javascript 中只有 double 型的数据类型，进行位运算时先转换为 int 型）。
+ 位运算：程序中的所有数在计算机内存中都是以二进制的形式储存的。 位运算就是直接对整数在内存中的二进制位进行操作。 比如，and运算本来是一个逻辑运算符，但整数与整数之间也可以进行and运算。
+ 在应用中，会频繁出现位运算的需求，包括转码、编码等过程，如果通过 Javascript 来实现，CPU 资源将会耗费很多，这时可以通过编写 C/C++ 扩展模块来提升性能。
+ 扩展模块在不同平台式的编译和加载过程
  + *nix：C/C++ 源码 -> g++/gcc（编译源码） -> .so 文件（生成 .node 文件）-> 加载 .so 文件（后缀为 .so，其实内部是 .node） -> dlopen() 加载 -> 导出给 Javascript
  + *nix：C/C++ 源码 -> VC++（编译源码） -> .dll 文件（生成 .node 文件）-> 加载 .dll 文件（后缀为 .dll，其实内部是 .node） -> dlopen() 加载 -> 导出给 Javascript
+ 前提条件
  + GYP 项目生成工具：跨平台项目生成器。
  + V8 引擎 C++ 库：V8 是 Node 自身的动力来源之一。它自身由 C++ 写成，可以实现 Javascript 和 C++ 的互相调用。
  + libuv 库：它是 Node 自身的动力来源之二。Node 能够实现跨平台的一个诀窍就是它的 libuv 库，这个库是跨平台的一些封装，通过它去调用一些底层操作，比自己在其他平台下编写实现要高效的多。libuv 封装的功能包括事件循环、文件操作等。
  + Node 内部库：写 C++ 模块时，免不了要做一些面向对象的编程工作，而 Node 自身提供了一些 C++ 代码，比如 node::ObjectWrap 类可以用来包装你的自定义类，它可以帮助实现对象回收等工作。
  + 其他库：其他存在 deps 目录下的库在编写扩展模块时也许可以帮助你，比如 zlib、openssl、http_parser 等。
+ C/C++ 扩展模块的编写
  + 普通的扩展模块与内建模块的区别自安于无须将源代码编译进 Node，而是通过 dlopen() 方法动态加载。
  + 由于不像编写内建模块那样将对象声明到 node_module_list 链表中，所以无法被认作是一个原生模块，只能通过 dlopen() 来动态加载，然后导出给 Javascript 调用。
+ C/C++ 扩展模块的编译
  + 通过 GYP 工具，编译过程会根据平台不同，分别通过 make 和 vcbuild 进行编译。编译完成后，[name].node 文件会生成在 build/Release 目录下。
+ C/C++ 扩展模块的加载
  + require() -> 路径分析 -> 文件定位 -> 编译执行；
  + 对于以 .node 扩展名的文件，Node 将会调用 process.dlopen() 方法去加载文件；
  + Javascript：require('./hello.node') -> 原生模块：process.dlopen('./hello.node', exports) -> libuv:uv_dlopen()、uv_dlsym() -> *nix：dlopen()、dlsym() / Windows：LoadLibraryExW()、GetProcAddress()
+ C/C++ 扩展模块与 Javascript 模块的区别在于加载之后不需要编译，直接执行之后就可以被外部调用了，其加载速度比 Javascript 模块略快。

## 模块调用栈
+ C/C++ 内建模块属于最底层的模块，它属于核心模块，主要提供 API 给 Javascript 核心模块和第三方 Javascript 文件模块调用。如果你不是非常了解要调用的 C/C++ 内建模块，请尽量避免通过 process.binding() 方法直接调用，这是不推荐的。
+ Javascript 核心模块主要扮演的职责有两类：一类是作为 C/C++ 内建模块的封装层和桥阶层，供文件模块调用；一类是纯粹的功能模块，它不需要和底层打交道，但是又十分重要。
+ 文件模块通常由第三方编写，包括普通 Javascript 模块和 C/C++ 扩展模块，主要调用方向为普通 Javascript 模块调用扩展模块。

## 包与 NPM
CommonJS 包规范是理论，NPM 是其中的一种实践。NPM 之于 Node，相当于 gem 之于 Ruby，pear 之于 PHP。
+ 包结构（完全符合 CommonJS 规范的包目录应该包含如下这些文件）
  + package.json：包描述文件；
  + bin：用于存放可执行二进制文件的目录；
  + lib：用于存放 Javascript 代码的目录；
  + doc：用于存放文档的目录；
  + test：用于存放单元测试用例的代码；
+ 包描述文件的属性（package.json）
  + name：包名。由小写的字母和数字组成；
  + description：包简介；
  + version：版本号；
  + keywords：关键词数组，NPM 中主要用来做分类搜索。一个好的关键词数组有利于用户快速找到你编写的包；
  + maintainers：包维护者列表。每个维护者由name、email 和 web 这3个属性组成；
  + contributors：贡献者列表；
  + bugs：一个可以反馈 bug 的网页地址或邮件地址；
  + licenses：许可证列表；
  + repositories：托管源代码的位置列表；
  + dependencies：使用当前包所需要的包列表，NPM 会通过这个属性帮助自动加载依赖的包；
  + homepage：当前包的网站地址；
  + os：操作系统支持列表；
  + cpu：CPU 架构的支持列表；
  + engine：支持的 Javascript 引擎列表；
  + builtin：标志当前包是否是内建在底层系统的标准组件；
  + directories：包目录说明；
  + implements：实现规范的列表；
  + scripts：脚本说明对象。
  + author：包作者；
  + bin：一些包作者希望包可以作为命令行工具使用。配置好 bin 字段后，通过 npm install package_name -g 命令可以将脚本添加到执行路径中，之后可以在命令行直接执行。
  + main：模块引入方法 require() 在引入包时，会优先检查这个字段，并将其作为包中其余模块的入口。
  + devDependencies：一些模块只在开发时需要依赖；
+ NPM 常用功能
  + 全局安装：npm install package_name -g；-g 是将一个包安装为全局可用的可执行命令，并不意味着可以从任何地方通过 require() 来引用到它；
+ 对于企业内部而言，私有的可重用模块可以打包到局域网 NPM 仓库中，这样可以保持更新的中心化，不至于让各个小项目各自维护相同功能的模块，杜绝通过复制粘贴实现代码共享的行为。