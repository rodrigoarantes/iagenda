angular.module('brushfire').controller('baseController', ['$scope', '$rootScope', 'PromiseIndicatorService', function($scope, $rootScope, PromiseIndicatorService) {



	console.log('Rodrigo Arantes is here my friend :D');


	$rootScope.loadingIndicator = PromiseIndicatorService;

}]);