var mongoose = require('mongoose');

var articleSchema = mongoose.Schema({
	title: { type: String, required: true, unique: true},
	body: [],
	author: {type: String, required: true},
	published: {type: Boolean, required: true},
	createdAt: { type: Date, default: Date.now } 
 });

articleSchema.methods.getTitle = function(){
	return this.title;
};

var Article = mongoose.model('Article', articleSchema);

module.exports = Article;