(function(pkg) {
  (function() {
  var annotateSourceURL, cacheFor, circularGuard, defaultEntryPoint, fileSeparator, generateRequireFn, global, isPackage, loadModule, loadPackage, loadPath, normalizePath, publicAPI, rootModule, startsWith,
    __slice = [].slice;

  fileSeparator = '/';

  global = self;

  defaultEntryPoint = "main";

  circularGuard = {};

  rootModule = {
    path: ""
  };

  loadPath = function(parentModule, pkg, path) {
    var cache, localPath, module, normalizedPath;
    if (startsWith(path, '/')) {
      localPath = [];
    } else {
      localPath = parentModule.path.split(fileSeparator);
    }
    normalizedPath = normalizePath(path, localPath);
    cache = cacheFor(pkg);
    if (module = cache[normalizedPath]) {
      if (module === circularGuard) {
        throw "Circular dependency detected when requiring " + normalizedPath;
      }
    } else {
      cache[normalizedPath] = circularGuard;
      try {
        cache[normalizedPath] = module = loadModule(pkg, normalizedPath);
      } finally {
        if (cache[normalizedPath] === circularGuard) {
          delete cache[normalizedPath];
        }
      }
    }
    return module.exports;
  };

  normalizePath = function(path, base) {
    var piece, result;
    if (base == null) {
      base = [];
    }
    base = base.concat(path.split(fileSeparator));
    result = [];
    while (base.length) {
      switch (piece = base.shift()) {
        case "..":
          result.pop();
          break;
        case "":
        case ".":
          break;
        default:
          result.push(piece);
      }
    }
    return result.join(fileSeparator);
  };

  loadPackage = function(pkg) {
    var path;
    path = pkg.entryPoint || defaultEntryPoint;
    return loadPath(rootModule, pkg, path);
  };

  loadModule = function(pkg, path) {
    var args, content, context, dirname, file, module, program, values;
    if (!(file = pkg.distribution[path])) {
      throw "Could not find file at " + path + " in " + pkg.name;
    }
    if ((content = file.content) == null) {
      throw "Malformed package. No content for file at " + path + " in " + pkg.name;
    }
    program = annotateSourceURL(content, pkg, path);
    dirname = path.split(fileSeparator).slice(0, -1).join(fileSeparator);
    module = {
      path: dirname,
      exports: {}
    };
    context = {
      require: generateRequireFn(pkg, module),
      global: global,
      module: module,
      exports: module.exports,
      PACKAGE: pkg,
      __filename: path,
      __dirname: dirname
    };
    args = Object.keys(context);
    values = args.map(function(name) {
      return context[name];
    });
    Function.apply(null, __slice.call(args).concat([program])).apply(module, values);
    return module;
  };

  isPackage = function(path) {
    if (!(startsWith(path, fileSeparator) || startsWith(path, "." + fileSeparator) || startsWith(path, ".." + fileSeparator))) {
      return path.split(fileSeparator)[0];
    } else {
      return false;
    }
  };

  generateRequireFn = function(pkg, module) {
    var fn;
    if (module == null) {
      module = rootModule;
    }
    if (pkg.name == null) {
      pkg.name = "ROOT";
    }
    if (pkg.scopedName == null) {
      pkg.scopedName = "ROOT";
    }
    fn = function(path) {
      var otherPackage;
      if (typeof path === "object") {
        return loadPackage(path);
      } else if (isPackage(path)) {
        if (!(otherPackage = pkg.dependencies[path])) {
          throw "Package: " + path + " not found.";
        }
        if (otherPackage.name == null) {
          otherPackage.name = path;
        }
        if (otherPackage.scopedName == null) {
          otherPackage.scopedName = "" + pkg.scopedName + ":" + path;
        }
        return loadPackage(otherPackage);
      } else {
        return loadPath(module, pkg, path);
      }
    };
    fn.packageWrapper = publicAPI.packageWrapper;
    fn.executePackageWrapper = publicAPI.executePackageWrapper;
    return fn;
  };

  publicAPI = {
    generateFor: generateRequireFn,
    packageWrapper: function(pkg, code) {
      return ";(function(PACKAGE) {\n  var src = " + (JSON.stringify(PACKAGE.distribution.main.content)) + ";\n  var Require = new Function(\"PACKAGE\", \"return \" + src)({distribution: {main: {content: src}}});\n  var require = Require.generateFor(PACKAGE);\n  " + code + ";\n})(" + (JSON.stringify(pkg, null, 2)) + ");";
    },
    executePackageWrapper: function(pkg) {
      return publicAPI.packageWrapper(pkg, "require('./" + pkg.entryPoint + "')");
    },
    loadPackage: loadPackage
  };

  if (typeof exports !== "undefined" && exports !== null) {
    module.exports = publicAPI;
  } else {
    global.Require = publicAPI;
  }

  startsWith = function(string, prefix) {
    return string.lastIndexOf(prefix, 0) === 0;
  };

  cacheFor = function(pkg) {
    if (pkg.cache) {
      return pkg.cache;
    }
    Object.defineProperty(pkg, "cache", {
      value: {}
    });
    return pkg.cache;
  };

  annotateSourceURL = function(program, pkg, path) {
    return "" + program + "\n//# sourceURL=" + pkg.scopedName + "/" + path;
  };

  return publicAPI;

}).call(this);

  window.require = Require.generateFor(pkg);
})({
  "source": {
    "gh-pages-jsonp.md": {
      "path": "gh-pages-jsonp.md",
      "content": "Using JSONP with Github Pages\n=============================\n\nHere's neat trick, hosting JSON data on Github Pages that is available cross\ndomain via JSONP.\n\nWhat is JSONP\n-------------\n\nTraditionally JSONP was used to circumvent the\n[same origin policy](http://en.wikipedia.org/wiki/Same-origin_policy) in\nJavaScript. AJAX requests were limited in what sites they could make requests to\nbut `<script>` tags did not have such restrictions imposed.\n\nYou can fake a cross orgin request by loading a script tag with a known\ncallback function. Many web services support JSONP by allowing for a\n`callback=someFunction` parameter to be sent in the query string.\n\nHere is an example URL from Google Docs\nhttps://spreadsheets.google.com/feeds/list/o13394135408524254648.240766968415752635/od6/public/basic?alt=json-in-script&callback=someFunction\n\nNotice the `callback=someFunction` parameter. Go view that URL and you will\nnotice that it is simply a script with the function with the given name being\ncalled with the data as a parameter.\n\nUsing JSONP on Github Pages\n---------------------------\n\nIdeally you could just store a `.json` file in the `gh-pages` branch of your\nrepo but unfortunately Github doesn't allow for setting CORS options on Github\nPages. Maybe they will in the future but until then we need to simulate the\nprocess.\n\nThe tricky part is that all gh-pages files are served statically, so the\nregular method of passing a callback in the querystring will have no effect.\n\nThere is a simple way to get around this. Because all your files are static and\nyou know the path where they are located, you can construct them to enable\nstatic JSONP.\n\nThe pattern I settled on was `<account>/<repo>:<ref>` for example `STRd6/md:v0.3.2`.\n\nThat file is hosted here: http://strd6.github.io/md/v0.3.2.json.js\n\nI use `.json.js` as the file extension so that Github's server can reasonably\nguess the MIME type and apply the correct compression.\n\nYou will notice that the function which is invoked is `STRd6/md:v0.3.2`. It\ndoesn't matter that the function has special characters in it, but you need to\nmake sure to access it as `window[\"STRd6/md:v0.3.2\"](...jsonData...)` because it\ncan't be invoked like a regularly named function.\n\nTo read this file from a web page using jQuery:\n\n>     $.ajax({\n>       url: \"http://strd6.github.io/md/v0.3.2.json.js\",\n>       dataType: \"jsonp\",\n>       jsonpCallback: \"STRd6/md:v0.3.2\"\n>       success: function(data) { ... }\n>     })\n\nEt voila! Now you can retrieve JSON data from Github Pages accross domains.\n\n[Back to danielx.net](/)\n",
      "mode": "100644",
      "type": "blob"
    },
    "ideas.md": {
      "path": "ideas.md",
      "content": "Ideas\n=====\n\nMusic Box where points of sound move around a multi-dimensional space via\ndifferential equations.\n\nL-Systems for Music\n\nDark Souls for Websites (Leave messages for other undeads, like traps or tricks)!\n\nAdd a pre-publish hook in that can run to modify the files before publishing \nthem. The hook will live in the project and be called in a safe web-worker or\nequivalent. It will run a `_prepublish` entry point and be passed the built \npackage, returning a Promise for the modified package to publish.\n",
      "mode": "100644",
      "type": "blob"
    },
    "index.md": {
      "path": "index.md",
      "content": "danielx.net\n===========\n\nHere I have many software experiments.\n\nThis whole site is created in my [editor](/editor/docs/).\n\nThe source for this directory is here: https://github.com/STRd6/strd6.github.io\n\nExplorations\n------------\n\nThe internet and computer software is a big place to explore. These are some of\nmy explorations.\n\n- [Editor](/editor/)\n- [Fourier Transform](/series/)\n- [Inflecta](/inflecta/docs/)\n- [Interactive Documentation](https://distri.github.io/interactive/docs/)\n- [Package Manager](https://distri.github.io/require/docs/)\n- [Pixel Editor](/pixel-editor/)\n- [Paint Composer](/composer/)\n- [Chlorian MIDI Player](/chlorian/)\n- [Streams](/stream/docs/)\n\nArticles\n--------\n\n[Using JSONP with Github Pages](./gh-pages-jsonp)\n",
      "mode": "100644",
      "type": "blob"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "content": "publishBranch: \"master\"\n",
      "mode": "100644",
      "type": "blob"
    }
  },
  "distribution": {
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"publishBranch\":\"master\"};",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "https://danielx.net/editor/"
  },
  "entryPoint": "main",
  "repository": {
    "branch": "blog",
    "default_branch": "blog",
    "full_name": "STRd6/strd6.github.io",
    "homepage": "https://danielx.net",
    "description": "Github pages",
    "html_url": "https://github.com/STRd6/strd6.github.io",
    "url": "https://api.github.com/repos/STRd6/strd6.github.io",
    "publishBranch": "master"
  },
  "dependencies": {}
});