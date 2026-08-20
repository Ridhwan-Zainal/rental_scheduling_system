// ========================================
// GET PAGE ELEMENTS
// ========================================

const availabilityForm =
    document.getElementById("availabilityForm");

const propertyNameDisplay =
    document.getElementById("propertyNameDisplay");

const viewDate =
    document.getElementById("viewDate");

const message =
    document.getElementById("availabilityMessage");


// ========================================
// GET SELECTED PROPERTY
// ========================================

const selectedPropertyID =
    localStorage.getItem("selectedPropertyID");

const properties =
    JSON.parse(localStorage.getItem("properties")) || [];

const selectedProperty = properties.find(
    property =>
        String(property.property_ID) ===
        String(selectedPropertyID)
);


// ========================================
// DISPLAY PROPERTY NAME
// ========================================

if (propertyNameDisplay && selectedProperty) {

    propertyNameDisplay.textContent =
        `Property: ${selectedProperty.property_Name}`;
}


// ========================================
// LOAD SAVED AVAILABILITY
// ========================================

function loadAvailability() {

    if (!viewDate.value) {
        return;
    }


    // Clear all checkboxes first

    const checkboxes =
        document.querySelectorAll(
            'input[name="slot"]'
        );

    checkboxes.forEach(
        function (checkbox) {

            checkbox.checked = false;
        }
    );


    // Get saved viewing records

    const viewings =
        JSON.parse(
            localStorage.getItem("viewings")
        ) || [];


    // Find slots for this property and date

    const savedSlots =
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
                    viewDate.value
        );


    // Check matching boxes

    savedSlots.forEach(
        function (viewing) {

            const slotValue =
                `${viewing.view_Start_Time}-${viewing.view_End_Time}`;

            const checkbox =
                document.querySelector(
                    `input[name="slot"][value="${slotValue}"]`
                );

            if (checkbox) {
                checkbox.checked = true;
            }
        }
    );


    message.textContent = "";
}


// ========================================
// PREVENT PAST VIEWING DATES
// ========================================

if (viewDate) {

    const today =
        new Date().toLocaleDateString("en-CA");

    viewDate.min = today;


    viewDate.addEventListener(
        "change",
        loadAvailability
    );
}


// ========================================
// SAVE / UPDATE AVAILABILITY
// ========================================

if (availabilityForm) {

    availabilityForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const selectedDate =
                viewDate.value;


            const selectedSlots =
                document.querySelectorAll(
                    'input[name="slot"]:checked'
                );


            if (!selectedDate) {

                message.textContent =
                    "Please select a viewing date.";

                return;
            }


            if (selectedSlots.length === 0) {

                message.textContent =
                    "Please select at least one viewing slot.";

                return;
            }


            let viewings =
                JSON.parse(
                    localStorage.getItem("viewings")
                ) || [];


            // ========================================
            // REMOVE OLD AVAILABILITY FOR THIS DATE
            // ========================================

            viewings =
                viewings.filter(
                    viewing =>
                        !(
                            String(
                                viewing.property_ID
                            ) ===
                                String(
                                    selectedPropertyID
                                )

                            &&

                            viewing.view_Date ===
                                selectedDate
                        )
                );


            // ========================================
            // CREATE UPDATED AVAILABILITY
            // ========================================

            selectedSlots.forEach(
                function (slot) {

                    const [
                        startTime,
                        endTime
                    ] =
                        slot.value.split("-");


                    const viewing = {

                        view_ID:
                            Date.now() +
                            Math.random(),

                        property_ID:
                            selectedPropertyID,

                        view_Date:
                            selectedDate,

                        view_Start_Time:
                            startTime,

                        view_End_Time:
                            endTime,

                        view_Status:
                            "AVAILABLE"
                    };


                    viewings.push(
                        viewing
                    );
                }
            );


            // ========================================
            // SAVE
            // ========================================

            localStorage.setItem(
                "viewings",
                JSON.stringify(viewings)
            );


            message.textContent =
                "Viewing availability updated successfully.";
        }
    );
}