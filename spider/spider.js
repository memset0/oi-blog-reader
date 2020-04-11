const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const superagent = require("superagent");

const blogSystem = {
  cnblogs: require("./methods/cnblogs.js"),
};

let db;

function setDatabase(currentDb) {
  db = currentDb;
  db.defaults({});
}

function writePostFile(id, html) {
  fs.writeFile(path.join(__dirname, `../public/source/${id}.html`), html, "utf8", err => {
    if (err) throw err;
  });
}

function pushPostData(data) {
  console.log(data);
  db.set(data.id, data).write();
}

function spiderPostPage(url, blog, config) {
  superagent
    .get(url)
    .then(res => {
      const $ = cheerio.load(res.text, { decodeEntities: false });
      if (!blog.methods.post.check($)) {
        return;
      }
      let postData = {
        url: url,
        author: config.author,
        id: blog.methods.post.id(url),
        title: blog.methods.post.title($),
        time: blog.methods.post.time($),
      };
      let content = blog.methods.post.content($);
      writePostFile(postData.id, content);
      console.log(url);
      postData.summary = content
        .replace('\n', ' ')
        .replace(/<[\s\S]*?>/g, ' ')
        .replace(/ +/g, ' ')
        .slice(0, 200);
      pushPostData(postData);
    })
}

function spiderArchivePage(url, blog, config) {
  superagent
    .get(url)
    .then(res => {
      const $ = cheerio.load(res.text, { decodeEntities: false });
      blog.methods.archive.postList($).forEach(post => {
        spiderPostPage(post.url, blog, config);
      });
      let nextPageLink = blog.methods.archive.nextPageLink($);
      if (nextPageLink) {
        spiderArchivePage(nextPageLink, blog, config);
      }
    })
}

if (require.main === module) {
  const lowdb = require("lowdb");
  const FileSync = require("lowdb/adapters/FileSync");
  setDatabase(lowdb(new FileSync(path.join(__dirname, "../data/posts.json"))));

  spiderArchivePage(
    "https://www.cnblogs.com/zhoushuyu",
    blogSystem.cnblogs,
    {
      author: "zhoushuyu",
      dateLimit: 0
    },
  );
}

module.exports = {
  setDatabase: setDatabase,
  postPage: spiderPostPage,
  archivePage: spiderArchivePage
}