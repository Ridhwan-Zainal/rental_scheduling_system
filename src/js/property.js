// ========================================
// GET SAVED PROPERTIES
// ========================================

function getProperties() {
    return JSON.parse(
        localStorage.getItem("properties")
    ) || [];
}


// ========================================
// SAVE PROPERTIES
// ========================================

function saveProperties(properties) {
    localStorage.setItem(
        "properties",
        JSON.stringify(properties)
    );
}


// ========================================
// ADD PROPERTY
// ========================================

const propertyForm =
    document.getElementById("propertyForm");

if (propertyForm) {

    propertyForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const property = {

                property_ID: Date.now(),

                property_Name:
                    document
                        .getElementById("propertyName")
                        .value
                        .trim(),

                property_Type:
                    document
                        .getElementById("propertyType")
                        .value,

                property_Unit:
                    document
                        .getElementById("propertyUnit")
                        .value
                        .trim(),

                property_GMap_URL:
                    document
                        .getElementById("propertyMap")
                        .value
                        .trim(),

                property_Description:
                    document
                        .getElementById("propertyDescription")
                        .value
                        .trim(),

                property_Rent:
                    document
                        .getElementById("propertyRent")
                        .value,

                property_Status:
                    "AVAILABLE"
            };

            const properties = getProperties();

            properties.push(property);

            saveProperties(properties);

            window.location.href =
                "owner-dashboard.html";
        }
    );
}


// ========================================
// DISPLAY OWNER PROPERTIES
// ========================================

const propertyList =
    document.getElementById("propertyList");

if (propertyList) {

    const properties = getProperties();

    if (properties.length === 0) {

        propertyList.innerHTML = `
            <div class="empty-state">

                <h3>No properties yet</h3>

                <p>
                    Add your first property to start
                    managing viewing schedules.
                </p>

            </div>
        `;

    } else {

        propertyList.innerHTML = "";

        properties.forEach(function (property) {

            const card =
                document.createElement("div");

            card.classList.add("property-card");

            card.innerHTML = `

                <h3>
                    ${property.property_Name}
                </h3>

                <p>
                    <strong>Type:</strong>
                    ${property.property_Type}
                </p>

                <p>
                    <strong>Rent:</strong>
                    RM ${property.property_Rent} / month
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

            propertyList.appendChild(card);
        });
    }
}


// ========================================
// EDIT PROPERTY NAVIGATION
// ========================================

function editProperty(propertyID) {

    localStorage.setItem(
        "selectedPropertyID",
        propertyID
    );

    window.location.href =
        "edit-property.html";
}


// ========================================
// MANAGE AVAILABILITY NAVIGATION
// ========================================

function manageAvailability(propertyID) {

    localStorage.setItem(
        "selectedPropertyID",
        propertyID
    );

    window.location.href =
        "manage-availability.html";
}


// ========================================
// LOAD PROPERTY INTO EDIT FORM
// ========================================

const editPropertyForm =
    document.getElementById("editPropertyForm");

if (editPropertyForm) {

    const selectedPropertyID =
        localStorage.getItem(
            "selectedPropertyID"
        );

    const properties =
        getProperties();

    const property =
        properties.find(
            property =>
                String(property.property_ID) ===
                String(selectedPropertyID)
        );


    // ========================================
    // DISPLAY EXISTING VALUES
    // ========================================

    if (property) {

        document.getElementById(
            "editPropertyName"
        ).value =
            property.property_Name;

        document.getElementById(
            "editPropertyType"
        ).value =
            property.property_Type;

        document.getElementById(
            "editPropertyUnit"
        ).value =
            property.property_Unit;

        document.getElementById(
            "editPropertyMap"
        ).value =
            property.property_GMap_URL;

        document.getElementById(
            "editPropertyDescription"
        ).value =
            property.property_Description;

        document.getElementById(
            "editPropertyRent"
        ).value =
            property.property_Rent;
    }


    // ========================================
    // SAVE EDITED PROPERTY
    // ========================================

    editPropertyForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const propertyIndex =
                properties.findIndex(
                    property =>
                        String(
                            property.property_ID
                        ) ===
                        String(selectedPropertyID)
                );

            if (propertyIndex === -1) {
                return;
            }

            properties[propertyIndex].property_Name =
                document
                    .getElementById(
                        "editPropertyName"
                    )
                    .value
                    .trim();

            properties[propertyIndex].property_Type =
                document
                    .getElementById(
                        "editPropertyType"
                    )
                    .value;

            properties[propertyIndex].property_Unit =
                document
                    .getElementById(
                        "editPropertyUnit"
                    )
                    .value
                    .trim();

            properties[propertyIndex].property_GMap_URL =
                document
                    .getElementById(
                        "editPropertyMap"
                    )
                    .value
                    .trim();

            properties[propertyIndex].property_Description =
                document
                    .getElementById(
                        "editPropertyDescription"
                    )
                    .value
                    .trim();

            properties[propertyIndex].property_Rent =
                document
                    .getElementById(
                        "editPropertyRent"
                    )
                    .value;

            saveProperties(properties);

            window.location.href =
                "owner-dashboard.html";
        }
    );
}