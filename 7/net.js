var net = require('net');
var server = net.createServer(function (socket) {
  // ႎ的૶接
  socket.on('data', function (data) {
    socket.write(`You print in ${data}`)
  });
  socket.on('end', function () {
    console.log('断开');
  });
  socket.write("Hello\n");
});
server.listen(8124, function () {
  console.log('server bound');
}); 