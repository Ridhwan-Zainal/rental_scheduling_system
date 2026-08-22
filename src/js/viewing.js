// ========================================
// PAGE ELEMENTS
// ========================================

const availabilityForm =
    document.getElementById(
        "availabilityForm"
    );

const propertyNameDisplay =
    document.getElementById(
        "propertyNameDisplay"
    );

const viewDate =
    document.getElementById(
        "viewDate"
    );

const message =
    document.getElementById(
        "availabilityMessage"
    );


// ========================================
// SELECTED PROPERTY
// ========================================

const selectedPropertyID =
    sessionStorage.getItem(
        "selectedPropertyID"
    );


// ========================================
// LOAD PROPERTY NAME
// ========================================

async function loadPropertyName() {

    if (
        !propertyNameDisplay ||
        !selectedPropertyID
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/properties/${selectedPropertyID}`
            );


        const property =
            await response.json();


        if (!response.ok) {

            propertyNameDisplay.textContent =
                "Property unavailable.";

            return;
        }


        propertyNameDisplay.textContent =
            `Property: ${property.property_Name}`;

    } catch (error) {

        console.error(error);

        propertyNameDisplay.textContent =
            "Unable to load property.";
    }
}


// ========================================
// PREVENT PAST DATES
// ========================================

if (viewDate) {

    const today =
        new Date()
            .toLocaleDateString(
                "en-CA"
            );

    viewDate.min =
        today;
}


// ========================================
// CLEAR CHECKBOXES
// ========================================

function clearSlots() {

    const checkboxes =
        document.querySelectorAll(
            'input[name="slot"]'
        );


    checkboxes.forEach(
        function (checkbox) {

            checkbox.checked =
                false;
        }
    );
}


// ========================================
// LOAD SAVED AVAILABILITY
// ========================================

async function loadAvailability() {

    if (
        !viewDate ||
        !viewDate.value ||
        !selectedPropertyID
    ) {
        return;
    }


    clearSlots();


    try {

        const response =
            await fetch(
                `/api/viewings?property_ID=${selectedPropertyID}&view_Date=${viewDate.value}`
            );


        const viewings =
            await response.json();


        if (!response.ok) {

            message.textContent =
                viewings.message;

            return;
        }


        viewings.forEach(
            function (viewing) {

                const slotValue =
                    `${viewing.view_Start_Time.substring(0, 5)}-${viewing.view_End_Time.substring(0, 5)}`;


                const checkbox =
                    document.querySelector(
                        `input[name="slot"][value="${slotValue}"]`
                    );


                if (checkbox) {

                    checkbox.checked =
                        true;


                    // If slot is already booked,
                    // owner cannot remove it.
                    if (
                        viewing.view_Status ===
                        "BOOKED"
                    ) {

                        checkbox.disabled =
                            true;
                    }
                }
            }
        );

    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to load viewing availability.";
    }
}


// ========================================
// DATE CHANGE
// ========================================

if (viewDate) {

    viewDate.addEventListener(
        "change",
        function () {

            // Clear old message when changing date
            message.textContent = "";

            const checkboxes =
                document.querySelectorAll(
                    'input[name="slot"]'
                );


            checkboxes.forEach(
                function (checkbox) {

                    checkbox.disabled =
                        false;
                }
            );


            loadAvailability();
        }
    );
}


// ========================================
// SAVE AVAILABILITY
// ========================================

if (availabilityForm) {

    availabilityForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            if (!viewDate.value) {

                message.textContent =
                    "Please select a viewing date.";

                return;
            }


            const selectedSlots =
                document.querySelectorAll(
                    'input[name="slot"]:checked:not(:disabled)'
                );


            const slots =
                [];


            selectedSlots.forEach(
                function (slot) {

                    const [
                        startTime,
                        endTime
                    ] =
                        slot.value.split(
                            "-"
                        );


                    slots.push({
                        startTime,
                        endTime
                    });
                }
            );


            try {

                const response =
                    await fetch(
                        "/api/viewings",
                        {
                            method:
                                "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    property_ID:
                                        selectedPropertyID,

                                    view_Date:
                                        viewDate.value,

                                    slots:
                                        slots
                                })
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


                loadAvailability();

            } catch (error) {

                console.error(error);

                message.textContent =
                    "Unable to save viewing availability.";
            }
        }
    );
}


// ========================================
// INITIAL LOAD
// ========================================

loadPropertyName();