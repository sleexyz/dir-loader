var dir = require("./lib/dir-loader");
var file = require("./lib/file-loader");
var makeExport = require("./lib/make-export");
var toExport = function(config) {
    return makeExport(config);
}

toExport.loaders = {
    dir: dir,
    file: file
};

module.exports = toExport;
