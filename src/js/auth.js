const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");


// ========================================
// LOGIN
// ========================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("loginPassword")
                    .value;

            const message =
                document
                    .getElementById("loginMessage");


            // ========================================
            // FRONTEND VALIDATION
            // ========================================

            if (
                email === "" ||
                password === ""
            ) {

                message.textContent =
                    "Please enter your email and password.";

                return;
            }


            // ========================================
            // SEND LOGIN TO BACKEND
            // ========================================

            try {

                const response =
                    await fetch(
                        "/api/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    email,
                                    password
                                })
                        }
                    );


                const data =
                    await response.json();


                // ========================================
                // LOGIN FAILED
                // ========================================

                if (!response.ok) {

                    message.textContent =
                        data.message;

                    return;
                }


                // ========================================
                // LOGIN SUCCESS
                // ========================================

                message.textContent =
                    data.message;


                // Temporary user storage
                sessionStorage.setItem(
                    "currentUser",
                    JSON.stringify(
                        data.user
                    )
                );

                sessionStorage.removeItem(
                    "upcomingBookingPopupShown"
                );


                // ========================================
                // ROLE REDIRECT
                // ========================================

                if (
                    data.user.user_Role ===
                    "OWNER"
                ) {

                    window.location.href =
                        "owner-dashboard.html";

                } else if (
                    data.user.user_Role ===
                    "RENTER"
                ) {

                    window.location.href =
                        "renter-home.html";
                }
            }

            catch (error) {

                console.error(error);

                message.textContent =
                    "Unable to connect to the server.";
            }
        }
    );
}

// ========================================
// REGISTER
// ========================================

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("registerName")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("registerEmail")
                    .value
                    .trim();

            const password =
                document
                    .getElementById("registerPassword")
                    .value;

            const confirmPassword =
                document
                    .getElementById("confirmPassword")
                    .value;

            const role =
                document
                    .getElementById("registerRole")
                    .value;

            const message =
                document
                    .getElementById("registerMessage");


            // ========================================
            // FRONTEND VALIDATION
            // ========================================

            if (
                name === "" ||
                email === "" ||
                password === "" ||
                confirmPassword === "" ||
                role === ""
            ) {

                message.textContent =
                    "Please complete all fields.";

                return;
            }


            if (
                password !==
                confirmPassword
            ) {

                message.textContent =
                    "Passwords do not match.";

                return;
            }


            // ========================================
            // SEND TO BACKEND
            // ========================================

            try {

                const response =
                    await fetch(
                        "/api/register",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({
                                    name,
                                    email,
                                    password,
                                    role
                                })
                        }
                    );


                const data =
                    await response.json();


                // ========================================
                // BACKEND ERROR
                // ========================================

                if (!response.ok) {

                    message.textContent =
                        data.message;

                    return;
                }


                // ========================================
                // SUCCESS
                // ========================================

                message.textContent =
                    data.message;


                registerForm.reset();

            } catch (error) {

                console.error(error);

                message.textContent =
                    "Unable to connect to the server.";
            }
        }
    );
}