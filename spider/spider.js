const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const cheerio = require("cheerio");
const superagent = require("superagent");

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
  // console.log(data);
  db.set(data.id, data).write();
}

function spiderPostPage(url, blog, config) {
  superagent
    .get(url)
    .then(res => {
      console.log('post', url);
      const $ = cheerio.load(res.text, { decodeEntities: false });
      if (!blog.methods.post.check($)) {
        return;
      }
      let postData = {
        url: url,
        author: config.author,
        id: blog.methods.post.id(url, config.author),
        title: blog.methods.post.title($),
        time: blog.methods.post.time($),
      };
      if (moment(postData.time, 'x').isBefore(config.time_limit)) {
        config.achieveTimeLimit = true;
        return;
      }
      let content = blog.methods.post.content($);
      writePostFile(postData.id, content);
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
      console.log('archive', url);
      const $ = cheerio.load(res.text, { decodeEntities: false });
      blog.methods.archive.postList($).forEach(post => {
        spiderPostPage(post.url, blog, config);
      });
      let nextPageLink = blog.methods.archive.nextPageLink($);
      if (nextPageLink && !config.achieveTimeLimit) {
        spiderArchivePage(nextPageLink, blog, config);
      }
    })
}

if (require.main === module) {
  const lowdb = require("lowdb");
  const FileSync = require("lowdb/adapters/FileSync");
  setDatabase(lowdb(new FileSync(path.join(__dirname, "../data/posts.json"))));
}

module.exports = {
  setDatabase: setDatabase,
  postPage: spiderPostPage,
  archivePage: spiderArchivePage
}