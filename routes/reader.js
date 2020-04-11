const express = require('express');
const router = express.Router();

const utils = Object.assign(require('../utils/reader.js'), {
  lodash: require('lodash'),
  moment: require('moment'),
})

router.get('/', function (req, res, next) {
  const archive = utils.listPosts();
  res.render('reader', {
    title: '阅读器',
    utils: utils,
    archive: archive,
    currentPost: archive[0].id,
  });
});

router.get('/:id', function (req, res, next) {
  const archive = utils.listPosts();
  res.render('reader', {
    title: '阅读器',
    utils: utils,
    archive: archive,
    currentPost: req.params.id,
  });
});

router.post('/post', function (req, res, next) {
  console.log(req.body)
  res.json(Object.assign(
    utils.queryPost(req.body.id)
  ))
})

module.exports = router;