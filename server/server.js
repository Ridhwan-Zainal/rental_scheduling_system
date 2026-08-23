const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const path = require("path");

const db = require("./db");

const app = express();
const PORT = 3000;


// ========================================
// MIDDLEWARE
// ========================================

app.use(express.json());


// ========================================
// SERVE FRONTEND
// ========================================

app.use(
    express.static(
        path.join(
            __dirname,
            "../src"
        )
    )
);


// ========================================
// LOGIN PAGE
// ========================================

app.get("/", function (req, res) {

    res.sendFile(
        path.join(
            __dirname,
            "../src/login.html"
        )
    );
});


// ========================================
// TEST USERS ROUTE
// ========================================

app.get("/api/users", function (req, res) {

    const sql =
        "SELECT * FROM USERS";

    db.query(
        sql,
        function (error, results) {

            if (error) {

                console.error(error);

                return res
                    .status(500)
                    .json({
                        message:
                            "Database query failed."
                    });
            }

            res.json(results);
        }
    );
});


// ========================================
// REGISTER USER
// ========================================

app.post(
    "/api/register",
    async function (req, res) {

        try {

            const {
                name,
                email,
                password,
                role
            } = req.body;


            if (
                !name ||
                !email ||
                !password ||
                !role
            ) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Please complete all fields."
                    });
            }


            if (
                role !== "OWNER" &&
                role !== "RENTER"
            ) {

                return res
                    .status(400)
                    .json({
                        message:
                            "Invalid user role."
                    });
            }


            const checkEmailSQL = `
                SELECT user_ID
                FROM USERS
                WHERE user_Email = ?
            `;


            db.query(
                checkEmailSQL,
                [email],

                async function (
                    error,
                    results
                ) {

                    if (error) {

                        console.error(error);

                        return res
                            .status(500)
                            .json({
                                message:
                                    "Database error."
                            });
                    }


                    if (
                        results.length > 0
                    ) {

                        return res
                            .status(409)
                            .json({
                                message:
                                    "Email is already registered."
                            });
                    }


                    const passwordHash =
                        await bcrypt.hash(
                            password,
                            10
                        );


                    const insertSQL = `
                        INSERT INTO USERS
                        (
                            user_Name,
                            user_Email,
                            user_Password_Hash,
                            user_Role,
                            user_Status
                        )
                        VALUES (?, ?, ?, ?, ?)
                    `;


                    db.query(
                        insertSQL,

                        [
                            name,
                            email,
                            passwordHash,
                            role,
                            "ACTIVE"
                        ],

                        function (
                            error,
                            result
                        ) {

                            if (error) {

                                console.error(error);

                                return res
                                    .status(500)
                                    .json({
                                        message:
                                            "Registration failed."
                                    });
                            }


                            res
                                .status(201)
                                .json({
                                    message:
                                        "Registration successful.",

                                    user_ID:
                                        result.insertId
                                });
                        }
                    );
                }
            );

        } catch (error) {

            console.error(error);

            res
                .status(500)
                .json({
                    message:
                        "Server error."
                });
        }
    }
);


// ========================================
// LOGIN USER
// ========================================

app.post(
    "/api/login",
    function (req, res) {

        const {
            email,
            password
        } = req.body;


        if (
            !email ||
            !password
        ) {

            return res
                .status(400)
                .json({
                    message:
                        "Please enter your email and password."
                });
        }


        const sql = `
            SELECT *
            FROM USERS
            WHERE user_Email = ?
        `;


        db.query(
            sql,
            [email],

            async function (
                error,
                results
            ) {

                if (error) {

                    console.error(error);

                    return res
                        .status(500)
                        .json({
                            message:
                                "Database error."
                        });
                }


                if (
                    results.length === 0
                ) {

                    return res
                        .status(401)
                        .json({
                            message:
                                "Invalid email or password."
                        });
                }


                const user =
                    results[0];


                if (
                    user.user_Status !==
                    "ACTIVE"
                ) {

                    return res
                        .status(403)
                        .json({
                            message:
                                "This account is inactive."
                        });
                }


                const passwordMatches =
                    await bcrypt.compare(
                        password,
                        user.user_Password_Hash
                    );


                if (!passwordMatches) {

                    return res
                        .status(401)
                        .json({
                            message:
                                "Invalid email or password."
                        });
                }


                res.json({

                    message:
                        "Login successful.",

                    user: {

                        user_ID:
                            user.user_ID,

                        user_Name:
                            user.user_Name,

                        user_Email:
                            user.user_Email,

                        user_Role:
                            user.user_Role
                    }
                });
            }
        );
    }
);

// ========================================
// PROPERTY IMAGE UPLOAD
// ========================================

const uploadStorage = multer.diskStorage({

    destination: function (
        req,
        file,
        callback
    ) {

        callback(
            null,
            path.join(
                __dirname,
                "../src/uploads"
            )
        );
    },


    filename: function (
        req,
        file,
        callback
    ) {

        const uniqueName =
            Date.now() +
            "-" +
            Math.round(
                Math.random() *
                1E9
            );


        const extension =
            path.extname(
                file.originalname
            );


        callback(
            null,
            uniqueName +
            extension
        );
    }
});


