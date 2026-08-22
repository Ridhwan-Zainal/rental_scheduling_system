// ========================================
// STATE / CITY DATA
// ========================================

const citiesByState = {

    "Selangor": [
        "Shah Alam",
        "Puchong",
        "Petaling Jaya",
        "Subang Jaya"
    ],

    "Kuala Lumpur": [
        "Kuala Lumpur"
    ]
};


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
// POPULATE CITY DROPDOWN
// ========================================

function populateCities(
    stateElement,
    cityElement,
    selectedCity = ""
) {

    const selectedState =
        stateElement.value;


    cityElement.innerHTML = `
        <option value="">
            Select city
        </option>
    `;


    if (
        !selectedState ||
        !citiesByState[selectedState]
    ) {

        cityElement.disabled =
            true;

        return;
    }


    citiesByState[
        selectedState
    ].forEach(
        function (city) {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                city;

            option.textContent =
                city;


            if (
                city ===
                selectedCity
            ) {

                option.selected =
                    true;
            }


            cityElement.appendChild(
                option
            );
        }
    );


    cityElement.disabled =
        false;
}


// ========================================
// ADD PROPERTY STATE / CITY
// ========================================

const propertyState =
    document.getElementById(
        "propertyState"
    );

const propertyCity =
    document.getElementById(
        "propertyCity"
    );


if (
    propertyState &&
    propertyCity
) {

    propertyState.addEventListener(
        "change",
        function () {

            populateCities(
                propertyState,
                propertyCity
            );
        }
    );
}

// ========================================
// ADD PROPERTY
// ========================================

const propertyForm =
    document.getElementById(
        "propertyForm"
    );


if (propertyForm) {

    propertyForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const currentUser =
                getCurrentUser();


            const message =
                document.getElementById(
                    "propertyMessage"
                );


            if (!currentUser) {

                message.textContent =
                    "You must be logged in.";

                return;
            }


            if (
                currentUser.user_Role !==
                "OWNER"
            ) {

                message.textContent =
                    "Only owners can add properties.";

                return;
            }


            // ========================================
            // FORM VALUES
            // ========================================

            const propertyName =
                document
                    .getElementById(
                        "propertyName"
                    )
                    .value
                    .trim();


            const propertyType =
                document
                    .getElementById(
                        "propertyType"
                    )
                    .value;


            const state =
                document
                    .getElementById(
                        "propertyState"
                    )
                    .value;


            const city =
                document
                    .getElementById(
                        "propertyCity"
                    )
                    .value;


            const unit =
                document
                    .getElementById(
                        "propertyUnit"
                    )
                    .value
                    .trim();


            const googleMapsURL =
                document
                    .getElementById(
                        "propertyMap"
                    )
                    .value
                    .trim();


            const imageInput =
                document.getElementById(
                    "propertyImage"
                );


            const description =
                document
                    .getElementById(
                        "propertyDescription"
                    )
                    .value
                    .trim();


            const rent =
                document
                    .getElementById(
                        "propertyRent"
                    )
                    .value;


            // ========================================
            // VALIDATION
            // ========================================

            if (
                !propertyName ||
                !propertyType ||
                !state ||
                !city ||
                !unit ||
                !googleMapsURL ||
                !rent
            ) {

                message.textContent =
                    "Please complete all required fields.";

                return;
            }


            // ========================================
            // BUILD FORM DATA
            // ========================================

            const formData =
                new FormData();


            formData.append(
                "user_ID",
                currentUser.user_ID
            );


            formData.append(
                "property_Name",
                propertyName
            );


            formData.append(
                "property_Type",
                propertyType
            );


            formData.append(
                "property_State",
                state
            );


            formData.append(
                "property_City",
                city
            );


            formData.append(
                "property_Unit",
                unit
            );


            formData.append(
                "property_GMap_URL",
                googleMapsURL
            );


            formData.append(
                "property_Description",
                description
            );


            formData.append(
                "property_Rent",
                rent
            );


            if (
                imageInput &&
                imageInput.files.length > 0
            ) {

                formData.append(
                    "propertyImage",
                    imageInput.files[0]
                );
            }


            // ========================================
            // SEND PROPERTY
            // ========================================

            try {

                const response =
                    await fetch(
                        "/api/properties",
                        {
                            method:
                                "POST",

                            body:
                                formData
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    message.textContent =
                        data.message;

                    return;
                }


                message.textContent =
                    data.message;


                setTimeout(
                    function () {

                        window.location.href =
                            "owner-dashboard.html";
                    },

                    500
                );

            } catch (error) {

                console.error(
                    error
                );


                message.textContent =
                    "Unable to connect to the server.";
            }
        }
    );
}


