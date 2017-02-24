vt-generator
==========

Broadlink VT application generator

[![Build Status](https://travis-ci.org/BroadLinkDev/vt-generator.svg?branch=master)](https://travis-ci.org/BroadLinkDev/vt-generator)
## Installation

```bash
  $ sudo npm install -g vt-generator
```

## Quick Start

The quickest way to get started building a VT application is to utilize the executable `vtvt(1)` to generate an application as shown below:

Create the app:

```bash
  $ vtvt ./tem && cd ./tem/Script
```

Test your app:

```bash
  $ node server.js
  $ node main.js
```

## Command Line Options

This generator can also be further configured with the following command line flags.

```
-h, --help          output usage information
    --version       output the version number
    --git           add .gitignore
-f, --force         force on non-empty directory

```

## Notice

`device.config`,`Script/main.js` and `Script/hzBuffer.js` are created and maintained by VT container. Local modifications of these files **won't** work in the real device. Please open pull requests or issues when you have any question.

`Script/server.js` is only a sample for local testing, custimze it as you like.

The `app.js` defines four functions: `onLaunch`, `onDeviceControl`, `onUploadData` and `onSubscribe`, which are called by the `main.js` in response to important events in the lifetime of your app.

## License

[MIT](LICENSE)
