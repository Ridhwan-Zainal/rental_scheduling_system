// ========================================
// DISPLAY LOGGED-IN USER
// ========================================

const headerUserName =
    document.getElementById(
        "headerUserName"
    );


if (headerUserName) {

    const currentUser =
        JSON.parse(
            sessionStorage.getItem(
                "currentUser"
            )
        );


    if (currentUser) {

        headerUserName.textContent =
            currentUser.user_Name;

    } else {

        headerUserName.textContent =
            "User";
    }
}