# Rental Scheduling System
Description: A rental viewing scheduling system designed to reduce communication friction between property owners and potential renters.

## Project Status
Current phase: Application Development
Version: v0.2.5
Last updated: 23 August 2026

### Changelog

#### v0.2.5 — 23 August 2026
- Added Malaysian state and city options for property locations.
- Added State and City filters to renter property browsing.
- Added combined State, City, and Property Type filtering.
- Added upcoming viewing reminder to Owner and Renter dashboards.
- Added login popup for the nearest upcoming confirmed viewing.
- Added Owner scheduling conflict prevention across multiple properties.
- Added Renter scheduling conflict prevention across multiple bookings.
- Added draft functional testing checklist. 

#### v0.2.4 — 22 August 2026
- Add property.State
- Add property.City
- Created the PROPERTY, VIEWING, and BOOKINGS database table based on the updated ERD design.
- Connected renter property browsing and viewing availability to MySQL.
- Implemented transactional viewing booking.
- Added renter booking history and confirmed-location details.
- Added 24-hour booking cancellation rule and slot reopening.
- Added owner booking management with completed and no-show statuses.
- Added logged-in user name display.

#### v0.2.3 — 22 August 2026
- Initialized Node.js and Express backend.
- Connected the backend to the XAMPP MySQL database.
- Created the USERS database table based on the existing ERD design.
- Implemented database-backed user registration with password hashing.
- Implemented user login with credential validation.
- Added role-based routing for OWNER and RENTER users.
- Added basic logout functionality using session storage.

#### v0.2.2 — 20 August 2026
- Update Booking Management Rules
- Update Viewing Management RulesA
- Update Owner dashboard interface
- Add Renter dashboard interface
- Add Property listing interface
- Add Booking confirmation interface
- Add functional prototype screenshots demonstrating the current system flow

#### v0.2.1 — 18 August 2026
- Update System Rules
- Add Owner dashboard interface
- Add Property interface

#### v0.2.0 — 17 August 2026
- Update System Rules
- Add Database Design
- Add Login interface & Register interface

#### v0.1.2 — 06 August 2026
- Define MVP Scope
- Update System Rules
- Update Future Improvement
- Define Design Decision

#### v0.1.1 — 05 August 2026
- Define User Roles
- Define System Rules
- Add Project Goals
- Define Future Improvements

#### v0.1.0 — 04 August 2026
- Created project roadmap
- Drafted README structure
- Identify Problem Statement

#### v0.0.1 — 03 August 2026
- Repository initialized
- Initial project planning


## Development Roadmap

Milestone 1:
Project Planning & Requirements

Milestone 2:
Prototype Design

Milestone 3:
Logic Validation

Milestone 4:
Application Development

Milestone 5:
Testing & Refinement

Milestone 6:
Deployment & Presentation

## Project Overview
Rental Scheduling System helps property owners manage rental unit viewing availability while allowing renters to directly select and book suitable viewing time slots.

The system aims to reduce the manual coordination usually required between owners and renters, such as negotiating viewing times, confirming appointments, and sharing viewing details.

## Problem Statement
Arranging rental property viewings often depends on manual communication between property owners and potential renters.

The current process creates several problems:

* Renters may need to wait hours for replies before confirming a viewing.
* Owners need to repeatedly answer similar questions about availability and location.
* Managing multiple interested renters becomes difficult.
* Managing multiple rental units increases scheduling complexity.

This becomes inefficient when every viewing requires individual coordination.

## Project Goals
Create a viewing scheduling system that allows:

### Property Owners
* Create and manage rental property listings.
* Define available viewing schedules.
* Reduce repetitive communication with renters.
* Track viewing appointments and outcomes.

### Renters
* Browse available rental properties.
* View available viewing slots.
* Book suitable viewing times immediately.
* Receive necessary viewing information after confirmation.

## User Roles
The system uses role-based accounts.

## Property Owner
Owners can:
* Create rental property listings.
* Configure recurring viewing availability.
* Manage viewing appointments.
* Update viewing outcomes.

