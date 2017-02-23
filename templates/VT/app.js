'use strict';

module.exports = {
  onLaunch: function() {
    console.log("on Launch");
  },

  onDeviceControl: function(str) {
    console.log("revice device control command: " + str);
  },

  onUploadData: function(str) {
    console.log("revice uploading device data command: " + str);
  },

  onSubscribe: function(str) {
    console.log("revice subscribing device command: " + str);
  }
}
