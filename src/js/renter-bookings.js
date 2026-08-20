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
// PAGE ELEMENT
// ========================================

const renterBookingList =
    document.getElementById(
        "renterBookingList"
    );


// ========================================
// CHECK CANCELLATION TIME
// ========================================

function canCancelBooking(viewing) {

    const viewingDateTime =
        new Date(
            `${viewing.view_Date}T${viewing.view_Start_Time}:00`
        );

    const currentDateTime =
        new Date();

    const differenceMilliseconds =
        viewingDateTime - currentDateTime;

    const differenceHours =
        differenceMilliseconds /
        (1000 * 60 * 60);

    return differenceHours > 24;
}


// ========================================
// DISPLAY RENTER BOOKINGS
// ========================================

function displayRenterBookings() {

    if (!renterBookingList) {
        return;
    }


    const bookings =
        getBookings();

    const viewings =
        getViewings();

    const properties =
        getProperties();


    const renterBookings =
        bookings.filter(
            booking =>
                booking.user_ID ===
                "RENTER_DEMO"
        );


    // ========================================
    // EMPTY STATE
    // ========================================

    if (renterBookings.length === 0) {

        renterBookingList.innerHTML = `

            <div class="empty-state">

                <h3>No bookings yet</h3>

                <p>
                    Your property viewing
                    appointments will appear here.
                </p>

                <a
                    href="renter-home.html"
                    class="button-link"
                >
                    Browse Properties
                </a>

            </div>
        `;

        return;
    }


    renterBookingList.innerHTML = "";


    // ========================================
    // DISPLAY BOOKINGS
    // ========================================

    renterBookings.forEach(
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
                document.createElement(
                    "div"
                );

            card.classList.add(
                "booking-card"
            );


            // ========================================
            // LOCATION INFORMATION
            // ========================================

            const locationSection =
                booking.booking_Status ===
                "CONFIRMED"

                ? `

                    <hr>

                    <h4>
                        Viewing Location
                    </h4>

                    <p>
                        <strong>
                            Unit / Block / Room:
                        </strong>

                        ${property.property_Unit}
                    </p>

                    <p>
                        <a
                            href="${property.property_GMap_URL}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Open Location in Google Maps
                        </a>
                    </p>

                `

                : "";


            // ========================================
            // CANCELLATION CONTROL
            // ========================================

            let cancellationSection = "";


            if (
                booking.booking_Status ===
                "CONFIRMED"
            ) {

                if (
                    canCancelBooking(viewing)
                ) {

                    cancellationSection = `

                        <button
                            type="button"
                            onclick="cancelBooking(
                                '${booking.booking_ID}'
                            )"
                        >
                            Cancel Booking
                        </button>

                    `;

                } else {

                    cancellationSection = `

                        <p class="booking-notice">
                            Cancellation is no longer
                            available because the viewing
                            is less than 24 hours away.
                        </p>

                    `;
                }
            }


            // ========================================
            // BOOKING CARD
            // ========================================

            card.innerHTML = `

                <h3>
                    ${property.property_Name}
                </h3>


                <p>
                    <strong>
                        Property Type:
                    </strong>

                    ${property.property_Type}
                </p>


                <p>
                    <strong>
                        Viewing Date:
                    </strong>

                    ${viewing.view_Date}
                </p>


                <p>
                    <strong>
                        Viewing Time:
                    </strong>

                    ${viewing.view_Start_Time}
                    -
                    ${viewing.view_End_Time}
                </p>


                <p>
                    <strong>
                        Booking Status:
                    </strong>

                    ${booking.booking_Status}
                </p>


                ${locationSection}


                <div class="booking-actions">

                    ${cancellationSection}

                </div>
            `;


            renterBookingList.appendChild(
                card
            );
        }
    );
}


// ========================================
// CANCEL BOOKING
// ========================================

function cancelBooking(bookingID) {

    const bookings =
        getBookings();

    const viewings =
        getViewings();


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


    const booking =
        bookings[bookingIndex];


    // Booking must still be confirmed

    if (
        booking.booking_Status !==
        "CONFIRMED"
    ) {
        return;
    }


    // Find related viewing

    const viewingIndex =
        viewings.findIndex(
            viewing =>
                String(
                    viewing.view_ID
                ) ===
                String(
                    booking.view_ID
                )
        );


    if (viewingIndex === -1) {
        return;
    }


    const viewing =
        viewings[viewingIndex];


    // ========================================
    // CHECK 24-HOUR RULE AGAIN
    // ========================================

    if (!canCancelBooking(viewing)) {

        alert(
            "This booking cannot be cancelled because the viewing is less than 24 hours away."
        );

        displayRenterBookings();

        return;
    }


    // ========================================
    // CANCEL BOOKING
    // ========================================

    bookings[
        bookingIndex
    ].booking_Status =
        "CANCELLED";


    // ========================================
    // RELEASE VIEWING SLOT
    // ========================================

    viewings[
        viewingIndex
    ].view_Status =
        "AVAILABLE";


    // ========================================
    // SAVE
    // ========================================

    saveBookings(bookings);

    saveViewings(viewings);


    // Refresh page content

    displayRenterBookings();
}


// ========================================
// INITIAL LOAD
// ========================================

displayRenterBookings();