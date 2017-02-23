const net = require('net');

const HOST = '127.0.0.1';
const PORT = 16640;
const hzBuffer = require('./hzBuffer.js');

var i = 0
net.createServer(function(sock) {
  sock.on('data', function(buf) {
    if (Buffer.isBuffer(buf) == false) {
      return;
    }
    const objs = hzBuffer.deSerializeBuf(buf);
  });
  sock.on('end', function(data) {

  });
  sock.on('error', (err) => {
    console.error(err);
  });

}).listen(PORT, HOST);
