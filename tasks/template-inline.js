
var grunt_encode = require("./lib/encode");

module.exports = function(grunt) {
  "use strict";

  // Grunt lib init
  var tplEncode = grunt_encode.init(grunt);

  // Grunt utils
  var async = grunt.util.async;

  grunt.registerMultiTask("templateEmbed", "", function() {

    var opts = this.options();
    var done = this.async();

    ///循环每个文件
    this.files.forEach(function(file) {

      var dest = file.dest;

      var tasks;

      tasks = file.src.map(function(srcFile) {
        return function(callback) {
            tplEncode.template(srcFile, opts, callback);
        };
      });

      // 回调函数
      async.parallel(tasks, function(err, output) {
        grunt.file.write(dest, output);
       // grunt.log.writeln('File "' + dest + '" created.');
        done();
      });
    });
  });

};
