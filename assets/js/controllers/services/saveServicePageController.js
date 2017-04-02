angular.module('brushfire').controller('saveServicePageController', ['$scope', '$http', '$window', 'toastr', function($scope, $http, $window, toastr) {


  $scope.INCREMENTAL_MINUTES = 15;
  var AN_HOUR_IN_MIN = 60;

  (function init() {
    $scope.me = window.SAILS_LOCALS.me;
    $scope.newService = $window.SAILS_LOCALS.editingObject;

    if (!$scope.newService) {
      $scope.newService = {
        numberOfSessions: 1
      };
    }
  })();

  


/* 
  _____   ____  __  __   ______               _       
 |  __ \ / __ \|  \/  | |  ____|             | |      
 | |  | | |  | | \  / | | |____   _____ _ __ | |_ ___ 
 | |  | | |  | | |\/| | |  __\ \ / / _ \ '_ \| __/ __|
 | |__| | |__| | |  | | | |___\ V /  __/ | | | |_\__ \
 |_____/ \____/|_|  |_| |______\_/ \___|_| |_|\__|___/

 */

 $scope.save = save;
 $scope.onChangeNumberOfSessions = onChangeNumberOfSessions;
 onChangeNumberOfSessions();

 function onChangeNumberOfSessions() {
    $scope.sessionDurationHours = Math.floor(($scope.newService.numberOfSessions * $scope.INCREMENTAL_MINUTES) / AN_HOUR_IN_MIN);
    $scope.sessionDurationMinutes = ($scope.newService.numberOfSessions * $scope.INCREMENTAL_MINUTES) % AN_HOUR_IN_MIN;
 }


  // FUNCTIONS
  /////////////

  function save() {

  	var valid = validate();

  	if (valid.isValid) {

  		if ($scope.newService.id && $scope.newService.id > 0) {


        $http.put('/service/' + $scope.newService.id, $scope.newService)
          .then(function onSuccess(sailsResponse) {

            toastr.success('Serviço atualiado com successo.');
            $window.location.href = '/services';

          }).catch(function onError(sailsResponse) {

              // Otherwise, this is some weird unexpected server error. 
              // Or maybe your WIFI just went out.
              console.error('sailsResponse: ', sailsResponse);
          });

      } else {
          
          $http.post('/service', $scope.newService)
          .then(function onSuccess(sailsResponse) {

            toastr.success('Serviço criado com successo.');
            $window.location.href = '/service/list';

          }).catch(function onError(sailsResponse) {

              // Otherwise, this is some weird unexpected server error. 
              // Or maybe your WIFI just went out.
              console.error('sailsResponse: ', sailsResponse);
          });
      }

  	} else {
  		toastr.error(valid.message); 
  	}

  }

  function validate() {

  	if (!$scope.newService.name || $scope.newService.name.length == 0) {
  		return {
  			isValid: false,
  			message: 'Nome é obrigatório.'
  		}
  	}

    if (!$scope.newService.numberOfSessions || $scope.newService.numberOfSessions <= 0 || $scope.newService.numberOfSessions > 20) {
      return {
        isValid: false,
        message: 'Número de sessões é obrigatório e deve ser um número maior que zero.'
      }
    }
    

    if (!$scope.newService.price || $scope.newService.price <= 0) {
      return {
        isValid: false,
        message: 'Preço é obrigatório. Apenas números positivos.'
      }
    }

  	return {
  		isValid: true
  	};
  }



}]);