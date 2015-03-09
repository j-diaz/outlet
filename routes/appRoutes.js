// ================================================================
//  APP ROUTES
// ================================================================
var Article 	 = require('../models/article');
var User 			 = require('../models/user');
var News 			 = require('../models/news');



module.exports = function(app, passport, aCache, nCache, cache_config, async){
	console.log('Cache: \n news -> '
		+JSON.stringify(nCache) 
		+ '\n articles -> '
		+JSON.stringify(aCache));
	// =================================
	// FOR PERSISTING USER
	// =================================
	app.use(function(req, res, next){
		res.locals.currentUser = req.user;
		res.locals.errors = req.flash('error');
		res.locals.infos = req.flash('info');
		next();
	});

	// =================================
	// FOR LATEST ARTICLE
	// =================================
	// app.use(function(req, res, next){
	// 	res.locals.latestArticle = Article.find()
	// 														.where('published')
	// 														.sort({createdAt: 'descending'})
	// 														.exec(function (err, articles){
	// 																//console.log(JSON.stringify(articles[0]));
	// 															return articles[0]; //this is the latest
	// 														});
	// 	//console.log(JSON.stringify(res.locals.latestArticle));
	// 	next();
	// });
	
	app.get('/', function(req, res, next){
		
		//var title = fromWhitespaceToDashes(cache[0].title);
	//	console.log('with dashes: ' +title);
		res.redirect('/blog');
	});

	app.get('/blog', function(req, res, next){

		var out_articles   = {};
		var out_news 			 = {};

		//	parallel tasks
		function findArticles(){
			if(aCache.length < cache_config.articles) {
				out_articles = aCache;
			 }
			else {
				// aCache.length == LIMIT_OF_ARTICLE_CACHE
				// by business policy cache should never be greater than property
				Article.find()
					.where('published').equals(true)
					.sort({ createdAt: "descending"})
					.exec(function (err , articles) {
						if (err) { return next(err); }
						console.log('/blog found articles: '+JSON.stringify(articles) +'\n\n');

						aCache = articles.splice(cache_config.articles, articles.length);	
						out_articles = aCache;
				});	
			}
			
		}
		
		function findNews(){
			if(nCache.length < cache_config.news) {
				out_news = nCache; 
			}
			else{
				// nCache.length ==  LIMIT_OF_NEWS_CACHE
				News.find()
						.where('published').equals(true)
						.sort({ createdAt: "descending"})
						.exec(function (err , news) {
							if (err) { return next(err); }
							console.log('/blog found news: '+JSON.stringify(news)  +'\n\n');
				
							nCache = news.splice(cache_config.news, news.length);
							out_news = news;
				});
			}
		}

		async.series(
			[
				findArticles,
				findNews
			],function(req, res, next){
			res.render('index', {data: { news: out_news, articles: out_articles }} );
		});

	});
//expansion
// {
// 	data: {
// 		news:[{}],
// 		articles:[{}]
// 	}
// }

	// =================================
	// FIND BY TITLE PAGE
	// =================================
	app.get('/blog/article/:title', function(req, res, next){
		if(!req.params.title) return next(new Error('No article title'));
		
		var title = fromDashToWhitespace(req.params.title);
		console.log('param title:' +title);
		Article.findOne({title: title}, function(err , article){
			if(err) return next(err);
			if(!article.published) return res.sendStatus(401);
			
			console.log('found article: '+JSON.stringify(article));
			//article.title = fromWhitespaceToDashes(article.title);
				
			res.render('article', {article:article});
		})
	});

	// =================================
	// 	LOGIN PAGE
	// =================================	
	// GET
	app.get('/blog/login', function(req, res, next){
		res.render('login');
	});
	// POST
	app.post('/blog/login', passport.authenticate('login-local', 
			{
				successRedirect: '/profile',
				failureRedirect: '/login',
				failureFlash: true
			}
		)
	);

	// =================================
	// LOGOUT PAGE
	// =================================
	app.get('/blog/logout', function(req, res, next){
		req.logout();
		res.redirect('/');
	});


	// =================================
	// CREATE-ADMIN PAGE
	// =================================
	// app.get('/createAdmin', function(req, res, next){
	// 	res.render('createAdmin');
	// });
	// //POST
	// app.post('/createAdmin', function(req, res, next){
	// 	console.log('createAdmin: ' + JSON.stringify(req.body));
	// 	if(!req.body.email|| !req.body.password){ return next(new Error('Incorrect admin payload'));}
	// 	var email = req.body.email;
	// 	var password = req.body.password;
	// 	var displayName = req.body.displayName;
	// 	var bio = req.body.bio;
	// 	var admin = true;

	//  	User.findOne({email: email}, function(err, user){
	//  		if(err) { return next(err);}
	//  		if(user){
	//  			req.flash('error', 'An admin was found with that same email');
	//  			return res.redirect('/createAdmin');
	//  		}

	// 	 	var newAdmin = new User({
	// 		 		email: email,
	// 		 		password: password,
	// 		 		admin: admin,
	// 		 		displayName: displayName,
	// 		 		bio: bio,
	// 		 		createdAt: new Date()
	// 	 		});

	// 	 	newAdmin.save(function(err){
	// 	 		if(err) {return next(err);}
	// 	 		res.redirect('profile');
	// 	 	});

	// 	});
	// });

	// =================================
	// ADMIN PAGE
	// =================================
	app.get('/blog/admin', function(req, res, next){
		if(isAdmin)
			res.render('admin', {user: req.user});

		res.redirect('/login');
	});

	// =================================
	// POST PAGE
	// =================================
	app.get('/blog/post', function(req, res, next){
		res.render('post');
	});

	app.post('/blog/post', function(req, res, next){
			console.log('postArticle: ' + JSON.stringify(req.body));
			if(!req.body.title || !req.body.body || !req.body.author){ return next(new Error('Incorrect article payload'));}
		
			var title = req.body.title;
			var body = req.body.body;
			var author = req.body.author;
			var published = false;

		 	Article.findOne({title: title}, function(err, article){
		 		if(err) { return next(err);}
		 		if(article){
		 			req.flash('error', 'An article was found with that same title');
		 			return res.redirect('/post');
		 		}

			 	var newArticle = new Article({
				 		title: title,
				 		body: body,
				 		author: author,
				 		published: published,
				 		createdAt: new Date()
			 		});

			 	newArticle.save(function(err){
			 		if(err) {return next(err);}
			 		updateCache(); //update cache
			 		res.send('ok!');
			 	});

			});
	});

	// =================================
	// PROFILE PAGE
	// =================================
	app.get('/blog/profile', function(req, res, next){
		if( !isLoggedIn(req, res, next) ){
			res.redirect('/login');		 
		}
		else res.render('profile', {user: req.user});	
	});



	// =================================
	// SIGNUP PAGE
	// =================================
	//GET
	app.get('/blog/signup', function(req, res, next){
		res.render('signup');
	});
	//POST
	app.post('/blog/signup', function(req, res, next){
		console.log('registering new user: ' + JSON.stringify(req.body));
		if(!req.body.email|| !req.body.password){ return next(new Error('Incorrect admin payload'));}
		var email = req.body.email;
		var password = req.body.password;
		var displayName = req.body.displayName;
		var bio = req.body.bio;
		var admin = false;

	 	User.findOne({email: email}, function(err, user){
	 		if(err) { return next(err);}
	 		if(user){
	 			req.flash('error', 'A user was found with that same email');
	 			return res.redirect('/blog/signup');
	 		}

		 	var newUser = new User({
			 		email: email,
			 		password: password,
			 		admin: admin,
			 		displayName: displayName,
			 		bio: bio,
			 		createdAt: new Date()
		 		});

		 	newUser.save(function(err){
		 		if(err) {return next(err);}
		 		res.redirect('/blog/login');
		 	});

		});
	});

	// =================================
	// 404 PAGE
	// =================================
	app.use('*', function(req, res){
 		res.render('404');
	});

	//===================================================
	// HELPER FUNCTIONS
	//===================================================

	// =================================
	// UPDATE RECENT ARTICLE CACHE
	// =================================
	function updateCache(){
		cache[0] = Article.find()
				.where('published').equals(true)
				.sort({ createdAt: "descending"})
				.exec(function (err , articles) {
					if (err) { return next(err); }
					console.log('updated cache - now: '+JSON.stringify(articles[0]));
				return articles[0];
		});
	}

	// =================================
	// CHECK IF REQUEST IS AUTHENTICATED
	// =================================
	function isLoggedIn(req, res, next){
			return req.isAuthenticated();
	}

	function isAdmin(req, res, next){
		return isLoggedIn && req.user.admin;
	}

	// ==================================================
	// Replaces white space characters with dashes
	// ==================================================
	function fromWhitespaceToDashes(title){
		return title.replace(/ +/g, '-');
	}

	function fromDashToWhitespace(title){
		return title.replace(/-/g, ' ');
	}


}