Using JSONP with Github Pages
=============================

Here's neat trick, hosting JSON data on Github Pages that is available cross
domain via JSONP.

What is JSONP
-------------

Traditionally JSONP was used to circumvent the 
[same origin policy](http://en.wikipedia.org/wiki/Same-origin_policy) in 
JavaScript. AJAX requests were limited in what sites they could make requests to
but `<script>` tags did not have such restrictions imposed. 

You can fake a cross orgin request by loading a script tag with a known 
callback function. Many web services support JSONP by allowing for a 
`callback=someFunction` parameter to be sent in the query string.

Here is an example URL from Google Docs 
https://spreadsheets.google.com/feeds/list/o13394135408524254648.240766968415752635/od6/public/basic?alt=json-in-script&callback=someFunction

Notice the `callback=someFunction` parameter. Go view that URL and you will
notice that it is simply a script with the function with the given name being
called with the data as a parameter.

Using JSONP on Github Pages
---------------------------

Ideally you could just store a `.json` file in the `gh-pages` branch of your
repo but unfortunately Github doesn't allow for setting CORS options on Github
Pages. Maybe they will in the future but until then we need to simulate the
process.

The tricky part is that all gh-pages files are served statically, so the
regular method of passing a callback in the querystring will have no effect.

There is a simple way to get around this. Because all your files are static and
you know the path where they are located, you can construct them to enable
static JSONP.

The pattern I settled on was `<account>/<repo>:<ref>` for example `STRd6/md:v0.3.2`.

That file is hosted here: http://strd6.github.io/md/v0.3.2.json.js

I use `.json.js` as the file extension so that Github's server can reasonably
guess the MIME type and apply the correct compression.

You will notice that the function which is invoked is `STRd6/md:v0.3.2`. It
doesn't matter that the function has special characters in it, but you need to
make sure to access it as `window["STRd6/md:v0.3.2"](...jsonData...)` because it
can't be invoked like a regularly named function.

To read this file from a web page using jQuery:

>     $.ajax({
>       url: "http://strd6.github.io/md/v0.3.2.json.js",
>       dataType: "jsonp",
>       jsonpCallback: "STRd6/md:v0.3.2"
>       success: function(data) { ... }
>     })

Et voila! Now you can retrieve JSON data from Github Pages accross domains.

[Back to danielx.net](/)
