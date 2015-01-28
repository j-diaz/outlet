// ================================================================
//  APP ROUTES
// ================================================================
var Article 	 = require('../models/article');
var User 			 = require('../models/user');

module.exports = function(app, passport){

	// // =================================
	// // FOR PERSISTING USER
	// // =================================
	// app.use(function(req, res, next){
	// 	res.locals.currentUser = req.user;
	// 	res.locals.errors = req.flash('error');
	// 	res.locals.infos = req.flash('info');
	// 	next();
	// })

	// =================================
	// HOME PAGE
	// =================================
	app.get('/', function(req, res, next){
			Article.find()
				.where('published').equals(true)
				.sort({ createdAt: "descending"})
				.exec(function (err , articles) {
					if (err) { return next(err); }
					console.log('loading home page: '+JSON.stringify(articles));
					res.render('index', {articles: articles});
		});

	});

	app.get('/articles', function(req, res, next){
		res.redirect('/');
	});

	// =================================
	// 	LOGIN PAGE
	// =================================	
	// GET
	app.get('/login', function(req, res, next){
		res.render('login');
	});
	// POST
	app.post('/login', passport.authenticate('login-local', 
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
	app.get('/logout', function(req, res, next){
		req.logout();
		res.redirect('/');
	});


	// =================================
	// CREATE-ADMIN PAGE
	// =================================
	app.get('/createAdmin', function(req, res, next){
		res.render('createAdmin');
	});
	//POST
	app.post('/createAdmin', function(req, res, next){
		console.log('createAdmin: ' + JSON.stringify(req.body));
		if(!req.body.email|| !req.body.password){ return next(new Error('Incorrect admin payload'));}
		var email = req.body.email;
		var password = req.body.password;
		var displayName = req.body.displayName;
		var bio = req.body.bio;
		var admin = true;

	 	User.findOne({email: email}, function(err, user){
	 		if(err) { return next(err);}
	 		if(user){
	 			req.flash('error', 'An admin was found with that same email');
	 			return res.redirect('/createAdmin');
	 		}

		 	var newAdmin = new User({
			 		email: email,
			 		password: password,
			 		admin: admin,
			 		displayName: displayName,
			 		bio: bio,
			 		createdAt: new Date()
		 		});

		 	newAdmin.save(function(err){
		 		if(err) {return next(err);}
		 		res.redirect('profile');
		 	});

		});
	});

	// =================================
	// ADMIN PAGE
	// =================================
	app.get('/admin', isAdmin, function(req, res, next){
		if(isLoggedIn && isAdmin)
			res.render('admin', {user: req.user});

		res.redirect('/login');
	});

	// =================================
	// POST PAGE
	// =================================
	app.get('/post', function(req, res, next){
		res.render('post');
	});

	app.post('/post', function(req, res, next){
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
			 		res.send('ok!');
			 	});

			});
	});

	// =================================
	// PROFILE PAGE
	// =================================
	app.get('/profile', function(req, res, next){
		if( !isLoggedIn(req, res, next) ){
			res.redirect('/login');		 
		}
		else res.render('profile', {user: req.user});	
	});

	// =================================
	// FIND BY TITLE PAGE
	// =================================
	app.get('/articles/:title', function(req, res, next){
		if(!req.params.title) return next(new Error('No article title'));
		var title = req.params.title;
		Article.findOne({title: title}, function(err , article){
			if(err) return next(err);
			if(!article.published) return res.sendStatus(401);
			console.log('found article: '+JSON.stringify(article));
			res.render('article', {article:article});
		});
	});

	// =================================
	// SIGNUP PAGE
	// =================================
	//GET
	app.get('/signup', function(req, res, next){
		res.render('signup');
	});
	//POST
	app.post('/signup', function(req, res, next){
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
	 			return res.redirect('/signup');
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
		 		res.redirect('/login');
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
	// CHECK IF REQUEST IS AUTHENTICATED
	// =================================
	function isLoggedIn(req, res, next){
			return req.isAuthenticated();
	}

	function isAdmin(req, res, next){
		return isLoggedIn && req.user.admin;
	}

}