## Renter
Renters can:
* Browse available properties.
* Select available viewing slots.
* Manage their bookings.
* Access viewing details after confirmation.

## MVP Scope
*Objective:*
Allow property owners and renters to complete the rental viewing process digitally.

## Property Owner MVP

The owner can:
### Property Management
* Create property listings.
* Update property information.
* Manage their own properties.

### Viewing Management
* Configure available viewing times.
* Create recurring viewing schedules.
* View upcoming appointments.
* Update viewing outcomes.

## Renter MVP
The renter can:

### Property Discovery
* Browse available properties.
* View property details.

### Viewing Booking
* View available viewing slots.
* Select a viewing slot.
* Confirm a booking.
* View booking details.
* Cancel a booking.

## System Design

## Feature: Authentication & Authorization

### Feature Rules
* Users must authenticate before accessing protected features.
* Each user has a role (Owner or Renter).
* Users can only access functions allowed by their role.

### Design Decision
* Role-based access control (RBAC) is used to separate owner and renter permissions.

### Future Improvement
* Social login.
* Two-factor authentication.
* Passwordless login.

## Platform Decision :Web Application
Although a mobile application may provide a better experience, the first version focuses on a web application.

### Design Decision 
* Faster development cycle
* Easier testing and iteration
* Focus on validating core scheduling logic
* Avoid unnecessary platform complexity during MVP stage

### Future Improvement: Mobile Application
A mobile application is planned as a future enhancement to improve user convenience through:
* Push notifications
* Mobile-first viewing experience
* Easier appointment management
* Integrated navigation features

## Feature: Viewing Management
### Feature Rules
* Each viewing slot belongs to one property.
* A viewing slot has an availability status.
* Owners can only create viewing availability for the current date or future dates.
* Owners cannot create overlapping viewing slots across different properties they own.
* Viewing availability cannot be created for past dates.
* A slot can only have one active booking.
* Once booked, the slot becomes unavailable.
* Cancelled bookings may release the slot based on cancellation rules.

### Design Decision
* Use separate Viewing and Booking concepts.
* Viewing represents *availability*.
* Booking represents *reservation history*.

Reason:
* Prevents mixing availability management with transaction history.

### Future Improvement
* Add calendar synchronization.
* Allow owners to block specific dates.

## Feature: Booking Management
### Feature Rules
* Renters can only book available slots.
* Renters can only select viewing dates from the current date onward.
* RenteS cannot create a new CONFIRMED booking if they already have another confirmed booking whose viewing time overlaps.
* Past viewing dates cannot be selected for new bookings.
* A booking has statuses:
  * Confirmed
  * Cancelled
  * Completed
* If a booking is cancelled more than 24 hours before viewing, the slot becomes available again.
* A booking cannot be cancelled if less than 24 hours before viewing.

### Design Decision
* Keep cancelled bookings instead of deleting them.
* Avoid renters cancel booking last minute. 

Reason:
* Maintains booking history and improves tracking.
* Avoid renters block the viewing slot from another renters. 

### Future Improvement
* Rescheduling workflow.
* Automated reminders.
* Waitlist system.

## Feature: Account Rules
### Feature Rules
* Each account is registered as either a Property Owner or Renter.
* Account roles are determined during registration.
* Account roles cannot be changed after registration.
* Users requiring another role must create a separate account.

### Design Decisions
* to maintain individual dashboard for a Property Owner or Renter.

### Future Improvements
* Support multi-role accounts where users can act as both property owners and renters.

### Database Design

The initial database design consists of four core entities: Users, Property, Viewing, and Bookings.

![Rental Scheduling System ERD](docs/database/erd-v0.2.png)

### Core Tables

- **Users** – Stores account and role information.
- **Properties** – Stores rental properties belonging to owners.
- **Viewing Slots** – Stores available viewing dates and times.
- **Bookings** – Connects renters with selected viewing slots.