const upload =
    multer({
        storage:
            uploadStorage
    });


// ========================================
// ADD PROPERTY
// ========================================

app.post(
    "/api/properties",

    upload.single(
        "propertyImage"
    ),

    function (
        req,
        res
    ) {

        const {
            user_ID,
            property_Name,
            property_Type,
            property_State,
            property_City,
            property_Unit,
            property_GMap_URL,
            property_Description,
            property_Rent
        } = req.body;


        // ========================================
        // VALIDATION
        // ========================================

        if (
            !user_ID ||
            !property_Name ||
            !property_Type ||
            !property_State ||
            !property_City ||
            !property_Unit ||
            !property_GMap_URL ||
            !property_Rent
        ) {

            return res
                .status(400)
                .json({
                    message:
                        "Please complete all required property fields."
                });
        }


        // ========================================
        // IMAGE PATH
        // ========================================

        let propertyImageURL =
            null;


        if (req.file) {

            propertyImageURL =
                `/uploads/${req.file.filename}`;
        }


        // ========================================
        // VERIFY OWNER
        // ========================================

        const userSQL = `
            SELECT
                user_ID,
                user_Role,
                user_Status

            FROM USERS

            WHERE user_ID = ?
        `;


        db.query(
            userSQL,
            [user_ID],

            function (
                error,
                results
            ) {

                if (error) {

                    console.error(
                        error
                    );

                    return res
                        .status(500)
                        .json({
                            message:
                                "Database error."
                        });
                }


                if (
                    results.length === 0
                ) {

                    return res
                        .status(404)
                        .json({
                            message:
                                "User not found."
                        });
                }


                const user =
                    results[0];


                if (
                    user.user_Role !==
                    "OWNER"
                ) {

                    return res
                        .status(403)
                        .json({
                            message:
                                "Only owners can add properties."
                        });
                }


                if (
                    user.user_Status !==
                    "ACTIVE"
                ) {

                    return res
                        .status(403)
                        .json({
                            message:
                                "Owner account is inactive."
                        });
                }


                // ========================================
                // INSERT PROPERTY
                // ========================================

                const insertSQL = `
                    INSERT INTO PROPERTY
                    (
                        user_ID,
                        property_Name,
                        property_Type,
                        property_State,
                        property_City,
                        property_Unit,
                        property_GMap_URL,
                        property_Image_URL,
                        property_Description,
                        property_Rent,
                        property_Status
                    )

                    VALUES
                    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;


                db.query(
                    insertSQL,

                    [
                        user_ID,
                        property_Name,
                        property_Type,
                        property_State,
                        property_City,
                        property_Unit,
                        property_GMap_URL,
                        propertyImageURL,
                        property_Description,
                        property_Rent,
                        "AVAILABLE"
                    ],

                    function (
                        error,
                        result
                    ) {

                        if (error) {

                            console.error(
                                error
                            );

                            return res
                                .status(500)
                                .json({
                                    message:
                                        "Unable to add property."
                                });
                        }


                        res
                            .status(201)
                            .json({
                                message:
                                    "Property added successfully.",

                                property_ID:
                                    result.insertId,

                                property_Image_URL:
                                    propertyImageURL
                            });
                    }
                );
            }
        );
    }
);

// ========================================
// GET OWNER PROPERTIES
// ========================================

app.get(
    "/api/properties",
    function (req, res) {

        const user_ID =
            req.query.user_ID;


        if (!user_ID) {

            return res
                .status(400)
                .json({
                    message:
                        "Owner user ID is required."
                });
        }


        const sql = `
            SELECT *
            FROM PROPERTY
            WHERE user_ID = ?
            ORDER BY property_Created_At DESC
        `;


        db.query(
            sql,
            [user_ID],

            function (
                error,
                results
            ) {

                if (error) {

                    console.error(error);

                    return res
                        .status(500)
                        .json({
                            message:
                                "Unable to retrieve properties."
                        });
                }


                res.json(results);
            }
        );
    }
);


// ========================================
// GET ONE PROPERTY
// ========================================

app.get(
    "/api/properties/:id",
    function (req, res) {

        const property_ID =
            req.params.id;


        const sql = `
            SELECT *
            FROM PROPERTY
            WHERE property_ID = ?
        `;


        db.query(
            sql,
            [property_ID],

            function (
                error,
                results
            ) {

                if (error) {

                    console.error(error);

                    return res
                        .status(500)
                        .json({
                            message:
                                "Unable to retrieve property."
                        });
                }


                if (
                    results.length === 0
                ) {

                    return res
                        .status(404)
                        .json({
                            message:
                                "Property not found."
                        });
                }


                res.json(
                    results[0]
                );
            }
        );
    }
);

// ========================================
// UPDATE PROPERTY
// ========================================

app.put(
    "/api/properties/:id",

    upload.single(
        "propertyImage"
    ),

    function (req, res) {

        const property_ID =
            req.params.id;


        const {
            user_ID,
            property_Name,
            property_Type,
            property_State,
            property_City,
            property_Unit,
            property_GMap_URL,
            property_Description,
            property_Rent
        } = req.body;


        // ========================================
        // VALIDATION
        // ========================================

        if (
            !user_ID ||
            !property_Name ||
            !property_Type ||
            !property_State ||
            !property_City ||
            !property_Unit ||
            !property_GMap_URL ||
            !property_Rent
        ) {

            return res
                .status(400)
                .json({
                    message:
                        "Please complete all required property fields."
                });
        }


        // ========================================
        // VERIFY PROPERTY OWNERSHIP
        // ========================================

        const checkSQL = `
            SELECT
                property_ID,
                property_Image_URL

            FROM PROPERTY

            WHERE
                property_ID = ?
                AND user_ID = ?
        `;


        db.query(
            checkSQL,
            [
                property_ID,
                user_ID
            ],

            function (
                error,
                results
            ) {

                if (error) {

                    console.error(error);

                    return res
                        .status(500)
                        .json({
                            message:
                                "Unable to verify property."
                        });
                }


                if (
                    results.length === 0
                ) {

                    return res
                        .status(404)
                        .json({
                            message:
                                "Property not found or access denied."
                        });
                }


                // ========================================
                // KEEP OR REPLACE IMAGE
                // ========================================

                let propertyImageURL =
                    results[0]
                        .property_Image_URL;


                if (req.file) {

                    propertyImageURL =
                        `/uploads/${req.file.filename}`;
                }


                // ========================================
                // UPDATE PROPERTY
                // ========================================

                const updateSQL = `
                    UPDATE PROPERTY

                    SET
                        property_Name = ?,
                        property_Type = ?,
                        property_State = ?,
                        property_City = ?,
                        property_Unit = ?,
                        property_GMap_URL = ?,
                        property_Image_URL = ?,
                        property_Description = ?,
                        property_Rent = ?

                    WHERE
                        property_ID = ?
                        AND user_ID = ?
                `;


                db.query(
                    updateSQL,

                    [
                        property_Name,
                        property_Type,
                        property_State,
                        property_City,
                        property_Unit,
                        property_GMap_URL,
                        propertyImageURL,
                        property_Description,
                        property_Rent,
                        property_ID,
                        user_ID
                    ],

                    function (error) {

                        if (error) {

                            console.error(error);

                            return res
                                .status(500)
                                .json({
                                    message:
                                        "Unable to update property."
                                });
                        }


                        res.json({
                            message:
                                "Property updated successfully.",

                            property_Image_URL:
                                propertyImageURL
                        });
                    }
                );
            }
        );
    }
);

// ========================================
// GET VIEWING SLOTS
// ========================================

app.get(
    "/api/viewings",
    function (req, res) {

        const property_ID =
            req.query.property_ID;

        const view_Date =
            req.query.view_Date;


        if (
            !property_ID ||
            !view_Date
        ) {

            return res
                .status(400)
                .json({
                    message:
                        "Property ID and viewing date are required."
                });
        }


        const sql = `
            SELECT *
            FROM VIEWING
            WHERE
                property_ID = ?
                AND view_Date = ?
            ORDER BY view_Start_Time
        `;


        db.query(
            sql,
            [
                property_ID,
                view_Date
            ],

            function (
                error,
                results
            ) {

                if (error) {

                    console.error(error);

                    return res
                        .status(500)
                        .json({
                            message:
                                "Unable to retrieve viewing slots."
                        });
                }


                res.json(results);
            }
        );
    }
);


// ========================================
// SAVE / UPDATE VIEWING AVAILABILITY
// ========================================

app.post(
    "/api/viewings",
    function (req, res) {

        const {
            property_ID,
            view_Date,
            slots
        } = req.body;


        // ========================================
        // BASIC VALIDATION
        // ========================================

        if (
            !property_ID ||
            !view_Date ||
            !Array.isArray(slots)
        ) {

            return res
                .status(400)
                .json({
                    message:
                        "Invalid viewing availability data."
                });
        }


        // ========================================
        // GET PROPERTY OWNER
        // ========================================

        const propertySQL = `
            SELECT
                property_ID,
                user_ID
            FROM PROPERTY
            WHERE property_ID = ?
        `;


        db.query(
            propertySQL,
            [property_ID],

            function (
                error,
                propertyResults
            ) {

                if (error) {

                    console.error(error);

                    return res
                        .status(500)
                        .json({
                            message:
                                "Unable to verify property owner."
                        });
                }


                if (
                    propertyResults.length === 0
                ) {

                    return res
                        .status(404)
                        .json({
                            message:
                                "Property not found."
                        });
                }


                const owner_ID =
                    propertyResults[0].user_ID;


                // ========================================
                // CHECK OWNER SLOT CONFLICTS
                // ========================================

                const conflictSQL = `
                    SELECT
                        VIEWING.view_ID,
                        VIEWING.view_Start_Time,
                        VIEWING.view_End_Time,
                        PROPERTY.property_Name

                    FROM VIEWING

                    INNER JOIN PROPERTY
                        ON VIEWING.property_ID =
                           PROPERTY.property_ID

                    WHERE
                        PROPERTY.user_ID = ?

                        AND VIEWING.view_Date = ?

                        AND VIEWING.property_ID <> ?

                        AND VIEWING.view_Status IN (
                            'AVAILABLE',
                            'BOOKED'
                        )
                `;


                db.query(
                    conflictSQL,

                    [
                        owner_ID,
                        view_Date,
                        property_ID
                    ],

                    function (
                        error,
                        existingSlots
                    ) {

                        if (error) {

                            console.error(error);

                            return res
                                .status(500)
                                .json({
                                    message:
                                        "Unable to check viewing schedule conflicts."
                                });
                        }


                        // ========================================
                        // FIND SAME PREDEFINED SLOT
                        // ========================================

                        const conflictingSlot =
                            slots.find(
                                function (newSlot) {

                                    return existingSlots.some(
                                        function (
                                            existingSlot
                                        ) {

                                            const existingStart =
                                                existingSlot
                                                    .view_Start_Time
                                                    .substring(
                                                        0,
                                                        5
                                                    );


                                            const existingEnd =
                                                existingSlot
                                                    .view_End_Time
                                                    .substring(
                                                        0,
                                                        5
                                                    );


                                            return (
                                                existingStart ===
                                                    newSlot.startTime &&
                                                existingEnd ===
                                                    newSlot.endTime
                                            );
                                        }
                                    );
                                }
                            );


                        // ========================================
                        // OWNER HAS CONFLICT
                        // ========================================

                        if (conflictingSlot) {

                            return res
                                .status(409)
                                .json({
                                    message:
                                        "You already have another property viewing scheduled for this time slot."
                                });
                        }


                        // ========================================
                        // REMOVE OLD AVAILABLE SLOTS
                        // ========================================

                        const deleteSQL = `
                            DELETE FROM VIEWING
                            WHERE
                                property_ID = ?
                                AND view_Date = ?
                                AND view_Status = 'AVAILABLE'
                        `;


                        db.query(
                            deleteSQL,

                            [
                                property_ID,
                                view_Date
                            ],

                            function (error) {

                                if (error) {

                                    console.error(
                                        error
                                    );

                                    return res
                                        .status(500)
                                        .json({
                                            message:
                                                "Unable to update viewing availability."
                                        });
                                }


                                // ========================================
                                // NO SLOTS SELECTED
                                // ========================================

                                if (
                                    slots.length === 0
                                ) {

                                    return res.json({
                                        message:
                                            "Viewing availability updated successfully."
                                    });
                                }


                                // ========================================
                                // INSERT SELECTED SLOTS
                                // ========================================

                                const values =
                                    slots.map(
                                        function (slot) {

                                            return [
                                                property_ID,
                                                view_Date,
                                                slot.startTime,
                                                slot.endTime,
                                                "AVAILABLE"
                                            ];
                                        }
                                    );


                                const insertSQL = `
                                    INSERT INTO VIEWING
                                    (
                                        property_ID,
                                        view_Date,
                                        view_Start_Time,
                                        view_End_Time,
                                        view_Status
                                    )
                                    VALUES ?
                                `;


                                db.query(
                                    insertSQL,
                                    [values],

                                    function (error) {

                                        if (error) {

                                            console.error(
                                                error
                                            );

                                            return res
                                                .status(500)
                                                .json({
                                                    message:
                                                        "Unable to save viewing slots."
                                                });
                                        }


                                        res.json({
                                            message:
                                                "Viewing availability updated successfully."
                                        });
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    }
);

// ========================================
// CREATE BOOKING
// ========================================

app.post(
    "/api/bookings",
    function (req, res) {

        const {
            view_ID,
            user_ID
        } = req.body;


        // ========================================
        // BASIC VALIDATION
        // ========================================

        if (
            !view_ID ||
            !user_ID
        ) {

            return res
                .status(400)
                .json({
                    message:
                        "Viewing slot and renter are required."
                });
        }


        // ========================================
        // START TRANSACTION
        // ========================================

        db.beginTransaction(
            function (error) {

                if (error) {

                    console.error(error);

                    return res
                        .status(500)
                        .json({
                            message:
                                "Unable to start booking transaction."
                        });
                }


                // ========================================
                // CHECK RENTER
                // ========================================

                const renterSQL = `
                    SELECT
                        user_ID,
                        user_Role,
                        user_Status
                    FROM USERS
                    WHERE user_ID = ?
                `;


                db.query(
                    renterSQL,
                    [user_ID],

                    function (
                        error,
                        renterResults
                    ) {

                        if (error) {

                            return rollbackBooking(
                                res,
                                error,
                                "Unable to verify renter."
                            );
                        }


                        if (
                            renterResults.length === 0
                        ) {

                            return rollbackBooking(
                                res,
                                null,
                                "Renter not found.",
                                404
                            );
                        }


                        const renter =
                            renterResults[0];


                        if (
                            renter.user_Role !==
                            "RENTER"
                        ) {

                            return rollbackBooking(
                                res,
                                null,
                                "Only renters can create bookings.",
                                403
                            );
                        }


                        if (
                            renter.user_Status !==
                            "ACTIVE"
                        ) {

                            return rollbackBooking(
                                res,
                                null,
                                "Renter account is inactive.",
                                403
                            );
                        }


                        // ========================================
                        // CHECK SELECTED VIEWING SLOT
                        // ========================================

                        const viewingSQL = `
                            SELECT *
                            FROM VIEWING
                            WHERE view_ID = ?
                            FOR UPDATE
                        `;


                        db.query(
                            viewingSQL,
                            [view_ID],

                            function (
                                error,
                                viewingResults
                            ) {

                                if (error) {

                                    return rollbackBooking(
                                        res,
                                        error,
                                        "Unable to verify viewing slot."
                                    );
                                }


                                if (
                                    viewingResults.length ===
                                    0
                                ) {

                                    return rollbackBooking(
                                        res,
                                        null,
                                        "Viewing slot not found.",
                                        404
                                    );
                                }


                                const viewing =
                                    viewingResults[0];


                                if (
                                    viewing.view_Status !==
                                    "AVAILABLE"
                                ) {

                                    return rollbackBooking(
                                        res,
                                        null,
                                        "This viewing slot is no longer available.",
                                        409
                                    );
                                }


                                // ========================================
                                // CHECK RENTER SCHEDULE CONFLICT
                                // ========================================

                                const conflictSQL = `
                                    SELECT
                                        BOOKING.booking_ID

                                    FROM BOOKING

                                    INNER JOIN VIEWING
                                        ON BOOKING.view_ID =
                                           VIEWING.view_ID

                                    WHERE
                                        BOOKING.user_ID = ?

                                        AND BOOKING.booking_Status =
                                            'CONFIRMED'

                                        AND VIEWING.view_Date = ?

                                        AND VIEWING.view_Start_Time = ?

                                        AND VIEWING.view_End_Time = ?

                                    LIMIT 1
                                `;


                                db.query(
                                    conflictSQL,

                                    [
                                        user_ID,
                                        viewing.view_Date,
                                        viewing.view_Start_Time,
                                        viewing.view_End_Time
                                    ],

                                    function (
                                        error,
                                        conflictResults
                                    ) {

                                        if (error) {

                                            return rollbackBooking(
                                                res,
                                                error,
                                                "Unable to check renter schedule."
                                            );
                                        }


                                        // ========================================
                                        // RENTER HAS CONFLICT
                                        // ========================================

                                        if (
                                            conflictResults.length >
                                            0
                                        ) {

                                            return rollbackBooking(
                                                res,
                                                null,
                                                "You already have another viewing booked for this time slot.",
                                                409
                                            );
                                        }


                                        // ========================================
                                        // CREATE BOOKING
                                        // ========================================

                                        const bookingSQL = `
                                            INSERT INTO BOOKING
                                            (
                                                view_ID,
                                                user_ID,
                                                booking_Status
                                            )
                                            VALUES (?, ?, ?)
                                        `;


                                        db.query(
                                            bookingSQL,

                                            [
                                                view_ID,
                                                user_ID,
                                                "CONFIRMED"
                                            ],

                                            function (
                                                error,
                                                bookingResult
                                            ) {

                                                if (error) {

                                                    return rollbackBooking(
                                                        res,
                                                        error,
                                                        "Unable to create booking."
                                                    );
                                                }


                                                // ========================================
                                                // MARK SLOT BOOKED
                                                // ========================================

                                                const updateViewingSQL = `
                                                    UPDATE VIEWING
                                                    SET
                                                        view_Status =
                                                            'BOOKED'
                                                    WHERE
                                                        view_ID = ?
                                                        AND view_Status =
                                                            'AVAILABLE'
                                                `;


                                                db.query(
                                                    updateViewingSQL,
                                                    [view_ID],

                                                    function (
                                                        error,
                                                        updateResult
                                                    ) {

                                                        if (error) {

                                                            return rollbackBooking(
                                                                res,
                                                                error,
                                                                "Unable to update viewing slot."
                                                            );
                                                        }


                                                        if (
                                                            updateResult
                                                                .affectedRows !==
                                                            1
                                                        ) {

                                                            return rollbackBooking(
                                                                res,
                                                                null,
                                                                "Viewing slot could not be booked.",
                                                                409
                                                            );
                                                        }


                                                        // ========================================
                                                        // COMMIT TRANSACTION
                                                        // ========================================

                                                        db.commit(
                                                            function (
                                                                error
                                                            ) {

                                                                if (
                                                                    error
                                                                ) {

                                                                    return rollbackBooking(
                                                                        res,
                                                                        error,
                                                                        "Unable to complete booking."
                                                                    );
                                                                }


                                                                res
                                                                    .status(
                                                                        201
                                                                    )
                                                                    .json({

                                                                        message:
                                                                            "Booking confirmed successfully.",

                                                                        booking_ID:
                                                                            bookingResult.insertId
                                                                    });
                                                            }
                                                        );
                                                    }
                                                );
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    }
);


// ========================================
// BOOKING ROLLBACK HELPER
// ========================================

function rollbackBooking(
    res,
    error,
    message,
    status = 500
) {

    if (error) {
        console.error(error);
    }


    db.rollback(
        function () {

            return res
                .status(status)
                .json({
                    message:
                        message
                });
        }
    );
}

// ========================================
// GET AVAILABLE PROPERTIES FOR RENTERS
// ========================================

app.get(
    "/api/renter/properties",
    function (req, res) {

        const sql = `
            SELECT
                property_ID,
                property_Name,
                property_Type,
                property_State,
                property_City,
                property_Image_URL,
                property_Description,
                property_Rent,
                property_Status
            FROM PROPERTY
            WHERE property_Status = 'AVAILABLE'
            ORDER BY property_Created_At DESC
        `;


        db.query(
            sql,
            function (
                error,
                results
            ) {

                if (error) {

                    console.error(error);

                    return res
                        .status(500)
                        .json({
                            message:
                                "Unable to retrieve available properties."
                        });
                }


                res.json(results);
            }
        );
    }
);

// ========================================
// GET ONE VIEWING SLOT
// ========================================

app.get(
    "/api/viewings/:id",
    function (req, res) {

        const view_ID =
            req.params.id;


        const sql = `
            SELECT *
            FROM VIEWING
            WHERE view_ID = ?
        `;


        db.query(
            sql,
            [view_ID],

            function (
                error,
                results
            ) {

                if (error) {

                    console.error(error);


                    return res
                        .status(500)
                        .json({
                            message:
                                "Unable to retrieve viewing slot."
                        });
                }


                if (
                    results.length === 0
                ) {

                    return res
                        .status(404)
                        .json({
                            message:
                                "Viewing slot not found."
                        });
                }


                res.json(
                    results[0]
                );
            }
        );
    }
);

// ========================================
// GET RENTER BOOKINGS
// ========================================

app.get(
    "/api/renter/bookings",
    function (req, res) {

        const user_ID =
            req.query.user_ID;


        if (!user_ID) {

            return res
                .status(400)
                .json({
                    message:
                        "Renter user ID is required."
                });
        }


        const sql = `
            SELECT
                BOOKING.booking_ID,
                BOOKING.booking_Status,
                BOOKING.booking_Created_At,

                VIEWING.view_ID,
                VIEWING.view_Date,
                VIEWING.view_Start_Time,
                VIEWING.view_End_Time,

                PROPERTY.property_ID,
                PROPERTY.property_Name,
                PROPERTY.property_Type,
                PROPERTY.property_State,
                PROPERTY.property_City,
                PROPERTY.property_Unit,
                PROPERTY.property_GMap_URL,
                PROPERTY.property_Image_URL,
                PROPERTY.property_Rent

            FROM BOOKING

            INNER JOIN VIEWING
                ON BOOKING.view_ID = VIEWING.view_ID

            INNER JOIN PROPERTY
                ON VIEWING.property_ID = PROPERTY.property_ID

            WHERE BOOKING.user_ID = ?

            ORDER BY
                VIEWING.view_Date DESC,
                VIEWING.view_Start_Time DESC
        `;


        db.query(
            sql,
            [user_ID],

            function (
                error,
                results
            ) {

                if (error) {

                    console.error(error);

                    return res
                        .status(500)
                        .json({
                            message:
                                "Unable to retrieve bookings."
                        });
                }


                res.json(results);
            }
        );
    }
);


// ========================================
// CANCEL BOOKING
// ========================================

app.post(
    "/api/bookings/:id/cancel",
    function (req, res) {

        const booking_ID =
            req.params.id;

        const {
            user_ID
        } = req.body;


        // ========================================
        // BASIC VALIDATION
        // ========================================

        if (!user_ID) {

            return res
                .status(400)
                .json({
                    message:
                        "Renter user ID is required."
                });
        }


        // ========================================
        // START TRANSACTION
        // ========================================

        db.beginTransaction(
            function (error) {

                if (error) {

                    console.error(error);

                    return res
                        .status(500)
                        .json({
                            message:
                                "Unable to start cancellation."
                        });
                }


                // ========================================
                // GET BOOKING + VIEWING
                // ========================================

                const bookingSQL = `
                    SELECT
                        BOOKING.booking_ID,
                        BOOKING.booking_Status,
                        BOOKING.view_ID,

                        VIEWING.view_Date,
                        VIEWING.view_Start_Time

                    FROM BOOKING

                    INNER JOIN VIEWING
                        ON BOOKING.view_ID =
                           VIEWING.view_ID

                    WHERE
                        BOOKING.booking_ID = ?
                        AND BOOKING.user_ID = ?

                    FOR UPDATE
                `;


                db.query(
                    bookingSQL,
                    [
                        booking_ID,
                        user_ID
                    ],

                    function (
                        error,
                        results
                    ) {

                        if (error) {

                            return rollbackBooking(
                                res,
                                error,
                                "Unable to retrieve booking."
                            );
                        }


                        // ========================================
                        // BOOKING NOT FOUND
                        // ========================================

                        if (
                            results.length === 0
                        ) {

                            return rollbackBooking(
                                res,
                                null,
                                "Booking not found.",
                                404
                            );
                        }


                        const booking =
                            results[0];


                        // ========================================
                        // STATUS CHECK
                        // ========================================

                        if (
                            booking.booking_Status !==
                            "CONFIRMED"
                        ) {

                            return rollbackBooking(
                                res,
                                null,
                                "Only confirmed bookings can be cancelled.",
                                409
                            );
                        }


                        // ========================================
                        // 24-HOUR CANCELLATION RULE
                        // ========================================

                        const viewingDateTime =
                            new Date(
                                `${booking.view_Date}T${booking.view_Start_Time}`
                            );


                        const currentDateTime =
                            new Date();


                        const differenceMilliseconds =
                            viewingDateTime -
                            currentDateTime;


                        const differenceHours =
                            differenceMilliseconds /
                            (
                                1000 *
                                60 *
                                60
                            );


                        if (
                            differenceHours <= 24
                        ) {

                            return rollbackBooking(
                                res,
                                null,
                                "This booking cannot be cancelled because the viewing is less than 24 hours away.",
                                409
                            );
                        }


                        // ========================================
                        // UPDATE BOOKING STATUS
                        // ========================================

                        const cancelSQL = `
                            UPDATE BOOKING

                            SET booking_Status =
                                'CANCELLED'

                            WHERE booking_ID = ?
                        `;


                        db.query(
                            cancelSQL,
                            [booking_ID],

                            function (error) {

                                if (error) {

                                    return rollbackBooking(
                                        res,
                                        error,
                                        "Unable to cancel booking."
                                    );
                                }


                                // ========================================
                                // RELEASE VIEWING SLOT
                                // ========================================

                                const releaseSQL = `
                                    UPDATE VIEWING

                                    SET view_Status =
                                        'AVAILABLE'

                                    WHERE view_ID = ?
                                `;


                                db.query(
                                    releaseSQL,
                                    [booking.view_ID],

                                    function (error) {

                                        if (error) {

                                            return rollbackBooking(
                                                res,
                                                error,
                                                "Unable to release viewing slot."
                                            );
                                        }


                                        // ========================================
                                        // COMMIT TRANSACTION
                                        // ========================================

                                        db.commit(
                                            function (error) {

                                                if (error) {

                                                    return rollbackBooking(
                                                        res,
                                                        error,
                                                        "Unable to complete cancellation."
                                                    );
                                                }


                                                res.json({
                                                    message:
                                                        "Booking cancelled successfully."
                                                });
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );
    }
);

// ========================================
// GET OWNER BOOKINGS
// ========================================

app.get(
    "/api/owner/bookings",
    function (req, res) {

        const user_ID =
            req.query.user_ID;


        if (!user_ID) {

            return res
                .status(400)
                .json({
                    message:
                        "Owner user ID is required."
                });
        }


        const sql = `
            SELECT
                BOOKING.booking_ID,
                BOOKING.booking_Status,
                BOOKING.booking_Created_At,

                USERS.user_ID AS renter_ID,
                USERS.user_Name AS renter_Name,
                USERS.user_Email AS renter_Email,

                VIEWING.view_ID,
                VIEWING.view_Date,
                VIEWING.view_Start_Time,
                VIEWING.view_End_Time,

                PROPERTY.property_ID,
                PROPERTY.property_Name,
                PROPERTY.property_Unit,
                PROPERTY.property_City,
                PROPERTY.property_State,
                PROPERTY.property_Image_URL

            FROM BOOKING

            INNER JOIN USERS
                ON BOOKING.user_ID =
                   USERS.user_ID

            INNER JOIN VIEWING
                ON BOOKING.view_ID =
                   VIEWING.view_ID

            INNER JOIN PROPERTY
                ON VIEWING.property_ID =
                   PROPERTY.property_ID

            WHERE PROPERTY.user_ID = ?

            ORDER BY
                VIEWING.view_Date DESC,
                VIEWING.view_Start_Time DESC
        `;


        db.query(
            sql,
            [user_ID],

            function (
                error,
                results
            ) {

                if (error) {

                    console.error(error);

                    return res
                        .status(500)
                        .json({
                            message:
                                "Unable to retrieve owner bookings."
                        });
                }


                res.json(results);
            }
        );
    }
);


// ========================================
// UPDATE BOOKING STATUS
// ========================================

app.put(
    "/api/bookings/:id/status",
    function (req, res) {

        const booking_ID =
            req.params.id;

        const {
            user_ID,
            booking_Status
        } = req.body;


        if (
            !user_ID ||
            !booking_Status
        ) {

            return res
                .status(400)
                .json({
                    message:
                        "Owner user ID and booking status are required."
                });
        }


        const allowedStatuses = [
            "COMPLETED",
            "NO_SHOW"
        ];


        if (
            !allowedStatuses.includes(
                booking_Status
            )
        ) {

            return res
                .status(400)
                .json({
                    message:
                        "Invalid booking status."
                });
        }


        const checkSQL = `
            SELECT
                BOOKING.booking_ID,
                BOOKING.booking_Status

            FROM BOOKING

            INNER JOIN VIEWING
                ON BOOKING.view_ID =
                   VIEWING.view_ID

            INNER JOIN PROPERTY
                ON VIEWING.property_ID =
                   PROPERTY.property_ID

            WHERE
                BOOKING.booking_ID = ?
                AND PROPERTY.user_ID = ?
        `;


        db.query(
            checkSQL,
            [
                booking_ID,
                user_ID
            ],

            function (
                error,
                results
            ) {

                if (error) {

                    console.error(error);

                    return res
                        .status(500)
                        .json({
                            message:
                                "Unable to verify booking."
                        });
                }


                if (
                    results.length === 0
                ) {

                    return res
                        .status(404)
                        .json({
                            message:
                                "Booking not found or access denied."
                        });
                }


                const booking =
                    results[0];


                if (
                    booking.booking_Status !==
                    "CONFIRMED"
                ) {

                    return res
                        .status(409)
                        .json({
                            message:
                                "Only confirmed bookings can be updated."
                        });
                }


                const updateSQL = `
                    UPDATE BOOKING

                    SET booking_Status = ?

                    WHERE booking_ID = ?
                `;


                db.query(
                    updateSQL,
                    [
                        booking_Status,
                        booking_ID
                    ],

                    function (error) {

                        if (error) {

                            console.error(error);

                            return res
                                .status(500)
                                .json({
                                    message:
                                        "Unable to update booking."
                                });
                        }


                        res.json({
                            message:
                                `Booking marked as ${booking_Status}.`
                        });
                    }
                );
            }
        );
    }
);

// ========================================
// GET NEXT UPCOMING VIEWING
// ========================================

app.get(
    "/api/upcoming-viewing",
    function (req, res) {

        const user_ID =
            req.query.user_ID;

        const user_Role =
            req.query.user_Role;


        // ========================================
        // BASIC VALIDATION
        // ========================================

        if (
            !user_ID ||
            !user_Role
        ) {

            return res
                .status(400)
                .json({
                    message:
                        "User ID and role are required."
                });
        }


        // ========================================
        // RENTER UPCOMING VIEWING
        // ========================================

        if (
            user_Role ===
            "RENTER"
        ) {

            const sql = `
                SELECT
                    BOOKING.booking_ID,

                    VIEWING.view_Date,
                    VIEWING.view_Start_Time,
                    VIEWING.view_End_Time,

                    PROPERTY.property_ID,
                    PROPERTY.property_Name,
                    PROPERTY.property_City,
                    PROPERTY.property_State,
                    PROPERTY.property_Image_URL

                FROM BOOKING

                INNER JOIN VIEWING
                    ON BOOKING.view_ID =
                       VIEWING.view_ID

                INNER JOIN PROPERTY
                    ON VIEWING.property_ID =
                       PROPERTY.property_ID

                WHERE
                    BOOKING.user_ID = ?
                    AND BOOKING.booking_Status =
                        'CONFIRMED'

                    AND TIMESTAMP(
                        VIEWING.view_Date,
                        VIEWING.view_Start_Time
                    ) > NOW()

                ORDER BY
                    VIEWING.view_Date ASC,
                    VIEWING.view_Start_Time ASC

                LIMIT 1
            `;


            db.query(
                sql,
                [user_ID],

                function (
                    error,
                    results
                ) {

                    if (error) {

                        console.error(
                            error
                        );

                        return res
                            .status(500)
                            .json({
                                message:
                                    "Unable to retrieve upcoming viewing."
                            });
                    }


                    if (
                        results.length === 0
                    ) {

                        return res.json(
                            null
                        );
                    }


                    res.json(
                        results[0]
                    );
                }
            );


            return;
        }


        // ========================================
        // OWNER UPCOMING VIEWING
        // ========================================

        if (
            user_Role ===
            "OWNER"
        ) {

            const sql = `
                SELECT
                    BOOKING.booking_ID,

                    USERS.user_ID
                        AS renter_ID,

                    USERS.user_Name
                        AS renter_Name,

                    VIEWING.view_Date,
                    VIEWING.view_Start_Time,
                    VIEWING.view_End_Time,

                    PROPERTY.property_ID,
                    PROPERTY.property_Name,
                    PROPERTY.property_City,
                    PROPERTY.property_State,
                    PROPERTY.property_Image_URL

                FROM BOOKING

                INNER JOIN USERS
                    ON BOOKING.user_ID =
                       USERS.user_ID

                INNER JOIN VIEWING
                    ON BOOKING.view_ID =
                       VIEWING.view_ID

                INNER JOIN PROPERTY
                    ON VIEWING.property_ID =
                       PROPERTY.property_ID

                WHERE
                    PROPERTY.user_ID = ?

                    AND BOOKING.booking_Status =
                        'CONFIRMED'

                    AND TIMESTAMP(
                        VIEWING.view_Date,
                        VIEWING.view_Start_Time
                    ) > NOW()

                ORDER BY
                    VIEWING.view_Date ASC,
                    VIEWING.view_Start_Time ASC

                LIMIT 1
            `;


            db.query(
                sql,
                [user_ID],

                function (
                    error,
                    results
                ) {

                    if (error) {

                        console.error(
                            error
                        );

                        return res
                            .status(500)
                            .json({
                                message:
                                    "Unable to retrieve upcoming viewing."
                            });
                    }


                    if (
                        results.length === 0
                    ) {

                        return res.json(
                            null
                        );
                    }


                    res.json(
                        results[0]
                    );
                }
            );


            return;
        }


        // ========================================
        // INVALID ROLE
        // ========================================

        return res
            .status(400)
            .json({
                message:
                    "Invalid user role."
            });
    }
);


// ========================================
// START SERVER
// ========================================

app.listen(
    PORT,
    function () {

        console.log(
            `Server running on http://localhost:${PORT}`
        );
    }
);