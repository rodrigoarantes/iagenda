/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

 module.exports = {

 	attributes: {
 		email: {
 			type: 'string',
 			email: 'true',
 			required: true,
 			unique: 'true'
 		},
 		encryptedPassword: {
 			type: 'string'
 		},
 		deleted: {
 			type: 'boolean',
 			defaultsTo: false
 		},
 		admin: {
 			type: 'boolean',
 			defaultsTo: false
 		},
 		banned: {
 			type: 'boolean',
 			defaultsTo: false
 		}
 	}
 };

