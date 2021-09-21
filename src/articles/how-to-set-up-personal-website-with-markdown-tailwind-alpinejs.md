---
title: How to set up a personal website with 11ty, Markdown, TailwindCSS, and Alpine.js
description: How to set up a personal website with 11ty, Markdown, TailwindCSS, and Alpine.js
date: 2021-08-23
author: Maciej Janowski
image: /assets/img/articles/eleventy.png
og_image: /assets/img/articles/eleventy.png
layout: layouts/article
tags: articles
keywords: 11ty, eleventy, website development, web dev, web design, tailwindcss, tailwind, alpine.js, markdown, github, netlify
---
{% raw %}

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
    <div id="content" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div class="max-w-3xl mx-auto">
            {% block content %}
            {{ content | safe }}
            {% endblock %}
        </div>
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

## Adding hero header

Inside `_includes` dir create a `components` folder with `hero.liquid` file inside.

```html
<div class="relative">
    <div class="absolute inset-0">
        <img class="w-full h-full object-cover"
            src="https://images.unsplash.com/34/BA1yLjNnQCI1yisIZGEi_2013-07-16_1922_IMG_9873.jpg?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1502&q=80"
            alt="">
        <div class="absolute inset-0 bg-gray-400 mix-blend-multiply" aria-hidden="true"></div>
    </div>
    <div class="relative text-center py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
        <h1 class="text-5xl font-extrabold text-white sm:text-6xl lg:text-7xl">My Personal Website</h1>
        <p class="mt-4 text-xl max-w-3xl">Read my web development tutorials, and see projects I worked on.
        </p>
    </div>
</div>
```

Now update the `index.liquid` file by including the header
```liquid
---
title: Home Page
description: This is our homepage
layout: layouts/main
---

{% include components/hero %}
```

Run the site `npm run start` and you should see our hero header

