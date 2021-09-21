---
title: How to create a contact form for a static site with Netlify
description: How to create a contact form for a static site with Netlify
date: 2021-09-21
author: Maciej Janowski
image: /assets/img/articles/howtofreelance.png
og_image: /assets/img/articles/howtofreelance.png
layout: layouts/article
tags: articles
---
Creating form on a static website hosted on Netlify is super easy.
Here is how to do it in couple simple steps.

First let's create a `index.html` file in our project's folder.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Netlify Contact Form</title>
</head>
<body>
    
</body>
</html>
```

Then let's create our contact form inside the `body` 

```html
<h1>Send Me a Message</h1>
<p>Fill the contact form below to send me a message, and I will contact you soon</p>

<form>
    <input type="text" name='name' placeholder="Your Name" required>
    <input type="email" name="email" placeholder="Your Email" required>
    <textarea name="message"cols="30" rows="10" placeholder="Your Message"></textarea>
    <button type="submit">Send</button>
</form>
```

We also want to redirect the user to a thank you page after submitting the form. Let's create, one real quick, create a `thanks.html` file in our project directory.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Thank You</h1>
    <p>I will try to reply to your message as soon as possible</p>
</body>
</html>
```

Now let's upload it to Netlify, go to `https://netlify.com` login or register if you don't have an account. Go to `sites` tab and drag and drop the folder with our html files 

![Netlify Site Upload](https://janowski.dev/assets/img/articles/gifs/netlify-ulpoad.gif)

Now our site is available to the world, let's make the contact form work. Open `index.html` again, and edit the `form` tag by adding few attributes. 
`name` - this value will show up in Netlify as the name of our form, it's useful if you have many forms on your website
`action` - this indicates to which page it should redirect after a successful form submit. In our case it's `thanks.html`
`netlify` - this attribute tells Netlify to handle the form

This is how our new form will look

```html
<form name="contact" action="/thanks.html" netlify>
    <input type="text" name='name' placeholder="Your Name" required>
    <input type="email" name="email" placeholder="Your Email" required>
    <textarea name="message"cols="30" rows="10" placeholder="Your Message"></textarea>
    <button type="submit">Send</button>
</form>
```

On Netlify go to site's overview. Click the `deploy` tab, and once again drag and drop the site's folder to update the files.

Now let's try submitting a form.


![Netlify Form Submit](https://janowski.dev/assets/img/articles/gifs/form-submit.gif)

It seems to be working! Now let's check out our form submission in Netlify.
Go to our site overview and select the `forms` tab.

![Netlify Forms](https://janowski.dev/assets/img/articles/screenshots/netlify_forms.png)

![Netlify Form Submissions](https://janowski.dev/assets/img/articles/screenshots/form_submission.png)

As you can see it works perfectly, and required almost 0 effort to set up. It also has a spam filter inbuilt so you don't have to worry about combing through spam emails. And you can get your form submissions sent straight to your email inbox.


