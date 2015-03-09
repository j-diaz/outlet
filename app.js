// app.js

// setup ======================================================
var path 								= require('path');
var fs 									= require('fs');
var express 						= require('express');
var app 								= express();
var port 								= process.env.PORT || 3000

var mongoose 						= require('mongoose');
var logger 							= require('morgan');
var flash 							= require('connect-flash');
var passport 						= require('passport');

var bodyParser 					= require('body-parser');
var cookieParser 				= require('cookie-parser');
var session 						= require('express-session');
var publicPath 					= path.resolve(__dirname, 'public');

var aCache							= {};
var nCache							= {};
var CACHE_CONSTANTS			= {};
var async								= require('async');
var flow								= require('nimble');

var configDb 						= require('./config/database.js');
// configuration ==============================================

// connect to db
mongoose.connect(configDb.url);

// configure passport
require('./config/setupPassport.js')(passport);

// set up our express app
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.set('port', port);
app.use(express.static(publicPath));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// required for passport
app.use(session({
	secret: 'TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX',
	resave: true,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// populate artcle & news Caches========================================
cache_config = require('./cache/cache_properties.json');
console.log('Succesfully read cache_properties.json file: '+cache_config.news);

// Configuration of Cache + Routes must happen sequantially=============
var caching = require('./cache/bootstrap_cache.js');
var app_routing = require('./routes/appRoutes.js');
var api_routing = require('./routes/apiRoutes.js');

flow.series([
		function(catching){
			console.log('Boostrapping Caches');
			catching(aCache, nCache, cache_config.article, cache_config.news);
		},
		function(app_routing){
			console.log('Configuring appRoutes.js');
			// routes==========================================================
			app_routing(app, passport, aCache, nCache, cache_config, async); //load our apps and pass passport fully configured
		},
		function(api_routing){
			console.log('Configuring apiRoutes.js');
			api_routing(app, passport, aCache, nCache, cache_config, async);
			
		}
]);

	// launch =========================================================
			app.listen(app.get('port'), function(){
					console.log('Server started on port: '+app.get('port'));
			});
