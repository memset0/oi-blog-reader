const moment = require("moment");

const BlogSystem = require("../blogSystem.js");

module.exports = new BlogSystem(
  "cnblog",
  methods = {
    archive: {
      postList: $ => {
        let result = [];
        $('.postTitle .postTitle2').each(function() {
          result.push({
            url: $(this).attr('href')
          });
        });
        return result;
      },
      nextPageLink: $ => $("#nav_next_page a").attr('href'),
    },
    post: {
      id: url => ('cnblogs' + url.match(/([0-9]+).html$/)[1]),
      check: $ => ($("title").text() != "博文阅读密码验证 - 博客园"),
      title: $ => $("#cb_post_title_url").text(),
      date: $ => moment($("#post-date").text(), "YYYY-MM-DD HH:mm").format("x"),
      content: $ => {
        return $("#cnblogs_post_body").html();
      }
    }
  }
);