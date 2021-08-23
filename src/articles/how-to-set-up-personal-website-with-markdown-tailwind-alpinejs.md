---
title: How to set up a personal website with 11ty, Markdown, TailwindCSS, and Alpine.js
description: How to set up a personal website with 11ty, Markdown, TailwindCSS, and Alpine.js
date: 2021-08-23
author: Maciej Janowski
image: /assets/img/articles/howtofreelance.png
og_image: /assets/img/articles/howtofreelance.png
layout: layouts/article
tags: articles
---

So I rebuild my website for about 100th time.
I was testing out some new website stacks, and this is the one I particularly enjoy.

We will use:
* 11ty static site generator
* markdown files for content such as blog posts and projects
* Tailwind to add some styling 
* Alpine.js for some interactivity, e.g mobile menu
* Netlify to host our website 

When finished you will have a  website that you can use as your personal developer portfolio. 
Show it  to your employers or clients to showcase your work and establish expertise.

This tutorial assumes you have basic understanding of Tailwind, HTML, JavaScript, and npm.

## Getting Started

Create a new directory for our project, and initialize it with package.json

    npm init -y

Now let's install eleventy, tailwind, and posts
    npm install --save-dev @11ty/eleventy tailwindcss postcss-cli autoprefixer
    
Now let's create a index.liquid file (liquid is one of the templating languages supported by 11ty )

```liquid
---
title: Home Page
description: This is our homepage
layout: layouts/main
---
<h1>{{ title }}</h1>
<p>{{ description }}</p>

```

The code between --- signs is the front matter. 
Here we define variables for different pages. We can access them in our html using double curly brackets  (if you used Django this should be familiar to you)

Layout variable is to point 11ty to a file that our page will use.
This way we can reuse the same code across many pages with out writing it more than once.

## Templating

Let's create a directory called `_includes`, this is where we can create reusable blocks of code for layouts, and components.
Let's create another directory called `layouts` and inside a file for our HTML boilerplate `main.liquid`

```liquid
---
title: Default Title
---
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>{{ title }}</title>
    {% if description %}
        <meta name="description" content="{{description}}" />
    {% endif %}

    <link rel="stylesheet" href="/style.css?v={% version %}" />

</head>

<body>
    <div id="content">
        {% block content %}
            {{ content | safe }}
        {% endblock %}
    </div>
</body>

</html>
```

## TailwindCSS Config

Create a folder called `styles` and a file inside `tailwind.config.js`

```json
module.exports = {
  purge: [
    '_site/**/*.html',
  ],
  darkMode: false,
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
```

Create another file in `styles` folder called `tailwind.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

In the root directory of the project create a `posts.config.js` file

```javascript
module.exports = {
  plugins: [
    require(`tailwindcss`)(`./styles/tailwind.config.js`),
    require(`autoprefixer`),
  ],
}
```

## Setting up the project

Create a `.gitignore` file in root directory

```
_site/
_tmp/
.DS_Store
node_modules/
package-lock.json
```

Next create a `.eleventyignore` file
```
node_modules
```

Finally let's create 11ty configuration file `.eleventy.js` 
```javascript
const now = String(Date.now())

module.exports = function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false)

  eleventyConfig.addWatchTarget('./_tmp/style.css')

  eleventyConfig.addPassthroughCopy({ './_tmp/style.css': './style.css' })

  eleventyConfig.addShortcode('version', function () {
    return now
  })
};
```

Now update `package.json` file with scripts to start the build.

```json
{
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "eleventy --serve & postcss styles/tailwind.css --o _tmp/style.css --watch",
    "build": "ELEVENTY_PRODUCTION=true eleventy & NODE_ENV=production postcss styles/tailwind.css --o _site/style.css"
  },
  "devDependencies": {
    "@11ty/eleventy": "^0.12.1",
    "autoprefixer": "^10.3.2",
    "postcss-cli": "^8.3.1",
    "tailwindcss": "^2.2.7"
  }
}
```

Now we can build the project

```
npm run build
```

And to start the site

```
npm run start
```

Open `http://localhost:8080` in your browser and you should see this in your browser 

![Website screenshot](https://janowski.dev/assets/img/articles/screenshots/sc1.png)

## Optimising HTML

Now we want to improve our site by minifing HTML and cleaning CSS. Install required packages

```
npm install --save-dev html-minifier clean-css-cli
```

Next update `.eleventy.js`

```javascript
const htmlmin = require('html-minifier')

const now = String(Date.now())

module.exports = function (eleventyConfig) {
  eleventyConfig.setUseGitIgnore(false)

  eleventyConfig.addWatchTarget('./_tmp/style.css')

  eleventyConfig.addPassthroughCopy({ './_tmp/style.css': './style.css' })

  eleventyConfig.addShortcode('version', function () {
    return now
  })

  eleventyConfig.addTransform('htmlmin', function (content, outputPath) {
    if (
      process.env.ELEVENTY_PRODUCTION &&
      outputPath &&
      outputPath.endsWith('.html')
    ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified
    }

    return content
  })
}
```

Lastly update the build script in `package.json`

```json
{
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "eleventy --serve & postcss styles/tailwind.css --o _tmp/style.css --watch",
    "build": "ELEVENTY_PRODUCTION=true eleventy && NODE_ENV=production postcss styles/tailwind.css --o _site/style.css && cleancss _site/style.css -o _site/style.css"
  },
  "devDependencies": {
    "@11ty/eleventy": "^0.12.1",
    "autoprefixer": "^10.3.2",
    "clean-css-cli": "^5.3.3",
    "html-minifier": "^4.0.0",
    "postcss-cli": "^8.3.1",
    "tailwindcss": "^2.2.7"
  }
}
```

Run `npm run build` again and you should see your files in `_site` directory take less space

## Adding Alpine.js

Now for the last bit of configuration let's add Alpine.js.
First install it through npm
```
npm install --save-dev alpinejs
```

Update the `.eleventy.js` file 

```
eleventyConfig.addPassthroughCopy({
  './node_modules/alpinejs/dist/cdn.js': './js/alpine.js',
})
```

Finally update the `_includes/layouts/main.liquid`, by importing alpine in the `<head>` 

```html
<script src="/js/alpine.js?v={% version %}"></script>
```

Now let's complete the website by adding pages, blog pages and styling it
