"use strict";

var jsdoc2md = require("jsdoc-to-markdown");
var through = require("through2");
var gutil = require("gulp-util");
var PluginError = gutil.PluginError;
var PLUGIN_NAME = "gulp-jsdoc-to-markdown";

module.exports = gulpJsdoc2md;

function prefixStream(prefixText) {
  var stream = through();
  stream.write(prefixText);
  return stream;
}

function gulpJsdoc2md(options) {

  var stream = through.obj(function(file, enc, callback) {
    var self = this;
    
    if (file.isNull()) {
       // Do nothing if no contents
    }
    if (file.isBuffer()) {
        var buf = new Buffer(0);
        var jsdoc2mdStream = jsdoc2md.render(options);
        jsdoc2mdStream.on("readable", function(){
            var chunk = this.read();
            if (chunk) buf = Buffer.concat([ buf, chunk ]);
        });
        jsdoc2mdStream.on("end", function(){
            file.contents = buf;
            self.push(file);
            return callback();
        });
        jsdoc2mdStream.end(file.contents);
    }

    if (file.isStream()) {
        // file.contents = file.contents.pipe(prefixStream(prefixText));
        console.dir("isStream")
    }


  });

  return stream;
}