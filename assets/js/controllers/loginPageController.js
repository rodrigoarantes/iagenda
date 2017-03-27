angular.module('brushfire').controller('loginPageController', ['$scope', '$http', '$window', 'toastr', function($scope, $http, $window, toastr) {


  var ctrl = this;

  // Grab the locals 
  ctrl.me = window.SAILS_LOCALS.me;
  ctrl.loginUser = {};
  ctrl.loading = false;
  
/* 
  _____   ____  __  __   ______               _       
 |  __ \ / __ \|  \/  | |  ____|             | |      
 | |  | | |  | | \  / | | |____   _____ _ __ | |_ ___ 
 | |  | | |  | | |\/| | |  __\ \ / / _ \ '_ \| __/ __|
 | |__| | |__| | |  | | | |___\ V /  __/ | | | |_\__ \
 |_____/ \____/|_|  |_| |______\_/ \___|_| |_|\__|___/

 */

 ctrl.onLogin = onLogin;

  //
  function onLogin() {
    
    
    if (!ctrl.loginUser.email || !ctrl.loginUser.password) {
      toastr.error('Por favor informe email e senha');
      return;
    }

    ctrl.loading = true;
    $http({
      url: '/login',
      method: 'PUT',
      params: {
        email: ctrl.loginUser.email,
        password: ctrl.loginUser.password
      }
    })
    .then(function onSuccess(sailsResponse) {

      if (sailsResponse && sailsResponse.status == 200) {
        $window.location = '/';
      }

    })
    .catch(function onError(sailsResponse) {

      if (sailsResponse && sailsResponse.status == 404) {
        toastr.error('Email ou senha inválidos.');
      }
      console.error('sailsResponse: ', sailsResponse);
    })
    .finally(function eitherWay() {
      ctrl.loading = false;
    });
  }

}]);