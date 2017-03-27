/**
 * ServiceController
 *
 * @description :: Server-side logic for managing services
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


	// PAGES
 	list: function(req, res) {
 		return res.view('list-service', { me: null });
 	},

 	prepareNew: function(req, res) {
 		return res.view('save-service', { me: null });
 	},

 	prepareEdit: function(req, res) {

 		Service.findOne(+req.param('id')).exec(function (err, foundObject) {

 			if (err) return res.negotiate(err);
 			if (!foundObject) return res.redirect('/services');

 			return res.view('save-service', { 
 				me: null,
 				service: foundObject
			});

 		});

 	},

 	// PAGES



 	// APIS


 	deleteEntry: function(req, res) {

 		var id = +req.param('id');
 		Service.update({ id: id }, { deleted: true }).exec(function (err, removedEntry) {
 			if (err) return res.negotiate(err);
 			if (removedEntry.length === 0) {
 				return res.notFound();
 			}
 			return res.ok();
 		})

 	},


 	find: function(req, res) {

 		Service.count({ deleted: 0 }).exec(function (err, totalServices) {

 			if (err) return res.negotiate(err);
 			if (!totalServices) return res.notFound();

 			var searchCriteria = req.param('searchCriteria');
 			if (!searchCriteria) {
 				searchCriteria = '';
 			}
 			Service.find({
 				where: {

					deleted: 0,
 					or: [
 					{
 						name: {
 							contains: searchCriteria
 						}
 					}]

 				},

 				limit: 20,
 				skip: req.param('skip'),
 				sort: 'price ASC'
 			}).exec(function (err, services) {



 				return res.json({
 					options: {
 						services: services,
 						totalServices: totalServices
 					}
 				});
 			});
 		});

 	}
	
};

