var loaderUtils = require("loader-utils");

module.exports = function(content) {
    console.log("this.query", this.query);

    var query = loaderUtils.parseQuery(this.query);
    console.log("query", query);

    if (query.cacheable && this.cacheable)
        this.cacheable();
    if (this.inputValue) {
        return null, this.inputValue;
    } else {
        return this.exec(content, this.resource);
    }
}
