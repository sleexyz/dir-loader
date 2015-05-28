var dirLoader = require("./lib/dir-loader");
var fileLoader = require("./lib/file-loader");
var makeExport = require("./lib/make-export");
var toExport = function(config) {
    return makeExport(config);
}

toExport.loaders = {
    dir: dirLoader,
    file: fileLoader
};

module.exports = toExport;
