# contentpack, for webpack
[![Build Status](https://travis-ci.org/freshdried/contentpack.svg)](https://travis-ci.org/freshdried/contentpack)

Contentpack allows you to dynamically requires assets via a `content.config.js` file.

One might then imagine using webpack as a content managment system.

## install
```
npm install --save-dev val-loader
npm install --save contentpack

```

## use

```js
// main.js

var cp = require("val!./contentpack.config.js")

setTimeout(function() {
    // stuff is loaded lazily, so we get about.src only when we call for it
    console.log(content.blog.about.src);
}, 1000)
```

```js
// contentpack.config.js
//
// You can actually name this file whatever you want...

var contentpack = require("contentpack");
var dir = contentpack.loaders.dir

module.exports = contentpack({
    blog: {
        loader: dir,
        path: "./blog",
        filter: /\.md$/
    },
})
```

## how
```js
var content = require("val!./content.config.js")
```

Webpack loads 'content.config.js' with [val-loader](https://github.com/webpack/val-loader). `val-loader` executes `./content.config.js`, which exports a string that webpack treats as javascript code. Within this exports string are the webpack-optimized `require` calls to your content.
