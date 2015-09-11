contentpack, for webpack
========================

[![Build Status](https://travis-ci.org/sleep/contentpack.svg)](https://travis-ci.org/freshdried/contentpack)

<br>

contentpack provides a *declarative* API to express *dynamic* dependencies for webpack.

contentpack generates JS code with static `require` calls to dynamically-expressed dependencies.

<br><br><br>

contentpack works with [**val-loader**](https://github.com/webpack/val-loader): a webpack loader that evaluates JS and bundles its generated code.

<br><br><br>
## motivation

webpack parses JS for `require(...)` strings for dependency analysis:

form             | type     | can resolve at compile time
---------------- | -------- | ------
`require("...")` | Static   | yes
`require(str)`   | Dynamic  | no

In the end, webpack needs to statically bundle all depedencies, so the question is how we handle dynamic dependencies.

#### webpack
webpack's built in answer to dynamic dependency resolution is with dynamic requires, via [`require.context`](http://webpack.github.io/docs/context.html#context-module-api)

However, for anything marginally more complex, `require.context` becomes difficult to shoehorn into with only three parameters to work with.

#### webpack + contentpack

The contentpack answer is with code that generates code: to dynamically express dependencies in code that evaluates to code with static dependencies.

This way, **contentpack** provides a solution to dynamic dependancy resolution that is
- **encapsulated**: keeps dependency-resolving meta-code away from code
- **modular**: works with webpack idioms, piggy-backing off of [val-loader](https://github.com/webpack/val-loader).
- **programmable**: program `contentpack.config.js` in nodejs.
- **extensible**: specify your own logic and write custom loaders in nodejs.
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
./
├── contentpack.config.js
└── main.js


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
