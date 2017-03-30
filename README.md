# iAgenda


## Messing around with Sailsjs

### Application Requirements by Module:

- **Login (Authentication/Authorization)**
    - Properties:

      | Field name    | Required | Type    | Attributes                   |
      | ------------- | -------- | ------- | ---------------------------- |
      | email         | true     | string  | maxLength: 80                |
      | password      | true     | string  | minLength: 6, maxLength: 100 |

    - Business Details:
        - All Pages require authentication
        - There will be two roles in the system: Admin, and User
        - Users are able to do everything Admins do, except for the following: Access "Reports" menu, and delete customers, services, and expenses(Note: they are allowed to delete appointments).
      
- **Appointments**
    - Properties:
    
      | Field name | required | type | attributes |
      | ------ | ------ | ------- | ------- |
      | scheduledFor | true | dateTime |  |
      | price | true | decimal | min: 1 |
      | service | true | entity |  |
      | customer | true | entity |  |
    
    - BusinessDetails:  
        Screen: (See mokcups in the mockups folder)
      - The user will see a list of possible times to schedule an appointment (it will look like a Calendar Day View). There will be a row for every half an hour starting at 08:00 going up to 22:00.
      - If the user clicks on a row, it will navigate to the screen in charge of adding appointments
      - on that screen the user will have the time selected, and the end time will be automatically calculate by the service's numberOfSessions property. (Seee below in the Service section). The user will then select only a service, and a customer. The dateAndTime that came from the hour list must show up in the URL.
      - If the user clicks an event, it will bring up the delete alert dialog
      - At the top of the list of times there will be the date for the current selection. If the user clicks on the date, it will bring up a date picker where he will be able to jump between dates and fetch appointments in different days(Note: The listing shows only appointments for the day selected).
      - On top of it there will be the days of the week (From Sunday to Saturday). Clicking on the weekday fetches entries for that day. (Make sure to highlight the weekday for the day selected)
      - The URL must show which day the user is viewing so he can bookmark it.
  
- **Customers**
    - Properties:
  
      | Field name | required | type | attributes |
      | ------ | ------ | ------- | ------- |
      | name | true | string | minLength: 2, maxLength: 100 |
      | phone1 | true | string | maxLength: 18 |
      | phone2 | false | string | maxLength: 18 |
      | comment | false | string | maxLength: 255 |
      
  - BusinessDetails:
      - Just a CRUD
      - Customer registers must never get deleted... As opposed, They should get flagged as deleted
      - The landing page for this module will be a place where there will be a search field which will list by latest 15 entries. The search term, in the text field, will be used for scanning the columns name, phone1, and phone2



- **Services**
  - Properties:
  
    | Field name | required | type | attributes |
    | ------ | ------ | ------- | ------- |
    | name | true | string | minLength: 2, maxLength: 50 |
    | price | true | numeric | min: 1 |
    | numberOfSessions | true | int | min: 1, max: 20 |

  - BusinessDetails:
    - Just a CRUD
    - Services registers must never get deleted... As opposed, They should get flagged as deleted
    - NumberOfSessions are period of half an hour. A service can extend to 2 and a half hours for example, then it would have 5 sessions
    - The landing page for this module will be a place where there will be a search field which will list by latest 15 entries. The search term, in the text field, will be used for scanning the column name
    
    
- **Expenses**

  - Properties:
  
    | Field name | required | type | attributes |
    | ------ | ------ | ------- | ------- |
    | name | true | string | maxLength: 80 |
    | value | true | numeric | min: 1 |
    | referredTo | true | date |  |
      
  - BusinessDetails:
    - Just a CRUD
    - The landing page for this module will be a place where there will be a search field for the name, and another for the date it was added. It will then list the latest 15 results.
  
- **Reports**



