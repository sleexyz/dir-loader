# Dinocms, for webpack
> DIrectories ftw! Say NO to CMS!

Generate webpack code that explicity requires your content for you.
Abstract away static external content from your app code.

## install
```
npm install -g dinocms
```

## use
```
touch dinocms.toml
```

```toml
# This is an example dinocms.toml

[ images ]
type = "directory"
path = "/Users/sean/Google Drive/website/images/"
filter = "/\.(jpg|jpeg|gif|png)$/i"

[ blog ]
type = "directory"
path = "/Users/sean/Google Drive/website/entries/"
filter = "/\.md$/"
```








### never-ly asked questions:

#### webpack has [dynamic requires!](https://github.com/webpack/webpack/tree/master/examples/require.context#examplejs)
Webpack's dynamic requiring necessitates static compilation of all possibly-required modules. Because Webpack is simply a bundler for static websites; everything must be loaded at compile time. So if you don't explicitly know the paths of the assets within your directory, you cannot require them.

Dinocms tells webpack exactly what needs to be required for you before compilation.


#### why not just make this some kind of webpack loader?
Too complicated... Maybe later... web

### todo:
- add debug mode
- write testss
- add help message
