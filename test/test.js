'use strict';

var assert = require('assert');
var exec = require('child_process').exec;
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var request = require('supertest');
var rimraf = require('rimraf');
var spawn = require('child_process').spawn;
var validateNpmName = require('validate-npm-package-name')

var binPath = path.resolve(__dirname, '../bin/express');
var TEMP_DIR = path.resolve(__dirname, '..', 'temp', String(process.pid + Math.random()))

describe('vtvt(1)', function() {
  before(function (done) {
    this.timeout(30000);
    cleanup(done);
  });

  after(function (done) {
    this.timeout(30000);
    cleanup(done);
  });

  describe('(no args)', function () {
    var ctx = setupTestEnvironment(this.fullTitle())

    it('should create basic app', function (done) {
      runRaw(ctx.dir, [], function (err, code, stdout, stderr) {
        if (err) return done(err);
        ctx.files = parseCreatedFiles(stdout, ctx.dir)
        ctx.stderr = stderr
        ctx.stdout = stdout
        assert.notEqual(ctx.files.length, 0)
        done();
      });
    });

  });

});

function cleanup(dir, callback) {
  if (typeof dir === 'function') {
    callback = dir;
    dir = TEMP_DIR;
  }

  rimraf(dir, function (err) {
    callback(err);
  });
}

function npmInstall(dir, callback) {
  var env = Object.create(null)

  // copy the environment except for "undefined" strings
  for (var key in process.env) {
    if (process.env[key] !== 'undefined') {
      env[key] = process.env[key]
    }
  }

  exec('npm install', {cwd: dir, env: env}, function (err, stderr) {
    if (err) {
      err.message += stderr;
      callback(err);
      return;
    }

    callback();
  });
}

function parseCreatedFiles(output, dir) {
  var files = [];
  var lines = output.split(/[\r\n]+/);
  var match;

  for (var i = 0; i < lines.length; i++) {
    if ((match = /create.*?: (.*)$/.exec(lines[i]))) {
      var file = match[1];

      if (dir) {
        file = path.resolve(dir, file);
        file = path.relative(dir, file);
      }

      file = file.replace(/\\/g, '/');
      files.push(file);
    }
  }

  return files;
}

function run(dir, args, callback) {
  runRaw(dir, args, function (err, code, stdout, stderr) {
    if (err) {
      return callback(err);
    }

    process.stderr.write(stripWarnings(stderr))

    try {
      assert.equal(stripWarnings(stderr), '')
      assert.strictEqual(code, 0);
    } catch (e) {
      return callback(e);
    }

    callback(null, stripColors(stdout))
  });
}

function runRaw(dir, args, callback) {
  var argv = [binPath].concat(args);
  var exec = process.argv[0];
  var stderr = '';
  var stdout = '';

  var child = spawn(exec, argv, {
    cwd: dir
  });

  child.stdout.setEncoding('utf8');
  child.stdout.on('data', function ondata(str) {
    stdout += str;
  });
  child.stderr.setEncoding('utf8');
  child.stderr.on('data', function ondata(str) {
    stderr += str;
  });

  child.on('close', onclose);
  child.on('error', callback);

  function onclose(code) {
    callback(null, code, stdout, stderr);
  }
}

function setupTestEnvironment (name) {
  var ctx = {}

  before('create environment', function (done) {
    ctx.dir = path.join(TEMP_DIR, name.replace(/[<>]/g, ''))
    mkdirp(ctx.dir, done)
  })

  after('cleanup environment', function (done) {
    this.timeout(30000)
    cleanup(ctx.dir, done)
  })

  return ctx
}

function stripColors (str) {
  return str.replace(/\x1b\[(\d+)m/g, '_color_$1_')
}

function stripWarnings (str) {
  return str.replace(/\n(?:  warning: [^\n]+\n)+\n/g, '')
}
