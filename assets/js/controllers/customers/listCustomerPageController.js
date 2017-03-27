angular.module('brushfire').controller('listCustomerPageController', ['$scope', '$http', '$mdDialog', 'toastr', function($scope, $http, $mdDialog, toastr) {

/*
   ____          _____                _           
  / __ \        |  __ \              | |          
 | |  | |_ __   | |__) |___ _ __   __| | ___ _ __ 
 | |  | | '_ \  |  _  // _ \ '_ \ / _` |/ _ \ '__|
 | |__| | | | | | | \ \  __/ | | | (_| |  __/ |   
  \____/|_| |_| |_|  \_\___|_| |_|\__,_|\___|_|   
                                                  
                                                  
  */

  var TOTAL_PER_PAGE = 20;
  console.log('hahahaha');

  // Grab the locals 
  $scope.me = window.SAILS_LOCALS.me;
  
  $scope.loading = false;
  $scope.noResults = false;
  $scope.noMoreTutorials = false;



  getCustomers();
/* 
  _____   ____  __  __   ______               _       
 |  __ \ / __ \|  \/  | |  ____|             | |      
 | |  | | |  | | \  / | | |____   _____ _ __ | |_ ___ 
 | |  | | |  | | |\/| | |  __\ \ / / _ \ '_ \| __/ __|
 | |__| | |__| | |  | | | |___\ V /  __/ | | | |_\__ \
 |_____/ \____/|_|  |_| |______\_/ \___|_| |_|\__|___/

 */

  $scope.getCustomers = getCustomers;
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

  function getCustomers() {
    $scope.loading = true;
    $scope.skip = 0;

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
      $scope.totalCustomers = sailsResponse.data.options.totalCustomers;

      // Prevents showing markup with no results
      if ($scope.customers.length > 0) {
        $scope.noResults = false;
        $scope.noMoreCustomers = false;

      // If on the first pass there are no results show message and hide more results
    } else {
      $scope.noResults = true;
      $scope.noMoreCustomers = true;
    }

    if ($scope.customers.length <= TOTAL_PER_PAGE) {
      $scope.noMoreCustomers = true;
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




$scope.fetchMoreTutorialsLikeThis = function() {
  $scope.loading = true;

  $http({
    url: '/tutorials/search',
    method: 'GET',
    params: {
      searchCriteria: $scope.searchCriteria,
      skip: $scope.skip
    }
  })
  .then(function onSuccess(sailsResponse) {

      // The returned tutorials
      $scope.tutorials = sailsResponse.data.options.updatedTutorials;

      // The current number of records to skip
      $scope.skip = $scope.skip+=10;

      // Disable the show more tutorials button when there are no more tutorials
      if ($scope.skip >= $scope.totalTutorials) {
        $scope.noMoreTutorials = true;
      }

    })
  .catch(function onError(sailsResponse) {

      // Otherwise, this is some weird unexpected server error. 
      // Or maybe your WIFI just went out.
      console.error('sailsResponse: ', sailsResponse);
    })
  .finally(function eitherWay() {
    $scope.loading = false;
  });
};
}]);