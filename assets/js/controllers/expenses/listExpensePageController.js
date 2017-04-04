angular.module('brushfire').controller('listExpensePageController', ['$scope', '$http', '$mdDialog', 'toastr', function($scope, $http, $mdDialog, toastr) {

  var ctrl = this;

  var TOTAL_PER_PAGE = 20;

  // Grab the locals 
  ctrl.me = window.SAILS_LOCALS.me;  
  ctrl.loading = false;
  ctrl.selectedMonth = moment().get('month') + "";

  loadResults();


  ctrl.loadResults = loadResults;
  ctrl.deleteEntry = deleteEntry;
  ctrl.formatDate = formatDate;

  function formatDate(dateAsString) {
    return moment(dateAsString).format('DD/MM/YYYY');
  }


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
      ctrl.expenses.splice(index, 1);
      toastr.success('Deletado com sucesso.');
    }).catch(function onError(sailsResponse) {
      // Otherwise, this is some weird unexpected server error. 
      // Or maybe your WIFI just went out.
      console.error('sailsResponse: ', sailsResponse);
    });


  }

  function loadResults() {
    ctrl.loading = true;

    var selectedMonth = ctrl.selectedMonth;
    var startDate = moment();
    startDate.set('month', selectedMonth);
    startDate.set('date', 1);

    var endDate = moment();
    endDate.set('month', selectedMonth);
    endDate.endOf('month');

    $http({
      url: '/expense/find',
      method: 'GET',
      params: {
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD')
      }
    })
    .then(function onSuccess(sailsResponse) {

      ctrl.expenses = sailsResponse.data.options.expenses;
      ctrl.totalExpenses = sailsResponse.data.options.totalExpenses;

      // Prevents showing markup with no results
      if (ctrl.expenses.length > 0) {
        ctrl.noResults = false;
        ctrl.noMoreExpenses = false;

      // If on the first pass there are no results show message and hide more results
      } else {
        ctrl.noResults = true;
        ctrl.noMoreExpenses = true;
      }

      if (ctrl.expenses.length <= TOTAL_PER_PAGE) {
        ctrl.noMoreExpenses = true;
      }


    }).catch(function onError(sailsResponse) {

      // Otherwise, this is some weird unexpected server error. 
      // Or maybe your WIFI just went out.
      console.error('sailsResponse: ', sailsResponse);
    })
  .finally(function eitherWay() {
    ctrl.loading = false;
  });
}





}]);