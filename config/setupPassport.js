// ================================================================
// PASSPORT CONFIGURATION FILE
// ================================================================

var LocalStrategy = require('passport-local').Strategy;
var User 					= require('../models/user');

module.exports		= function(passport){

// SERIALIZATION ===============================
passport.serializeUser(function(user, done){
		done(null, user._id);
	});

// DESERIALIZATION =============================
passport.deserializeUser(function(id, done){
	User.findById(id, function(err, user){
		done(err, user);
	});
});

// AUTHENTICATION ===============================
passport.use('login-local', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password'
	},
	function(email, password, done){
		User.findOne({ email: email }, function (err, user){
			if(err) {return done(err);}
			if(!user){
				return done(null,false, {message: 'No user has that email!'});
			}
			user.checkPassword(password, function(err, isMatch){
				if(err) {return done(err);}
				if(isMatch){
					return done(null, user);
				}else{
					return done(null,false,{message: 'Invalid password'});
				}
			});
		})
	})
);

}
