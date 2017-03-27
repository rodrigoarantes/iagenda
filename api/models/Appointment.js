/**
 * Appointment.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

  	scheduledFor: {
		type: 'datetime',
		required: true
 	},

 	price: {
 		type: 'float',
 		required: true,
 		min: 1
 	},

 	deleted: {
 		type: 'boolean',
 		defaultsTo : false
 	},

 	service: {
 		model: 'service',
 		required: true
 	},

 	customer: {
 		model: 'customer',
 		required: true
 	}

  }
};

