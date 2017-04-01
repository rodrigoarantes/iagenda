/**
 * CustomerController
 *
 * @description :: Server-side logic for managing Customers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {

 	// PAGES
 	list: function(req, res) {
 		return res.view('list-customer', { me: null });
 	},

 	prepareNew: function(req, res) {
 		return res.view('save-customer', { me: null });
 	},

 	showDetail: function(req, res) {
 		Customer.findOne(+req.param('id')).exec(function (err, foundObject) {

 			if (err) return res.negotiate(err);
 			if (!foundObject) return res.redirect('/customers');

 			return res.view('show-customer', { 
 				me: null,
 				customer: foundObject
			});

 		});
 	},

 	prepareEdit: function(req, res) {

 		Customer.findOne(+req.param('id')).exec(function (err, foundObject) {

 			if (err) return res.negotiate(err);
 			if (!foundObject) return res.redirect('/customers');

 			return res.view('save-customer', { 
 				me: null,
 				customer: foundObject
			});

 		});

 	},

 	// PAGES


 	// APIS
 	deleteEntry: function(req, res) {

 		var id = +req.param('id');
 		Customer.update({ id: id }, { deleted: true }).exec(function (err, removedEntry) {
 			if (err) return res.negotiate(err);
 			if (removedEntry.length === 0) {
 				return res.notFound();
 			}
 			return res.ok();
 		})

 	},


 	find: function(req, res) {

 		var searchCriteria = req.param('searchCriteria');
		if (!searchCriteria) {
			searchCriteria = '';
		}
		Customer.find({
			where: {

			deleted: 0,
				or: [
				{
					name: {
						contains: searchCriteria
					}
				},
				{
					phone1: {
						contains: searchCriteria
					}
				},
				{
					phone2: {
						contains: searchCriteria
					}
				},
				{
					comment: {
						contains: searchCriteria
					}
				}
				]

			},

			limit: 20
		}).exec(function (err, customers) {



			return res.json({
				options: {
					customers: customers
				}
			});
		});

 	}

 };