### USERS Table
| Attribute | Type | Key | Description |
|---|---|---|---|
| user_ID | INT | PK | Unique user identifier |
| user_Name | VARCHAR(100) | | User's name |
| user_Email | VARCHAR(255) | UNIQUE | User's email address |
| user_Password_Hash | VARCHAR(255) | | Hashed user password |
| user_Role | VARCHAR(20) | | OWNER or RENTER |
| user_Status | VARCHAR(20) | | ACTIVE or INACTIVE |
| user_Created_At | TIMESTAMP | | Account creation timestamp |
| user_Updated_At | TIMESTAMP | | Last account update |

---

### PROPERTY Table
| Attribute | Type | Key | Description |
|---|---|---|---|
| property_ID | INT | PK | Unique property identifier |
| user_ID | INT | FK | References Users.user_ID |
| property_Name | VARCHAR(150) | | Property/listing name |
| property_Type | VARCHAR(30) | | ROOM, APARTMENT, CONDO, or HOUSE |
| property_Unit | VARCHAR(50) | | Unit/block/room information |
| property_City | VARCHAR(100) | | City or locality of the property |
| property_State | VARCHAR(100) | | State or federal territory of the property |
| property_GMap_URL | VARCHAR(255) | | Google Maps location URL |
| property_Image_URL | VARCHAR(255) | | Property image path or URL |
| property_Description | TEXT | | Property description |
| property_Rent | DECIMAL(10,2) | | Monthly rental price |
| property_Status | VARCHAR(20) | | AVAILABLE, RENTED, or HIDDEN |
| property_Created_At | TIMESTAMP | | Property creation timestamp |
| property_Updated_At | TIMESTAMP | | Last property update |


### VIEWING Table
| Attribute | Type | Key | Description |
|---|---|---|---|
| view_ID | INT | PK | Unique viewing slot identifier |
| property_ID | INT | FK | References Property.property_ID |
| view_Date | DATE | | Viewing date |
| view_Start_Time | TIME | | Start of predefined one-hour slot |
| view_End_Time | TIME | | End of predefined one-hour slot |
| view_Status | VARCHAR(20) | | AVAILABLE, BOOKED, or UNAVAILABLE |
| view_Created_At | TIMESTAMP | | Slot creation timestamp |
| view_Updated_At | TIMESTAMP | | Last slot update |

---

### BOOKING Table
| Attribute | Type | Key | Description |
|---|---|---|---|
| booking_ID | INT | PK | Unique booking identifier |
| view_ID | INT | FK | References Viewing.view_ID |
| user_ID | INT | FK | References renter in Users.user_ID |
| booking_Status | VARCHAR(20) | | CONFIRMED, CANCELLED, COMPLETED, or NO_SHOW |
| booking_Created_At | TIMESTAMP | | Booking creation timestamp |
| booking_Updated_At | TIMESTAMP | | Last booking update |

---

## Functional Prototype

The current prototype demonstrates the core rental viewing
scheduling workflow using HTML, CSS, JavaScript, and localStorage.

### Owner — Manage Viewing Availability

![Owner Availability](docs/screenshots/prototype/owner-availability.PNG)

### Renter — Browse Available Properties

![Renter Properties](docs/screenshots/prototype/renter-properties.PNG)

### Renter — Booking Management

![Renter Bookings](docs/screenshots/prototype/renter-bookings.PNG)

### Owner — Manage Bookings

![Owner Bookings](docs/screenshots/prototype/owner-bookings.PNG)


# Functional Testing

This document tracks manual functional testing performed on the
Rental Scheduling System.

Testing covers the main Owner and Renter workflows, validation rules,
scheduling behaviour, and common error cases.

---

## 1. Authentication

### Registration
- [ ] Register a new Owner account successfully
- [ ] Register a new Renter account successfully
- [ ] Reject registration using an existing email address
- [ ] Reject registration when password and confirmation do not match
- [ ] Verify newly registered account can log in

### Login
- [ ] Login successfully using a valid Owner account
- [ ] Login successfully using a valid Renter account
- [ ] Reject login with incorrect password
- [ ] Reject login with unregistered email
- [ ] Owner is redirected to Owner Dashboard
- [ ] Renter is redirected to Renter Home
- [ ] Correct logged-in username is displayed

