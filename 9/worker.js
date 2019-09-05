const http = require('http');

const HOST = '0.0.0.0';
const PORT = Math.round((1 + Math.random()) * 10000);
http.createServer((req, res) => {
  res.end('Hello World');
}).listen(PORT, HOST);
console.log(`Server is listening in http://${HOST}:${PORT}`);