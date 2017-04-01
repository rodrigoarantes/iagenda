/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /*************************************************************
  * JSON API ENDPOINTS                                         *
  *************************************************************/  

  'POST /customer': 'CustomerController.create',
  'PUT /customer': 'CustomerController.update',
  'GET /customers': 'CustomerController.list',
  'DELETE /customers/:id': 'CustomerController.deleteEntry',

  'POST /expense': 'ExpenseController.create',
  'PUT /expense': 'ExpenseController.update',
  'GET /expenses/:id/edit': 'ExpenseController.prepareEdit',

  'POST /service': 'ServiceController.create',
  'PUT /service': 'ServiceController.update',
  'DELETE /services/:id': 'ServiceController.deleteEntry',

  'POST /appointments': 'AppointmentController.create',

  'PUT /login': 'UserController.login',


  /*************************************************************
  * Server Rendered HTML Page Endpoints                        *
  *************************************************************/

  'GET /': 'AppointmentController.list',

  'GET /signup': 'UserController.signup',
  'GET /login': 'UserController.loginPage',
  'PUT /login': 'UserController.login',
  'GET /logout': 'UserController.logout',

  'GET /customers/new': 'CustomerController.prepareNew',
  'GET /customers/:id': 'CustomerController.showDetail',
  'GET /customers/:id/edit': 'CustomerController.prepareEdit',

  'GET /reports': 'ExpenseController.reports',
  'GET /expenses': 'ExpenseController.list',
  'GET /expenses/new': 'ExpenseController.prepareNew',

  'GET /services': 'ServiceController.list',
  'GET /services/new': 'ServiceController.prepareNew',
  'GET /services/:id/edit': 'ServiceController.prepareEdit',

  'GET /appointments': 'AppointmentController.list',
  'GET /appointments/new': 'AppointmentController.prepareNew',
  'GET /appointments/:id/edit': 'AppointmentController.prepareEdit'



  

};
