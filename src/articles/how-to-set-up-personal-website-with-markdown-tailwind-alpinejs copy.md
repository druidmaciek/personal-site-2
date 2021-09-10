---
title: How to create Notification pop up component with Alpine.js and TailwindCSS
description: How to create Notification pop up component with Alpine.js and TailwindCSS
date: 2021-09-10
author: Maciej Janowski
image: /assets/img/articles/eleventy.png
og_image: /assets/img/articles/eleventy.png
layout: layouts/article
tags: articles
keywords: website development, web dev, web design, tailwindcss, tailwind, alpine.js, component design, components, notification
---

# How to create Notification pop up component with Alpine.js and TailwindCSS

I will show you how to create a notifications pop up component with Alpine.js and Tailwind so you can have a nice way to notify your users.

Here is a simple starting page that we will use. It's just a title, input and button. When user writes something inside the input, and presses the button the notification will pop-up, then user will be able to dismiss it. 

To store notifications we will use Alpine.store, for storing global data, since notifications and input will be separate components.


`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notifications</title>
    <script src="//unpkg.com/alpinejs" defer></script>
    <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-yellow-50">
    <div class="mt-4 max-w-2xl mx-auto text-center">
        <h1 class="text-5xl  font-bold">Alpine Notifications</h1>
        <div class="mt-2">
            <p>Add items below to see notifications pop-up</p>
        </div>
        <div class="mt-4">
            <input class="px-4 py-2 border-2 border-gray-900 rounded" type="text">
            <button class="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 border-2 border-yellow-500 rounded ">Add Item</button> 
        </div>
    </div>   
</body>
</html>
`

![Starting point](https://janowski.dev/assets/img/articles/screenshots/sc1.png)


If you liked this guide, [follow me](https://twitter.com/MaciejJanowski) on twitter, to stay up to date with my latest content. 