---
title: Building a carousel component with TailwindCSS and Alpine.js
description: Building a carousel component with TailwindCSS and Alpine.js
date: 2022-03-27
author: Maciej Janowski
image: /assets/img/articles/alpinetodo.png
og_image: /assets/img/articles/alpinetodo.png
layout: layouts/article
tags: articles
---
By the end of this article you will be able to create a carousel component with TailwindCSS and Alpine.js 

[Here](https://codesandbox.io/s/suspicious-proskuriakova-ibrvzc) is what a working example will look like

## Set up

First add tailwind and alpine.
In the `index.html` add what's below to your `<head>` 

```html
<script src="https://unpkg.com/tailwindcss-jit-cdn"></script>
```

For Tailwind we are using the ![jit compiler cdn](https://beyondco.de/blog/tailwind-jit-compiler-via-cdn) to keep it simple and keep the size small.

```html
<script src="https://unpkg.com/alpinejs" defer></script>
```

And then the official alpine.js cdn

## Creating the component

Create the main image

```html
<body class="p-4 font-serif bg-gray-50">
    <h1 class="text-2xl font-semibold">
      TailwindCSS + Alpine.js Carousel
    </h1>
    <div class="relative">
      <img
        class="h-64 w-full object-cover object-center"
        src="https://images.unsplash.com/photo-1527549993586-dff825b37782?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
        alt="mountains"
      />
    </div>
</body>
```

I used mountain pics as a placeholder for the images.

### previous/next buttons

Let's create to big buttons with arrows on each side to switch between items

```html
<img class="h-64 w-full object-cover object-center"
    src="https://images.unsplash.com/photo-1527549993586-dff825b37782?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
    alt="mountains" />
<button
    class="absolute inset-y-0 left-0 px-2 py-[25%] h-full w-8 group hover:bg-gray-500 hover:bg-opacity-75 cursor-pointer">
    <span class="hidden group-hover:block text-gray-50">
        &larr;
    </span>
</button>
<button
    class="absolute inset-y-0 right-0 px-2 py-[25%] h-full w-8 group hover:bg-gray-500 hover:bg-opacity-75 cursor-pointer">
    <span class="hidden group-hover:block text-gray-50">
        &rarr;
    </span>
</button>
```

### dot buttons

Next dot buttons to switch between items by index, and also show the selected item

```html
<div class="absolute bottom-0 w-full p-4 flex justify-center space-x-2">
    <button class="h-2 w-2 rounded-full bg-gray-300 hover:bg-gray-300 ring-2 ring-gray-300"></button>
    <button class="h-2 w-2 rounded-full bg-gray-500 hover:bg-gray-300 ring-2 ring-gray-300"></button>
    <button class="h-2 w-2 rounded-full bg-gray-500 hover:bg-gray-300 ring-2 ring-gray-300"></button>
</div>
```

Your code should look like this

```html
<div class="relative">
    <img class="h-64 w-full object-cover object-center"
        src="https://images.unsplash.com/photo-1527549993586-dff825b37782?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
        alt="mountains" />
    <button
        class="absolute inset-y-0 left-0 px-2 py-[25%] h-full w-8 group hover:bg-gray-500 hover:bg-opacity-75 cursor-pointer">
        <span class="hidden group-hover:block text-gray-50">
            &larr;
        </span>
    </button>
    <button
        class="absolute inset-y-0 right-0 px-2 py-[25%] h-full w-8 group hover:bg-gray-500 hover:bg-opacity-75 cursor-pointer">
        <span class="hidden group-hover:block text-gray-50">
            &rarr;
        </span>
    </button>
    <div class="absolute bottom-0 w-full p-4 flex justify-center space-x-2">
        <button class="h-2 w-2 rounded-full bg-gray-300 hover:bg-gray-300 ring-2 ring-gray-300"></button>
        <button class="h-2 w-2 rounded-full bg-gray-500 hover:bg-gray-300 ring-2 ring-gray-300"></button>
        <button class="h-2 w-2 rounded-full bg-gray-500 hover:bg-gray-300 ring-2 ring-gray-300"></button>
    </div>
</div>
```	
## Adding alpine.js

Now for the fun part let's open a `script` tag before the closing `body` tag and create our alpine object. 

We need two variables:
-  `selected` to show a current index of image list
-  `images` array with the list of images we want to show in the carousel.

I will use a couple of mountain landscape images from ![Unsplash](https://unsplash.com/s/photos/mountain-landscapes)

```js
const carousel = () => {
    return {
        selected: 0,
        images: [
            "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
            "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80",
            "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
            "https://images.unsplash.com/photo-1485160497022-3e09382fb310?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
            "https://images.unsplash.com/photo-1472791108553-c9405341e398?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2137&q=80"
        ]
    };
};
```

Next let's add `x-data` property to the top div of our app

```html
<div x-data="carousel()" class="relative">
```

### Showing the image

Let's make the image source show the `images[selected]` image.
Edit the `img` tag

```html
<img class="h-64 w-full object-cover object-center" :src="images[selected]" alt="mountains" />
```
 
We removed the `src` tag and added the `:src` which is alpnie.js shorthand for `x-bind:src`

Now your image should show the first image from the `images` array

### Next button

Let's add `@click` which is alpine's shorthand for `x-on:click`, and make it increase selected by 1 unless it's the last image then reset it back to 0

```html
<button
    class="absolute inset-y-0 right-0 px-2 py-[25%] h-full w-8 group hover:bg-gray-500 hover:bg-opacity-75 cursor-pointer">
    <span class="hidden group-hover:block text-gray-50">
        &rarr;
    </span>
</button>
```

### Previous button

The back button other way around

```html
<button
    class="absolute inset-y-0 left-0 px-2 py-[25%] h-full w-8 group hover:bg-gray-500 hover:bg-opacity-75 cursor-pointer">
    <span class="hidden group-hover:block text-gray-50">
        &larr;
    </span>
</button>
```

### Dot buttons

First we want to render as many buttons as there are images for that we will use the `template` tag and alpine `x-for`

```html
<template x-for="(image,index) in images" :key="index">
    <button class="h-2 w-2 rounded-full hover:bg-gray-300 ring-2 ring-gray-300"></button>
</template>
```

Add `@click` to set the new index

```html
<template x-for="(image,index) in images" :key="index">
    <button @click="selected = index" class="h-2 w-2 rounded-full hover:bg-gray-300 ring-2 ring-gray-300"></button>
</template>
```

Finally add conditional styling so the button for selected image looks different

```html
<template x-for="(image,index) in images" :key="index">
    <button @click="selected = index" :class="{'bg-gray-300': selected == index, 'bg-gray-500': selected != index}"
        class="h-2 w-2 rounded-full hover:bg-gray-300 ring-2 ring-gray-300"></button>
</template>
```

Now your component is fully working

## What's next?

You could further improve the carousel component by:
- making it mobile responsive
- adding animation on image change 
- auto changing the image on interval

Or you can start using the carousel in your projects.

Follow me on Twitter ![@MaciejJanowski](http://twitter.com/MaciejJanowski) to stay updated on my content.
