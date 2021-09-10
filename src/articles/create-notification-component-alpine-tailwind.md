---
title: How to create Notification pop up component with Alpine.js and TailwindCSS
description: How to create Notification pop up component with Alpine.js and TailwindCSS
date: 2021-09-10
author: Maciej Janowski
image: /assets/img/articles/notification_component.png
og_image: /assets/img/articles/notification_component.png
layout: layouts/article
tags: articles
keywords: website development, web dev, web design, tailwindcss, tailwind, alpine.js, component design, components, notification
---

I will show you how to create a notifications pop-up component using Alpine.js and Tailwind. 
So you can have a nice way to notify your users of things happening at your website.

Here is a simple starting page that we will use. It's a title, input and button. After you submit something in the input the notification will pop-up and then user can dismiss it.

To store notifications we will use Alpine.store, for storing global data. We use it because we want to separate input and notifications components.

```html
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
```

![Starting point](https://janowski.dev/assets/img/articles/screenshots/sc8.png)

Now let's make the input work by adding some Alpine magic.
Let's change the parent `div` of the input to include `x-data`, add `x-model` attribute to the input.

```html
<div x-data="{ value: '' }" class="mt-4">
    <input x-model="value" class="px-4 py-2 border-2 border-gray-900 rounded" type="text">
    <button class="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 border-2 border-yellow-500 rounded ">Add Item</button> 
</div>
```

Now let's create a global store. Open a `script` tag before closing `body` tag, and create our global store. 

Inside we create an empty list `items` to store our notification and a function called `notify`.
We will use the function to add messages to `items` list.

```html
<script>
document.addEventListener('alpine:init', () => {
    Alpine.store('notifications', {
        items: [],
        notify(message) {
            this.items.push(message)
        }
    })
})
</script>

```

Now let's go back to the button next to the input and add the `@click` attribute and call the `notify` function there. 
Also let's clear the input after pressing the button and check if it has content.

```html
<button @click="if (value) { $store.notifications.notify(value); value = ''; }"
        class="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 border-2 border-yellow-500 rounded">Add Item</button> 
```

Now we can add messages to our notification list, but we can't actually see them. So before we create our notifications
Component, let's add a quick preview of our items in the list.

```html
<div x-data class="mt-2 space-y-2">
    <template x-for="item in $store.notifications.items">
        <p x-text="item"></p>
    </template>
</div>
```

We can see our items appear in the list belo the input. Now we are ready to create the notifications pop ups.

Create a new element before the `script` tag with the simple notification badge.

```html
<div class="fixed bottom-0 flex items-end px-4 py-6 sm:p-6 sm:items-start">
    <div class="w-full flex flex-col space-y-4 items-end">
        <!-- Notification Badge -->
        <div class="px-4 py-2 w-64 rounded bg-white border-2 border-gray-900">
            <button class="underline">dismiss</button>
            <p>This is a a pop up</p> 
        </div>
    </div>
</div>
``` 

![Notification Badge](https://janowski.dev/assets/img/articles/screenshots/sc9.png)

Now let's make it render our notification badges from the global store.

```html
<div x-data class="fixed bottom-0 flex items-end px-4 py-6 sm:p-6 sm:items-start">
    <div class="w-full flex flex-col space-y-4 items-end">
        <!-- Notification Badges -->
        <template x-for="item in $store.notifications.items">
            <div class="px-4 py-2 w-64 rounded bg-white border-2 border-gray-900">
                <button class="underline">dismiss</button>
                <p x-text="item"></p>
            </div>
        </template>
    </div>
</div>
``` 

To finish let's add `@click` property to the dismiss button, to remove the item from the array. 
Remove the old list we used to preview if items are being added to the array.
Now test out are notifications pop up, by adding few items and dismissing them.

![Notification List Screenshot](https://janowski.dev/assets/img/articles/gifs/gif1.gif)

If you liked this guide, [follow me](https://twitter.com/MaciejJanowski) on twitter, to stay up to date with my latest content. 

