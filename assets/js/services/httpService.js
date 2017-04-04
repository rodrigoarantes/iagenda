angular.module('brushfire').factory('httpService', ['$http', function($http) {

    

    return {


	    doGet: function (url, params, successCallback, failureCallback) {
        

			$http({
				url: url,
				method: 'GET',
				params: params
			})
			.then(function onSuccess(sailsResponse) {

				if (successCallback) {
					successCallback(sailsResponse);
				}

			}).catch(function onError(sailsResponse) {

				// Otherwise, this is some weird unexpected server error. 
				// Or maybe your WIFI just went out.
				console.error('sailsResponse: ', sailsResponse);

				if (failureCallback) {
					failureCallback(sailsResponse);
				}
			})
			.finally(function eitherWay() {
				

			});

	    }

	 }

}]);