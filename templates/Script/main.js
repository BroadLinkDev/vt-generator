'use strict';

const net = require('net');
const HOST = '127.0.0.1';
const PORT = 16640;

const client = new net.Socket();
const hzBuffer = require('./hzBuffer.js');
const MsgType = hzBuffer.MsgType;
const fs = require('fs');

const app = require('./app.js')

var deviceInfo;

fs.readFile(__dirname + '/../device.config', 'utf8', function (err, data) {
  if (err) {
    console.log(err);
    return;
  }
  var obj = JSON.parse(data)

  deviceInfo = {
    'did' : obj.did,
    'devtype' : obj.pid,
    'name' : obj.name
  }
});



app.onLaunch()

var noHBTimes = 0;
connect();

function dataEventHandler(buf) {
  if (Buffer.isBuffer(buf) == false) {
    return;
  }
  const objs = hzBuffer.deSerializeBuf(buf);
  for (var obj of objs) {
    handle(obj);
  }
}
client.on('data', dataEventHandler);

client.on('error', function() {

});

setInterval(function() {
  client.write(hzBuffer.serializedBuf(MsgType.HeartBeatQ, deviceInfo));
  noHBTimes++;
  if (noHBTimes > 4) {
    connect();
  }
}, 5000);

var connectEventHandler = function() {

};

function connect() {
  noHBTimes = 0;
  client.connect(PORT, HOST);
}

function handle(obj) {
  if (obj.msgType == MsgType.HeartBeatP) {
    noHBTimes = 0;
  }
  if (obj.msgType == MsgType.ControlQ) {
    const response = app.onDeviceControl(obj.data)
    client.write(hzBuffer.serializedBuf(MsgType.ControlP, response));
  }
  if (obj.msgType == MsgType.DataUploadQ) {
    const response = app.onUploadData(obj.data)
    client.write(hzBuffer.serializedBuf(MsgType.DataUploadP, response));
  }
  if (obj.msgType == MsgType.DeviceSubscribeQ) {
    const response = app.onSubscribe(obj.data)
    client.write(hzBuffer.serializedBuf(MsgType.DeviceSubscribeP, response));
  }
}
