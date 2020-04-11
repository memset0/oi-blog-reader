const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const YAML = require('yaml')
const moment = require('moment')

const spider = require('../spider/spider.js')

const lowdb = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
spider.setDatabase(lowdb(new FileSync(path.join(__dirname, '../data/posts.json'))))

const blogSystem = {
	cnblogs: require('../spider/methods/cnblogs.js'),
}

let config = []

function loadConfig() {
	config = YAML.parse(fs.readFileSync(path.join(__dirname, '../config/spiderBlogs.yml')).toString())
}

function run() {
	_.each(config, (data, url) => {
		spider.archivePage(
			url,
			blogSystem[data.blog],
			config = {
				url: url,
				author: data.author,
				time_limit: data.time_limit ? moment(data.time_limit) : moment('2018-07-01')
			}
		)
	})
}

loadConfig()

if (require.main === module) {
	run()
}