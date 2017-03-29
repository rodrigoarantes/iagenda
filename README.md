# iAgenda

Messing around with Sailsjs

Application Requirements by Module:
- Login
  .Properties:
    required:
      email, password
      
- Appointments
  .Properties:
    required: 
      scheduledFor(type: dateTime), price(min: 1), service(type: relationship), customer(type: relationship)
    optional:
    
   .BusinessDetails:
    1: Screen
      - The user will se a list of possible times to schedule an appointment (it will look like a Calendar Day View). There will be a row for every half an hour starting at 08:00 going up to 22:00.
      - If the user clicks on a row, it will navigate to the screen in charge of adding appointments
      - on that screen the user will have the starting time, and the end time will be automatically calculate by the service's numberOfSessions property. (Seee below in the Service section). The user will then select only a service, and a customer. The dateAndTime that came from the hour list must show up in the URL.
      - If the user clicks an event, it will bring up the delete alert dialog
      - At the top of the list of times there will be the date for the current selection. If the user clicks on the date, it will bring up a date picker where he will be able to jump between dates and fetch appointments in different days(Note: The listing shows only appointment for the day selected).
      - On top of it there will be the days of the week (From Sunday to Saturday). Clicking on the weekday fetches entries for that day.
      - The URL must show which day the user is viewing so he can bookmark it.
  
- Customers
  .Properties:
    required:
      name(minLength: 2, maxLength: 100), phone1 (maxLength: 18)
    optional:
      comment(maxLength: 255), phone1 (maxLength: 18)
      
  .BusinessDetails:
      - Just a CRUD
      - Customer registers must never get deleted... As opposed, They should get flagged as deleted



- Services
  .Properties:
    required:
      name(minLength: 2, maxLength: 50), price (min: 1), numberOfSessions(min: 1, max: 20)
    optional:
      comment(maxLength: 255), phone1 (maxLength: 18)

  .BusinessDetails:
    - Just a CRUD
    - Services registers must never get deleted... As opposed, They should get flagged as deleted
    - NumberOfSessions are period of half an hour. A service can extend to 2 and a half hours for example, then it would have 5 sessions
    
    
- Expenses
  .Properties:
    required:
      name(maxLength: 80), value (minValue: 1), referredTo(type: Date)
      
  .BusinessDetails:
    Just a CRUD
  
