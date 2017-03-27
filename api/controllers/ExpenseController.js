/**
 * ExpenseController
 *
 * @description :: Server-side logic for managing expenses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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

 		Expense.count().exec(function (err, totalExpenses) {

 			if (err) return res.negotiate(err);
 			if (!totalExpenses) return res.notFound();

 			var searchCriteria = req.param('searchCriteria');
 			if (!searchCriteria) {
 				searchCriteria = '';
 			}
 			Expense.find({
 				where: {

 					or: [
 					{
 						name: {
 							contains: searchCriteria
 						}
 					}]

 				},

 				limit: 20,
 				skip: req.param('skip'),
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

