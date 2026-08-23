## Functional Testing
Functional testing was performed across authentication, property management, viewing scheduling, booking conflicts, cancellations, and booking status workflows.

### Authentication Module

| Test ID | Test Scenario                        | Expected Result                                    | Status |
| ------- | ------------------------------------ | -------------------------------------------------- | ------ |
| AUTH-01 | Register valid OWNER account         | Account created with OWNER role and ACTIVE status  |        |
| AUTH-02 | Register valid RENTER account        | Account created with RENTER role and ACTIVE status |        |
| AUTH-03 | Register duplicate email             | Registration rejected                              |        |
| AUTH-04 | Password and confirm password differ | Registration rejected                              |        |
| AUTH-05 | Login with valid OWNER credentials   | Redirect to Owner Dashboard                        |        |
| AUTH-06 | Login with valid RENTER credentials  | Redirect to Renter Home                            |        |
| AUTH-07 | Login with wrong password            | Login rejected                                     |        |
| AUTH-08 | Login with unknown email             | Login rejected                                     |        |
| AUTH-09 | Login using different users          | Header displays correct logged-in username         |        |
| AUTH-10 | Logout                               | Session cleared and user returned to Login page    |        |



### Property Management Module

| Test ID | Test Scenario                        | Expected Result                              | Status |
| ------- | ------------------------------------ | -------------------------------------------- | ------ |
| PROP-01 | Owner adds valid property            | Property created successfully in MySQL       |        |
| PROP-02 | Add property with image              | Image saved and image path stored            |        |
| PROP-03 | Add property with State and City     | Correct location saved                       |        |
| PROP-04 | Edit property information            | Property data updates correctly              |        |
| PROP-05 | Edit property without new image      | Existing image remains unchanged             |        |
| PROP-06 | Replace property image               | New image replaces existing image path       |        |
| PROP-07 | Open Edit Property page              | Existing property image preview appears      |        |
| PROP-08 | Owner views dashboard                | Only logged-in owner's properties appear     |        |
| PROP-09 | Renter browses properties            | AVAILABLE properties appear                  |        |
| PROP-10 | Renter views property before booking | Exact unit and Google Maps URL remain hidden |        |


### Property Filtering Module

| Test ID   | Test Scenario                           | Expected Result                                | Status |
| --------- | --------------------------------------- | ---------------------------------------------- | ------ |
| FILTER-01 | Filter by Property Type                 | Only matching property types appear            |        |
| FILTER-02 | Filter by State                         | Only properties in selected state appear       |        |
| FILTER-03 | Select a State                          | City dropdown displays cities for that state   |        |
| FILTER-04 | Select All States                       | City resets to All Cities and becomes disabled |        |
| FILTER-05 | Filter by State and City                | Only matching locations appear                 |        |
| FILTER-06 | Filter by State, City and Property Type | Only properties matching all filters appear    |        |
| FILTER-07 | Filter combination has no result        | Empty state is displayed                       |        |


### Viewing Availability Module

| Test ID | Test Scenario                                     | Expected Result                          | Status |
| ------- | ------------------------------------------------- | ---------------------------------------- | ------ |
| VIEW-01 | Owner selects future date                         | Predefined viewing slots can be selected |        |
| VIEW-02 | Save viewing availability                         | Selected slots saved in VIEWING table    |        |
| VIEW-03 | Reload existing viewing date                      | Previously saved slots reload correctly  |        |
| VIEW-04 | Remove an AVAILABLE slot                          | Slot is removed from availability        |        |
| VIEW-05 | Try selecting past date                           | Past date cannot be selected             |        |
| VIEW-06 | Renter selects viewing date                       | Only AVAILABLE slots are shown           |        |
| VIEW-07 | Same owner creates same slot for another property | Conflicting slot rejected                |        |
| VIEW-08 | Different owner creates same slot                 | Slot is allowed                          |        |

### Booking Module

