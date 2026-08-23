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
// PAGE ELEMENTS
// ========================================

const renterBookingList =
    document.getElementById(
        "renterBookingList"
    );


const upcomingBooking =
    document.getElementById(
        "upcomingBooking"
    );


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
// CAN CANCEL?
// ========================================

function canCancelBooking(
    booking
) {

    const dateString =
        booking.view_Date.substring(
            0,
            10
        );


    const viewingDateTime =
        new Date(
            `${dateString}T${booking.view_Start_Time}`
        );


    const now =
        new Date();


    const differenceHours =
        (
            viewingDateTime -
            now
        ) /
        (
            1000 *
            60 *
            60
        );


    return differenceHours > 24;
}


// ========================================
// LOAD RENTER BOOKINGS
// ========================================

async function displayRenterBookings() {

    if (!renterBookingList) {
        return;
    }


    const currentUser =
        getCurrentUser();


    if (!currentUser) {

        renterBookingList.innerHTML = `
            <div class="empty-state">

                <h3>
                    Not logged in
                </h3>

                <p>
                    Please log in to view your bookings.
                </p>

            </div>
        `;

        return;
    }


    if (
        currentUser.user_Role !==
        "RENTER"
    ) {

        renterBookingList.innerHTML = `
            <div class="empty-state">

                <h3>
                    Access denied
                </h3>

                <p>
                    This page is for renters.
                </p>

            </div>
        `;

        return;
    }


    try {

        const response =
            await fetch(
                `/api/renter/bookings?user_ID=${currentUser.user_ID}`
            );


        const bookings =
            await response.json();


        if (!response.ok) {

            renterBookingList.innerHTML = `
                <div class="empty-state">

                    <h3>
                        Unable to load bookings
                    </h3>

                    <p>
                        ${bookings.message}
                    </p>

                </div>
            `;

            return;
        }


        // ========================================
        // EMPTY STATE
        // ========================================

        if (
            bookings.length === 0
        ) {

            renterBookingList.innerHTML = `
                <div class="empty-state">

                    <h3>
                        No bookings yet
                    </h3>

                    <p>
                        Your property viewing
                        bookings will appear here.
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


        // ========================================
        // DISPLAY BOOKINGS
        // ========================================

        renterBookingList.innerHTML =
            "";


        bookings.forEach(
            function (booking) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.classList.add(
                    "booking-card"
                );


                const startTime =
                    booking
                        .view_Start_Time
                        .substring(
                            0,
                            5
                        );


                const endTime =
                    booking
                        .view_End_Time
                        .substring(
                            0,
                            5
                        );


                // ========================================
                // PRIVATE LOCATION
                // ========================================

                let locationSection =
                    "";


                if (
                    booking.booking_Status ===
                        "CONFIRMED" ||
                    booking.booking_Status ===
                        "COMPLETED"
                ) {

                    locationSection = `

                        <div class="booking-location">

                            <h4>
                                Viewing Location
                            </h4>

                            <p>
                                <strong>
                                    General Location:
                                </strong>

                                ${booking.property_City},
                                ${booking.property_State}
                            </p>

                            <p>
                                <strong>
                                    Unit / Block / Room:
                                </strong>

                                ${booking.property_Unit}
                            </p>

                            <p>
                                <a
                                    href="${booking.property_GMap_URL}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Open Location in Google Maps
                                </a>
                            </p>

                        </div>
                    `;
                }


                // ========================================
                // CANCELLATION
                // ========================================

                let cancellationSection =
                    "";


                if (
                    booking.booking_Status ===
                    "CONFIRMED"
                ) {

                    if (
                        canCancelBooking(
                            booking
                        )
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
                // CARD
                // ========================================

                card.innerHTML = `

                    <h3>
                        ${booking.property_Name}
                    </h3>


                    <div class="booking-card-content">


                        <div class="booking-image-section">

                            ${
                                booking.property_Image_URL
                                    ? `
                                        <img
                                            src="${booking.property_Image_URL}"
                                            alt="${booking.property_Name}"
                                            class="booking-property-image"
                                        >
                                    `
                                    : ""
                            }

                        </div>


                        <div class="booking-info-section">

                            <p>
                                <strong>
                                    Property Type:
                                </strong>

                                ${booking.property_Type}
                            </p>


                            <p>
                                <strong>
                                    Viewing Date:
                                </strong>

                                ${formatDate(
                                    booking.view_Date
                                )}
                            </p>


                            <p>
                                <strong>
                                    Viewing Time:
                                </strong>

                                ${startTime} - ${endTime}
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

                        </div>

                    </div>
                `;


                renterBookingList.appendChild(
                    card
                );
            }
        );

    } catch (error) {

        console.error(
            error
        );


        renterBookingList.innerHTML = `
            <div class="empty-state">

                <h3>
                    Unable to load bookings
                </h3>

                <p>
                    Unable to connect to the server.
                </p>

            </div>
        `;
    }
}


// ========================================
// CANCEL BOOKING
// ========================================

async function cancelBooking(
    bookingID
) {

    const currentUser =
        getCurrentUser();


    if (!currentUser) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/bookings/${bookingID}/cancel`,
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            user_ID:
                                currentUser.user_ID
                        })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message
            );

            return;
        }


        // Reload list after cancellation

        displayRenterBookings();


    } catch (error) {

        console.error(
            error
        );


        alert(
            "Unable to cancel booking."
        );
    }
}