![Hero Header Screenshot](https://janowski.dev/assets/img/articles/screenshots/sc2.png)

## Adding a Navigation Bar

Create a `navigation.liquid` file in the `_includes/components` directory

```html
<div class="mt-6 flex justify-between items-center">
    <a class="font-extrabold uppercase text-xl" href="/">Web Dev Blog</a>
    <button @click="isOpen = !isOpen" class="block md:hidden p-1 rounded-lg bg-gray-900 bg-opacity-80 hover:bg-opacity-100 text-gray-200">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    </button>
    <div class="hidden md:flex md:justify-end md:items-center md:space-x-6">
        <a class="font-semibold uppercase hover:opacity-80 hover:underline" href="/">Home</a>
        <a class="font-semibold uppercase hover:opacity-80 hover:underline" href="/blog">Blog</a>
        <a class="font-semibold uppercase hover:opacity-80 hover:underline" href="/about">About</a>
        <a class="font-semibold uppercase hover:opacity-80 hover:underline" href="/work">Work</a>
    </div>
</div>
```

## Making a Mobile Nav

Now let's make a mobile navigation with the help of some Alpine.js magic

```html
<style>
    [x-cloak] {
      display: none;
    }
  </style>

<div x-cloak x-data="navigation()">
    <!-- Mobile navigation -->
    <div class="-mt-6 absolute z-50 bg-white h-screen w-screen" x-show="isOpen"
        x-transition:enter="transition ease-in-out duration-300"
        x-transition:enter-start="opacity-0 transform scale-x-0 -translate-x-1/2"
        x-transition:enter-end="opacity-100 transform scale-x-100 translate-x-0"
        x-transition:leave="transition ease-in-out duration-300"
        x-transition:leave-start="opacity-100 transform scale-x-100 translate-x-0"
        x-transition:leave-end="opacity-0 transform scale-x-0 -translate-x-1/2">
        
        <div class="flex justify-between items-center p-6">
            <a class="font-extrabold uppercase text-xl" href="/">Web Dev Blog</a>
            <button @click="isOpen = !isOpen" class="block md:hidden p-1 rounded-lg bg-gray-900 bg-opacity-80 hover:bg-opacity-100 text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
            </button>
        </div>
        <div class="grid grid-cols-1 gap-4 p-6">
            <a class="font-semibold uppercase hover:opacity-80 hover:underline" href="/">Home</a>
            <a class="font-semibold uppercase hover:opacity-80 hover:underline" href="/blog">Blog</a>
            <a class="font-semibold uppercase hover:opacity-80 hover:underline" href="/about">About</a>
            <a class="font-semibold uppercase hover:opacity-80 hover:underline" href="/work">Work</a>
        </div>

    </div>
    <!-- Desktop navigation -->
    <div class="mt-6 flex justify-between items-center">
        <a class="font-extrabold uppercase text-xl" href="/">Web Dev Blog</a>
        <button @click="isOpen = !isOpen" class="block md:hidden p-1 rounded-lg bg-gray-900 bg-opacity-80 hover:bg-opacity-100 text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </button>
        <div class="hidden md:flex md:justify-end md:items-center md:space-x-6">
            <a class="font-semibold uppercase hover:opacity-80 hover:underline" href="/">Home</a>
            <a class="font-semibold uppercase hover:opacity-80 hover:underline" href="/blog">Blog</a>
            <a class="font-semibold uppercase hover:opacity-80 hover:underline" href="/about">About</a>
            <a class="font-semibold uppercase hover:opacity-80 hover:underline" href="/work">Work</a>
        </div>
    </div>
</div>

<script>
    function navigation() {
        return {
            isOpen: false
        }
    }
</script>

```

Now let's include the navigation in our layout file `_includes/layouts/main.liquid`

```liquid
<body>
    <div id="content" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto">
            {% include components/navigation %}
            {% block content %}
            {{ content | safe }}
            {% endblock %}
        </div>
    </div>
</body>
```

Preview our website in the browser

![Desktop Navigation Screenshot](https://janowski.dev/assets/img/articles/screenshots/sc3.png)

![Mobile Navigation Screenshot](https://janowski.dev/assets/img/articles/screenshots/sc4.png)

## Making reusable components

Let's make our hero header reusable by adding few variables to it, for title text, sub text and image url. Update `_includes/compnoents/hero.liquid` 

```liquid
    <div class="mt-2 relative">
        <div class="absolute inset-0">
            <img class="w-full h-full object-cover"
                src="{{ hero_img }}"
                alt="">
            <div class="absolute inset-0 bg-gray-400 mix-blend-multiply" aria-hidden="true"></div>
        </div>
        <div class="relative text-center py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
            <h1 class="text-5xl font-extrabold text-white sm:text-6xl lg:text-7xl">{{ hero_title }}</h1>
            <p class="mt-4 text-xl text-gray-50 max-w-3xl">{{ hero_subtitle }}</p>
        </div>
    </div>
```

Next update the include in the `index.liquid`

```liquid
---
title: Home Page
description: This is our homepage
layout: layouts/main
---

{% include components/hero, hero_title: "My Web Development Blog", hero_subtitle: "Read my web development tutorials,
and see projects I worked
on.", hero_img:
"https://images.unsplash.com/34/BA1yLjNnQCI1yisIZGEi_2013-07-16_1922_IMG_9873.jpg"
%}
```

Check if everything still work in the browser.

## Adding pages 

Let's create an about page. In the root directory create a file `about.liquid` 

```liquid
---
title: About Page
description: This is the about page
layout: layouts/main
---

{% include components/hero, hero_title: "About Me", hero_subtitle: "Learn more about me here", hero_img:
"https://images.unsplash.com/photo-1628373791626-fe21d99fbd58?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
%}
<p>Here is a short summary about me and what I do.</p>

```

Visit `http://localhost:8080/aboutt` in your browser

![About Page Screenshot](https://janowski.dev/assets/img/articles/screenshots/sc5.png)

## Creating collections

Create a new directory in the root dir of the project called `blog`
Inside create 3 files `blog1.md`, `blog2.md`,`index.liquid`

The markdown files will be used to render our blog articles content, and the index.liquid will list all the articles under /blog

`blog1.md`

```markdown
---
title: Example Blog post no. 1
description: This is a basic description of the post
date: 2021-08-21
layout: layouts/blog
tags: blog
---
This is some placeholder content that will be rendered to html
```

`blog2.md`

```markdown
---
title: Example Blog post no. 1
description: This is a basic description of the post
date: 2021-08-23
layout: layouts/blog
tags: blog
---
This is another peace of  placeholder content that will be rendered to html
```

`blog/index.liquid`

```liquid
---
title: About Page
description: This is the about page
layout: layouts/main
---

{% include components/hero, hero_title: "Blog", hero_subtitle: "Read my articles", hero_img:
"https://images.unsplash.com/photo-1628607292260-9195108b03b7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1502&q=80"
%}
<div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 ">
    {% for article in collections.blog reversed %}

    <a href="{{ article.url }}" class="p-4 border rounded shadow hover:bg-gray-100">
        <h3 class="text-lg font-bold">{{ article.data.title }}</h3>
        <p class="text-gray-700">{{ article.data.description }}</p>
    </a>

    {% endfor %}
</div>
```

Finally we need to create a layout for articles, create `_includes/layouts/blog.liquid` file

```liquid
---
layout: layouts/main
---

{% include components/hero, hero_title: title, hero_subtitle: description, hero_img:
"https://images.unsplash.com/photo-1628366757132-6c49770ec9d7"
%}

<div class="mt-6 md:mt-12">
    {{ content | safe }}
</div>

```

Now visit `http://localhost:8080/blog` to view a list of posts, and click one of them to see the content

![Blog List Screenshot](https://janowski.dev/assets/img/articles/screenshots/sc6.png)

![Blog page Screenshot](https://janowski.dev/assets/img/articles/screenshots/sc7.png)

You can do the same to list projects you worked on, but I will let you add it yourself as an exercise.

## Deploying website to Netlify 

Firstly, let's upload our website to GitHub. 
Create a new repo on GitHub, and then initialise git local and upload our files

```git
git init
git add . 
git commit -m "first commit"
git branch -M main
git remote add origin https://github/your_username/your_repo.git
git push -u origin main
```

Now go to [Netlify.com](https://netlify.com), login or register if you don't have an account.

On main dashboard click `New site from Git` button. And under `Continuous Deployment` click `GitHub` button. Authenticate your GitHub account, and you should see a list of your repositories.
Select the one we just created. 

On the next screen leave everything on defaults, and press `Deploy`.
You built and deployed your eleventy blog to netlify and should have your website available on address like [that](https://flamboyant-poitras-0033f8.netlify.app).
The website will automaticly deploy when you push changes to github.

Here is a [link](https://github.com/druidmaciek/11ty-tailwind-alpine-blog) to GitHub repo of the finished project.

If you liked this guide, [follow me](https://twitter.com/MaciejJanowski) on twitter, to stay up to date with my latest content. 

{% endraw %}