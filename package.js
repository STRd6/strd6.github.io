(function(pkg) {
  // Expose a require for our package so scripts can access our modules
  window.require = Require.generateFor(pkg);
})({
  "source": {
    "index.md": {
      "path": "index.md",
      "mode": "100644",
      "content": "www.danielx.net\n===============\n\nHere I have many software experiments.\n\nThis whole site is created in my [editor](/editor/docs).\n\nThe source for this directory is here: https://github.com/STRd6/strd6.github.io\n\nIntroduction\n------------\n\nThe internet and computer software is a big place to explore. These are some of\nmy explorations.\n\n- [Streams](/stream/docs)\n\nArticles\n--------\n\n[Using JSONP with Github Pages](./gh-pages-jsonp)\n",
      "type": "blob"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "mode": "100644",
      "content": "publishBranch: \"master\"\n",
      "type": "blob"
    },
    "gh-pages-jsonp.md": {
      "path": "gh-pages-jsonp.md",
      "mode": "100644",
      "content": "Using JSONP with Github Pages\n=============================\n\nHere's neat trick, hosting JSON data on Github Pages that is available cross\ndomain via JSONP.\n\nWhat is JSONP\n-------------\n\nTraditionally JSONP was used to circumvent the \n[same origin policy](http://en.wikipedia.org/wiki/Same-origin_policy) in \nJavaScript. AJAX requests were limited in what sites they could make requests to\nbut `<script>` tags did not have such restrictions imposed. \n\nYou can fake a cross orgin request by loading a script tag with a known \ncallback function. Many web services support JSONP by allowing for a \n`callback=someFunction` parameter to be sent in the query string.\n\nHere is an example URL from Google Docs \nhttps://spreadsheets.google.com/feeds/list/o13394135408524254648.240766968415752635/od6/public/basic?alt=json-in-script&callback=someFunction\n\nNotice the `callback=someFunction` parameter. Go view that URL and you will\nnotice that it is simply a script with the function with the given name being\ncalled with the data as a parameter.\n\nUsing JSONP on Github Pages\n---------------------------\n\nIdeally you could just store a `.json` file in the `gh-pages` branch of your\nrepo but unfortunately Github doesn't allow for setting CORS options on Github\nPages. Maybe they will in the future but until then we need to simulate the\nprocess.\n\nThe tricky part is that all gh-pages files are served statically, so the\nregular method of passing a callback in the querystring will have no effect.\n\nThere is a simple way to get around this. Because all your files are static and\nyou know the path where they are located, you can construct them to enable\nstatic JSONP.\n\nThe pattern I settled on was `<account>/<repo>:<ref>` for example `STRd6/md:v0.3.2`.\n\nThat file is hosted here: http://strd6.github.io/md/v0.3.2.json.js\n\nI use `.json.js` as the file extension so that Github's server can reasonably\nguess the MIME type and apply the correct compression.\n\nYou will notice that the function which is invoked is `STRd6/md:v0.3.2`. It\ndoesn't matter that the function has special characters in it, but you need to\nmake sure to access it as `window[\"STRd6/md:v0.3.2\"](...jsonData...)` because it\ncan't be invoked like a regularly named function.\n\nTo read this file from a web page using jQuery:\n\n>     $.ajax({\n>       url: \"http://strd6.github.io/md/v0.3.2.json.js\",\n>       dataType: \"jsonp\",\n>       jsonpCallback: \"STRd6/md:v0.3.2\"\n>       success: function(data) { ... }\n>     })\n\nEt voila! Now you can retrieve JSON data from Github Pages accross domains.\n\n[Back to danielx.net](/)\n",
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
    "url": "http://strd6.github.io/editor/"
  },
  "entryPoint": "main",
  "repository": {
    "id": 3356864,
    "name": "strd6.github.io",
    "full_name": "STRd6/strd6.github.io",
    "owner": {
      "login": "STRd6",
      "id": 18894,
      "avatar_url": "https://gravatar.com/avatar/33117162fff8a9cf50544a604f60c045?d=https%3A%2F%2Fidenticons.github.com%2F39df222bffe39629d904e4883eabc654.png&r=x",
      "gravatar_id": "33117162fff8a9cf50544a604f60c045",
      "url": "https://api.github.com/users/STRd6",
      "html_url": "https://github.com/STRd6",
      "followers_url": "https://api.github.com/users/STRd6/followers",
      "following_url": "https://api.github.com/users/STRd6/following{/other_user}",
      "gists_url": "https://api.github.com/users/STRd6/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/STRd6/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/STRd6/subscriptions",
      "organizations_url": "https://api.github.com/users/STRd6/orgs",
      "repos_url": "https://api.github.com/users/STRd6/repos",
      "events_url": "https://api.github.com/users/STRd6/events{/privacy}",
      "received_events_url": "https://api.github.com/users/STRd6/received_events",
      "type": "User",
      "site_admin": false
    },
    "private": false,
    "html_url": "https://github.com/STRd6/strd6.github.io",
    "description": "Github pages",
    "fork": false,
    "url": "https://api.github.com/repos/STRd6/strd6.github.io",
    "forks_url": "https://api.github.com/repos/STRd6/strd6.github.io/forks",
    "keys_url": "https://api.github.com/repos/STRd6/strd6.github.io/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/STRd6/strd6.github.io/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/STRd6/strd6.github.io/teams",
    "hooks_url": "https://api.github.com/repos/STRd6/strd6.github.io/hooks",
    "issue_events_url": "https://api.github.com/repos/STRd6/strd6.github.io/issues/events{/number}",
    "events_url": "https://api.github.com/repos/STRd6/strd6.github.io/events",
    "assignees_url": "https://api.github.com/repos/STRd6/strd6.github.io/assignees{/user}",
    "branches_url": "https://api.github.com/repos/STRd6/strd6.github.io/branches{/branch}",
    "tags_url": "https://api.github.com/repos/STRd6/strd6.github.io/tags",
    "blobs_url": "https://api.github.com/repos/STRd6/strd6.github.io/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/STRd6/strd6.github.io/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/STRd6/strd6.github.io/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/STRd6/strd6.github.io/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/STRd6/strd6.github.io/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/STRd6/strd6.github.io/languages",
    "stargazers_url": "https://api.github.com/repos/STRd6/strd6.github.io/stargazers",
    "contributors_url": "https://api.github.com/repos/STRd6/strd6.github.io/contributors",
    "subscribers_url": "https://api.github.com/repos/STRd6/strd6.github.io/subscribers",
    "subscription_url": "https://api.github.com/repos/STRd6/strd6.github.io/subscription",
    "commits_url": "https://api.github.com/repos/STRd6/strd6.github.io/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/STRd6/strd6.github.io/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/STRd6/strd6.github.io/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/STRd6/strd6.github.io/issues/comments/{number}",
    "contents_url": "https://api.github.com/repos/STRd6/strd6.github.io/contents/{+path}",
    "compare_url": "https://api.github.com/repos/STRd6/strd6.github.io/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/STRd6/strd6.github.io/merges",
    "archive_url": "https://api.github.com/repos/STRd6/strd6.github.io/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/STRd6/strd6.github.io/downloads",
    "issues_url": "https://api.github.com/repos/STRd6/strd6.github.io/issues{/number}",
    "pulls_url": "https://api.github.com/repos/STRd6/strd6.github.io/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/STRd6/strd6.github.io/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/STRd6/strd6.github.io/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/STRd6/strd6.github.io/labels{/name}",
    "releases_url": "https://api.github.com/repos/STRd6/strd6.github.io/releases{/id}",
    "created_at": "2012-02-05T01:56:50Z",
    "updated_at": "2014-02-19T20:36:40Z",
    "pushed_at": "2014-02-19T20:36:40Z",
    "git_url": "git://github.com/STRd6/strd6.github.io.git",
    "ssh_url": "git@github.com:STRd6/strd6.github.io.git",
    "clone_url": "https://github.com/STRd6/strd6.github.io.git",
    "svn_url": "https://github.com/STRd6/strd6.github.io",
    "homepage": "strd6.github.io",
    "size": 180,
    "stargazers_count": 1,
    "watchers_count": 1,
    "language": "CoffeeScript",
    "has_issues": true,
    "has_downloads": true,
    "has_wiki": true,
    "forks_count": 0,
    "mirror_url": null,
    "open_issues_count": 1,
    "forks": 0,
    "open_issues": 1,
    "watchers": 1,
    "default_branch": "blog",
    "master_branch": "blog",
    "permissions": {
      "admin": true,
      "push": true,
      "pull": true
    },
    "network_count": 0,
    "subscribers_count": 1,
    "branch": "blog",
    "publishBranch": "master"
  },
  "dependencies": {}
});