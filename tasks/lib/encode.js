/*
 * Template-inline
 * https://github.com/pronebel/template-inline
 *
 * Copyright (c) 2013 nebel
 * Licensed under the MIT license.
 */


var fs = require("fs");
var path = require("path");


var regTemplatePattern1 = /["']{1}text\!([A-Za-z0-9-_\/]+\.[A-Za-z0-9]+)["']{1}/g;

exports.init = function (grunt) {
    "use strict";

    var exports = {};

    var utils = grunt.utils || grunt.util;
    var file = grunt.file;
    var _ = utils._;
    var async = utils.async;

    exports.template = function (srcFile, opts, lasceCallBackOut) {
        opts = opts || {};
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

                    while(htmlSource.indexOf(prop)>-1){
                        htmlSource =  htmlSource.replace(prop,'"tplin!'+htmlSrcArray[prop]+'"');
                    }
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

        if (!fs.existsSync(readFilePath)) {
            grunt.fail.warn("Template: " + readFilePath + " does not exist!");
            getFileComplete(null, templateSrc);
            return;
        }

        var srcHtml = fs.readFileSync(readFilePath);
        srcHtml = (opts.type=="uri") ? encodeURIComponent(srcHtml) : new Buffer(srcHtml).toString('base64');

        var encoded =  srcHtml;
        getFileComplete(null, encoded);

    };

    return exports;
};
