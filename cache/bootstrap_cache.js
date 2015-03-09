
var News 			= require('../models/news.js');
var Article  = require('../models/article.js');

module.exports = function(aCache, nCache, ARTICLE_CACHE_LIMIT, NEWS_CACHE_LIMIT){
	console.log('Running bootstraping cache');
	// Constants


	function getArticlesCache(){
		Article.find()
				.where('published').equals(true)
				.sort({ createdAt: "descending"})
				.exec(function (err , articles) {
					if (err) { return next(err); }
					console.log('loading home page: '+JSON.stringify(articles));

					// limit cache to the 10 lastest articles
					return {articles: articles.splice(ARTICLE_CACHE_LIMIT, articles.length)};
		});
	}

	function getNewsCache(){
		News.find()
				.where('published').equals(true)
				.sort({ createdAt: "descending"})
				.exec(function (err , news) {
					if (err) { return next(err); }
					console.log('loading home page news: '+JSON.stringify(news));

					return {news: news.splice(NEWS_CACHE_LIMIT, news.length)};
		});
	}

	//populate the caches
	aCache = getArticlesCache();
	nCache = getNewsCache();
	console.log('bootrapping: ' +aCache);
	console.log('bootstrapping: '+nCache);
}