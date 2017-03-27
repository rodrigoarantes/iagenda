/**
 * Customer.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {


  	name: {
  		type: 'string',
  		required: true,
      minLength: 2,
      maxLength: 100
  	},

  	comment: {
  		type: 'string',
      maxLength: 255
  	},

  	phone1: {
  		type: 'string',
  		required: true,
      maxLength: 18
  	},

  	phone2: {
  		type: 'string',
      maxLength: 18
  	},

  	deleted: {
  		type: 'boolean',
  		defaultsTo: false,
      required: true
  	}




  }
};

