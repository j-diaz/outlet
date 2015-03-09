var mongoose = require('mongoose');

var newsSchema = mongoose.Schema({
	title: { type: String, required: true, unique: true},
	body: {type: String, required: true },
	published: {type: Boolean, required: true},
	createdAt: { type: Date, default: Date.now } 
 });

newsSchema.methods.getTitle = function(){
	return this.title;
};

var News = mongoose.model('News', newsSchema);

module.exports = News;