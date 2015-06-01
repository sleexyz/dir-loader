contentpack, for webpack
========================

[![Build Status](https://travis-ci.org/freshdried/contentpack.svg)](https://travis-ci.org/freshdried/contentpack)

<br>

contentpack provides a *declarative* API to *dynamically* express dependencies for webpack.

<br><br><br>

contentpack works with [**val-loader**](https://github.com/webpack/val-loader): a webpack loader that evaluates JS and bundles its generated code. The contentpack API helps you write that code that generates code. That generated code has your original dynamically-expressed dependencies, but now statically linked).

<br><br><br>
## motivation

webpack parses JS for `require(...)` strings for dependency analysis:

form             | type               | can resolve at compile time
---------------- | ------------------ | ------
`require("...")` | Static dependency  | yes
`require(str)`   | Dynamic dependency | no

In the end, webpack needs to statically link all depedencies, so the question is how we resolve the dynamic dependencies.

#### webpack
webpack's built in answer to dynamic dependency resolution is via [`require.context`](http://webpack.github.io/docs/context.html#context-module-api)

However, for anything marginally more dependency-wise complex, `require.context` is limited in usage with only three parameters to work with.

#### webpack + contentpack

The contentpack answer is with code that generates code: to dynamically express dependencies in code that evaluates to code with static dependencies.

This way, **contentpack** provides a solution to dynamic dependancy resolution that is
- **encapsulated**: it keeps dependency-resolving meta-code away from code
- **modular**: it works with webpack idioms, piggy-backing off of [val-loader](https://github.com/webpack/val-loader).
- **programmable**: you program `contentpack.config.js` in nodejs.
- **extensible**: you can use write custom loaders in nodejs.
- **easy**: 
```js
var content = require('val!./contentpack.config.js')
```
<br><br><br>
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
