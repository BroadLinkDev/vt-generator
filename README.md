vt-generator
==========

Broadlink VT application generator

## Installation

```bash
  $ npm install -g vt-generator
```

## Quick Start

The quickest way to get started building a VT application is to utilize the executable `vtvt(1)` to generate an application as shown below:

Create the app:

```bash
  $ vtvt /tem && cd /tem/Script
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

## License

[MIT](LICENSE)
