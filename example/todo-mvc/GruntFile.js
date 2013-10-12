/*global module:false*/
module.exports = function(grunt) {
  "use strict";

  grunt.loadTasks("../tasks");

  grunt.initConfig({
      templateEmbed: {

        tpl: {

            /*src: ["template-embed*//*.js"],


            dest: 'css/ssss.js',

            options: {


                // Base directory if you use absolute paths in your stylesheet
                // baseDir: "/Users/ehynds/projects/grunt-image-embed/"
            }
*/

            files : [
                {
                    expand: true,
                    cwd : './',
                    src : 'template-embed/*',
                    filter : 'isFile',
                    dest : 'bd/'
                }
            ]


        }
    }
  });

  grunt.registerTask("default", ["templateEmbed"]);
};
