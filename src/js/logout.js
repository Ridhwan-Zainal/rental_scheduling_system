// ========================================
// LOGOUT
// ========================================

const logoutButton =
    document.getElementById("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            sessionStorage.removeItem(
                "currentUser"
            );

            window.location.href =
                "login.html";
        }
    );
}