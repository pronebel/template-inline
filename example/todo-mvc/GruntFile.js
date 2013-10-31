/*global module:false*/
module.exports = function(grunt) {
  "use strict";

  grunt.loadTasks("../../tasks");

  grunt.initConfig({

      templateInline: {

        tpl: {
            files : [
                {
                    expand: true,
                    cwd : 'js/',
                    src : '**/*.js',
                    filter : 'isFile',
                    dest : 'dist/'
                }
            ],
            options: {

                // Base directory if you use absolute paths in your stylesheet
                baseDir: "js/",
                type:"uri" //base4 or uri
            }


        }
    }
  });

  grunt.registerTask("default", ["templateInline"]);
};
