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

const ownerBookingList =
    document.getElementById(
        "ownerBookingList"
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
// LOAD OWNER BOOKINGS
// ========================================

async function displayOwnerBookings() {

    if (!ownerBookingList) {
        return;
    }


    const currentUser =
        getCurrentUser();


    if (!currentUser) {

        ownerBookingList.innerHTML = `
            <div class="empty-state">

                <h3>
                    Not logged in
                </h3>

                <p>
                    Please log in to view bookings.
                </p>

            </div>
        `;

        return;
    }


    if (
        currentUser.user_Role !==
        "OWNER"
    ) {

        ownerBookingList.innerHTML = `
            <div class="empty-state">

                <h3>
                    Access denied
                </h3>

                <p>
                    This page is for property owners.
                </p>

            </div>
        `;

        return;
    }


    try {

        const response =
            await fetch(
                `/api/owner/bookings?user_ID=${currentUser.user_ID}`
            );


        const bookings =
            await response.json();


        if (!response.ok) {

            ownerBookingList.innerHTML = `
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

            ownerBookingList.innerHTML = `
                <div class="empty-state">

                    <h3>
                        No bookings yet
                    </h3>

                    <p>
                        Renter viewing appointments
                        will appear here.
                    </p>

                </div>
            `;

            return;
        }


        // ========================================
        // DISPLAY BOOKINGS
        // ========================================

        ownerBookingList.innerHTML =
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


                let actionSection =
                    "";


                if (
                    booking.booking_Status ===
                    "CONFIRMED"
                ) {

                    actionSection = `

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
                    `;
                }


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
                                    Renter:
                                </strong>

                                ${booking.renter_Name}
                            </p>


                            <p>
                                <strong>
                                    Renter Email:
                                </strong>

                                ${booking.renter_Email}
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


                            <p>
                                <strong>
                                    Property Location:
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


                            <div class="booking-actions">

                                ${actionSection}

                            </div>

                        </div>

                    </div>
                `;


                ownerBookingList.appendChild(
                    card
                );
            }
        );

    } catch (error) {

        console.error(
            error
        );


        ownerBookingList.innerHTML = `
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
// UPDATE BOOKING STATUS
// ========================================

async function updateBookingStatus(
    bookingID,
    newStatus
) {

    const currentUser =
        getCurrentUser();


    if (!currentUser) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/bookings/${bookingID}/status`,
                {
                    method:
                        "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            user_ID:
                                currentUser.user_ID,

                            booking_Status:
                                newStatus
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


        displayOwnerBookings();


    } catch (error) {

        console.error(
            error
        );


        alert(
            "Unable to update booking."
        );
    }
}


// ========================================
// DISPLAY UPCOMING OWNER BOOKING
// ========================================

async function displayUpcomingOwnerBooking() {

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
        "OWNER"
    ) {

        return;
    }


    try {

        const response =
            await fetch(
                `/api/upcoming-viewing?user_ID=${currentUser.user_ID}&user_Role=OWNER`
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
                                Renter:
                            </strong>

                            ${booking.renter_Name}
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
                endTime +
                "\n" +
                "Renter: " +
                booking.renter_Name
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

displayOwnerBookings();

displayUpcomingOwnerBooking();