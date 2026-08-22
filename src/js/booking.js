// ========================================
// CURRENT USER
// ========================================

function getCurrentUser() {

    return JSON.parse(
        sessionStorage.getItem(
            "currentUser"
        )
    );
}


// ========================================
// BOOKING PAGE ELEMENTS
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
// SELECTED DATA
// ========================================

const selectedPropertyID =
    sessionStorage.getItem(
        "selectedRenterPropertyID"
    );

const selectedViewingID =
    sessionStorage.getItem(
        "selectedViewingID"
    );


// ========================================
// LOAD BOOKING SUMMARY
// ========================================

async function loadBookingSummary() {

    if (
        !bookingPropertyName ||
        !selectedPropertyID ||
        !selectedViewingID
    ) {
        return;
    }


    try {

        // ========================================
        // LOAD PROPERTY
        // ========================================

        const propertyResponse =
            await fetch(
                `/api/properties/${selectedPropertyID}`
            );


        const property =
            await propertyResponse.json();


        if (!propertyResponse.ok) {

            bookingMessage.textContent =
                property.message;

            return;
        }


        // ========================================
        // LOAD VIEWING SLOT
        // ========================================

        const viewingResponse =
            await fetch(
                `/api/viewings/${selectedViewingID}`
            );


        const viewing =
            await viewingResponse.json();


        if (!viewingResponse.ok) {

            bookingMessage.textContent =
                viewing.message;

            return;
        }


        // ========================================
        // DISPLAY PROPERTY INFORMATION
        // ========================================

        bookingPropertyName.textContent =
            property.property_Name;


        bookingPropertyType.textContent =
            property.property_Type;


        bookingPropertyRent.textContent =
            `RM ${property.property_Rent} / month`;


        // ========================================
        // DISPLAY VIEWING INFORMATION
        // ========================================

        bookingDate.textContent =
            formatDate(
                viewing.view_Date
            );


        const startTime =
            viewing
                .view_Start_Time
                .substring(
                    0,
                    5
                );


        const endTime =
            viewing
                .view_End_Time
                .substring(
                    0,
                    5
                );


        bookingTime.textContent =
            `${startTime} - ${endTime}`;


        // ========================================
        // CHECK SLOT STATUS
        // ========================================

        if (
            viewing.view_Status !==
            "AVAILABLE"
        ) {

            bookingMessage.textContent =
                "This viewing slot is no longer available.";


            confirmBookingBtn.disabled =
                true;
        }

    } catch (error) {

        console.error(error);


        bookingMessage.textContent =
            "Unable to load booking information.";
    }
}


// ========================================
// FORMAT DATE
// ========================================

function formatDate(
    dateValue
) {

    const dateString =
        dateValue.substring(
            0,
            10
        );


    const date =
        new Date(
            `${dateString}T00:00:00`
        );


    return date.toLocaleDateString(
        "en-MY",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );
}


// ========================================
// CONFIRM BOOKING
// ========================================

if (confirmBookingBtn) {

    confirmBookingBtn.addEventListener(
        "click",
        async function () {

            const currentUser =
                getCurrentUser();


            // ========================================
            // CHECK LOGIN
            // ========================================

            if (!currentUser) {

                bookingMessage.textContent =
                    "Please log in before booking.";

                return;
            }


            // ========================================
            // CHECK RENTER ROLE
            // ========================================

            if (
                currentUser.user_Role !==
                "RENTER"
            ) {

                bookingMessage.textContent =
                    "Only renters can create bookings.";

                return;
            }


            // ========================================
            // CHECK VIEWING
            // ========================================

            if (!selectedViewingID) {

                bookingMessage.textContent =
                    "No viewing slot selected.";

                return;
            }


            // ========================================
            // PREVENT DOUBLE CLICK
            // ========================================

            confirmBookingBtn.disabled =
                true;


            confirmBookingBtn.textContent =
                "Confirming...";


            // ========================================
            // CREATE BOOKING
            // ========================================

            try {

                const response =
                    await fetch(
                        "/api/bookings",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    view_ID:
                                        selectedViewingID,

                                    user_ID:
                                        currentUser.user_ID
                                })
                        }
                    );


                const data =
                    await response.json();


                // ========================================
                // BOOKING FAILED
                // ========================================

                if (!response.ok) {

                    bookingMessage.textContent =
                        data.message;


                    confirmBookingBtn.disabled =
                        false;


                    confirmBookingBtn.textContent =
                        "Confirm Booking";


                    return;
                }


                // ========================================
                // BOOKING SUCCESS
                // ========================================

                bookingMessage.textContent =
                    data.message;


                sessionStorage.setItem(
                    "lastBookingID",
                    data.booking_ID
                );


                sessionStorage.removeItem(
                    "selectedViewingID"
                );


                // ========================================
                // REDIRECT
                // ========================================

                setTimeout(
                    function () {

                        window.location.href =
                            "renter-home.html";
                    },

                    1200
                );

            } catch (error) {

                console.error(error);


                bookingMessage.textContent =
                    "Unable to complete booking.";


                confirmBookingBtn.disabled =
                    false;


                confirmBookingBtn.textContent =
                    "Confirm Booking";
            }
        }
    );
}


// ========================================
// INITIAL LOAD
// ========================================

loadBookingSummary();