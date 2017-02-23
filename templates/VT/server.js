'use strict';

const net = require('net');

const HOST = '127.0.0.1';
const PORT = 16640;
const hzBuffer = require('./hzBuffer.js');

var ti = 0
net.createServer(function(sock) {
  sock.on('data', function(buf) {
    if (Buffer.isBuffer(buf) == false) {
      return;
    }
    const objs = hzBuffer.deSerializeBuf(buf);
    for (var i = 0; i < objs.length; i++) {
      handle(objs[i])
      ti++
    }
  });
  sock.on('end', function(data) {

  });
  sock.on('error', (err) => {
    console.error(err);
  });

}).listen(PORT, HOST);

function handle(obj) {
  if (obj.msgType == MsgType.HeartBeatQ) {
    var buf = Buffer.fron('get the heart beat request')
    var obj = {
      data: buf,
      errorCode: 0
    }
    net.write(hzBuffer.serializedBuf(MsgType.HeartBeatP, obj));
    if (ti == 1) {
      this.sendControlCommond()
    }
    if (ti == 2) {
      this.sendUploadCommond()
    }
    return
  }

}

function sendControlCommond() {
  var buf = Buffer.from('open something')
  var obj = {
    data: buf,
    errorCode: 0
  }
  net.write(hzBuffer.serializedBuf(MsgType.HeartBeatP, obj));
}

function sendUploadCommond() {

}
