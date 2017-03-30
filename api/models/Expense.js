/**
 * Expense.js
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
      maxLength: 50
  	},

  	value: {
  		type: 'float',
  		required: true,
      min: 1
  	},

    referredTo: {
      type: 'date',
      required: true
    },

  	description: {
  		type: 'string'
  	},

  }
};

