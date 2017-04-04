var app = angular.module('brushfire', ['ngMaterial', 'toastr', 'cgBusy']);
app.config(['$mdDateLocaleProvider', function($mdDateLocaleProvider) {

    // Example of a French localization.
    $mdDateLocaleProvider.months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    $mdDateLocaleProvider.shortMonths = ['jan', 'fev', 'mar', 'abr', 'maio', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    $mdDateLocaleProvider.days = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    $mdDateLocaleProvider.shortDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

    // Can change week display to start on Monday.
    $mdDateLocaleProvider.firstDayOfWeek = 0;

    // // Optional.
    // $mdDateLocaleProvider.dates = [1, 2, 3, 4, 5, 6, ...];

    // // Example uses moment.js to parse and format dates.
    $mdDateLocaleProvider.parseDate = function(dateString) {
      var m = moment(dateString, 'DD/MM/YYYY', true);
      return m.isValid() ? m.toDate() : new Date(NaN);
    };

    $mdDateLocaleProvider.formatDate = function(date) {
      var m = moment(date);
      return m.isValid() ? m.format('DD/MM/YYYY') : '';
    };


}]);

app.config(['$provide', function($provide) {
    $provide.decorator("$exceptionHandler", ['$delegate', '$injector', function($delegate, $injector) {

        function logGlobalError(message, stack) {
            alert('Algo deu errado. Já contatamos o administrador.');
            var $http = $injector.get("$http");
            var params = {
                message: message,
                stack: stack
            };
            $http.post('/logger', params).then(function onSuccess(sailsResponse) {
            });
        }


        return function(exception, cause) {
            $delegate(exception, cause);
            
            if (exception != null) {
                if (typeof exception == 'string' && exception.indexOf("Possibly unhandled rejection") == -1) {
                    logGlobalError(exception);

                } else if (exception && exception.stack) {
                    var message = exception.message || 'No message found.';
                    var stack = exception.stack;
                    logGlobalError(message, stack);
                }                
            }
        };

    }]);
}]);



app.factory('PromiseIndicatorService', function () {

    var self =  {
        mainIndicatorPromise: null,
        loadingMessage: 'Carregando...',
        shouldShowIndicator: true,
        // function
        setPromise: setPromise
    };
    return self;

    // FUNCTIONS
    /////////////////
    function setPromise(promise) {
        if (self.shouldShowIndicator) {
            self.mainIndicatorPromise = promise;
        }
    }
});

app.config(['$httpProvider', function($httpProvider) {
    // Build our interceptor here
    var _deferred = null;

    var interceptor =  ['$q', '$rootScope', '$location', '$injector', 'PromiseIndicatorService', function($q, $rootScope, $location, $injector, PromiseIndicatorService) {

        return {
            request: function (config) {

                // does not for typeaheads
                if (config.typeahead != null && config.typeahead) {
                    return config;
                }
                // create promise only for json calls
                if (PromiseIndicatorService.shouldShowIndicator && config.headers.Accept.indexOf("application/json") != -1) {
                    if (_deferred) {
                        _deferred.resolve();
                    }
                    _deferred = $q.defer();
                    PromiseIndicatorService.setPromise(_deferred.promise);
                }
                return config;


            },
            'requestError': function(rejection) {
                // do something on error
                if (_deferred) {
                    _deferred.resolve();
                }
                return $q.reject(rejection);
            },
            'response': function(resp) {

                if (_deferred && resp.config.headers.Accept.indexOf("application/json") != -1) {
                    _deferred.resolve();
                }
                // if (resp.data != null && resp.data.status != null && resp.data.status === false) {
                //     var message  = resp.data.message != null ? resp.data.message : 'An error occurred. Please try again later.';
                //     $injector.get('toastr').error(message);
                // }
                return resp;


            },
            'responseError': function(rejection) { // Handle errors

                if (_deferred) {
                    _deferred.resolve();
                }
                switch(rejection.status) {
                    case 401:
                        if (rejection.config.url!=='/login') {
                            // If we're not on the login page
                            //$rootScope.$broadcast('auth:loginRequired');
                            //$state.go('login');

                            console.log('Invalid login. Error 401');
                        }
                        break;
                    case 403:
                        $injector.get('toastr').error('Acesso Negado. Contate o administrador do sistema.');
                        $rootScope.$broadcast('auth:forbidden');
                        $location.path('/login');
                        break;
                    case 404: $rootScope.$broadcast('page:notFound'); break;
                    case 500:
                        $injector.get('toastr').error('Um erro aconteceu. Contate o administrador do sistema.');
                        $rootScope.$broadcast('server:error');
                        break;
                }
                return $q.reject(rejection);
            }
        };

    }];

    $httpProvider.interceptors.push(interceptor);
}]);





    


