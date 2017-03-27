/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
 //  Video.count().exec(function(err, numVideos) {
 //  	if (err) {
 //  		return cb(err);
 //  	}
 //  	if (numVideos > 0) {
 //  	 	console.log('Number of video records: ', numVideos);
 //  		return cb();
 //  	}

	// var Youtube = require('machinepack-youtube');
	// // List Youtube videos which match the specified search query.
	// Youtube.searchVideos({
	// 	query: 'grumpy cat',
	// 	apiKey: 'PLACE YOUR GOOGLE API KEY HERE',
	// 	limit: 15,
	// }).exec({
	// 	// An unexpected error occurred.
	// 	error: function(err) {
	// 		console.log('an error: ', err);
	// 	},
	// 	// OK.
	// 	success: function(result) {
	// 		console.log('the result: ', result);
	// 	},
	// });

	return cb();
  //})
  
};
