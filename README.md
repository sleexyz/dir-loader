# content-loader, for webpack

Use webpack as a cms!

```js
// main.js
var content = require("content!./content.config.js")

setTimeout(function() {
    // requires are loaded lazily, so we get about.src only when we call for it
    console.log(content.blog.about.src);
}, 1000);
```

## how
```js
var content = require("content!./content.config.js")
```
Evaluates the contents of 'content.js', much like [val-loader](https://github.com/webpack/val-loader). The output is valid, `require`-able javascript. Inside the output code are `require` calls to your content.


## install

## use

```js
// main.js
var content = require("content!./content.js")

setTimeout(function() {
    // stuff is loaded lazily, so we get about.src only when we call for it
    console.log(content.blog.about.src);
}, 1000)
```

```js
// content.js
var cl = require("content-loader")

module.exports = cl({
    blog: {
        loader: cl.dir,
        path: "./blog",
        filter: /\.md$/
    },
})
```
