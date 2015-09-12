var makeExport = require("./lib/make-export");
var toExport = function(config) {
    return makeExport(config);
}

module.exports = toExport;