// ========================================
// DISPLAY UPCOMING RENTER BOOKING
// ========================================

async function displayUpcomingRenterBooking() {

    if (!upcomingBooking) {
        return;
    }


    const currentUser =
        getCurrentUser();


    if (!currentUser) {
        return;
    }


    if (
        currentUser.user_Role !==
        "RENTER"
    ) {

        return;
    }


    try {

        const response =
            await fetch(
                `/api/upcoming-viewing?user_ID=${currentUser.user_ID}&user_Role=RENTER`
            );


        const booking =
            await response.json();


        if (!response.ok) {

            throw new Error(
                booking.message ||
                "Unable to load upcoming booking."
            );
        }


        // ========================================
        // NO UPCOMING BOOKING
        // ========================================

        if (!booking) {

            upcomingBooking.innerHTML = `
                <div class="empty-state">

                    <h3>
                        No upcoming viewing
                    </h3>

                    <p>
                        You currently have no
                        upcoming viewing appointments.
                    </p>

                </div>
            `;

            return;
        }


        // ========================================
        // FORMAT TIME
        // ========================================

        const startTime =
            booking
                .view_Start_Time
                .substring(
                    0,
                    5
                );


        const endTime =
            booking
                .view_End_Time
                .substring(
                    0,
                    5
                );


        // ========================================
        // DISPLAY UPCOMING BOOKING
        // ========================================

        upcomingBooking.innerHTML = `

            <div class="booking-card">

                <h3>
                    ${booking.property_Name}
                </h3>


                <div class="booking-card-content">


                    <div class="booking-image-section">

                        ${
                            booking.property_Image_URL
                                ? `
                                    <img
                                        src="${booking.property_Image_URL}"
                                        alt="${booking.property_Name}"
                                        class="booking-property-image"
                                    >
                                `
                                : ""
                        }

                    </div>


                    <div class="booking-info-section">

                        <p>
                            <strong>
                                Viewing Date:
                            </strong>

                            ${formatDate(
                                booking.view_Date
                            )}
                        </p>


                        <p>
                            <strong>
                                Viewing Time:
                            </strong>

                            ${startTime} - ${endTime}
                        </p>


                        <p>
                            <strong>
                                Property Location:
                            </strong>

                            ${booking.property_City},
                            ${booking.property_State}
                        </p>

                    </div>

                </div>

            </div>
        `;


        // ========================================
        // LOGIN POPUP
        // ========================================

        const popupShown =
            sessionStorage.getItem(
                "upcomingBookingPopupShown"
            );


        if (!popupShown) {

            alert(
                "Upcoming Viewing\n\n" +
                booking.property_Name +
                "\n" +
                formatDate(
                    booking.view_Date
                ) +
                "\n" +
                startTime +
                " - " +
                endTime
            );


            sessionStorage.setItem(
                "upcomingBookingPopupShown",
                "true"
            );
        }


    } catch (error) {

        console.error(
            error
        );


        upcomingBooking.innerHTML = `
            <div class="empty-state">

                <h3>
                    Unable to load upcoming viewing
                </h3>

                <p>
                    Please try again later.
                </p>

            </div>
        `;
    }
}


// ========================================
// INITIAL LOADS
// ========================================

displayRenterBookings();

displayUpcomingRenterBooking();