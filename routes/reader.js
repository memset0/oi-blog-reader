const express = require('express');
const router = express.Router();

const utils = require('../utils/reader.js')

router.get('/', function (req, res, next) {
  res.render('reader', {
    title: '阅读器',
    utils: utils,
    archive: utils.listPosts(),
  });
});

router.post('/post', function (req, res, next) {
  console.log(req.body)
  res.json(Object.assign(
    utils.queryPost(req.body.id)
  ))
})

module.exports = router;