angular.module('brushfire').controller('reportsPageController', ['$scope', '$http', '$mdDialog', 'toastr', function($scope, $http, $mdDialog, toastr) {

  var ctrl = this;

  // Grab the locals 
  ctrl.me = window.SAILS_LOCALS.me;  
  ctrl.loading = false;
  ctrl.selectedMonth = moment().get('month') + "";

  loadResults();

  ctrl.loadResults = loadResults;
  ctrl.formatDate = formatDate;

  function formatDate(dateAsString) {
    return moment(dateAsString).format('DD/MM/YYYY');
  }


  function loadResults() {


    ctrl.resultsPromise = $http({
      url: '/expense/yearlyReport',
      method: 'GET',
      params: {
        year: 2017,
        startMonth: 1,
        endMonth: 3
      }
    })
    .then(function onSuccess(sailsResponse) {

      var results = sailsResponse.data;
      var months = [];
      for (var monthIndex in results) {
        months.push(moment().set('month', monthIndex - 1).format('MMMM'));
      }
      ctrl.months = months;
      ctrl.results = results;

      console.log(ctrl.months);


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