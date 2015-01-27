// ================================================================
//  API ROUTES
// ================================================================
var Article 	 = require('../models/article');
var User 		   = require('../models/user');

module.exports = function(app, passport){


	//	====================================================
	//	CREATE NEW ARTICLE
	//	====================================================
	app.post('/api/article', function(req, res, next){

		if(!req.body.article){ return next(new Error('No article payload'));}
		var article = req.body.article;

	 	article.published = false;

	 	Article.findOne({title: article.title}, function(err, article){
	 		if(err) { return next(err);}
	 		if(article){
	 			req.flash('error', 'An article was found with that same title');
	 			return res.redirect('/');
	 		}

		 	var newArticle = new Article({
			 		title: article.title,
			 		body: article.body,
			 		author: article.author,
			 		published: article.published,
			 		createdAt: new Date()
		 		});

		 	newArticle.save(function(err){
		 		if(err) {return next(err);}
		 		res.send('ok!');
		 	});

		});

	});

	//	====================================================
	//	READ ALL NEW ARTICLE
	//	====================================================
	app.get('/api/articles', function(req, res, next){

	});

	//	====================================================
	//	UPDATE AN ARTICLE
	//	====================================================
	app.put('/api/articles/', function(req, res, next){

	});

	//	====================================================
	//	DELETE AN ARTICLE
	//	====================================================
	app.delete('/api/articles', function(req, res, next){

	});

}