# 模块机制

## CommonJS 规范
+ Javascript 早期的缺陷：
  + 没有模块系统
  + 标准库较少
  + 没有标准接口
  + 缺乏包管理系统
+ CommonJS 的模块规范
  + 模块引用：const math = require('math');
  + 模块定义：module.exports = math;
  + 模块标识
+ Node 引入模块，需要经历3个步骤
  + 路径分析
  + 文件定位
  + 编译执行

## Node 中的模块实现
+ Node 中的两类模块
  + 核心模块：核心模块部分在 Node 源代码的编译过程中，编译进了二进制执行文件。在 Node 进程启动时，部分核心模块就被直接加载进内存中，所以这部分核心模块引入时，文件定位和编译执行这两个步骤可以省略掉，并且在路径分析中优先判断，所以它是加载速度是最快的。
  + 文件模块则是在运行时动态加载，需要完整的路径分析、文件定位、编译执行过程，速度比核心模块慢。
+ 与前端浏览器会缓存静态脚本文件以提高性能一样，Node 对引入过的模块都会进行缓存，以减少二次引入时的开销。不同的地方在于，浏览器仅仅缓存文件，而 Node 缓存的是编译和执行之后的对象。
+ 模块标识符分析
  + 核心模块：核心模块的优先级仅次于缓存加载，它在 Node 源代码编译过程中已经编译为二进制代码，其加载过程最快。
  + 路径形式的文件模块：以.、..和/开始的标识符，这里都被当做文件模块来处理。在分析路径模块时，require() 方法会将路径转为真实路径，并以真实路径为索引，将编译执行后的结果存放到缓存中，以使二次加载时更快。
  + 自定义模块：自定义模块指的是非核心模块，也不是路径形式的标识符。它是一种特殊的文件模块，可能是一个文件或者包的形式。这类模块的查找是最费时的，也是所有方式中最慢的一种。在加载过程中，Node 会逐个尝试模块路径中的路径，直到找到目标文件或到达最顶级目录仍未找到文件为止。寻找路径如下
    + 当前文件目录下的 node_modules 目录；
    + 父目录下的 node_modules 目录；
    + 父目录的父目录下的 node_modules 目录；
    + 沿路径向上逐级递归，直到根目录下的 node_modules 目录；
+ 文件定位
  + 从缓存加载的优化策略使得二次引入时不需要路径分析、文件定位和编译执行的过程，大大提高了再次加载模块时的效率。
  + require() 在分析标识符的过程中，会出现标识符不包含文件扩展名的情况。这种情况下，Node 会按 .js、.json、.node 的次序补足扩展名，依次尝试。
  + 目录分析和包：如果得到一个目录，Node 会将目录当做一个包来处理。Node 在当前目录下查找 package.json，通过 JSON.parse() 解析出包描述对象，从中取出 main 属性指定的文件名进行定位。如果 main 属性指定的文件名有误，或者压根没有 package.json 文件，Node 会将 index 当做默认文件名，然后依次查找 index.js、index.json、index.node。
+ 模块编译
  + 在 Node 中，每个文件模块都是一个对象，它的定义如下
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
  + 不同文件的载入方法
    + .js文件：通过 fs 模块同步读取文件后编译执行；
    + .node 文件：这是用 C/C++ 编写的扩展文件，通过 dlopen() 方法加载最后编译生成的文件；
    + .json 文件：通过 fs 模块同步读取文件后，用 JSON.parse() 解析返回结果；
    + 其余扩展名文件：它们都被当做 .js 文件载入；
  + Javascript 模块的编译
    + 在编译的过程中，Node 对获取的 Javascript 文件内容进行了头尾包装。
    ```es6
      (function(exports, require, module, __filename, __dirname){
        const math = require('math');
        exports.area = function (radius) {
          return Math.PI * radius * radius;
        }
      });
    ```
  + C/C++ 模块的编译
    + .node 的模块文件通过 process.dlopen() 进行加载和执行，并不需要编译，因为它是通过 C/C++ 模块之后编译生成的。
    + C/C++ 模块给 Node 使用者带来的优势主要是执行效率方面的，劣势则是 C/C++ 模块的编写门槛要比 Javascript 高。
  + JSON 文件的编译
    + .json 文件的编译是3中编译方式中最简单的。Node 利用 fs 模块同步读取 JSON 文件的内容之后，调用 JSON.parse() 方法得到对象，然后将它赋给模块对象的 exports，以供外部调用。

## 核心模块
