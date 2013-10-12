/*
 * Grunt Image Embed
 * https://github.com/ehynds/grunt-image-embed
 *
 * Copyright (c) 2012 Eric Hynds
 * Licensed under the MIT license.
 */

// Node libs
var fs = require("fs");
var path = require("path");

//xxxxx =  "text!yyyyyyyyy"
var regTemplatePattern1 = /["']{1}text\!([A-Za-z0-9-_\/]+\.html)["']{1}/g;



// Grunt export wrapper
exports.init = function (grunt) {
    "use strict";

    var exports = {};



    // Grunt utils
    var utils = grunt.utils || grunt.util;
    var file = grunt.file;
    var _ = utils._;
    var async = utils.async;

    /**
     * require-text ：为绝对路径，或者相对于起始目录的路径
     * @param srcFile
     * @param opts
     * @param lasceCallBackOut
     */
    exports.template = function (srcFile, opts, lasceCallBackOut) {
        opts = opts || {};

        // Cache of already converted images
        var cache = {};

        // Shift args if no options object is specified
        if (utils.kindOf(opts) === "function") {
            lasceCallBackOut = opts;
            opts = {};
        }

		
        var htmlSource = file.read(srcFile);



        var  htmlPath, htmlGroup;
        var htmlSrcArray={};

        async.whilst(
            function () {
                htmlGroup = regTemplatePattern1.exec(htmlSource);
                return htmlGroup != null;
            },
            function (complete) {




                 htmlPath = htmlGroup[1];

                if (htmlPath != null) {

                        exports.getTemplateString(htmlPath, opts, function (err, resp) {

                            htmlSrcArray[htmlGroup[0]]=resp ;
                            complete();
                        });

                }
            },
            function () {


                for(var prop in htmlSrcArray){


                  



                    htmlSource =  htmlSource.replace(prop,'"tplin!'+htmlSrcArray[prop]+'"');
                }


                lasceCallBackOut(null, htmlSource);
            });
    };


    exports.getTemplateString = function (templateSrc, opts, getFileDone) {


        if (utils.kindOf(opts) === "function") {
            getFileDone = opts;
            opts = {};
        }

        var getFileComplete = function (err, encoded) {
            if (err) {
                grunt.log.error(err);
                getFileDone(err, templateSrc, false);
            } else {
                getFileDone(null, encoded);
            }
        };


		var readFilePath = opts.baseDir + templateSrc;
grunt.log.writeln(readFilePath);
        if (!fs.existsSync(readFilePath)) {
            grunt.fail.warn("Template: " + readFilePath + " does not exist~~~~~~~~~~~~~~~");
            getFileComplete(null, templateSrc);
            return;
        }

        var srcHtml = fs.readFileSync(readFilePath);
        srcHtml =  new Buffer(srcHtml).toString('base64');     //encodeURIComponent(srcHtml);//

        var encoded =  srcHtml;
        getFileComplete(null, encoded);

    };


    return exports;
};
