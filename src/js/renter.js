// ========================================
// STORAGE / SESSION HELPERS
// ========================================

function getCurrentUser() {

    return JSON.parse(
        sessionStorage.getItem(
            "currentUser"
        )
    );
}


// ========================================
// RENTER HOME ELEMENTS
// ========================================

const renterPropertyList =
    document.getElementById(
        "renterPropertyList"
    );


const propertyStateFilter =
    document.getElementById(
        "propertyStateFilter"
    );


const propertyCityFilter =
    document.getElementById(
        "propertyCityFilter"
    );


const propertyTypeFilter =
    document.getElementById(
        "propertyTypeFilter"
    );


// ========================================
// LOAD AVAILABLE PROPERTIES FROM MYSQL
// ========================================

async function getAvailableProperties() {

    const response =
        await fetch(
            "/api/renter/properties"
        );


    const data =
        await response.json();


    if (!response.ok) {

        throw new Error(
            data.message ||
            "Unable to retrieve properties."
        );
    }


    return data;
}


// ========================================
// DISPLAY PROPERTIES
// ========================================

async function displayProperties(
    filterType = "ALL",
    filterState = "ALL",
    filterCity = "ALL"
) {

    if (!renterPropertyList) {
        return;
    }


    const currentUser =
        getCurrentUser();


    // ========================================
    // CHECK LOGIN
    // ========================================

    if (!currentUser) {

        renterPropertyList.innerHTML = `
            <div class="empty-state">

                <h3>
                    Not logged in
                </h3>

                <p>
                    Please log in to browse properties.
                </p>

            </div>
        `;

        return;
    }


    // ========================================
    // CHECK ROLE
    // ========================================

    if (
        currentUser.user_Role !==
        "RENTER"
    ) {

        renterPropertyList.innerHTML = `
            <div class="empty-state">

                <h3>
                    Access denied
                </h3>

                <p>
                    This page is only available
                    to renters.
                </p>

            </div>
        `;

        return;
    }


    try {

        let properties =
            await getAvailableProperties();


        // ========================================
        // PROPERTY TYPE FILTER
        // ========================================

        if (
            filterType !==
            "ALL"
        ) {

            properties =
                properties.filter(
                    function (property) {

                        return (
                            property.property_Type ===
                            filterType
                        );
                    }
                );
        }


        // ========================================
        // STATE FILTER
        // ========================================

        if (
            filterState !==
            "ALL"
        ) {

            properties =
                properties.filter(
                    function (property) {

                        return (
                            property.property_State ===
                            filterState
                        );
                    }
                );
        }


        // ========================================
        // CITY FILTER
        // ========================================

        if (
            filterCity !==
            "ALL"
        ) {

            properties =
                properties.filter(
                    function (property) {

                        return (
                            property.property_City ===
                            filterCity
                        );
                    }
                );
        }


        // ========================================
        // EMPTY STATE
        // ========================================

        if (
            properties.length === 0
        ) {

            renterPropertyList.innerHTML = `
                <div class="empty-state">

                    <h3>
                        No properties available
                    </h3>

                    <p>
                        There are currently no
                        properties matching
                        your selection.
                    </p>

                </div>
            `;

            return;
        }


        // ========================================
        // PROPERTY CARDS
        // ========================================

        renterPropertyList.innerHTML =
            "";


        properties.forEach(
            function (property) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.classList.add(
                    "property-card"
                );


                card.innerHTML = `

                    <h3>
                        ${property.property_Name}
                    </h3>


                    ${
                        property.property_Image_URL
                            ? `
                                <img
                                    src="${property.property_Image_URL}"
                                    alt="${property.property_Name}"
                                    class="property-image"
                                >
                            `
                            : ""
                    }


                    <p>
                        <strong>
                            Property Type:
                        </strong>

                        ${property.property_Type}
                    </p>


                    <p>
                        <strong>
                            Location:
                        </strong>

                        ${property.property_City},
                        ${property.property_State}
                    </p>


                    <p>
                        <strong>
                            Monthly Rent:
                        </strong>

                        RM ${property.property_Rent}
                        / month
                    </p>


                    <p>
                        ${
                            property.property_Description ||
                            ""
                        }
                    </p>


                    <button
                        type="button"
                        onclick="viewProperty(
                            '${property.property_ID}'
                        )"
                    >
                        View Property
                    </button>
                `;


                renterPropertyList.appendChild(
                    card
                );
            }
        );

    } catch (error) {

        console.error(
            error
        );


        renterPropertyList.innerHTML = `
            <div class="empty-state">

                <h3>
                    Unable to load properties
                </h3>

                <p>
                    Unable to connect to the server.
                </p>

            </div>
        `;
    }
}


// ========================================
// APPLY ALL PROPERTY FILTERS
// ========================================

function applyPropertyFilters() {

    const selectedType =
        propertyTypeFilter
            ? propertyTypeFilter.value
            : "ALL";


    const selectedState =
        propertyStateFilter
            ? propertyStateFilter.value
            : "ALL";


    const selectedCity =
        propertyCityFilter
            ? propertyCityFilter.value
            : "ALL";


    displayProperties(
        selectedType,
        selectedState,
        selectedCity
    );
}


// ========================================
// STATE FILTER CHANGE
// ========================================

