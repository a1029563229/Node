
const http = require('http');
http.createServer((req, res) => {
  res.end('Hello World\n');
}).listen(8888, '0.0.0.0');