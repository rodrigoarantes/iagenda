/**
 * AppointmentController
 *
 * @description :: Server-side logic for managing appointments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var moment = require('moment');

module.exports = {


	// PAGES
 	list: function(req, res) {

 		var date = req.param('date');
 		var momentDate = moment();
 		if (date) {
 			momentDate = moment(date, 'YYYY-MM-DD');
	 		if (!momentDate.isValid()) {
	 			return res.badRequest('Please provide date parameter with the format YYYY-MM-DD');
	 		}
 		}
		return res.view('list-appointments', { me: null, dateParam: momentDate.format('YYYY-MM-DD') });
 	},

 	prepareNew: function(req, res) {

 		var scheduledDateTimeParam = req.param('scheduledDateTime');
 		sails.log(scheduledDateTimeParam);
 		if (_.isUndefined(scheduledDateTimeParam) || !moment(scheduledDateTimeParam, 'YYYY-MM-DD HH:mm').isValid()) {
			return res.badRequest('Please provide scheduledDateTime parameter with the format YYYY-MM-DD HH:mm');
 		}

 		Customer.find({ where: { deleted: false }, sort: "name ASC" }).exec(function (err, customerListFound) {
 			if (err) return res.negotiate(err);

 			Service.find({ where: { deleted: false }, sort: "name ASC" }).exec(function (err, serviceListFound) {
 				if (err) return res.negotiate(err);

 				return res.view('save-appointment', { 
 					me: null ,
 					scheduledDateTime: scheduledDateTimeParam,
 					customerList: customerListFound,
 					serviceList: serviceListFound
 				});

 			});

 		});
 		
 	},

 	prepareEdit: function(req, res) {

 		Appointment.findOne(+req.param('id')).exec(function (err, foundObject) {

 			if (err) return res.negotiate(err);
 			if (!foundObject) return res.redirect('/appointments');

 			return res.view('save-appointment', { 
 				me: null,
 				appointment: foundObject
			});

 		});

 	},

 	// PAGES



 	// APIS

 	create: function (req, res) {


		var jsonObject = req.body;
 		if (!jsonObject) {
 			return res.badRequest('Body with object is required.');
 		}

	    // Find the user that's adding a tutorial
	    Appointment.count({
	    	where: {
	    		deleted: 0,
	    		scheduledFor: jsonObject.scheduledFor
	    	}
	    }).exec(function(err, numberOfEntries){
	    	if (err) return res.negotiate;
	    	if (numberOfEntries && numberOfEntries > 0) return res.badRequest('Já existe horário marcado na hora informado.');

	    	Appointment.create(jsonObject).exec(function(err, createdObject){
	    		if (err) return res.negotiate(err);

	    		return res.json({id: createdObject.id});
	    	});

 		});

	},

 	hasOverlappingTime: function(req, res) {

 		var startDateTime = req.param('startDateTime');
 		var momentStartDateTime = moment(startDateTime, 'YYYY-MM-DD HH:mm');
 		if (_.isUndefined(startDateTime) || !momentStartDateTime.isValid()) {
 			return res.badRequest('Please provide startDateTime parameter with the format YYYY-MM-DD HH:mm.');
 		}

 		var endDateTime = req.param('endDateTime');
 		var momentEndDateTime = moment(endDateTime, 'YYYY-MM-DD HH:mm');
 		if (_.isUndefined(endDateTime) || !momentEndDateTime.isValid()) {
 			return res.badRequest('Please provide endDateTime parameter with the format YYYY-MM-DD HH:mm.');
 		}

 		sails.log(startDateTime);
 		sails.log(endDateTime);
 		// var sql = 'SELECT count(1) as overlapps from appointment a ' +
			// 	  'INNER JOIN service s ON a.service = s.id '+
			// 	  'WHERE a.scheduledFor >= ? and DATE_ADD(a.scheduledFor, INTERVAL s.numberOfSessions * 15 MINUTE) <= ? ';
		var sql = 'SELECT count(1) as overlapps from appointment a ' +
			  'INNER JOIN service s ON a.service = s.id '+
			  'WHERE a."scheduledFor" >= ? and a."scheduledFor" + s."numberOfSessions"' + " * INTERVAL '15 MINUTE' <= ? ";
		sails.log(sql);
 		Appointment.query(sql, [ startDateTime, endDateTime ] ,function(err, rawResult) {
		  if (err) { return res.serverError(err); }

		  sails.log(rawResult);
		  return res.json({
 				options: {
 					hasOverlappingTime: (rawResult && rawResult.length > 0 ? rawResult[0].overlapps : 0)
 				}
 			});

		});

 	},

 	deleteEntry: function(req, res) {

 		var id = +req.param('id');
 		Appointment.update({ id: id }, { deleted: true }).exec(function (err, removedEntry) {
 			if (err) return res.negotiate(err);
 			if (removedEntry.length === 0) {
 				return res.notFound();
 			}
 			return res.ok();
 		})

 	},


 	find: function(req, res) {

 		var dateParam = req.param('date');
 		var momentDate = moment(dateParam, 'YYYY-MM-DD');
 		if (_.isUndefined(dateParam) || !momentDate.isValid()) {
 			return res.badRequest('Please provide date parameter with the format YYYY-MM-DD.');
 		}

 		var nextDayFormatted = momentDate.add(1, 'day');

 		Appointment.find({
 			where: {
 				deleted: 0,
 				scheduledFor: {
 					'>=': dateParam,
 					'<': nextDayFormatted.format('YYYY-MM-DD')
 				}
 			},
 			sort: 'scheduledFor ASC'
 		})
 		.populate('customer')
 		.populate('service')
 		.exec(function (err, appointments) {

 			return res.json({
 				options: {
 					appointments: appointments
 				}
 			});
 		});

 	}
	
};

