import Promise from "bluebird"

export default function(config) {
    return Object.keys(config.content).map(
            (_) => [_, config.content[_]]

        ).map(function(obj) { // convert
            const key = obj.key
            const options = obj.options
            const loader = options.loader
            return [key, options.loader(options))];

        }).map((kv) =>
            "exports['" + kv[0] + "'] = " + kv[1] + ";")
        ).join("\n\n\n");
}
