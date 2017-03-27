angular.module('brushfire').controller('listExpensePageController', ['$scope', '$http', '$mdDialog', 'toastr', function($scope, $http, $mdDialog, toastr) {

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


  function deleteEntry(ev, expense, index) {

    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Você tem certeza que quer deletar?')
          .ariaLabel('Deleting Expense ' + expense.name)
          .targetEvent(ev)
          .ok('Sim')
          .cancel('Não');

    $mdDialog.show(confirm).then(function() {
      callDelete(expense.id, index);
    });
  };

  // FUNCTION
  function callDelete(id, index) {

    $http({
      url: '/expense/'+id,
      method: 'DELETE'
    })
    .then(function onSuccess(sailsResponse) {
      $scope.expenses.splice(index, 1);
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
      url: '/expense/find',
      method: 'GET',
      params: {
        searchCriteria: $scope.searchCriteria,
        skip: $scope.skip
      }
    })
    .then(function onSuccess(sailsResponse) {

      $scope.expenses = sailsResponse.data.options.expenses;
      $scope.totalExpenses = sailsResponse.data.options.totalExpenses;

      // Prevents showing markup with no results
      if ($scope.expenses.length > 0) {
        $scope.noResults = false;
        $scope.noMoreExpenses = false;

      // If on the first pass there are no results show message and hide more results
      } else {
        $scope.noResults = true;
        $scope.noMoreExpenses = true;
      }

      if ($scope.expenses.length <= TOTAL_PER_PAGE) {
        $scope.noMoreExpenses = true;
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