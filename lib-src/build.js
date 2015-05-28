//TODO: clean, fix
export default const build = function() {
    const projectRoot = Promise.try(function getProjectRoot () {
        return process.cwd();
    });

    const config = projectRoot.then(function loadConfig(root) {
        const config = require(root + "/fscms.config.js");
        return config;
    }).catch((e) => e.code === "MODULE_NOT_FOUND", function(e) {
        console.log("fscms.config.js not found!");
        process.exit(1);
    }).catch(function(e) {
        throw e;
        process.exit(1);
    });

    config.then(function(config) {
        // convert to k:v [k, v]
        return Object.keys(config.content).map((_) => [_, config.content[_]]);
    }).map(function(obj) { // convert
        const [key, value] = obj;
        const loader = value.loader
        let options = value;

        return Promise.resolve(loader(options))
            .then((str) => 
                "exports['" + key + "'] = " + str + ";");
    }).then(function(array) {
        console.log(array.join("\n\n\n"));
    }).catch((e) => e.code === "ENOENT", function(e) {
        console.log(e.cause.path);
        console.log("    was not found!");
    });
}
