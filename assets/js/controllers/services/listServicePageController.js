angular.module('brushfire').controller('listServicePageController', ['$scope', '$http', '$mdDialog', 'toastr', function($scope, $http, $mdDialog, toastr) {

/*
   ____          _____                _           
  / __ \        |  __ \              | |          
 | |  | |_ __   | |__) |___ _ __   __| | ___ _ __ 
 | |  | | '_ \  |  _  // _ \ '_ \ / _` |/ _ \ '__|
 | |__| | | | | | | \ \  __/ | | | (_| |  __/ |   
  \____/|_| |_| |_|  \_\___|_| |_|\__,_|\___|_|   
                                         
  */
  var TOTAL_PER_PAGE = 20;

  // Grab the locals 
  $scope.me = window.SAILS_LOCALS.me;  
  $scope.loading = false;


  loadResults();
/* 
  _____   ____  __  __   ______               _       
 |  __ \ / __ \|  \/  | |  ____|             | |      
 | |  | | |  | | \  / | | |____   _____ _ __ | |_ ___ 
 | |  | | |  | | |\/| | |  __\ \ / / _ \ '_ \| __/ __|
 | |__| | |__| | |  | | | |___\ V /  __/ | | | |_\__ \
 |_____/ \____/|_|  |_| |______\_/ \___|_| |_|\__|___/

 */

  $scope.loadResults = loadResults;
  $scope.deleteEntry = deleteEntry;


  function deleteEntry(ev, customer, index) {

    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Você tem certeza que quer deletar?')
          .ariaLabel('Deleting Customer ' + customer.name)
          .targetEvent(ev)
          .ok('Sim')
          .cancel('Não');

    $mdDialog.show(confirm).then(function() {
      callDelete(customer.id, index);
    });
  };

  // FUNCTION
  function callDelete(id, index) {

    $http({
      url: '/services/'+id,
      method: 'DELETE'
    })
    .then(function onSuccess(sailsResponse) {
      $scope.services.splice(index, 1);
      toastr.success('Deletado com sucesso.');
    }).catch(function onError(sailsResponse) {
      // Otherwise, this is some weird unexpected server error. 
      // Or maybe your WIFI just went out.
      console.error('sailsResponse: ', sailsResponse);
    });


  }

  function loadResults() {
    $scope.loading = true;
    $scope.skip = 0;

    $http({
      url: '/service/find',
      method: 'GET',
      params: {
        searchCriteria: $scope.searchCriteria,
        skip: $scope.skip
      }
    })
    .then(function onSuccess(sailsResponse) {

      $scope.services = sailsResponse.data.options.services;
      $scope.totalServices = sailsResponse.data.options.totalServices;

      // Prevents showing markup with no results
      if ($scope.services.length > 0) {
        $scope.noResults = false;
        $scope.noMoreservices = false;

      // If on the first pass there are no results show message and hide more results
      } else {
        $scope.noResults = true;
        $scope.noMoreservices = true;
      }

      if ($scope.services.length <= TOTAL_PER_PAGE) {
        $scope.noMoreservices = true;
      }

      $scope.skip = $scope.skip+=TOTAL_PER_PAGE;

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