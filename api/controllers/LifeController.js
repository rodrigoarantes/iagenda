/**
 * LifeController
 *
 * @description :: Server-side logic for managing lives
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {

 	purpose: function(req, res) {
		return res.json({
			answer: "Rodrigo",
			question: "Question"
		});
	}

 };

