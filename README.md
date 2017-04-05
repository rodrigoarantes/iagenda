# iAgenda

### Pre-requisites:
- It needs to be mobile-first. (It will be tested on iphone6)
- Pay attention to production distribution because it will be evaluated.
- There are no specific requirements for the technology used on the front-end.
- It's required that you use either Java or .Net for the backend.
- APIs must be RESTful.
- The application will have a small number of users.
- Emphasis will be placed on maintainability and fast prototyping.

### Application Requirements by Module:

NOTE: The "Attributes" section below, shows only entries relevant to the customer that they would report as related directly to their business. Imagine these as fields the customer would tell you during a conversation for gathering requisites. 
Please note that there will be more fields that will be needed in order to comply with all requirements described in the following pages. This part varies from developer to developer and will be evaluated.

- **Login (Authentication/Authorization)**
    - Attributes:
        name(required), email(required), password(required)
    - Business Details:
        - All Pages require authentication.
        - There will be two roles in the system: Admin, and User
        - Users are able to do everything Admins do, except for the following: To access "Reports" menu, and delete customers, services, and expenses(Note: they are allowed to delete appointments).
      
- **Appointments**
    - Attributes:
    Service(required), Customer(required), Scheduled Date and Time(required)
    
    - BusinessDetails:  
        Screen: (See mockups in the mockups folder)
      - The user will see a list of possible times to schedule an appointment (it will look like a Calendar Day View). There will be a row for every fifteen minutes starting at 08:00 going up to 22:00 (e.g.: 08:00, 08:15, 08:30, and so on).
      - If the user clicks on a row, it will navigate to the screen in charge of adding appointments
      - If the user clicks an appointment, it will bring up a delete alert dialog.
      - on that screen the user will see the time selected and the end time will be automatically calculated by the service's number Of sessions property. (Seee below in the 'Service' section). The user will then only need to select a service, and a customer in order to create an appointment entry. The date And time used to create an appointment must show up in the URL.
      - At the top of the list of times there will be the date for the current selection. If the user clicks on the date, it will bring up a date picker where users will be able to jump between dates and fetch appointments in different days(Note: The listing shows only appointments for the day selected).
      - On top of it there will be the days of the week (From Sunday to Saturday). Clicking on the weekday fetches entries for that day. Make sure to highlight the weekday for the day selected.
      - The URL must show which day the user is viewing so he can bookmark it.
  
- **Customers**
    - Attributes:
    name(required), phone1(required), phone2, comment
      
  - BusinessDetails:
      - Just a CRUD
      - Customer records must never get deleted, as opposed, They should get flagged as deleted
      - The landing page for this module must have a search field. The search term will be used for scanning the database columns name, phone1, phone2, and comment. The maximum amount of returned entries must be 20.



- **Services**
  - Attributes:
    name(required), price(required), numberOfSessions(required)

  - BusinessDetails:
    - Just a CRUD
    - Services records must never get deleted... As opposed, They should get flagged as deleted
    - NumberOfSessions are period of fifteen minutes(Make sure you make it flexible so you, the developer, can change it when requested by the customer - Ex.: the customer decides that 1 session is equivalent to half an hour). 
    - NumberOfSessions field only allows positive values. If the user enter 2 it needs to show on the screen somewhere that it is equivalent to 30 minutes.
    - The landing page for this module must have a search field. The search term will be used for scanning the columns name. The maximum amount of returned entries must be 20.
    - Price cannot be historically bound to the service. If the customer changes the service price today it cannot modify the service's price for old appointments since it will be used in the reports. You decide the better strategy for this required.
    
    
- **Expenses**

  - Attributes:

    | Field name | required | type | attributes |
    | ------ | ------ | ------- | ------- |
    | name | true | string | maxLength: 80 |
    | value | true | numeric | min: 1 |
    | referredToDate | true | date |  |
      
  - BusinessDetails:
    - Just a CRUD
    - The landing page for this module will list all expenses for a month selected. There will be a select dropdown with the month list. It pull the entries based on the month selected. 
  
- **Reports**

    - Business Details:
        - The user will have on screen a year, starting and ending month dropdowns.
        - The result for the parameters above must be a table which will show the month values in the columns and the detail on the rows. In each row you need to show 'Gross Profit', 'Expenses', and 'Net Profit'
        - IMPORTANT: The table output must present itself properly on both iphone and desktop windows.
        



