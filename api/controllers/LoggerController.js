/**
 * LoggerController
 *
 * @description :: Server-side logic for managing loggers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	create: function(req, res) {

 		var jsonObject = req.body;
 		if (!jsonObject) {
 			return res.badRequest('Body with object is required.');
 		}

 		// if (!jsonObject.message) {
			// jsonObject.message = 'No message provided! AUTOMATICALLY Added by the API.';
 		// }
 		jsonObject.user = req.session.userId;
 		sails.log(jsonObject.stack.length);

 		Logger.create(jsonObject).exec(function (err, createdEntry) {
 			if (err) return res.negotiate(err);
 			
 			return res.ok(createdEntry);
 		})

 	}
	
};

