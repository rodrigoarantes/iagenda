angular.module('brushfire').controller('saveExpensePageController', ['$scope', '$http', '$window', 'toastr', function($scope, $http, $window, toastr) {



  (function init() {
    $scope.me = window.SAILS_LOCALS.me;
    $scope.newExpense = $window.SAILS_LOCALS.editingObject;

    if (!$scope.newExpense) {
      $scope.newExpense = {
        referredToDate: new Date()
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


  // FUNCTIONS
  /////////////

  function save() {

  	var valid = validate();

  	if (valid.isValid) {

      $scope.newExpense.referredTo = moment($scope.newExpense.referredToDate).format('YYYY-MM-DD');

  		if ($scope.newExpense.id && $scope.newExpense.id > 0) {


        $http.put('/expense/' + $scope.newExpense.id, $scope.newExpense)
          .then(function onSuccess(sailsResponse) {

            toastr.success('Despesa atualiado com successo.');
            $window.location.href = '/expenses';

          }).catch(function onError(sailsResponse) {

              // Otherwise, this is some weird unexpected server error. 
              // Or maybe your WIFI just went out.
              console.error('sailsResponse: ', sailsResponse);
          });

      } else {
          
          $http.post('/expense', $scope.newExpense)
          .then(function onSuccess(sailsResponse) {

            toastr.success('Despesa criado com successo.');
            $window.location.href = '/expenses';

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

  	if (!$scope.newExpense.name || $scope.newExpense.name.length == 0 || $scope.newExpense.name.length < 2) {
  		return {
  			isValid: false,
  			message: 'Nome é obrigatório. Quantidade minima de caracters é de 2.'
  		}
  	}
    

    if (!$scope.newExpense.value || $scope.newExpense.value <= 0) {
      return {
        isValid: false,
        message: 'Valor é obrigatório. Apenas números positivos.'
      }
    }

    if (!$scope.newExpense.referredToDate) {
      return {
        isValid: false,
        message: 'Data Referente é obrigatória.'
      }
    }

  	return {
  		isValid: true
  	};
  }



}]);