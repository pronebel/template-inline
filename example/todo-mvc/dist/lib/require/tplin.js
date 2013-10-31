
define(function(require, exports) {

    exports.version = "0.1.1";

    exports.load = function(name, req, load, config) {
        var tplString = decodeURIComponent(name);  //
        //var tplString = Base64.decode(name); //  decode user base64
        return load(tplString);
    };
});

