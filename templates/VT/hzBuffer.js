'use strict';

const headerLen = 56;
const MsgType = {
  HeartBeatQ       : {value: 0, description: 'HeartBeat Request'},
  HeartBeatP       : {value: 1, description: 'HeartBeat Response'},
  ControlQ         : {value: 2, description: 'Device Control Request'},
  ControlP         : {value: 3, description: 'Device Control Response'},
  DataUploadQ      : {value: 4, description: 'Data Upload Request'},
  DataUploadP      : {value: 5, description: 'Data Upload Response'},
  DeviceSubscribeQ : {value: 6, description: 'Device Subscribe Data Request'},
  DeviceSubscribeP : {value: 7, description: 'Device Subscribe Data Response'}
};

var _buf = Buffer.alloc(0);
var _buf_len = 0;

const deSerializeBuf = function(buf) {
  if (!buf) {
    return;
  }
  const left = _buf.length - _buf_len;
  if (left > buf.length) {
    buf.copy(_buf, _buf_len);
    _buf_len += buf.length;
  }else {
    _buf = Buffer.concat([_buf.slice(0, _buf_len), buf], (_buf_len + buf.length));
    _buf_len += buf.length;
  }
  var res;
  var rs = [];
  do {
    res = parse(_buf);
    _buf = _buf.slice(res[1]);
    _buf_len -= res[1];
    if (res[0]) {
      rs.push(res[0]);
    }
  } while (res[1] > 0);
  return rs;
};

const serializedBuf = function(msg_type, obj) {
  const json = JSON.stringify(obj)
  var jsonbuf = Buffer.from(json);

if (msg_type == MsgType.ControlP) {
  var base64Obj = {"data" : jsonbuf.toString('base64'), "error" : 0};
  jsonbuf = Buffer.from(JSON.stringify(base64Obj))
}

  const buf = Buffer.alloc(headerLen, 0);
  const magic_code = 0x5aa5a55a;
  buf.writeUInt32LE(magic_code, 0);
  const status = 0x0022;
  buf.writeUInt16LE(status, 4);
  buf.writeUInt16LE(msg_type.value, 6);
  const data_len = jsonbuf.length;
  buf.writeUInt16LE(data_len, 8);
  var checksum = 0x0000;
  buf.writeUInt16LE(checksum, 10);
  const version = 0x0000;
  buf.writeUInt16LE(version, 12);
  const encrypt = 0x0055;
  buf.writeUInt16LE(encrypt, 14);
  const sequence = 0x0000;
  buf.writeUInt16LE(sequence, 16);
  const reserved = 0x0066;
  buf.writeUInt16LE(reserved, 18);

  const bufA = Buffer.concat([buf, jsonbuf], (buf.length + jsonbuf.length))
  var checksum = 0xbeaf;
  for (const value of bufA.values()) {
    checksum += value;
  }

  bufA.writeUInt16LE(checksum, 10);
  return bufA;
};

function parse(buf) {
  if (buf.length < headerLen) {
    return [null, 0];
  }
  const dataLen = buf.readUInt16LE(8);

  if (buf.length < headerLen + dataLen) {
    return [null, 0];
  }
  const _checksum = buf.readUInt16LE(10);
  var checksum = 0xbeaf;
  for (var i = 0; i < headerLen + dataLen; i++) {
    if (i == 10 || i == 11) {
      continue;
    }
    checksum += buf[i];
  }

  if (checksum != _checksum) {
    // drop error data
    return [null, headerLen + dataLen];
  }
  const jsonStr = buf.toString('utf8' ,headerLen, (headerLen + dataLen));
  try {
    var obj = JSON.parse(jsonStr);
    obj.msgType = convertToMsg(buf.readUInt16LE(6));
    return [obj, headerLen + dataLen];
  } catch (e) {
    return [null, headerLen + dataLen];
  }
};

function convertToMsg(value) {
  for (var type in MsgType) {
    if (MsgType[type].value == value) {
      return MsgType[type]
    }
  }
};


exports.serializedBuf = serializedBuf;
exports.deSerializeBuf = deSerializeBuf;
exports.MsgType = MsgType;
