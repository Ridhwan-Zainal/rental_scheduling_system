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
// PAGE ELEMENT
// ========================================

const ownerBookingList =
    document.getElementById(
        "ownerBookingList"
    );


// ========================================
// DISPLAY BOOKINGS
// ========================================

function displayOwnerBookings() {

    if (!ownerBookingList) {
        return;
    }


    const bookings =
        getBookings();

    const viewings =
        getViewings();

    const properties =
        getProperties();


    // ========================================
    // EMPTY STATE
    // ========================================

    if (bookings.length === 0) {

        ownerBookingList.innerHTML = `

            <div class="empty-state">

                <h3>No bookings yet</h3>

                <p>
                    Confirmed renter viewing bookings
                    will appear here.
                </p>

            </div>
        `;

        return;
    }


    ownerBookingList.innerHTML = "";


    // ========================================
    // CREATE BOOKING CARDS
    // ========================================

    bookings.forEach(
        function (booking) {


            const viewing =
                viewings.find(
                    viewing =>
                        String(
                            viewing.view_ID
                        ) ===
                        String(
                            booking.view_ID
                        )
                );


            if (!viewing) {
                return;
            }


            const property =
                properties.find(
                    property =>
                        String(
                            property.property_ID
                        ) ===
                        String(
                            viewing.property_ID
                        )
                );


            if (!property) {
                return;
            }


            const card =
                document.createElement("div");

            card.classList.add(
                "booking-card"
            );


            card.innerHTML = `

                <h3>
                    ${property.property_Name}
                </h3>

                <p>
                    <strong>Renter:</strong>
                    Demo Renter
                </p>

                <p>
                    <strong>Date:</strong>
                    ${viewing.view_Date}
                </p>

                <p>
                    <strong>Time:</strong>
                    ${viewing.view_Start_Time}
                    -
                    ${viewing.view_End_Time}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${booking.booking_Status}
                </p>

                <div class="booking-actions">

                    ${
                        booking.booking_Status ===
                        "CONFIRMED"

                        ? `

                            <button
                                type="button"
                                onclick="updateBookingStatus(
                                    '${booking.booking_ID}',
                                    'COMPLETED'
                                )"
                            >
                                Mark Completed
                            </button>


                            <button
                                type="button"
                                onclick="updateBookingStatus(
                                    '${booking.booking_ID}',
                                    'NO_SHOW'
                                )"
                            >
                                Mark No-Show
                            </button>

                        `

                        : ""
                    }

                </div>
            `;


            ownerBookingList.appendChild(
                card
            );
        }
    );
}


// ========================================
// UPDATE BOOKING STATUS
// ========================================

function updateBookingStatus(
    bookingID,
    newStatus
) {

    const bookings =
        getBookings();


    const bookingIndex =
        bookings.findIndex(
            booking =>
                String(
                    booking.booking_ID
                ) ===
                String(
                    bookingID
                )
        );


    if (bookingIndex === -1) {
        return;
    }


    bookings[
        bookingIndex
    ].booking_Status =
        newStatus;


    saveBookings(
        bookings
    );


    displayOwnerBookings();
}


// ========================================
// INITIAL LOAD
// ========================================

displayOwnerBookings();