var blog = require("val!./blog.js");

document.body.innerHTML = "<pre>"  + JSON.stringify(blog, null, 4) + "</pre>";
