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


// ========================================
// RENTER HOME ELEMENTS
// ========================================

const renterPropertyList =
    document.getElementById(
        "renterPropertyList"
    );

const propertyTypeFilter =
    document.getElementById(
        "propertyTypeFilter"
    );


// ========================================
// DISPLAY PROPERTIES
// ========================================

function displayProperties(filterType = "ALL") {

    if (!renterPropertyList) {
        return;
    }

    const properties = getProperties();

    let availableProperties =
        properties.filter(
            property =>
                property.property_Status ===
                "AVAILABLE"
        );


    if (filterType !== "ALL") {

        availableProperties =
            availableProperties.filter(
                property =>
                    property.property_Type ===
                    filterType
            );
    }


    if (availableProperties.length === 0) {

        renterPropertyList.innerHTML = `

            <div class="empty-state">

                <h3>
                    No properties available
                </h3>

                <p>
                    There are currently no properties
                    matching your selection.
                </p>

            </div>
        `;

        return;
    }


    renterPropertyList.innerHTML = "";


    availableProperties.forEach(
        function (property) {

            const card =
                document.createElement("div");

            card.classList.add(
                "property-card"
            );


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
                        Monthly Rent:
                    </strong>

                    RM ${property.property_Rent}
                </p>

                <p>
                    ${property.property_Description}
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
}


// ========================================
// VIEW PROPERTY
// ========================================

function viewProperty(propertyID) {

    localStorage.setItem(
        "selectedRenterPropertyID",
        propertyID
    );

    window.location.href =
        "property-details.html";
}


// ========================================
// PROPERTY FILTER
// ========================================

if (propertyTypeFilter) {

    propertyTypeFilter.addEventListener(
        "change",
        function () {

            displayProperties(
                propertyTypeFilter.value
            );
        }
    );
}


// ========================================
// PROPERTY DETAILS PAGE
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


if (propertyName) {

    const selectedPropertyID =
        localStorage.getItem(
            "selectedRenterPropertyID"
        );

    const properties =
        getProperties();

    const selectedProperty =
        properties.find(
            property =>
                String(
                    property.property_ID
                ) ===
                String(
                    selectedPropertyID
                )
        );


    if (selectedProperty) {

        propertyName.textContent =
            selectedProperty.property_Name;

        propertyType.textContent =
            selectedProperty.property_Type;

        propertyRent.textContent =
            `RM ${selectedProperty.property_Rent} / month`;

        propertyDescription.textContent =
            selectedProperty.property_Description;
    }
}


// ========================================
// PREVENT PAST VIEWING DATES
// ========================================

if (renterViewDate) {

    const today =
        new Date().toLocaleDateString("en-CA");

    renterViewDate.min = today;
}


// ========================================
// DISPLAY AVAILABLE SLOTS
// ========================================

function displayAvailableSlots() {

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


    const selectedPropertyID =
        localStorage.getItem(
            "selectedRenterPropertyID"
        );


    const viewings =
        getViewings();


    const matchingSlots =
        viewings.filter(
            viewing =>

                String(
                    viewing.property_ID
                ) ===
                    String(
                        selectedPropertyID
                    )

                &&

                viewing.view_Date ===
                    selectedDate

                &&

                viewing.view_Status ===
                    "AVAILABLE"
        );


    if (matchingSlots.length === 0) {

        availableSlots.innerHTML = `
            <p>
                No viewing slots are
                available on this date.
            </p>
        `;

        return;
    }


    availableSlots.innerHTML = "";


    matchingSlots.forEach(
        function (viewing) {

            const button =
                document.createElement(
                    "button"
                );

            button.type = "button";

            button.textContent =
                `${viewing.view_Start_Time} - ${viewing.view_End_Time}`;


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

function selectViewing(viewID) {

    localStorage.setItem(
        "selectedViewingID",
        viewID
    );

    window.location.href =
        "booking-confirmation.html";
}


// ========================================
// INITIAL RENTER HOME LOAD
// ========================================

displayProperties();