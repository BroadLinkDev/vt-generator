'use strict';

const net = require('net');

const HOST = '127.0.0.1';
const PORT = 16640;
const hzBuffer = require('./hzBuffer.js');
const MsgType = hzBuffer.MsgType;

var ti = 0
var that = this
net.createServer(function(sock) {
  sock.on('data', function(buf) {
    if (Buffer.isBuffer(buf) == false) {
      return;
    }
    const objs = hzBuffer.deSerializeBuf(buf);
    for (var i = 0; i < objs.length; i++) {
      ti++
      const re = handle(objs[i])
      if (re != null) {
        sock.write(re)
      }
      if (ti == 1) {
        sock.write(sendControlCommond())
      }
      if (ti == 2) {
        sock.write(sendUploadCommond())
      }
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
    var buf = Buffer.from('get the heart beat request')
    var obj = {
      data: buf,
      errorCode: 0
    }
    return hzBuffer.serializedBuf(MsgType.HeartBeatP, obj);
  }

  if (obj.msgType == MsgType.ControlP) {
    const str = obj.data.toString('utf8');
    console.log("server revices device control response: " + str);
  }

  if (obj.msgType == MsgType.DataUploadP) {
    const str = obj.data.toString('utf8');
    var obj = JSON.parse(str)
    console.log("server revices uploading device data response: ");
    for (var key in obj) {
      console.log(key + ": " + obj[key]);
    }
  }

  return null
}

function sendControlCommond() {
  var buf = Buffer.from('open something')
  var obj = {
    data: buf,
    errorCode: 0
  }
  return hzBuffer.serializedBuf(MsgType.ControlQ, obj);
}

function sendUploadCommond() {
  var resObj = {
    keya: 'valuea',
    keyb: 'valueb'
  }
  const json = JSON.stringify(resObj)
  var jsonbuf = Buffer.from(json);
  var obj = {
    data: jsonbuf,
    errorCode: 0
  }
  return hzBuffer.serializedBuf(MsgType.DataUploadQ, obj);
}
