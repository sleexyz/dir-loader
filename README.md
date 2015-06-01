# contentpack, for webpack
[![Build Status](https://travis-ci.org/freshdried/contentpack.svg)](https://travis-ci.org/freshdried/contentpack)

contentpack provides a *declarative* way to *dynamically* require modules via a `contentpack.config.js` file.

If **webpack** is a **module bundler** for modules with **static dependencies**...

...then **contentpack** is a **module generator** that generates static dependencies from **dynamic dependencies**.



## motivation

webpack's `require(...)` parser is advanced enough to support [dynamic requires](http://webpack.github.io/docs/context.html#dynamic-requires), but falls short when you want to `require` each file in a directory without knowing the names of the files. 

With just webpack, *you need to require each file manually*...

</br>
...but by adding contentpack to the equation, you can simply name a directory and have it generate code with a `require` call for each one of its files.

You can think of contentpack as a **content management system** for your webpack project.

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

1. Webpack loads `content.config.js` with [val-loader](https://github.com/webpack/val-loader). `val-loader` evaluates `./content.config.js` at compile time (as opposed to packing it as js).
2. With the help of contentpack, `./content.config.js` generates and exports a string of valid JS code with all your dynamic content requires.
3. Finally, `val-loader` tells webpack to pack this *generated code* as JS.
