/**
 * ExpenseController
 *
 * @description :: Server-side logic for managing expenses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var moment = require('moment');
var async = require('async');

module.exports = {


	// PAGES
	reports: function(req, res) {
 		return res.view('reports', { me: null });
 	},

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
 	monthlyReport: function(req, res) {

 	},

 	yearlyReport: function(req, res) {

 		var year = req.param('year');
 		if (_.isUndefined(year) || isNaN(year)) {
 			return res.badRequest('Please provide a valid year parameter.');
 		}

 		var startMonth = req.param('startMonth');
 		if (_.isUndefined(startMonth) || isNaN(startMonth) || startMonth <= 0 || startMonth > 12) {
 			return res.badRequest('Please provide a valid startMonth parameter.');
 		}

 		var endMonth = req.param('endMonth');
 		if (_.isUndefined(endMonth) || isNaN(endMonth) || endMonth <= 0 || endMonth > 12) {
 			return res.badRequest('Please provide a valid endMonth parameter.');
 		}

 		if (startMonth > endMonth) {
 			return res.badRequest('Incorrect Use! endMonth must come after startMonth.');
 		}

 		var startDateTime = moment().set( {'date': 1, 'year': year, 'month': startMonth - 1, 'hour': 0, 'minute': 0} );
 		var endDateTime = moment().set( { 'year': year, 'month': endMonth - 1, 'hour': 23, 'minute': 59} ).endOf('month');

 		sails.log(startDateTime.format('YYYY-MM-DD HH:mm:ss'));
 		sails.log(endDateTime.format('YYYY-MM-DD HH:mm:ss'));

 		var sqlEarnings =   'SELECT SUM(a.price) as totalValue, COUNT(1) as numOfServices, MONTH(a.scheduledFor) as month FROM appointment a ' +
						    ' WHERE a.scheduledFor >= ? and a.scheduledFor <= ?' +
						    ' GROUP BY MONTH(a.scheduledFor)' +
							' ORDER BY MONTH(a.scheduledFor) ASC ';
		var sqlEarningsAndParams = {
			sql: sqlEarnings,
			jsonKey: 'earnings',
			parameters: [ startDateTime.format('YYYY-MM-DD HH:mm:ss'), endDateTime.format('YYYY-MM-DD HH:mm:ss') ]
		}; 



		var sqlExpenses = 'SELECT SUM(`value`) as totalValue, MONTH(a.referredTo) as month from expense a '+
							'WHERE a.referredTo >= ? and a.referredTo <= ? ' +
							'GROUP BY MONTH(a.referredTo) ' +
							'ORDER BY MONTH(a.referredTo) ASC ';
		var sqlExpensesAndParams = {
			sql: sqlExpenses,
			jsonKey: 'expenses',
			parameters: [ startDateTime.format('YYYY-MM-DD'), endDateTime.format('YYYY-MM-DD') ]
		}; 			

		var jsonOptions = {};
		async.each([sqlEarningsAndParams, sqlExpensesAndParams], function executeQueries(sqlAndParams, next){ 

			Expense.query(sqlAndParams.sql, sqlAndParams.parameters ,function(err, rawResult) {
			  if (err) { next(err); }

			  jsonOptions[sqlAndParams.jsonKey] = rawResult;
			  next();
			});

		}, function afterwards(err) {

			if (err) { return res.serverError(err); }

			var finalResults = {};
			if (jsonOptions) {

				var expenses = jsonOptions.expenses;
				var earnings = jsonOptions.earnings;

				
				for (var i = startMonth; i <= endMonth; i++) {
					
					finalResults[i] = {
						totalEarnigs: 0,
						totalExpenses: 0,
						numOfServices: 0,
						totalNetEarnigs: 0
					};
					var earningsFound = _.find(earnings, function (obj) { return obj.month == i; } );
					if (earningsFound) {
						finalResults[i].totalEarnigs = earningsFound.totalValue;
						finalResults[i].numOfServices = earningsFound.numOfServices;
					}
					var expensesFound = _.find(expenses, function (obj) { return obj.month == i; } );
					if (expensesFound) {
						finalResults[i].totalExpenses = expensesFound.totalValue;
					}
					finalResults[i].totalNetEarnigs = (finalResults[i].totalEarnigs - finalResults[i].totalExpenses);

				}
			}
			return res.json( finalResults );

		});


 	},

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
 		momentEndDate.set('hour', 23).set('minute', 59).set('second', 59);

 		if (momentEndDate.isBefore(momentStartDate)) {
 			return res.badRequest('Incorrect Use! EndDate must come after StartDate.');
 		}

 		Expense.count().exec(function (err, totalExpenses) {

 			if (err) return res.negotiate(err);
 			if (!totalExpenses) return res.notFound();

 			Expense.find({
 				where: {

 					referredTo: {
 						'>=': momentStartDate.toDate(),
 						'<=': momentEndDate.toDate()
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

