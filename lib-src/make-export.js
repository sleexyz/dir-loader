import Promise from "bluebird"

export default function(config) {
    Promise.try(function(config) {
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
