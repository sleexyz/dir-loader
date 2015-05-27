var fscms = require("../index.js")

//loaders
module.exports = {
    content: {
        blog: {
            loader: fscms.dir,
            path: "./blog",
            test: /\.md$/
        },
        // images: {
        //     loader: fscms.dir,
        //     path: "./images",
        //     test: /\.(jpg|jpeg|gif|png)$/
        // },
        // poop: {
        //     loader: fscms.file
        // }

    }
}