if (
    propertyStateFilter &&
    propertyCityFilter
) {

    propertyStateFilter.addEventListener(
        "change",
        function () {

            const selectedState =
                propertyStateFilter.value;


            // Reset city dropdown

            propertyCityFilter.innerHTML = `
                <option value="ALL">
                    All Cities
                </option>
            `;


            // ========================================
            // ALL STATES
            // ========================================

            if (
                selectedState ===
                "ALL"
            ) {

                propertyCityFilter.disabled =
                    true;
            }


            // ========================================
            // SPECIFIC STATE
            // ========================================

            else {

                propertyCityFilter.disabled =
                    false;


                const cities =
                    citiesByState[
                        selectedState
                    ] || [];


                cities.forEach(
                    function (city) {

                        const option =
                            document.createElement(
                                "option"
                            );


                        option.value =
                            city;


                        option.textContent =
                            city;


                        propertyCityFilter
                            .appendChild(
                                option
                            );
                    }
                );
            }


            applyPropertyFilters();
        }
    );
}


// ========================================
// CITY FILTER CHANGE
// ========================================

if (propertyCityFilter) {

    propertyCityFilter.addEventListener(
        "change",
        function () {

            applyPropertyFilters();
        }
    );
}


// ========================================
// PROPERTY TYPE FILTER CHANGE
// ========================================

if (propertyTypeFilter) {

    propertyTypeFilter.addEventListener(
        "change",
        function () {

            applyPropertyFilters();
        }
    );
}


// ========================================
// VIEW PROPERTY
// ========================================

function viewProperty(
    propertyID
) {

    sessionStorage.setItem(
        "selectedRenterPropertyID",
        propertyID
    );


    window.location.href =
        "property-details.html";
}


// ========================================
// PROPERTY DETAILS ELEMENTS
// ========================================

const propertyName =
    document.getElementById(
        "propertyName"
    );


const propertyType =
    document.getElementById(
        "propertyType"
    );


const propertyRent =
    document.getElementById(
        "propertyRent"
    );


const propertyDescription =
    document.getElementById(
        "propertyDescription"
    );


const renterViewDate =
    document.getElementById(
        "renterViewDate"
    );


const availableSlots =
    document.getElementById(
        "availableSlots"
    );


// ========================================
// PREVENT PAST VIEWING DATES
// ========================================

if (renterViewDate) {

    const today =
        new Date()
            .toLocaleDateString(
                "en-CA"
            );


    renterViewDate.min =
        today;
}


// ========================================
// LOAD PROPERTY DETAILS
// ========================================

async function loadPropertyDetails() {

    if (!propertyName) {
        return;
    }


    const propertyID =
        sessionStorage.getItem(
            "selectedRenterPropertyID"
        );


    if (!propertyID) {

        propertyName.textContent =
            "Property not selected.";

        return;
    }


    try {

        const response =
            await fetch(
                `/api/properties/${propertyID}`
            );


        const property =
            await response.json();


        if (!response.ok) {

            propertyName.textContent =
                property.message;

            return;
        }


        // ========================================
        // DISPLAY PROPERTY INFORMATION
        // ========================================

        propertyName.textContent =
            property.property_Name;


        propertyType.textContent =
            `${property.property_Type} • ${property.property_City}, ${property.property_State}`;


        propertyRent.textContent =
            `RM ${property.property_Rent} / month`;


        propertyDescription.textContent =
            property.property_Description ||
            "";


        /*
            IMPORTANT:

            We deliberately do NOT display:

            property.property_Unit
            property.property_GMap_URL

            These remain hidden until
            a booking is confirmed.
        */

    } catch (error) {

        console.error(
            error
        );


        propertyName.textContent =
            "Unable to load property.";
    }
}


// ========================================
// LOAD AVAILABLE VIEWING SLOTS
// ========================================

async function displayAvailableSlots() {

    if (
        !renterViewDate ||
        !availableSlots
    ) {

        return;
    }


    const selectedDate =
        renterViewDate.value;


    if (!selectedDate) {

        availableSlots.innerHTML = `
            <p>
                Select a date to view
                available slots.
            </p>
        `;

        return;
    }


    const propertyID =
        sessionStorage.getItem(
            "selectedRenterPropertyID"
        );


    if (!propertyID) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/viewings?property_ID=${propertyID}&view_Date=${selectedDate}`
            );


        const viewings =
            await response.json();


        if (!response.ok) {

            availableSlots.innerHTML = `
                <p>
                    ${viewings.message}
                </p>
            `;

            return;
        }


        const availableViewings =
            viewings.filter(
                function (viewing) {

                    return (
                        viewing.view_Status ===
                        "AVAILABLE"
                    );
                }
            );


        // ========================================
        // NO AVAILABLE SLOTS
        // ========================================

        if (
            availableViewings.length === 0
        ) {

            availableSlots.innerHTML = `
                <p>
                    No viewing slots are
                    available on this date.
                </p>
            `;

            return;
        }


        // ========================================
        // DISPLAY SLOT BUTTONS
        // ========================================

        availableSlots.innerHTML =
            "";


        availableViewings.forEach(
            function (viewing) {

                const button =
                    document.createElement(
                        "button"
                    );


                button.type =
                    "button";


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


                button.textContent =
                    `${startTime} - ${endTime}`;


                button.addEventListener(
                    "click",
                    function () {

                        selectViewing(
                            viewing.view_ID
                        );
                    }
                );


                availableSlots.appendChild(
                    button
                );
            }
        );

    } catch (error) {

        console.error(
            error
        );


        availableSlots.innerHTML = `
            <p>
                Unable to load viewing slots.
            </p>
        `;
    }
}


// ========================================
// DATE CHANGED
// ========================================

if (renterViewDate) {

    renterViewDate.addEventListener(
        "change",
        displayAvailableSlots
    );
}


// ========================================
// SELECT VIEWING SLOT
// ========================================

function selectViewing(
    viewID
) {

    sessionStorage.setItem(
        "selectedViewingID",
        viewID
    );


    window.location.href =
        "booking-confirmation.html";
}


// ========================================
// INITIAL LOADS
// ========================================

displayProperties();

loadPropertyDetails();