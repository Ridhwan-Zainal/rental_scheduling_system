const mysql = require("mysql2");

const db = mysql.createConnection({

    host: "localhost",

    user: "root",

    password: "",

    database: "rental_scheduling_system",

    // Keep SQL DATE / DATETIME values as strings
    // instead of automatically converting them
    // into JavaScript Date objects.
    dateStrings: true
});


db.connect(
    function (error) {

        if (error) {

            console.error(
                "Database connection failed:",
                error.message
            );

            return;
        }


        console.log(
            "Connected to Rental Scheduling System database."
        );
    }
);


module.exports = db;