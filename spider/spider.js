const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const superagent = require("superagent");

const blogSystem = {
  cnblogs: require("./methods/cnblogs.js"),
};

function writePostFile(id, html) {
  fs.writeFile(path.join(__dirname, `../public/source/${id}.html`), html, "utf8", err => {
    if (err) throw err;
  });
}

function spiderPostPage(url, config, blog) {
  superagent
    .get(url)
    .then(res => {
      console.log('post page', url);
      const $ = cheerio.load(res.text, { decodeEntities: false });
      let postData = {
        id: blog.methods.post.id(url),
        title: blog.methods.post.title($),
        date: blog.methods.post.date($),
      };
      let content = blog.methods.post.content($);
      writePostFile(postData.id, content);
      postData.summary = content
        .replace(/<[\s\S]*?>/g, ' ')
        .replace(/ +/g, ' ')
        .slice(0, 200);
      console.log(postData);
    })
}

function spiderArchivePage(url, config, blog) {
  superagent
    .get(url)
    .then(res => {
      console.log("archive page", url);
      const $ = cheerio.load(res.text, { decodeEntities: false });
      blog.methods.archive.postList($).forEach(url => {
        spiderPostPage(url, config, blog);
      });
      let nextPageLink = blog.methods.archive.nextPageLink($);
      if (nextPageLink) {
        spiderArchivePage(nextPageLink, config, blog);
      }
    })
}

if (require.main === module) {
  spiderArchivePage(
    "https://www.cnblogs.com/mathematician/",
    {},
    blogSystem.cnblogs
  );
}