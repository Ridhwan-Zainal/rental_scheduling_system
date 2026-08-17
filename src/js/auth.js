const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

// LOGIN
if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;
        const message = document.getElementById("loginMessage");

        if (email === "" || password === "") {
            message.textContent = "Please enter your email and password.";
            return;
        }

        // Temporary until database authentication is implemented
        message.textContent = "Login form submitted successfully.";
    });
}

// REGISTER
if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail").value.trim();
        const password = document.getElementById("registerPassword").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;
        const role = document.getElementById("registerRole").value;
        const message = document.getElementById("registerMessage");

        if (
            name === "" ||
            email === "" ||
            password === "" ||
            confirmPassword === "" ||
            role === ""
        ) {
            message.textContent = "Please complete all fields.";
            return;
        }

        if (password !== confirmPassword) {
            message.textContent = "Passwords do not match.";
            return;
        }

        // Temporary until database registration is implemented
        message.textContent = "Registration form submitted successfully.";
    });
}