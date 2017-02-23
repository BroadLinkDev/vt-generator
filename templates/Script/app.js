'use strict';

module.exports = {
  onLaunch: function() {
    console.log("on Launch");
  },

  /**
 * Device control envent
 * @param {Buffer} data
 * @return {Object}
 */

  onDeviceControl: function(data) {
    // This is sample for sending string
    const str = data.toString('utf8');
    console.log("client revices device control command: " + str);
    var resStr = Buffer.from('client\'s response')
    var res = {
      data: resStr,
      errorCode: 0
    }
    return res
  },

  onUploadData: function(data) {
    // This is sample for sending obj
    const str = data.toString()
    var obj = JSON.parse(str)
    console.log("client revices uploading device data command: ");
    for (var key in obj) {
        console.log(key + ": " + obj[key]);
    }
    var resObj = {
      key1: 'value1',
      key2: 'value2'
    }
    const json = JSON.stringify(resObj)
    var jsonbuf = Buffer.from(json);
    var res = {
      data: jsonbuf,
      errorCode: 0
    }
    return res
  },

  onSubscribe: function(str) {
    console.log("client revices subscribing device command: " + str);
  }
}
