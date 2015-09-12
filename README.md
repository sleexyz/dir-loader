contentpack, for webpack
========================

[![Build Status](https://travis-ci.org/sleep/contentpack.svg)](https://travis-ci.org/sleep/contentpack)

contentpack lets you load a directory dynamically in [webpack](webpack.github.io).

<br><br><br>
## install
```
npm install --save-dev val-loader
npm install --save contentpack
```

## use

```js
// ./entry.js

import blog_files from "val!./blog-files.js";

console.log(Object.keys(blog_files));

// ./hello.md
// ./world.md
```

```js
// ./blog.js

import contentpack from "contentpack";

export default contentpack({
  path: "/home/user/website/blog/",
  filter: /\.md$/
});
```

```
./
├── blog.js
└── entry.js


/home/user/website/
└── blog
    ├── This_is_ignored.js
    ├── hello.md
    └── world.md
```

## alternatives
webpack's [`require.context`](http://webpack.github.io/docs/context.html#require-context)