### Logout
- [ ] Owner can log out successfully
- [ ] Renter can log out successfully
- [ ] User session is cleared after logout
- [ ] User is redirected to Login page

---

## 2. Property Management

### Add Property
- [ ] Owner can add a new property
- [ ] Required property information is saved correctly
- [ ] Property State is saved correctly
- [ ] Property City is saved correctly
- [ ] Property image can be uploaded
- [ ] Uploaded image is displayed correctly
- [ ] New property appears on Owner Dashboard
- [ ] New available property appears for renters

### State and City Selection
- [ ] All supported Malaysian states are available
- [ ] Selecting a State displays the correct City options
- [ ] Changing State updates the City options
- [ ] Property saves the selected State and City correctly

### Edit Property
- [ ] Owner can open an existing property for editing
- [ ] Existing property information is loaded correctly
- [ ] Existing property image preview is displayed
- [ ] Owner can update property information
- [ ] Owner can update State and City
- [ ] Existing image remains when no new image is selected
- [ ] Owner can replace the existing property image
- [ ] Updated property information appears correctly

### Property Ownership
- [ ] Owner Dashboard only displays properties belonging to logged-in Owner
- [ ] One Owner cannot edit another Owner's property

---

## 3. Property Browsing

### Property List
- [ ] Renter can browse available properties
- [ ] Property name is displayed
- [ ] Property type is displayed
- [ ] Property State and City are displayed
- [ ] Monthly rent is displayed
- [ ] Property description is displayed
- [ ] Property image is displayed correctly
- [ ] Property cards display correctly when multiple properties exist

### Property Privacy
- [ ] Exact property unit is hidden before booking
- [ ] Google Maps location is hidden before booking
- [ ] General City and State remain visible before booking

### Empty State
- [ ] Empty state appears when no properties are available

---

## 4. Property Filtering

### Property Type
- [ ] Filter properties by Room
- [ ] Filter properties by Apartment
- [ ] Filter properties by Condo
- [ ] Filter properties by House
- [ ] All Property Types displays all types

### State
- [ ] Filter properties by selected State
- [ ] Only properties from selected State are displayed
- [ ] All States displays properties from every State

### City
- [ ] City filter is disabled when All States is selected
- [ ] Selecting a State enables the City filter
- [ ] City filter only contains cities belonging to selected State
- [ ] Filtering by City displays the correct properties
- [ ] Changing State resets the City filter

### Combined Filters
- [ ] State + City filtering works correctly
- [ ] State + Property Type filtering works correctly
- [ ] State + City + Property Type filtering works correctly
- [ ] Filter combination with no matching properties displays empty state

---

## 5. Viewing Availability

### Owner Availability
- [ ] Owner can select one of their properties
- [ ] Owner can select a future viewing date
- [ ] Past viewing dates cannot be selected
- [ ] Predefined viewing time slots are displayed
- [ ] Owner can select one viewing slot
- [ ] Owner can select multiple viewing slots
- [ ] Selected viewing availability can be saved
- [ ] Saved viewing slots are stored correctly
- [ ] Previously saved slots reload correctly
- [ ] Owner can remove an AVAILABLE viewing slot
- [ ] Removed AVAILABLE slot is no longer shown to renters

### Viewing Availability for Renter
- [ ] Renter can select a viewing date
- [ ] Only AVAILABLE viewing slots are displayed
- [ ] BOOKED viewing slots are not available for selection
- [ ] Appropriate message appears when no slots are available

---

## 6. Owner Scheduling Conflict

- [ ] Owner can create a viewing slot when no conflict exists
- [ ] Same Owner cannot create the same date/time slot for another property
- [ ] Conflicting AVAILABLE slot is detected
- [ ] Conflicting BOOKED slot is detected
- [ ] Conflict produces a clear error message
- [ ] Failed conflict attempt does not create the new slot
- [ ] Different Owner can use the same date/time slot
- [ ] Same Owner can use a different time on the same date
- [ ] Same Owner can use the same time on a different date

