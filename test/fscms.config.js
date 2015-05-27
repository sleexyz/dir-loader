var fscms = require("../index.js")

//loaders
module.exports = {
    content: {
        blog: {
            loader: fscms.dir,
            path: "./blog",
            filter: /\.md$/
        },
        images: {
            loader: fscms.dir,
            path: "./images",
            filter: /\.(jpg|jpeg|gif|png)$/
        },
        poop: {
            loader: fscms.file
        }

    }
}
