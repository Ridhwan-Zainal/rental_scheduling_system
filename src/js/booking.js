// ========================================
// STORAGE HELPERS
// ========================================

function getProperties() {

    return JSON.parse(
        localStorage.getItem("properties")
    ) || [];
}


function getViewings() {

    return JSON.parse(
        localStorage.getItem("viewings")
    ) || [];
}


function saveViewings(viewings) {

    localStorage.setItem(
        "viewings",
        JSON.stringify(viewings)
    );
}


function getBookings() {

    return JSON.parse(
        localStorage.getItem("bookings")
    ) || [];
}


function saveBookings(bookings) {

    localStorage.setItem(
        "bookings",
        JSON.stringify(bookings)
    );
}


// ========================================
// SELECTED VIEWING
// ========================================

const selectedViewingID =
    localStorage.getItem(
        "selectedViewingID"
    );

let viewings =
    getViewings();


const selectedViewing =
    viewings.find(
        viewing =>
            String(viewing.view_ID) ===
            String(selectedViewingID)
    );


// ========================================
// SELECTED PROPERTY
// ========================================

let selectedProperty = null;


if (selectedViewing) {

    const properties =
        getProperties();


    selectedProperty =
        properties.find(
            property =>
                String(property.property_ID) ===
                String(selectedViewing.property_ID)
        );
}


// ========================================
// PAGE ELEMENTS
// ========================================

const bookingPropertyName =
    document.getElementById(
        "bookingPropertyName"
    );

const bookingPropertyType =
    document.getElementById(
        "bookingPropertyType"
    );

const bookingPropertyRent =
    document.getElementById(
        "bookingPropertyRent"
    );

const bookingDate =
    document.getElementById(
        "bookingDate"
    );

const bookingTime =
    document.getElementById(
        "bookingTime"
    );

const bookingMessage =
    document.getElementById(
        "bookingMessage"
    );

const confirmBookingBtn =
    document.getElementById(
        "confirmBookingBtn"
    );


// ========================================
// DISPLAY BOOKING SUMMARY
// ========================================

if (
    selectedViewing &&
    selectedProperty
) {

    bookingPropertyName.textContent =
        selectedProperty.property_Name;


    bookingPropertyType.textContent =
        selectedProperty.property_Type;


    bookingPropertyRent.textContent =
        `RM ${selectedProperty.property_Rent} / month`;


    bookingDate.textContent =
        selectedViewing.view_Date;


    bookingTime.textContent =
        `${selectedViewing.view_Start_Time} - ${selectedViewing.view_End_Time}`;
}


// ========================================
// CONFIRM BOOKING
// ========================================

if (confirmBookingBtn) {

    confirmBookingBtn.addEventListener(
        "click",
        function () {


            // ========================================
            // VALIDATE VIEWING
            // ========================================

            if (!selectedViewing) {

                bookingMessage.textContent =
                    "Viewing slot could not be found.";

                return;
            }


            if (
                selectedViewing.view_Status !==
                "AVAILABLE"
            ) {

                bookingMessage.textContent =
                    "This viewing slot is no longer available.";

                return;
            }


            // ========================================
            // CREATE BOOKING
            // ========================================

            const bookings =
                getBookings();


            const booking = {

                booking_ID:
                    Date.now(),

                view_ID:
                    selectedViewing.view_ID,

                // Temporary renter ID
                // until real authentication exists
                user_ID:
                    "RENTER_DEMO",

                booking_Status:
                    "CONFIRMED",

                booking_Created_At:
                    new Date().toISOString()
            };


            bookings.push(
                booking
            );


            saveBookings(
                bookings
            );


            // ========================================
            // CHANGE VIEWING STATUS
            // ========================================

            const viewingIndex =
                viewings.findIndex(
                    viewing =>
                        String(
                            viewing.view_ID
                        ) ===
                        String(
                            selectedViewingID
                        )
                );


            if (viewingIndex !== -1) {

                viewings[
                    viewingIndex
                ].view_Status =
                    "BOOKED";
            }


            saveViewings(
                viewings
            );


            // ========================================
            // SUCCESS
            // ========================================

            bookingMessage.textContent =
                "Booking confirmed successfully.";


            confirmBookingBtn.disabled =
                true;


            confirmBookingBtn.textContent =
                "Booking Confirmed";
        }
    );
}