---

## 7. Booking

### Booking Creation
- [ ] Renter can select an AVAILABLE viewing slot
- [ ] Booking confirmation displays the correct property
- [ ] Booking confirmation displays the correct date
- [ ] Booking confirmation displays the correct time
- [ ] Renter can confirm the booking
- [ ] New booking is created as CONFIRMED
- [ ] Corresponding viewing slot becomes BOOKED
- [ ] Booked slot disappears from available viewing slots

### My Bookings
- [ ] Confirmed booking appears in Renter My Bookings
- [ ] Correct property image is displayed
- [ ] Correct property information is displayed
- [ ] Correct viewing date is displayed
- [ ] Correct viewing time is displayed
- [ ] Correct booking status is displayed

### Location After Booking
- [ ] Confirmed booking displays exact Unit / Block / Room
- [ ] Confirmed booking displays Google Maps link
- [ ] Google Maps link opens correctly

### Booking Protection
- [ ] Already BOOKED viewing slot cannot be booked again
- [ ] Booking failure does not create duplicate booking data

---

## 8. Renter Scheduling Conflict

- [ ] Renter can book a slot when no scheduling conflict exists
- [ ] Same Renter cannot book another property at the same date/time
- [ ] Scheduling conflict produces a clear error message
- [ ] Rejected booking is not created
- [ ] Rejected property's viewing slot remains AVAILABLE
- [ ] Different Renter can book another property at the same date/time
- [ ] Same Renter can book another viewing at a different time
- [ ] Same Renter can book the same time on a different date

---

## 9. Booking Cancellation

### Valid Cancellation
- [ ] Renter can cancel a CONFIRMED booking more than 24 hours before viewing
- [ ] Cancelled booking status becomes CANCELLED
- [ ] Cancelled viewing slot becomes AVAILABLE again
- [ ] Released viewing slot can be selected by another renter
- [ ] Cancel button disappears after successful cancellation

### Cancellation Restriction
- [ ] Booking less than 24 hours away cannot be cancelled
- [ ] Cancellation restriction message is displayed
- [ ] Restricted booking remains CONFIRMED
- [ ] Viewing slot remains BOOKED when cancellation is rejected

### Invalid Cancellation
- [ ] Already CANCELLED booking cannot be cancelled again
- [ ] COMPLETED booking cannot be cancelled
- [ ] NO_SHOW booking cannot be cancelled

---

## 10. Owner Booking Management

### Booking List
- [ ] Owner can open Manage Bookings
- [ ] Owner only sees bookings for properties they own
- [ ] Correct renter name is displayed
- [ ] Correct renter email is displayed
- [ ] Correct property is displayed
- [ ] Property image is displayed correctly
- [ ] Correct viewing date and time are displayed
- [ ] Correct booking status is displayed
- [ ] Property Unit / Block / Room is displayed

### Booking Status
- [ ] Owner can mark CONFIRMED booking as COMPLETED
- [ ] COMPLETED status is saved correctly
- [ ] Owner can mark CONFIRMED booking as NO_SHOW
- [ ] NO_SHOW status is saved correctly
- [ ] Completed booking cannot be marked again
- [ ] No-show booking cannot be marked again
- [ ] Cancelled booking cannot be changed to COMPLETED or NO_SHOW

---

## 11. Upcoming Viewing Reminder

### Renter Reminder
- [ ] Upcoming section appears on Renter Home
- [ ] Nearest future CONFIRMED booking is displayed
- [ ] Correct property is displayed
- [ ] Correct viewing date is displayed
- [ ] Correct viewing time is displayed
- [ ] Upcoming viewing popup appears after login
- [ ] Popup only appears once during the login session
- [ ] Refreshing dashboard does not show the popup again
- [ ] Multiple upcoming bookings still show only the nearest booking
- [ ] No upcoming booking displays empty state
- [ ] CANCELLED booking does not appear as upcoming
- [ ] COMPLETED booking does not appear as upcoming
- [ ] NO_SHOW booking does not appear as upcoming

