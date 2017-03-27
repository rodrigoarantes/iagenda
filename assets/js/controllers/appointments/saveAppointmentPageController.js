angular.module('brushfire').controller('saveAppointmentPageController', ['$scope', '$http', '$window', '$mdDialog', 'toastr', function($scope, $http, $window, $mdDialog, toastr) {


  var ctrl = this;
  ctrl.newAppointment = {};

  (function init() {
    ctrl.me = window.SAILS_LOCALS.me;
    var scheduledDateTime = $window.SAILS_LOCALS.scheduledDateTime; 
    if (!scheduledDateTime) {
      alert('ERROR! No dateTime value informed.');
      return;
    }

    ctrl.momentScheduledDateTime = moment(scheduledDateTime, "YYYY-MM-DD HH:mm");
    if (!ctrl.momentScheduledDateTime.isValid()) {
      alert('ERROR! Invalid dateTime.');
      return;
    }
    
    var hour = ctrl.momentScheduledDateTime.get('hour');
    var minutes = ctrl.momentScheduledDateTime.get('minute');

    // start time
    ctrl.scheduledStartTime = ctrl.momentScheduledDateTime.format('HH:mm');

    ctrl.customerList = $window.SAILS_LOCALS.customerList;
    if (ctrl.customerList && ctrl.customerList.length > 0) {
      ctrl.newAppointment.customer = ctrl.customerList[0];
    }
    
    ctrl.serviceList = $window.SAILS_LOCALS.serviceList;
    if (ctrl.serviceList && ctrl.serviceList.length > 0) {
      ctrl.newAppointment.service = ctrl.serviceList[0];
      onChangeService();
    }
    
  })();

  


/* 
  _____   ____  __  __   ______               _       
 |  __ \ / __ \|  \/  | |  ____|             | |      
 | |  | | |  | | \  / | | |____   _____ _ __ | |_ ___ 
 | |  | | |  | | |\/| | |  __\ \ / / _ \ '_ \| __/ __|
 | |__| | |__| | |  | | | |___\ V /  __/ | | | |_\__ \
 |_____/ \____/|_|  |_| |______\_/ \___|_| |_|\__|___/

 */

 ctrl.saveObject = saveObject;
 ctrl.onChangeService = onChangeService;
 ctrl.onClickGoBack = onClickGoBack;


  // FUNCTIONS
  /////////////
  function onClickGoBack() {
    $window.location.href = '/appointments?date=' + ctrl.momentScheduledDateTime.format("YYYY-MM-DD");
  }
  
  function saveObject() {

  	var valid = validate();

  	if (valid.isValid) {

      ctrl.newAppointment.scheduledFor = ctrl.momentScheduledDateTime.format('YYYY-MM-DD HH:mm');
      ctrl.newAppointment.price = ctrl.newAppointment.service.price;

      // verify if there is overlapping time
      $http({
        url: '/appointment/hasOverlappingTime',
        method: 'GET',
        params: {
          startDateTime: ctrl.newAppointment.scheduledFor,
          endDateTime: ctrl.momentScheduledEndDateTime.format('YYYY-MM-DD HH:mm'),
        }
      }).then(function onSuccess(sailsResponse) {

        var hasOverlappingTime = sailsResponse.data.options.hasOverlappingTime;
        if (hasOverlappingTime && hasOverlappingTime > 0) {

          var confirm = $mdDialog.confirm()
          .title('Já existe outro agendamento que inicia dentro desse intervalo de horário marcado ('+ ctrl.scheduledStartTime +' - ' + ctrl.scheduledEndTime +'). Continuar(Isso não removerá o outro horário)?')
          .ariaLabel('Appointment conflict')
          .ok('Sim')
          .cancel('Não');

          $mdDialog.show(confirm).then(function() {
            callSaveApi();
          }, function() {});

        } else {
          callSaveApi();
        }

      });

  	} else {

  		toastr.error(valid.message);

  	}
  }

  function callSaveApi() {
    $http.post('/appointments', ctrl.newAppointment)
      .then(function onSuccess(sailsResponse) {

        toastr.success('Horário criado com successo.');
        $window.location.href = '/appointments?date=' + ctrl.momentScheduledDateTime.format("YYYY-MM-DD");

      }).catch(function onError(sailsResponse) {

          // Otherwise, this is some weird unexpected server error. 
          // Or maybe your WIFI just went out.
          console.error('sailsResponse: ', sailsResponse);
          if (sailsResponse && sailsResponse.data) {
            toastr.error(sailsResponse.data);
          }
          
      });
  }

  function onChangeService() {
    ctrl.momentScheduledEndDateTime = angular.copy(ctrl.momentScheduledDateTime).add('minute', ctrl.newAppointment.service.numberOfSessions * 30);
    ctrl.scheduledEndTime = ctrl.momentScheduledEndDateTime.format('HH:mm');
  }

  function validate() {

  	if (!ctrl.newAppointment.service) {
  		return {
  			isValid: false,
  			message: 'Por favor selecione um serviço.'
  		}
  	}
  	if (!ctrl.newAppointment.customer) {
        return {
          isValid: false,
          message: 'Por favor selecione um cliente.'
        }
    }
  	return {
  		isValid: true
  	};
  }


}]);