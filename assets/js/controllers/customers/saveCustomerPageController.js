angular.module('brushfire').controller('saveCustomerPageController', ['$scope', '$http', '$window', 'toastr', function($scope, $http, $window, toastr) {



  (function init() {
    $scope.me = window.SAILS_LOCALS.me;
    $scope.newCustomer = $window.SAILS_LOCALS.editingCustomer;

    if (!$scope.newCustomer) {
      $scope.newCustomer = {};
    }
  })();

  


 $scope.saveCustomer = saveCustomer;


  // FUNCTIONS
  /////////////

  function saveCustomer() {

  	var valid = validate();

  	if (valid.isValid) {

  		if ($scope.newCustomer.id && $scope.newCustomer.id > 0) {


        $http.put('/customer/' + $scope.newCustomer.id, $scope.newCustomer)
          .then(function onSuccess(sailsResponse) {

            toastr.success('Cliente atualiado com successo.');
            $window.location.href = '/customer/list';

          }).catch(function onError(sailsResponse) {

              // Otherwise, this is some weird unexpected server error. 
              // Or maybe your WIFI just went out.
              console.error('sailsResponse: ', sailsResponse);
          });

      } else {
          
          $http.post('/customer', $scope.newCustomer)
          .then(function onSuccess(sailsResponse) {

            toastr.success('Cliente criado com successo.');
            $window.location.href = '/customer/list';

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


  	if ($scope.newCustomer.name && $scope.newCustomer.name.length > 0) {

      if ($scope.newCustomer.name.length > 100) {
        return {
          isValid: false,
          message: 'O maximo numero de caracteres é de 100.'
        }
      } else if ($scope.newCustomer.name.length <= 2) {
        return {
          isValid: false,
          message: 'Informe pelo menos 3 caracteres para o Nome.'
        }
      }
  		
  	} else {
      return {
        isValid: false,
        message: 'Nome é obrigatório.'
      }
    }

  	if ($scope.newCustomer.phone1 && $scope.newCustomer.phone1.length > 0) {

      if ($scope.newCustomer.phone1.length < 8) {
        return {
          isValid: false,
          message: 'Insira pelo menos 8 digitos para Tel 1.'
        }
      }
      if ($scope.newCustomer.phone1.length > 18) {
        return {
          isValid: false,
          message: 'São permitidos apenas 18 digitos para Tel 1.'
        }
      }
  		
  	} else {
      return {
        isValid: false,
        message: 'Telefone1 é obrigatório.'
      }
    }

    if ($scope.newCustomer.phone2 && $scope.newCustomer.phone2.length > 0) {

      if ($scope.newCustomer.phone2.length < 8) {
        return {
          isValid: false,
          message: 'Insira pelo menos 8 digitos para Tel 2.'
        }
      }
      if ($scope.newCustomer.phone2.length > 18) {
        return {
          isValid: false,
          message: 'São permitidos apenas 18 digitos para Tel 2.'
        }
      }
      
    }

    if ($scope.newCustomer.comment && $scope.newCustomer.comment.length > 100) {
      return {
        isValid: false,
        message: 'O tamanho máximo do comentário é de 100 caracteres.'
      }
    }

  	return {
  		isValid: true
  	};
  }

  



}]);