# contentpack, for webpack
[![Build Status](https://travis-ci.org/freshdried/contentpack.svg)](https://travis-ci.org/freshdried/contentpack)

contentpack provides a *declarative* way to *dynamically* require modules via a `contentpack.config.js` file.


> If **webpack** is a **module bundler** for modules with static dependencies...

> ...then **contentpack** is a **module generator** that generates static references to dynamic dependencies.


## motivation

webpack parses JS for `require(...)` strings for dependency analysis:

form             | type               | can resolve at compile time
---------------- | ------------------ | ------
`require("...")` | Static dependency  | yes
`require(str)`   | Dynamic dependency | no

#### webpack only
webpack's out-of-the-box answer to dynamic dependencies is [`require.context`](http://webpack.github.io/docs/context.html#context-module-api)

However, this method is quite limited in usage with only three parameters.

#### webpack + contentpack

contentpack comes in as a more powerful and expressive way to specify dynamic dependencies.
*contentpack is*
- *modular*: contentpack piggy-backs off of `val-loader`.
- *programmable*: write `contentpack.config.js` in nodejs.
- *extensible*: write your own custom loaders in nodejs.
- *easy*: 
```js
var content = require('val!./contentpack.config.js')
```

## install
```
npm install --save-dev val-loader
npm install --save contentpack
```

## use

```js
// ./contentpack.config.js

var contentpack = require("contentpack");
var dir = contentpack.loaders.dir,
    file = contentpack.loaders.file;

module.exports = contentpack({
    blog: {
        loader: dir,
        path: "/home/slee2/website/blog/",
        filter: /\.md$/
    },
    about: {
        loader: file,
        path: "/home/slee2/website/about.md"
    }
})
```

```
$ tree ./
./
├── contentpack.config.js
└── main.js

$ tree /home/slee2/website/
/home/slee2/website/
├── about.md
└── blog
    ├── hello.md
    └── world.md
```

```js
// ./entry.js

var content = require("val!./contentpack.config.js");

// we declared .../about.md to be loaded as a file
var about = content.about;
var aboutDiv = document.getElementById("about");
aboutDiv.innerHTML = about.src;

// we declared .../blog/ to be loaded as a directory
var posts = content.blog;
var postsDiv = document.getElementById("posts");
postsDiv.innerHTML = "";
Object.keys(posts).forEach(function(filename) {
    postsDiv.innerHTML += posts[filename].src;
});
```

## how
```js
var content = require("val!./content.config.js")
```

1. Webpack loads `./content.config.js` with [val-loader](https://github.com/webpack/val-loader). Instead of packing it, `val-loader` first evaluates `./content.config.js`.
2. With the help of contentpack, `./content.config.js` generates and exports a string of valid JS code with all your dynamic content `require`'d.
3. Finally, `val-loader` tells webpack to pack this *generated code* as JS.
