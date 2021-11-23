---
title: Adding Strapi as headless CMS to 11ty blog
description: Connect headless CMS strapi to eleventy blog 
date: 2021-11-22
author: Maciej Janowski
image: /assets/img/articles/alpinetodo.png
og_image: /assets/img/articles/alpinetodo.png
layout: layouts/article
tags: articles
---
{% raw %}
## Setting up Strapi

Open up a terminal and type 

```sh
npx create-strapi-app backend --quickstart
```

this will create all the strapi files in the `backend` folder and run strapi instance on `http://localhost:1337`

If you want to run Strapi again after terminating the process, you can do it from the `backend` folder by typing

```sh
npm run develop
```

Now you have to create your first Strapi admin user, go to ![http://localhost:1337](http://localhost:1337) and press `Create the first administrator` and fill the form.

![Strapi Dashboard](https://janowski.dev/assets/img/articles/eleventy_strapi/strapi_1.png)

You will see the main dashboard, let's create a Content-Type for our blog articles, 

![Strapi Dashboard](https://janowski.dev/assets/img/articles/eleventy_strapi/strapi_2.png)

1. Press `Create your first content-type` button.
2. In the **Display name** enter **article**
3. Select **Text** field, fill the name field with **title**
4. On the advanced tab check **required** and **unique**
5. Press **Add Another Field**, select **Rich Text**, and call it **content**
6. Press **Add Another Field**, select **Text**, and call it **author**
7. Press **Finish** and then **Save**

We also want to have a way to tag the posts with tag, so let's create a content-type for that.

1. In **Content-Types Builder** tab under **Plugins** press **Create new collection type**
2. In the **Display name** enter **tag**
3. Select **Text** field, fill the name field with **name**
4. On the advanced tab check **required** and **unique**
5. Press **Finish** and then **Save**

We will also create a relation to link tags with articles.

1. In **Content-Types Builder** tab press **Article** collection and click **Add another field**
2. Select **Relation**
3. On the right side select box chose **tag**
4. In the middle press the second button from the right to set the relation type to **Many to Many**
5. Press **Finish** and then **Save**

Now let's add some content.

Under the `Collection Types` section select `tags` and create and publish few examples.

Do the same for articles and assign tags to them.

Final thing we have to do in strapi is assign permissons so the articles are visible to anyone.

1. Under **General** select **Settings** 
2. Under **Users & Permissions Plugin** select **Roles**
3. Click **Public**
4. In Permissions section find article and select **find** and **findone** checkboxes
5. Do the same for tag
6. Press **Save**

You should see articles and tags under [http://localhost:1337/articles](http://localhost:1337/articles) and [http://localhost:1337/tags](http://localhost:1337/tags) 

We are done with Strapi set up.

## Setting up Eleventy

Now let's set up eleventy, as a starting point let's use a simple 11ty + markdown blog we created in [this guide](https://janowski.dev/articles/how-to-set-up-personal-website-with-markdown-tailwind-alpinejs/)

In the main project directory create a new folder called `frontend`
Clone the starting blog repository, and install required packages.

```sh
cd frontend
git clone https://github.com/druidmaciek/11ty-tailwind-alpine-blog .
npm i
```

Now install Axios so we can make requests to strapi api

```sh
npm install axios
```

Create a new folder called `_data` and inside create `articles.js` and `tags.js` files

```sh
mkdir _data
touch _data/article.js
touch _data/tags.js
```

article.js

```javascript
const { default: axios } = require('axios');

module.exports = async () => {
  try {
    const res = await axios.get('http://localhost:1337/articles');
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
```

tags.js

```javascript
const { default: axios } = require('axios');

module.exports = async () => {
  try {
    const res = await axios.get('http://localhost:1337/tags');
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
```

Now delete `blog` folder, and edit the `index.liquid`

```liquid
---
title: My Blog
layout: layouts/main
pagination:
  data: articles
  size: 100
  alias: articles
---

{% include components/hero, hero_title: "Blog", hero_subtitle: "Read my articles", hero_img:
"https://images.unsplash.com/photo-1628607292260-9195108b03b7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1502&q=80"
%}
<div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 ">
    {%- for article in articles -%}
    <a href="/articles/{{ article.id }}/" class="p-4 border rounded shadow hover:bg-gray-100">
        <h3 class="text-lg font-bold">{{ article.title }}</h3>
    </a>
    {%- endfor -%}
</div>
``` 

Now run your eleventy site, and visit `localhost:8080` to see if our blog posts from Strapi appeared

![Strapi Blog](https://janowski.dev/assets/img/articles/eleventy_strapi/blog_1.png)

Now let's work on indivdual article page.

Create a `article.liquid` file.

```liquid
---
title: Article
layout: layouts/blog
pagination:
  data: articles
  size: 1
  alias: article
permalink: 'articles/{{ article.id }}/'
---
```

then edit `_includes/layouts/blog`

```liquid
---
layout: layouts/main
---

{% include components/hero, hero_title: article.title, hero_subtitle: '', hero_img:
"https://images.unsplash.com/photo-1628366757132-6c49770ec9d7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1500&q=80"
%}

<div class="mt-4">
    {% for tag in article.tags %}
    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        {{ tag.name }}
    </span>
    {% endfor %}
</div>


<div class="mt-6 md:mt-12">
    {{ article.content | safe }}
</div>

```

Now go to `localhost:8080/articles/1/`, you should see your content.

![Strapi Blog](https://janowski.dev/assets/img/articles/eleventy_strapi/blog_2.png)

As you can see it's super easy to set up headless CMS with 11ty using Strapi.

## Next steps

Next thing to do is deploy our site, since Strapi is self hosted backend service we will need to deploy it. You can deploy it for free on Heroku, by following this [steps](https://strapi.io/documentation/developer-docs/latest/setup-deployment-guides/deployment/hosting-guides/heroku.html).

To deploy our front-end we can deploy it on service such as [Netlify](https://docs.netlify.com/configure-builds/common-configurations/eleventy/).


Here is a [link](https://github.com/druidmaciek/eleventy_strapi_blog) to GitHub repo of the finished project.

If you liked this guide, [follow me](https://twitter.com/MaciejJanowski) on twitter, to stay up to date with my latest content.
{% endraw %}