const events = require("events");

function MyPromise(fn) {
  this.events = new events.EventEmitter();
  this.fn = fn;
  return this.execute();
}

MyPromise.prototype.execute = function() {
  const resolve = data => this.events.emit("success", data);
  const reject = error => this.events.emit("fail", error);
  fn(resolve, reject);
  return this;
};

MyPromise.prototype.then = function(success) {
  this.events.once("success", success);
  return this;
};

const fn = resolve => {
  setTimeout(() => {
    const data = "Test";
    resolve(data);
  }, 1000);
};

new MyPromise(fn).then(data => {
  console.log({ data });
  return 10;
});