| Test ID | Test Scenario                                        | Expected Result                              | Status |
| ------- | ---------------------------------------------------- | -------------------------------------------- | ------ |
| BOOK-01 | Renter selects an available slot                     | Booking confirmation shows correct details   |        |
| BOOK-02 | Confirm available viewing                            | BOOKING status becomes CONFIRMED             |        |
| BOOK-03 | Confirm booking                                      | Corresponding VIEWING status becomes BOOKED  |        |
| BOOK-04 | Reload availability after booking                    | Booked slot is no longer available           |        |
| BOOK-05 | Open My Bookings                                     | Booking appears for correct renter           |        |
| BOOK-06 | View confirmed booking                               | Unit and Google Maps location become visible |        |
| BOOK-07 | Try booking already-booked slot                      | Booking rejected                             |        |
| BOOK-08 | Same renter books another property at same date/time | Booking rejected                             |        |
| BOOK-09 | Different renter books same date/time elsewhere      | Booking allowed                              |        |

### Booking Cancellation Module

| Test ID   | Test Scenario                            | Expected Result                     | Status |
| --------- | ---------------------------------------- | ----------------------------------- | ------ |
| CANCEL-01 | Cancel more than 24 hours before viewing | Booking becomes CANCELLED           |        |
| CANCEL-02 | Successful cancellation                  | Viewing slot returns to AVAILABLE   |        |
| CANCEL-03 | Cancel less than 24 hours before viewing | Cancellation rejected               |        |
| CANCEL-04 | Try cancelling already cancelled booking | Cancellation rejected / unavailable |        |
| CANCEL-05 | View cancelled booking                   | Cancel button no longer appears     |        |

### Owner Booking Management Module

| Test ID  | Test Scenario                       | Expected Result                              | Status |
| -------- | ----------------------------------- | -------------------------------------------- | ------ |
| OWNER-01 | Owner opens Manage Bookings         | Only bookings for owner's properties appear  |        |
| OWNER-02 | View booking card                   | Property image and renter information appear |        |
| OWNER-03 | Mark CONFIRMED booking as COMPLETED | Status changes to COMPLETED                  |        |
| OWNER-04 | Mark CONFIRMED booking as NO_SHOW   | Status changes to NO_SHOW                    |        |
| OWNER-05 | Try updating non-CONFIRMED booking  | Status update rejected                       |        |

### Upcoming Viewing Reminder Module

| Test ID     | Test Scenario                                | Expected Result                            | Status |
| ----------- | -------------------------------------------- | ------------------------------------------ | ------ |
| UPCOMING-01 | Renter logs in with future confirmed booking | Upcoming viewing popup appears             |        |
| UPCOMING-02 | Renter opens home page                       | Nearest future booking is displayed        |        |
| UPCOMING-03 | Refresh renter home                          | Reminder remains but popup does not repeat |        |
| UPCOMING-04 | Renter has no future booking                 | Empty state shown and no popup             |        |
| UPCOMING-05 | Owner has upcoming booking                   | Next appointment appears with renter name  |        |
| UPCOMING-06 | User has multiple future bookings            | Only nearest upcoming booking is shown     |        |
| UPCOMING-07 | Booking is CANCELLED, COMPLETED or NO_SHOW   | Booking does not appear as upcoming        |        |

### Database & Transaction Module

| Test ID | Test Scenario           | Expected Result                                                  | Status |
| ------- | ----------------------- | ---------------------------------------------------------------- | ------ |
| DATA-01 | Property created        | PROPERTY references valid OWNER                                  |        |
| DATA-02 | Viewing created         | VIEWING references correct PROPERTY                              |        |
| DATA-03 | Booking created         | BOOKING references correct RENTER and VIEWING                    |        |
| DATA-04 | Booking succeeds        | BOOKING created and VIEWING changes to BOOKED together           |        |
| DATA-05 | Booking operation fails | Transaction rolls back without partial updates                   |        |
| DATA-06 | Cancellation succeeds   | BOOKING becomes CANCELLED and VIEWING becomes AVAILABLE together |        |

### Navigation & UI Behaviour Module

| Test ID | Test Scenario                   | Expected Result                                     | Status |
| ------- | ------------------------------- | --------------------------------------------------- | ------ |
| UI-01   | Save viewing availability       | Success message remains visible long enough to read |        |
| UI-02   | Display property images         | Images do not break card layout                     |        |
| UI-03   | Display booking cards           | Image appears left and details appear right         |        |
| UI-04   | Owner completes normal workflow | Navigation returns to appropriate Owner page        |        |
| UI-05   | Renter confirms booking         | Navigation returns to Renter Home                   |        |
| UI-06   | No records available            | Appropriate empty state is displayed                |        |