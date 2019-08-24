const events = require("events");

function MyPromise(func) {
  this.events = new events.EventEmitter();
  this.func = func;
  this.queue = [];
  this.addSuccessHandler();
  return this.execute();
}

MyPromise.prototype.addSuccessHandler = function() {
  this.events.on("success", data => {
    const handler = this.queue.shift();
    if (!handler) return;
    const func = handler(data);

    if (func instanceof MyPromise) {
      func.then(data => {
        this.events.emit("success", data);
      });
    }
  });
}

MyPromise.prototype.execute = function() {
  const resolve = data => this.events.emit("success", data);
  const reject = error => this.events.emit("fail", error);
  this.func(resolve, reject);
  return this;
};

MyPromise.prototype.then = function(success) {
  this.queue.push(success);
  return this;
};

const fn = resolve => {
  setTimeout(() => {
    const n = 100;
    resolve(n);
  }, 500);
};

new MyPromise(fn).then(n1 => {
  console.log({ n1 });
  return new MyPromise(resolve => {
    setTimeout(() => {
      resolve(n1 * 100);
    }, 1000);
  });
}).then(n2 => {
  console.log({ n2 });
  return new MyPromise(resolve => {
    setTimeout(() => {
      resolve(n2 * 100);
    }, 1000);
  });
}).then(n3 => {
  console.log({ n3 });
  return new MyPromise(resolve => {
    setTimeout(() => {
      resolve(n3 * 100);
    }, 1000);
  });
});