const moment = require("moment");

const BlogSystem = require("../blogSystem.js");

module.exports = new BlogSystem(
  "cnblog",
  methods = {
    archive: {
      postList: $ => {
        let result = [];
        $('.postTitle .postTitle2').each(function () {
          if ($(this).text().startsWith('[置顶]')) {
            return;
          }
          result.push({
            url: $(this).attr('href')
          });
        });
        return result;
      },
      nextPageLink: $ => {
        const c = (selector) => {
          if ($(selector).length && $(selector).text().trim() == '下一页') {
            return $(selector).attr('href');
          }
          return null;
        }
        return c('#nav_next_page a') ||
          c('#homepage_top_pager .pager a:last-child') ||
          c('#homepage_bottom_pager .pager a:last-child');
      }
    },
    post: {
      id: (url, author) => ('cnblogs-' + author + '-' + url.match(/\/([^\/]+?).html$/)[1]),
      check: $ => ($("title").text() != "博文阅读密码验证 - 博客园"),
      title: $ => $("#cb_post_title_url").text(),
      time: $ => moment($("#post-date").text(), "YYYY-MM-DD HH:mm").format("x"),
      content: $ => {
        return $("#cnblogs_post_body").html();
      }
    }
  }
);