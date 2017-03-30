/**
 * ExpenseController
 *
 * @description :: Server-side logic for managing expenses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var moment = require('moment');

module.exports = {


	// PAGES
 	list: function(req, res) {
 		return res.view('list-expense', { me: null });
 	},

 	prepareNew: function(req, res) {
 		return res.view('save-expense', { me: null });
 	},

 	prepareEdit: function(req, res) {

 		Expense.findOne(+req.param('id')).exec(function (err, foundObject) {

 			if (err) return res.negotiate(err);
 			if (!foundObject) return res.redirect('/expenses');

 			return res.view('save-expense', { 
 				me: null,
 				expense: foundObject
			});

 		});

 	},


 	// APIS

 	find: function(req, res) {

 		var startDate = req.param('startDate');
 		var momentStartDate = moment(startDate, 'YYYY-MM-DD');
 		if (_.isUndefined(startDate) || !momentStartDate.isValid()) {
 			return res.badRequest('Please provide startDate parameter with the format YYYY-MM-DD');
 		}

 		var endDate = req.param('endDate');
 		var momentEndDate = moment(endDate, 'YYYY-MM-DD');
 		if (_.isUndefined(endDate) || !momentEndDate.isValid()) {
 			return res.badRequest('Please provide endDate parameter with the format YYYY-MM-DD');
 		}

 		if (momentEndDate.isBefore(momentStartDate)) {
 			return res.badRequest('Incorrect Use! EndDate must come after StartDate.');
 		}

 		Expense.count().exec(function (err, totalExpenses) {

 			if (err) return res.negotiate(err);
 			if (!totalExpenses) return res.notFound();

 			Expense.find({
 				where: {

 					referredTo: {
 						'>=': startDate,
 						'<=': endDate
 					}
 				},

 				limit: 20,
 				sort: 'name ASC'
 			}).exec(function (err, expenses) {



 				return res.json({
 					options: {
 						expenses: expenses,
 						totalExpenses: totalExpenses
 					}
 				});
 			});
 		});

 	}
	
};