// ========================================
// OWNER DASHBOARD
// ========================================

const propertyList =
    document.getElementById(
        "propertyList"
    );


async function displayOwnerProperties() {

    if (!propertyList) {
        return;
    }


    const currentUser =
        getCurrentUser();


    if (!currentUser) {

        propertyList.innerHTML = `
            <div class="empty-state">
                <h3>Not logged in</h3>
                <p>Please log in.</p>
            </div>
        `;

        return;
    }


    try {

        const response =
            await fetch(
                `/api/properties?user_ID=${currentUser.user_ID}`
            );


        const properties =
            await response.json();


        if (!response.ok) {

            propertyList.innerHTML = `
                <div class="empty-state">
                    <h3>
                        Unable to load properties
                    </h3>
                    <p>
                        ${properties.message}
                    </p>
                </div>
            `;

            return;
        }


        if (
            properties.length === 0
        ) {

            propertyList.innerHTML = `
                <div class="empty-state">

                    <h3>
                        No properties yet
                    </h3>

                    <p>
                        Add your first property
                        to start managing
                        viewing schedules.
                    </p>

                </div>
            `;

            return;
        }


        propertyList.innerHTML = "";


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
                        <strong>Type:</strong>
                        ${property.property_Type}
                    </p>

                    <p>
                        <strong>Location:</strong>
                        ${property.property_City},
                        ${property.property_State}
                    </p>

                    <p>
                        <strong>Rent:</strong>
                        RM ${property.property_Rent}
                        / month
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${property.property_Status}
                    </p>

                    <div class="property-actions">

                        <button
                            type="button"
                            onclick="editProperty(
                                '${property.property_ID}'
                            )"
                        >
                            Edit Property
                        </button>

                        <button
                            type="button"
                            onclick="manageAvailability(
                                '${property.property_ID}'
                            )"
                        >
                            Manage Availability
                        </button>

                    </div>
                `;


                propertyList.appendChild(
                    card
                );
            }
        );

    } catch (error) {

        console.error(error);

        propertyList.innerHTML = `
            <div class="empty-state">
                <h3>
                    Unable to load properties
                </h3>
            </div>
        `;
    }
}


// ========================================
// EDIT PROPERTY NAVIGATION
// ========================================

function editProperty(
    propertyID
) {

    sessionStorage.setItem(
        "selectedPropertyID",
        propertyID
    );


    window.location.href =
        "edit-property.html";
}


// ========================================
// MANAGE AVAILABILITY NAVIGATION
// ========================================

function manageAvailability(
    propertyID
) {

    sessionStorage.setItem(
        "selectedPropertyID",
        propertyID
    );


    window.location.href =
        "manage-availability.html";
}


// ========================================
// EDIT PROPERTY FORM
// ========================================

const editPropertyForm =
    document.getElementById(
        "editPropertyForm"
    );


const editPropertyState =
    document.getElementById(
        "editPropertyState"
    );


const editPropertyCity =
    document.getElementById(
        "editPropertyCity"
    );


if (
    editPropertyState &&
    editPropertyCity
) {

    editPropertyState.addEventListener(
        "change",
        function () {

            populateCities(
                editPropertyState,
                editPropertyCity
            );
        }
    );
}


// ========================================
// LOAD PROPERTY FOR EDIT
// ========================================

async function loadPropertyForEdit() {

    if (!editPropertyForm) {
        return;
    }


    const propertyID =
        sessionStorage.getItem(
            "selectedPropertyID"
        );


    const message =
        document.getElementById(
            "editPropertyMessage"
        );


    if (!propertyID) {

        message.textContent =
            "No property selected.";

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

            message.textContent =
                property.message;

            return;
        }


        document.getElementById(
            "editPropertyName"
        ).value =
            property.property_Name;


        document.getElementById(
            "editPropertyType"
        ).value =
            property.property_Type;


        document.getElementById(
            "editPropertyState"
        ).value =
            property.property_State;


        populateCities(
            editPropertyState,
            editPropertyCity,
            property.property_City
        );


        document.getElementById(
            "editPropertyUnit"
        ).value =
            property.property_Unit;


        document.getElementById(
            "editPropertyMap"
        ).value =
            property.property_GMap_URL;


        const currentPropertyImage =
             document.getElementById(
        "currentPropertyImage"
         );


            if (property.property_Image_URL) {

                currentPropertyImage.innerHTML = `
                <img
                     src="${property.property_Image_URL}"
                     alt="${property.property_Name}"
                    class="edit-property-image"
                >
                `;

            } else {

                 currentPropertyImage.innerHTML = `
                 <p>
                      No property image currently uploaded.
                </p>
                `;
            }


        document.getElementById(
            "editPropertyDescription"
        ).value =
            property.property_Description || "";


        document.getElementById(
            "editPropertyRent"
        ).value =
            property.property_Rent;

    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to load property.";
    }
}


// ========================================
// SAVE EDITED PROPERTY
// ========================================

if (editPropertyForm) {

    editPropertyForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const currentUser =
                getCurrentUser();


            const propertyID =
                sessionStorage.getItem(
                    "selectedPropertyID"
                );


            const message =
                document.getElementById(
                    "editPropertyMessage"
                );


            if (
                !currentUser ||
                currentUser.user_Role !==
                "OWNER"
            ) {

                message.textContent =
                    "Access denied.";

                return;
            }


            // ========================================
            // FORM VALUES
            // ========================================

            const propertyName =
                document
                    .getElementById(
                        "editPropertyName"
                    )
                    .value
                    .trim();


            const propertyType =
                document
                    .getElementById(
                        "editPropertyType"
                    )
                    .value;


            const propertyState =
                document
                    .getElementById(
                        "editPropertyState"
                    )
                    .value;


            const propertyCity =
                document
                    .getElementById(
                        "editPropertyCity"
                    )
                    .value;


            const propertyUnit =
                document
                    .getElementById(
                        "editPropertyUnit"
                    )
                    .value
                    .trim();


            const propertyMap =
                document
                    .getElementById(
                        "editPropertyMap"
                    )
                    .value
                    .trim();


            const propertyDescription =
                document
                    .getElementById(
                        "editPropertyDescription"
                    )
                    .value
                    .trim();


            const propertyRent =
                document
                    .getElementById(
                        "editPropertyRent"
                    )
                    .value;


            const imageInput =
                document.getElementById(
                    "editPropertyImage"
                );


            // ========================================
            // VALIDATION
            // ========================================

            if (
                !propertyName ||
                !propertyType ||
                !propertyState ||
                !propertyCity ||
                !propertyUnit ||
                !propertyMap ||
                !propertyRent
            ) {

                message.textContent =
                    "Please complete all required fields.";

                return;
            }


            // ========================================
            // BUILD FORM DATA
            // ========================================

            const formData =
                new FormData();


            formData.append(
                "user_ID",
                currentUser.user_ID
            );


            formData.append(
                "property_Name",
                propertyName
            );


            formData.append(
                "property_Type",
                propertyType
            );


            formData.append(
                "property_State",
                propertyState
            );


            formData.append(
                "property_City",
                propertyCity
            );


            formData.append(
                "property_Unit",
                propertyUnit
            );


            formData.append(
                "property_GMap_URL",
                propertyMap
            );


            formData.append(
                "property_Description",
                propertyDescription
            );


            formData.append(
                "property_Rent",
                propertyRent
            );


            // Only send an image if the owner
            // actually selected a replacement.
            if (
                imageInput &&
                imageInput.files.length > 0
            ) {

                formData.append(
                    "propertyImage",
                    imageInput.files[0]
                );
            }


            // ========================================
            // UPDATE PROPERTY
            // ========================================

            try {

                const response =
                    await fetch(
                        `/api/properties/${propertyID}`,
                        {
                            method:
                                "PUT",

                            body:
                                formData
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    message.textContent =
                        data.message;

                    return;
                }


                message.textContent =
                    data.message;


                setTimeout(
                    function () {

                        window.location.href =
                            "owner-dashboard.html";
                    },

                    500
                );

            } catch (error) {

                console.error(error);


                message.textContent =
                    "Unable to update property.";
            }
        }
    );
}

// ========================================
// INITIAL LOADS
// ========================================

displayOwnerProperties();

loadPropertyForEdit();