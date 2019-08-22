// 加入ଇ߲nextTick()的回调函数
process.nextTick(function () {
  console.log('nextTickჽ׿执行1');
 });
 process.nextTick(function () {
  console.log('nextTickჽ׿执行2');
 });
 // 加入ଇ߲setImmediate()的回调函数
 setImmediate(function () {
  console.log('setImmediateჽ׿执行1');
  // 进入ူْ循环
  process.nextTick(function () {
  console.log('ഽ势֭入');
  });
 });
 setImmediate(function () {
  console.log('setImmediateჽ׿执行2');
 });
 console.log('正常执行'); 