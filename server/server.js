const express = require("express");
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
// SERVE FRONTEND FILES
// ========================================

app.use(
    express.static(
        path.join(__dirname, "../src")
    )
);


// ========================================
// TEST ROUTE
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
// GET USERS - TEST ROUTE
// ========================================

app.get("/api/users", function (req, res) {

    const sql =
        "SELECT * FROM USERS";

    db.query(
        sql,
        function (error, results) {

            if (error) {

                console.error(error);

                res.status(500).json({
                    message:
                        "Database query failed."
                });

                return;
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

                return res.status(400).json({
                    message:
                        "Please complete all fields."
                });
            }


            if (
                role !== "OWNER" &&
                role !== "RENTER"
            ) {

                return res.status(400).json({
                    message:
                        "Invalid user role."
                });
            }


            const checkEmailSQL =
                "SELECT user_ID FROM USERS WHERE user_Email = ?";


            db.query(
                checkEmailSQL,
                [email],
                async function (
                    error,
                    results
                ) {

                    if (error) {

                        console.error(error);

                        return res.status(500).json({
                            message:
                                "Database error."
                        });
                    }


                    if (results.length > 0) {

                        return res.status(409).json({
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


                            res.status(201).json({
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

            res.status(500).json({
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


        // ========================================
        // VALIDATION
        // ========================================

        if (
            !email ||
            !password
        ) {

            return res.status(400).json({
                message:
                    "Please enter your email and password."
            });
        }


        // ========================================
        // FIND USER
        // ========================================

        const sql =
            "SELECT * FROM USERS WHERE user_Email = ?";


        db.query(
            sql,
            [email],
            async function (
                error,
                results
            ) {

                if (error) {

                    console.error(error);

                    return res.status(500).json({
                        message:
                            "Database error."
                    });
                }


                // No account with this email

                if (results.length === 0) {

                    return res.status(401).json({
                        message:
                            "Invalid email or password."
                    });
                }


                const user =
                    results[0];


                // ========================================
                // CHECK ACCOUNT STATUS
                // ========================================

                if (
                    user.user_Status !==
                    "ACTIVE"
                ) {

                    return res.status(403).json({
                        message:
                            "This account is inactive."
                    });
                }


                // ========================================
                // CHECK PASSWORD
                // ========================================

                const passwordMatches =
                    await bcrypt.compare(
                        password,
                        user.user_Password_Hash
                    );


                if (!passwordMatches) {

                    return res.status(401).json({
                        message:
                            "Invalid email or password."
                    });
                }


                // ========================================
                // LOGIN SUCCESS
                // ========================================

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