// app.js

// setup ======================================================
var path 					= require('path');
var express 			= require('express');
var app 					= express();
var port 					= process.env.PORT || 3000

var mongoose 			= require('mongoose');
var logger 				= require('morgan');
var flash 				= require('connect-flash');
var passport 			= require('passport');

var bodyParser 		= require('body-parser');
var cookieParser 	= require('cookie-parser');
var session 			= require('express-session');
var publicPath 		= path.resolve(__dirname, 'public');

var configDb 			= require('./config/database.js');
// configuration ==============================================

// connect to db
mongoose.connect(configDb.url);

// configure passport
require('./config/setupPassport.js')(passport);

// set up our express app
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
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

// routes==========================================================
require('./routes/appRoutes.js')(app, passport); //load our apps and pass passport fully configured

// launch =========================================================

app.listen(app.get('port'), function(){
	console.log('Server started on port: '+app.get('port'));
});