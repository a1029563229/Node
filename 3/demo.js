setImmediate(() => {
  console.log(3);
});

setTimeout(() => {
  console.log(1);
});

process.nextTick(() => {
  console.log(2);
});

new Promise(resolve => resolve()).then(() => console.log(4));

console.log(5);

// 5 2 4 1 3