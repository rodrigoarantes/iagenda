/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Passwords = require('machinepack-passwords');
 module.exports = {


 	loginPage: function(req, res) {
 		return res.view('login', { me: null });
 	},

 	login: function(req, res) {

 		
 		sails.log('hahaha - works');

 		User.findOne({
 			where: {
 				email: req.param('email')
 			}
 		}, function foundUser(err, createdUser) {
 			if (err) return res.negotiate(err);
 			if (!createdUser) return res.notFound();

 			Passwords.checkPassword({
 				passwordAttempt: req.param('password'),
 				encryptedPassword: createdUser.encryptedPassword
 			}).exec({

 				error: function(err) {
 					return res.negotiate(err);
 				},

 				incorrect: function() {
 					return res.notFound();
 				},

 				success: function() {

 					req.session.userId = createdUser.id;
 					return res.ok();

 				}
 			});
 		});
 	},



 	logout: function(req, res) {

 		if (!req.session.userId) {
 			return res.redirect('/login');
 		}
 		
 		User.findOne(req.session.userId, function foundUser(err, user) {
 			if (!user) {
 				sails.log.verbose('Session refers to a user who no longer exists.');
 				return res.redirect('/login');
 			}

		  // log the user-agent out.
		  req.session.userId = null;

		  return res.redirect('/login');
		});
 	},


 	hello: function(req, res) {
 		return res.json('Hello World!');
 	},



 	signup: function(req, res) {

 		if (_.isUndefined(req.param('email'))) {
 			return res.badRequest('An email address is required!');
 		}

 		if (_.isUndefined(req.param('password'))) {
 			return res.badRequest('A password is required!');
 		}

 		if (req.param('password').length < 6) {
 			return res.badRequest('Password must be at least 6 characters!');
 		}


 		Passwords.encryptPassword({
      		password: req.param('password'),
      	}).exec({

      		error: function(err) {
      			return res.serverError(err);
      		},

      		success: function(result) {

      			var options = {};


      			options.email = req.param('email');
      			options.encryptedPassword = result;
      			options.deleted = false;
      			options.admin = false;
      			options.banned = false;

      			User.create(options).exec(function(err, createdUser) {
	      			if (err) return res.negotiate(err);

	              	// Log the user in
	              	req.session.userId = createdUser.id;
	              	return res.json({
	              		id: createdUser.id
	              	});
	          });
      		}
      	});

 
	}



}

