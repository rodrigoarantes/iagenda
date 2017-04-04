angular.module('brushfire').controller('listCustomerPageController', ['$scope', '$http', '$mdDialog', 'toastr', function($scope, $http, $mdDialog, toastr) {


  $scope.me = window.SAILS_LOCALS.me;
  loadResults();


  $scope.loadResults = loadResults;
  $scope.deleteEntry = deleteEntry;


  $scope.deleteCustomer = function(ev, customer, index) {

    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Você tem certeza que quer deletar?')
          .ariaLabel('Deleting Customer ' + customer.name)
          .targetEvent(ev)
          .ok('Sim')
          .cancel('Não');

    $mdDialog.show(confirm).then(function() {
      deleteEntry(customer.id, index);
    });
  };

 
  // FUNCTION

  function deleteEntry(id, index) {


    $http({
      url: '/customers/'+id,
      method: 'DELETE'
    })
    .then(function onSuccess(sailsResponse) {

      $scope.customers.splice(index, 1);
      toastr.success('Deletado com sucesso.');

    }).catch(function onError(sailsResponse) {

      // Otherwise, this is some weird unexpected server error. 
      // Or maybe your WIFI just went out.
      console.error('sailsResponse: ', sailsResponse);
    });


  }

  function loadResults() {

    $http({
      url: '/customer/find',
      method: 'GET',
      params: {
        searchCriteria: $scope.searchCriteria,
        skip: $scope.skip
      }
    })
    .then(function onSuccess(sailsResponse) {

      $scope.customers = sailsResponse.data.options.customers;

    }).catch(function onError(sailsResponse) {

        // Otherwise, this is some weird unexpected server error. 
        // Or maybe your WIFI just went out.
        console.error('sailsResponse: ', sailsResponse);
      })
    .finally(function eitherWay() {
      $scope.loading = false;
    });
  }
  

}]);