### Owner Reminder
- [ ] Upcoming section appears on Owner Dashboard
- [ ] Owner's nearest future CONFIRMED appointment is displayed
- [ ] Correct property is displayed
- [ ] Correct renter name is displayed
- [ ] Correct viewing date and time are displayed
- [ ] Upcoming viewing popup appears after login
- [ ] Popup only appears once during the login session
- [ ] Multiple appointments still show only the nearest appointment
- [ ] No upcoming appointment displays empty state
- [ ] CANCELLED / COMPLETED / NO_SHOW bookings are excluded

---

## 12. Database and Data Consistency

### Property Data
- [ ] New property creates correct PROPERTY record
- [ ] Property references the correct Owner
- [ ] Property edits update the existing record
- [ ] Property image path is stored correctly

### Viewing Data
- [ ] Viewing references the correct property
- [ ] Viewing date is stored correctly
- [ ] Viewing start and end times are stored correctly
- [ ] New slot begins as AVAILABLE
- [ ] Booking changes slot to BOOKED
- [ ] Cancellation changes slot back to AVAILABLE

### Booking Data
- [ ] Booking references the correct Renter
- [ ] Booking references the correct Viewing
- [ ] New booking begins as CONFIRMED
- [ ] Cancellation updates status to CANCELLED
- [ ] Completion updates status to COMPLETED
- [ ] No-show updates status to NO_SHOW

### Transaction Consistency
- [ ] Successful booking updates both BOOKING and VIEWING
- [ ] Failed booking does not leave partial booking data
- [ ] Successful cancellation updates both BOOKING and VIEWING
- [ ] Failed cancellation does not leave inconsistent statuses

---

## 13. Session and Access Control

- [ ] Owner pages work correctly while logged in as Owner
- [ ] Renter pages work correctly while logged in as Renter
- [ ] Owner-specific data belongs to the current Owner
- [ ] Renter-specific booking data belongs to the current Renter
- [ ] Current username updates correctly between accounts
- [ ] Logout removes current user session
- [ ] Logging into another account does not retain previous user's data
- [ ] Upcoming popup state resets after a new login

---

## 14. Navigation

### Owner
- [ ] Owner Dashboard navigation works
- [ ] Add Property navigation works
- [ ] Edit Property navigation works
- [ ] Viewing Availability navigation works
- [ ] Manage Bookings navigation works
- [ ] Logout navigation works

### Renter
- [ ] Browse Properties navigation works
- [ ] Property Details navigation works
- [ ] Booking Confirmation navigation works
- [ ] My Bookings navigation works
- [ ] Google Maps external link works
- [ ] Logout navigation works

---

## 15. Empty States and User Feedback

### Empty States
- [ ] Owner with no properties sees appropriate empty state
- [ ] Renter with no available properties sees appropriate empty state
- [ ] Filter with no matching property shows appropriate empty state
- [ ] Renter with no bookings sees appropriate empty state
- [ ] Owner with no bookings sees appropriate empty state
- [ ] User with no upcoming viewing sees appropriate empty state
- [ ] Date with no viewing slots shows appropriate message

### Success / Error Feedback
- [ ] Successful property creation displays feedback
- [ ] Successful property update displays feedback
- [ ] Successful viewing availability update displays feedback
- [ ] Successful booking displays feedback
- [ ] Successful cancellation displays feedback
- [ ] Successful booking status update displays feedback
- [ ] Scheduling conflict displays clear feedback
- [ ] Invalid action displays understandable error message

---

## 16. Basic UI Behaviour

> Detailed visual polishing will be performed separately.
> These checks only verify that the current interface remains usable.

- [ ] Property images display at usable size
- [ ] Property cards remain readable
- [ ] Booking images display beside booking information
- [ ] Booking cards remain readable
- [ ] Property edit image preview displays at usable size
- [ ] State / City / Property Type filters display horizontally on desktop
- [ ] Long property information does not break the layout
- [ ] Buttons remain visible and clickable
- [ ] Empty states display correctly
- [ ] Upcoming booking card displays correctly