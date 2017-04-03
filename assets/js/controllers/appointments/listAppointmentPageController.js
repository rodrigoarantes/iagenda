angular.module('brushfire').controller('listAppointmentPageController', ['$scope', '$http', '$mdDialog', '$mdBottomSheet', '$mdDialog', 'toastr', function($scope, $http, $mdDialog, $mdBottomSheet, $mdDialog, toastr) {



  var ctrl = this;
  ctrl.dateParam = window.SAILS_LOCALS.dateParam;

  this.myDate = new Date();
  this.isOpen = false;

  var STARTING_TIME = 8;
  var ENDING_TIME = 22;
  var INCREMENTAL_MINUTES = 15;
  var AN_HOUR_IN_MIN = 60;

  var datePicker = $('#datePicker');

  // Grab the locals 
  this.me = window.SAILS_LOCALS.me;
  this.selectedDate = null;


  (function init() {
    var momentDateParam = moment(ctrl.dateParam, 'YYYY-MM-DD');
    if (momentDateParam && momentDateParam.isValid()) {
      prepareHeader(momentDateParam);
    } else {
      toastr.error("A data informada é inválida.");
    }    
  })();


  this.getResults = getResults;
  this.onClickAppointmentRow = onClickAppointmentRow
  this.onClickDay = onClickDay;
  this.onChangeDate = onChangeDate;
  this.showAppointmentInfo = showAppointmentInfo;
  this.closeDialog = closeDialog;

  function closeDialog() {
    $mdDialog.hide();
  }

  function showListBottomSheet($event, appointmentRow, index) {

    ctrl.selectedAppointmentRow = appointmentRow;
    ctrl.selectedAppointmentIndex = index;

    $mdBottomSheet.show({
      templateUrl: 'bottom-sheet-list-template.html',
      controller: 'listAppointmentBottomSheetController',
      controllerAs: 'actionSheet'
    }).then(function(clickedItem) {
      if (clickedItem == 'delete') {
        deleteAppointment($event, appointmentRow, index);
      } else {
        showAppointmentInfo($event, appointmentRow, index);
      }
    });
  }


  function showAppointmentInfo($event, appointmentRow, index) {
    $mdDialog.show({
      contentElement: '#myStaticDialog',
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      escapeToClose: true
    });
  }


  function onClickAppointmentRow($event, appointmentRow, index) {
    if (appointmentRow.appointment && appointmentRow.appointment.id) {
      showListBottomSheet($event, appointmentRow, index);
    } else {
      // create new
      var selectedMoment = moment(ctrl.selectedDay.formattedDateParam + " " + appointmentRow.hourAsString, "YYYY-MM-DD HH:mm")
      window.location = "/appointments/new?scheduledDateTime=" + selectedMoment.format('YYYY-MM-DD HH:mm');
    }
  }

  function onChangeDate(event) {

    if (ctrl.selectedDate) {
      var momentSelectedDate = moment(ctrl.selectedDate, "D MMMM, YYYY");
      window.location = "/appointments?date=" + momentSelectedDate.format('YYYY-MM-DD');
    }
  }


  function onClickDay(date) {
    window.location = "/appointments?date=" + date.formattedDateParam;
  }


  function prepareResults() {

    var appointmentList = [];
    var currentHour = STARTING_TIME;
    var appointmentIndex = 0;
    var evenColor = true;

    while (currentHour <= ENDING_TIME) {

        var hours = parseInt(currentHour);
        var minutes = (currentHour % hours) * AN_HOUR_IN_MIN;

        var appointment = getAppointmentScheduledFor(hours, minutes);
        var rowClass = null;
        if (appointment != null) {
          if (evenColor) {
            rowClass = "collection-item-even";
          } else {
            rowClass = "collection-item-odd";
          }
          evenColor = !evenColor;
        }

        var numberOfSessions = 1;
        var endTimeAsString = null;
        var startTimeAsString = null;
        if (appointment) {
          numberOfSessions = appointment.service.numberOfSessions;
          startTimeAsString = moment.utc(appointment.scheduledFor).format('HH:mm');
          endTimeAsString = moment.utc(appointment.scheduledFor).add(numberOfSessions * INCREMENTAL_MINUTES, 'minute').format('HH:mm');
        }

        var parcialAppointmentIndex = appointmentIndex;
        for (var i = 0; i < numberOfSessions; i++) {

          var minutesResult = minutes + (INCREMENTAL_MINUTES * i);
          var sessionHour = (hours + parseInt(minutesResult / AN_HOUR_IN_MIN));
          var sessionMinutes = (minutesResult % AN_HOUR_IN_MIN == 0 ? '00' : minutesResult % AN_HOUR_IN_MIN);


          var object = {
            hourAsString: sessionHour + ':' + sessionMinutes,
            startTimeAsString: startTimeAsString,
            endTimeAsString: endTimeAsString,
            hour: sessionHour,
            minutes: sessionMinutes,
            appointment: appointment,
            rowColorClass: rowClass,
            description: appointment ? ( appointment.service.name + ' - ' + appointment.customer.name ) : null
          };

          var existingAppointment = appointmentList[parcialAppointmentIndex];
          if (existingAppointment) {
            if (appointment) {
              appointmentList[parcialAppointmentIndex] = object;
            }
          } else {
            appointmentList.push(object);
          }
          ++parcialAppointmentIndex;
        }

        
        currentHour += (INCREMENTAL_MINUTES / AN_HOUR_IN_MIN);
        ++appointmentIndex;
    }
    ctrl.appointmentList = appointmentList;
  }

  function getAppointmentScheduledFor(appointmentHour, appMinutes){
    if (ctrl.appointments) {

      for (var i = 0; i < ctrl.appointments.length; i++) {
        var app = ctrl.appointments[i];

        var momentObject = moment.utc(app.scheduledFor);
        var hour = momentObject.get('hour');
        var minutes = momentObject.get('minute');

        if (appointmentHour == hour && appMinutes == minutes) {
          return app;
        }
      }

    }
    return null;
  }

  function deleteAppointment(ev, appointmentRow, index) {

    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Você tem certeza que quer deletar?')
          .ariaLabel('Deleting Appointment ')
          .targetEvent(ev)
          .ok('Sim')
          .cancel('Não');

    $mdDialog.show(confirm).then(function() {
      deleteEntry(appointmentRow.appointment.id);
    }, function() {});
  }

  // PRIVATE
  /////////////////

  function prepareHeader(momentDateParam) {

    var today = moment();
    if (!momentDateParam) {
      momentDateParam = today;
    }
    var originalParam = angular.copy(momentDateParam);
    var paramWeekDay = momentDateParam.weekday();

    var weekdays = [];
    for (var i = 0; i < 7; i++) {

      var momentDay = momentDateParam.weekday(i);
      var isToday = (today.isSame(momentDay, 'day') && today.isSame(momentDay, 'month') && today.isSame(momentDay, 'year'));
      weekdays.push({
        formattedDate: momentDay.format('DD/MM/YYYY'),
        formattedDateParam: momentDay.format('YYYY-MM-DD'),
        weekDay: i,
        weekDayName: getWeekdayName(i),
        isToday: isToday 
      });

      if (paramWeekDay == i) {
        ctrl.selectedDay = weekdays[i];
      }
      
    }
    ctrl.weekdays = weekdays;

    getResults(originalParam);
  }

  function getWeekdayName(weekday) {

    if (weekday == 0) {
      return 'D'
    } else if (weekday == 1) {
      return 'S'
    } else if (weekday == 2) {
      return 'T'
    } else if (weekday == 3) {
      return 'Q'
    } else if (weekday == 4) {
      return 'Q'
    } else if (weekday == 5) {
      return 'S'
    } else if (weekday == 6) {
      return 'S'
    } else {
      alert('Error');
    }
  }
 
  // FUNCTION

  function deleteEntry(id) {


    $http({
      url: '/appointment/'+id,
      method: 'DELETE'
    })
    .then(function onSuccess(sailsResponse) {


      var indexes = getIndexesForAppointmentId(id);
      indexes.forEach(function (elIndex) {
        ctrl.appointmentList[elIndex].appointment = null;
        ctrl.appointmentList[elIndex].description = null;
        ctrl.appointmentList[elIndex].rowColorClass = null;
      });
      toastr.success('Deletado com sucesso.');

    }).catch(function onError(sailsResponse) {

      // Otherwise, this is some weird unexpected server error. 
      // Or maybe your WIFI just went out.
      console.error('sailsResponse: ', sailsResponse);
    });


  }

  function getResults(momentDate) {

    
    ctrl.skip = 0;

    $http({
      url: '/appointment/find',
      method: 'GET',
      params: {
        date: momentDate.format('YYYY-MM-DD')
      }
    })
    .then(function onSuccess(sailsResponse) {

      ctrl.appointments = sailsResponse.data.options.appointments;
      prepareResults();

  }).catch(function onError(sailsResponse) {

      // Otherwise, this is some weird unexpected server error. 
      // Or maybe your WIFI just went out.
      console.error('sailsResponse: ', sailsResponse);
    })
  .finally(function eitherWay() {
    ctrl.loading = false;
  });
}

//////////////////
// HELPERS
//////////////////

  function getIndexesForAppointmentId(appointmentId) {

    var indexes = [];
    ctrl.appointmentList.forEach(function (item, index) {
      if (item.appointment && item.appointment.id == appointmentId) {
        indexes.push(index);
      }
    });
    return indexes;

  }
}]);



angular.module('brushfire').controller('listAppointmentBottomSheetController', ['$http', '$mdBottomSheet', function($scope, $mdBottomSheet) {


  var actionSheet = this;
  actionSheet.showInfo = showInfo;
  actionSheet.deleteAction = deleteAction;

  function showInfo() {
    $mdBottomSheet.hide('info');
  }

  function deleteAction() {
    $mdBottomSheet.hide('delete');
  }


}]);