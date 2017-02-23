'use strict';

module.exports = {
  onLaunch: function() {
    console.log("on Launch");
  },

  onDeviceControl: function(obj) {
    console.log("revice device control command: " + obj);
  },

  onUploadData: function(obj) {
    console.log("revice uploading device data command: " + obj);
  },

  onSubscribe: function(obj) {
    console.log("revice subscribing device command: " + obj);
  }
}
