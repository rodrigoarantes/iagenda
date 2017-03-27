/**
 * Service.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

  	name: {
  		type: 'string',
  		required: true,
      minLength: 3,
      maxLength: 50
  	},

  	price: {
  		type: 'float',
  		required: true,
      min: 1
  	},

    numberOfSessions: {
      type: 'integer',
      required: true,
      min: 1,
      max: 20
    },

  	deleted: {
  		type: 'boolean',
  		defaultsTo : false
  	}

  }
};

