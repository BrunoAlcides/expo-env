#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var prompt = require('prompt');
var defaultOptions = require('./default');

var args = process.argv.slice(2);

// --configPath=./config
var cliOptions = {};
args.forEach(function (arg) {
  var splitArr = arg.split('=');
  if (splitArr.length) {
    var k = splitArr[0].split('--');
    var v = splitArr.pop();
    if (k.length) {
      k = k.pop();
      cliOptions[k] = v;
    }
  }
});

var options = Object.assign({}, defaultOptions, cliOptions);
var passedEnv = options.env || "development";

prompt.start();

buildConfig(passedEnv);

function buildConfig(env) {
  var fpath = path.join(process.cwd(), options.configFile),
    envFilePath = path.join(process.cwd(), options.configPath,  env + "." + options.template),
    envFile,
    targetFile,
    config;

  if (!fs.existsSync(envFilePath)) {
    console.log("FAIL:", env + "." + options.template, "config file not found, aborting!");
    return;
  }

  envFile = require(envFilePath) || {};

  if (fs.existsSync(fpath)) {
    config = JSON.parse(fs.readFileSync(path.join(process.cwd(), options.configFile), 'utf8')) || {};
    config.expo = config.expo || {};
    config.expo.extra = envFile;
    fs.writeFileSync(path.join(process.cwd(), options.outputFile), JSON.stringify(config, null, 2), 'utf8');
  }
}

function createConfigFile() {
  var appJson = fs.readFileSync(path.join(process.cwd(), options.outputFile), "utf8");
  fs.writeFileSync(path.join(process.cwd(), options.configFile), appJson, 'utf8');
}
