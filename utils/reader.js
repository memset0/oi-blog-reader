const fs = require("fs");
const path = require("path");

const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
let db = lowdb(new FileSync(path.join(__dirname, "../data/posts.json")));

function listPosts() {
	let result = [];
	db.sortBy(o => o.time)
		.each(val => result.push(val))
		.value();
	return result;
}

function queryPost(id) {
	return Object.assign(db.get(id).value(), {
		content: fs.readFileSync(path.join(__dirname, `../public/source/${id}.html`), 'utf8').toString()
	});
}

module.exports = {
	listPosts: listPosts,
	queryPost: queryPost,
};