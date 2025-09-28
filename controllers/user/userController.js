require("dotenv").config()
const userService = require("../../services/userService/userService")
const constants = require("../../config/constants")
const generatedPdfs = require("../../models/user/generatedPdfs")
const fs = require("fs");
const path = require("path");
const pdf = require("html-pdf-node");
const itineraryLocations = require("./location")
let HOTEL = require("../../models/user/hotelModel")
const bcrypt = require("bcrypt")
const jwtToken = require("jsonwebtoken")
const { date } = require("joi")
const { base } = require("../../models/user/userModel")

const hotels = [
    {
        "hotel": "Citymax Hotel Bur Dubai",
        "street": "Mankhool and Kuwait Street",
        "area": "Bur Dubai",
        "country": "Dubai, UAE"
    },
    {
        "hotel": "Grand Excelsior Hotel Bur Dubai",
        "street": "Al Kuwait St",
        "area": "Bur Dubai",
        "country": "Dubai, United Arab Emirates"
    },
    {
        "hotel": "Wescott Hotel Bur Dubai",
        "street": "Al Souq Al Kabeer",
        "area": "Bur Dubai",
        "country": "Dubai, United Arab Emirates"
    },
    {
        "hotel": "Admiral Plaza Hotel Bur Dubai",
        "street": "Khalid Bin Walid Road, Al Nahdha Street",
        "area": "Bur Dubai",
        "country": "Dubai, UAE"
    },
    {
        "hotel": "Park Regis Hotel Bur Dubai",
        "street": "Khalid Bin Al Waleed St",
        "area": "Bur Dubai (Near Burjuman Metro Station)",
        "country": "Dubai, UAE"
    },
    {
        "hotel": "Double Tree By Hilton Bur Dubai",
        "street": "Al Mankhool Road",
        "area": "Bur Dubai",
        "country": "Dubai, UAE"
    },
    {
        "hotel": "Regent Palace Hotel Al Karama",
        "street": "Khalid Bin Al Waleed Rd",
        "area": "Al Karama",
        "country": "Dubai, UAE"
    },
    {
        "hotel": "Fortune Karama Hotel",
        "street": "2 17A St",
        "area": "Al Karama (Near Karama Metro Station)",
        "country": "Dubai, UAE"
    },
    {
        "hotel": "Savoy Suites Hotel Apartments Bur Dubai",
        "street": "Street #12",
        "area": "Mankhool, Bur Dubai",
        "country": "Dubai, UAE"
    }
];


exports.signupUser = async (req, res) => {
    try {
        let data = req.body;
        data.email = "tajgateway2@gmail.com";
        data.name = "Sakshi";
        data.phone = "9371000044";
        data.role = "admin";
        let hashedPassword = await bcrypt.hash("Sakshi@123", 10);
        data.password = hashedPassword;
        let createUser = await userService.createUser(data);
        if (!createUser) {
            res.send({
                code: constants.dataInsertError,
                message: "Unable to create the user, please try again"
            });
        } else {
            res.send({
                code: constants.successCode,
                message: "Admin created successfully"
            });
        }
    } catch (err) {
        res.send({
            code: constants.catchError,
            message: err.message,
            stack: err.stack
        });
    }
};


exports.loginUser = async (req, res) => {
    try {
        let data = req.body;
        let user = await userService.findOneUser({ email: data.email });

        if (!user) {
            return res.send({
                code: constants.userNotFound,
                message: "User not found"
            });
        }

        let isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch) {
            return res.send({
                code: constants.invalidCredentials,
                message: "Invalid credentials"
            });
        }

        let token = jwtToken.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        // ✅ Explicitly return the role
        res.send({
            code: constants.successCode,
            message: "Login successful",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role || "user"
                },
                token
            }
        });

    } catch (err) {
        res.send({
            code: constants.catchError,
            message: err.message,
            stack: err.stack
        });
    }
};


exports.addUser = async (req, res) => {
    try {
        let data = req.body
        data.password = await bcrypt.hash(data.password, 10)
        data.role = "user"
        let createUser = await userService.createUser(data)
        if (!createUser) {
            res.send({
                code: constants.dataInsertError,
                message: "Unable to create the user,please try again"
            })
        } else {
            res.send({
                code: constants.successCode,
                message: "User created successfully"
            })
        }
    } catch (err) {
        res.send({
            code: constants.catchError,
            message: err.message,
            stack: err.stack
        })
    }
}

exports.getUsers = async (req, res) => {
    try {
        let users = await userService.findAllUsers({ role: "user" })
        res.send({
            code: constants.successCode,
            message: "Users retrieved successfully",
            data: users
        })
    } catch (err) {
        res.send({
            code: constants.catchError,
            message: err.message,
            stack: err.stack
        })
    }
}

exports.getUserById = async (req, res) => {
    try {
        let userId = req.params.userId
        let user = await userService.findOneUser({ _id: userId })
        if (!user) {
            res.send({
                code: constants.userNotFound,
                message: "User not found"
            })
        } else {
            res.send({
                code: constants.successCode,
                message: "User retrieved successfully",
                data: user
            })
        }
    } catch (err) {
        res.send({
            code: constants.catchError,
            message: err.message,
            stack: err.stack
        })
    }
}

exports.editUser = async (req, res) => {
    try {
        let userId = req.params.userId
        let data = req.body
        let updateUser = await userService.updateUser({ _id: userId }, data)
        if (!updateUser) {
            res.send({
                code: constants.dataUpdateError,
                message: "Unable to update the user,please try again"
            })
        } else {
            res.send({
                code: constants.successCode,
                message: "User updated successfully"
            })
        }
    } catch (err) {
        res.send({
            code: constants.catchError,
            message: err.message,
            stack: err.stack
        })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        let userId = req.params.userId
        let deleteUser = await userService.deleteUserHard({ _id: userId })
        if (!deleteUser) {
            res.send({
                code: constants.dataDeleteError,
                message: "Unable to delete the user,please try again"
            })
        } else {
            res.send({
                code: constants.successCode,
                message: "User deleted successfully"
            })
        }
    } catch (err) {
        res.send({
            code: constants.catchError,
            message: err.message,
            stack: err.stack
        })
    }
}

exports.updatePassword = async (req, res) => {
    try {
        let userId = req.params.userId
        let data = req.body
        data.password = await bcrypt.hash(data.password, 10)
        let updateUser = await userService.updateUser({ _id: userId }, data)
        if (!updateUser) {
            res.send({
                code: constants.dataUpdateError,
                message: "Unable to update the user,please try again"
            })
        } else {
            res.send({
                code: constants.successCode,
                message: "User updated successfully"
            })
        }
    } catch (err) {
        res.send({
            code: constants.catchError,
            message: err.message,
            stack: err.stack
        })
    }
}

exports.convertPdf = async (req, res) => {
    try {
        let data = req.body

        console.log("📩 Payload received from frontend:", data);

        async function htmlToPdf(htmlContent, fileName = "output.pdf") {
            // Save in /uploads at project root
            const filePath = path.join(process.cwd(), "uploads", fileName);

            let options = { format: "A4" };
            let file = { content: htmlContent };

            try {
                // Ensure uploads folder exists
                if (!fs.existsSync(path.join(process.cwd(), "uploads"))) {
                    fs.mkdirSync(path.join(process.cwd(), "uploads"));
                }

                const pdfBuffer = await pdf.generatePdf(file, options);
                fs.writeFileSync(filePath, pdfBuffer);
                console.log("✅ PDF saved at:", filePath);
            } catch (err) {
                console.error("❌ Error generating PDF:", err);
            }
        }

        // let fileName = data.name + "-" + new Date()
        let fileName = `${data.type}-${Date.now()}.pdf`;
        let saveObject = {
            userId: data.userId || null,
            type: data.type,           // save form type
            name: data.name,           // use same key as frontend
            price: data.price,         // save price
            flightDate1: data.date ? data.date : data.departureDate,
            flightDate2: data.returnDate || null,
            pdfUrl: `/uploads/${fileName}`,
            fileName: fileName,
            date: data.date || new Date()
        }

        function generatePnrCode() {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            let result = "R"; // fixed starting letter

            for (let i = 0; i < 5; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }

            return result;
        }
        function generateBookingCode() {
            const letters = "abcdefghijklmnopqrstuvwxyz";
            const digits = "0123456789";

            let result = "";

            // generate 4 random lowercase letters
            for (let i = 0; i < 4; i++) {
                result += letters.charAt(Math.floor(Math.random() * letters.length));
            }

            // add 1 random digit at the end
            result += digits.charAt(Math.floor(Math.random() * digits.length));

            return result;
        }
        function generateBookingRefCode() {
            const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const randomLetters = Array.from({ length: 4 }, () =>
                letters.charAt(Math.floor(Math.random() * letters.length))
            ).join("");

            const randomDigits = Math.floor(1000000 + Math.random() * 9000000);

            return `${randomLetters}-F${randomDigits}`;
        }

        function generateTripId() {
            const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const words = ["PORT", "CITY", "ZONE", "AREA", "PLACE", "STOP"]; // you can extend this

            // 3 random letters
            const part1 = Array.from({ length: 3 }, () =>
                letters.charAt(Math.floor(Math.random() * letters.length))
            ).join("");

            // 5 random digits
            const part2 = Math.floor(10000 + Math.random() * 90000);

            // 3 random letters
            const part3 = Array.from({ length: 3 }, () =>
                letters.charAt(Math.floor(Math.random() * letters.length))
            ).join("");

            // pick random word
            const word = words[Math.floor(Math.random() * words.length)];

            // 4 random digits
            const part4 = Math.floor(1000 + Math.random() * 9000);

            return `${part1}${part2}${part3}${word}${part4}`;
        }

        function generateTicketNumber() {
            // generate a 13-digit random number
            const number = Math.floor(
                1000000000000 + Math.random() * 9000000000000
            );
            return ` ${number}`;
        }

        // Generate 13-digit confirmation number
        function generateConfirmationNumber() {
            return Math.floor(1e12 + Math.random() * 9e12).toString();
        }

        function generateBookingId(length = 5) {
            const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
            let id = "";
            for (let i = 0; i < length; i++) {
                id += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return id;
        }

        // Example usage:
        let pnrNumber = generatePnrCode();
        console.log(pnrNumber);

        let bookingCode = generateBookingCode();
        console.log(bookingCode);

        let bookingReference = generateBookingRefCode();
        console.log(bookingReference);

        let tripId = generateTripId();
        console.log(tripId);

        let ticketNumber = generateTicketNumber();
        console.log(ticketNumber);

        let confirmationNo = generateConfirmationNumber();
        console.log(confirmationNo);

        let bookingId = generateBookingId();
        console.log(bookingId);

        if (data.type == "oneway") {

            let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>One Side Ticket Booking Confirmation</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
  <table width="100%" cellspacing="0" cellpadding="0" border="0" style="padding:20px 0;">
    <tr>
      <td align="center">
        <table width="750" cellspacing="0" cellpadding="0" border="0" style="background:#fff; width: 750px; font-family: 'Raleway', sans-serif; font-optical-sizing: auto; border:1px solid #ddd; border-radius:6px; overflow:hidden;">
            <tr>
                <td>
                    <table style="width: 100%;">
                        <tr>
                            <td></td>
                            <td style="width: 40%;">
                                <p style="font-size: 17px; text-align: end; padding-right: 30px; line-height: 10px; font-weight: 700; color: #3a508a;">PNR: {{pnrCode}}</p>
                                <p style="font-size: 13px; text-align: end; padding-right: 40px; line-height: 10px;">Booking Id : {{bookingId}}</p>
                                <p style="font-size: 13px; text-align: end; padding-right: 40px; line-height: 10px;">Issued Date : {{issueDate}}</p>
                            </td>
                        </tr>
                    </table>
                </td> 
            </tr>
            <tr>
                <td style="padding: 20px;"></td>
            </tr>
            <tr>
                <td style="background-color: #374d88; height: 4px; margin-top: 30px;"></td>
            </tr>
            <tr>
                <td>
                    <table style="width: 100%; padding: 10px 25px; border-bottom: 1px dashed;">
                        <tr style="margin-top:20px;">
                            <th style="text-align: left; padding: 13px 10px;">Traveller Details</th>
                        </tr>
                        <tr>
                            <td>
                                <table border="1px" style="border-collapse: collapse; width: 100%;">
                                    <tr>
                                        <th style="border: 1px solid; background-color: #efefef;text-align: left;padding-left: 5px; font-size: 13px; line-height: 13px;">Passenger Name</th>
                                        <th style="border: 1px solid; background-color: #efefef; text-align: left; padding-left: 5px; font-size: 13px; line-height: 13px;">Ticket Number</th>
                                        <th style="border: 1px solid; background-color: #efefef; text-align: left; padding-left: 5px; font-size: 13px; line-height: 13px;">Frequent Flyer No.</th>
                                    </tr>
                                    <tr>
                                        <td style="border: 1px solid;"> <p style="padding-left: 10px; font-size: 13px; line-height: 13px;">1. {{name}}</p></td>
                                        <td style="border: 1px solid;"> <p style="padding-left: 10px; font-size: 13px; line-height: 13px;">{{ticketNumber}}</p></td>
                                        <td style="border: 1px solid;"> <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"></p></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <table style="width: 100%; padding: 0px 25px;">
                        <tr>
                            <td>
                                <p><img src="{{BaseUrl}}uploads/plane-taking-off.png" width="40px" height="30px" alt="departure">{{segments}}</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="background-color: #374d88; height: 1px; margin-top: 30px;"></td>
                        </tr>
                    </table>
                    <table style="width: 100%; padding: 0px 25px; border-bottom: 1px dashed;">
                        <tr style="text-align: left;">
                            <th style="border-bottom: 1px solid;">Flight</th>
                            <th style="border-bottom: 1px solid;">Departure</th>
                            <th style="border-bottom: 1px solid;">Arrival</th>
                            <th style="border-bottom: 1px solid;">Status</th>
                        </tr>
                        <tr>
                            <td>
                                 <img src="{{BaseUrl}}uploads/indigo.jpeg" width="50px" height="25px" style="margin-left: 10px; margin-top: 10px; border-radius:10px"  alt="airport"> <br />
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"><strong>IndiGo 6E 1462</strong> <br/>Economy Class</p>
                            </td>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px;">Dubai (DXB) <br/><strong>Dubai International Airport (DXB)</strong> <br/>Terminal 1</p>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"><strong>{{departureDate}}<br/>{{departureTime}}</strong></p>
                            </td>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px;">Delhi (DEL)<br/><strong>Indira Gandhi International Airport (DEL)</strong> <br/>Terminal 1</p>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"><strong>{{arrivalDate}}<br/>{{arrivalTime}}</strong></p>
                            </td>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"><strong>CONFIRMED</strong> <br/>Airline PNR: {{pnrCode}} <br/>Baggage <br/>Adult: 30 Kg <br/>Refundable</p>
                            </td>
                        </tr>
                    </table>
                    <table style="width: 100%; padding: 10px 25px;">
                        <tr style="margin-top:20px;">
                            <th style="text-align: left; padding: 3px 10px;">Payment Details</th>
                        </tr>
                        <tr>
                            <td>
                                <table style="width: 100%; border: 1px solid; margin-bottom: 20px;">
                                    <tr>
                                        <td style="width: 50%; border-right: 1px solid;"> <p style="padding-left: 10px; font-size: 13px; line-height: 13px; margin: 1px;">Base Fare</p></td>
                                        <td> <p style="padding-left: 10px; font-size: 13px; line-height: 13px; margin: 1px;">{{baseFare}}</p></td>
                                    </tr>
                                    <tr>
                                        <td style="width: 50%; border-right: 1px solid;"> <p style="padding-left: 10px; font-size: 13px; line-height: 13px; margin: 1px;">Fee & Surcharge</p></td>
                                        <td> <p style="padding-left: 10px; font-size: 13px; line-height: 13px; margin: 1px;">{{feeAndSurcharge}}</p></td>
                                    </tr>
                                    <tr style="background-color: #efefef;">
                                        <td style="width: 50%; border-right: 1px solid;"> <p style="padding-left: 10px; font-size: 13px; line-height: 13px; margin: 1px;"><strong>Total Amount</strong></p></td>
                                        <td> <p style="padding-left: 10px; font-size: 13px; line-height: 13px; margin: 1px;"><strong>{{totalAmount}}</strong></p></td>
                                    </tr>
                                </table>
                                <p style="border-top: 1px dashed;"></p>
                                <table style="width: 100%; border: 1px solid; margin-top: 20px;border-collapse: collapse;">
                                    <tr style="background-color: #efefef;">
                                        <th style="width: 50%; border: 1px solid;"> <p style="padding-left: 10px; font-size: 13px; line-height: 13px;">Pax Name </p></th>
                                        <th style="width: 50%; border: 1px solid;"> <p style="padding-left: 10px; font-size: 13px; line-height: 13px;">Segments </p></th>
                                        <th style="width: 50%; border: 1px solid;"> <p style="padding-left: 10px; font-size: 13px; line-height: 13px;">Barcode </p></th>
                                    </tr>
                                    <tr>
                                        <td style="width: 50%; border: 1px solid;"> <p style="padding-left: 10px; font-size: 13px; line-height: 13px;">{{pax-name}}</p></td>
                                        <td style="border: 1px solid;"> <p style="padding-left: 10px; font-size: 13px; line-height: 13px; margin: 1px;">{{segments}}</p></td>
<td style="border: 1px solid;"><p style="padding-left: 10px; font-size: 13px; line-height: 13px; margin: 1px;"> <img  src="{{BaseUrl}}uploads/barcode.jpg"  alt="Barcode" style="width: 100px; height: auto;" /></p></td>                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td>
                    <table style="width: 100%; padding: 10px 25px;">
                        <tr>
                            <td>
                                <table style="width: 100%; padding: 10px 25px;">
                                    <tr style="margin-top:20px;">
                                        <th style="text-align: left; padding: 3px 10px;">Terms & Conditions</th>
                                    </tr>
                                    <tr>
                                        <td style="padding-bottom: 20px; border-bottom: 1px dashed;">
                                            <ul>
                                                <li style="padding-left: 10px; font-size: 13px; line-height: 16px;">All Passengers must carry a Valid Photo Identity Proof at the time of Check-in.</li>
                                                <li style="padding-left: 10px; font-size: 13px; line-height: 16px;">Please re-check the passenger name(s) as per the passport/identity proof, departure, arrival date, time, flight number, terminal, baggage details etc.</li>
                                                <li style="padding-left: 10px; font-size: 13px; line-height: 16px;">This can include: Driving License, Passport, PAN Card, Voter ID Card or any other ID issued by the Government of India. For infant passengers, it is mandatory to carry the Date of Birth certificate.</li>
                                                <li style="padding-left: 10px; font-size: 13px; line-height: 16px;">Reach the terminal at least 2 hours prior to the departure for domestic flight and 4 hours prior to the departure of international flight.</li>
                                                <li style="padding-left: 10px; font-size: 13px; line-height: 16px;">Flight timings are subject to change without prior notice. Please recheck with the carrier prior to departure.</li>
                                            </ul>
                                        </td>
                                    </tr>
                                    <tr style="margin-top:20px;">
                                        <th style="text-align: left; padding: 3px 10px;">Baggage Information</th>
                                    </tr>
                                    <tr>
                                        <td style="padding-bottom: 20px;">
                                            <ul>
                                                <li style="padding-left: 10px; font-size: 13px; line-height: 16px;">Free Cabin Baggage Allowance: As per Bureau of Civil Aviation Security (BCAS) guidelines traveling passenger may carry maximum 7 Kgs per person per flight (only one piece measuring not more than 55 cm x 35 cm x 25 cm, including laptops or duty free shopping bags). The dimensions of the checked Baggage should not exceed 158 cm (62 inches) in overall dimensions (L + W + H).</li>
                                            </ul>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr style="padding: 10px;">
                <td style="background-color: #374d88; color: white; text-align: center; margin-top: 30px;padding: 10px 0px;"> Thank you for booking with us. Have a safe journey!</td>
            </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
            let totalAmount = Number(data.price) + 4460
            let issueDate = new Date();
            issueDate = issueDate.toDateString();
            let onewayData = {
                pnrCode: pnrNumber,
                bookingId: bookingCode,
                issueDate: issueDate,
                name: data.name,
                ticketNumber: pnrNumber + "-" + 1,
                source: data.source,
                destination: data.destination,
                baseFare: "Rs " + data.price,
                feeAndSurcharge: "Rs 4460.0",
                totalAmount: "Rs " + totalAmount,
                "pax-name": data.name,
                segments: "Dubai (DXB) - Delhi (DEL)",
                departureDate: data.date,
                departureTime: "11:50 AM",
                arrivalDate: data.date,
                arrivalTime: "04:50 PM",
                BaseUrl: process.env.base_url

            }
            Object.keys(onewayData).forEach(key => {
                let regex = new RegExp(`{{${key}}}`, "g");
                html = html.replace(regex, onewayData[key]);
            });


            await htmlToPdf(html, fileName);
            let saveData = await generatedPdfs(saveObject).save()
            res.send({
                code: constants.successCode,
                message: "PDF generated successfully",
            })

        } else if (data.type == "roundtrip") {

            let html = `<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> Ticket Booking Confirmation</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap"
        rel="stylesheet">
    <script src='https://kit.fontawesome.com/a076d05399.js' crossorigin='anonymous'></script>
</head>

<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
    <table width="100%" cellspacing="0" cellpadding="0" border="0" style="padding:20px 0;">
        <tr>
            <td align="center">
                <table width="750" cellspacing="0" cellpadding="0" border="0" style="background:#fff; width: 750px; font-family: 'Raleway', sans-serif;
  font-optical-sizing: auto; border:1px solid #ddd; padding: 20px; border-radius:6px; overflow:hidden;">
  <tr>
    <td>
        <table style="width: 100%; border: 2px solid #ababab;">

            <tr>
                <td style="background-color: #f5811f; height: 2px; margin-top: 30px;"></td>
            </tr>
            <tr>
                <td>
                    <table style="width: 100%;">
                        <tr>
                            <td></td>
                            <td style="width: 40%;">
                                <p
                                    style="font-size: 13px; text-align: end; padding-right: 40px; line-height: 10px;">
                                    {{issueDate}}</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td style=" padding: 20px ; text-align: center; font-size: 20px; line-height: 13px;">
                    <strong>BOOKING RECEIPT </strong> 
                </td>
            </tr>
            <tr>
                <td>
                    <table style="width: 100%;padding: 10px 20px;">
                        <!-- Guest Info -->
                        <tr>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"> <strong>
                                        Dear</strong><br />
                                    {{name}} </p>
                            </td>
                            <td style="width: 40%;">
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px;">
                                    <strong>Booking Reference Flight: <span style="color: red;"> {{bookingReference}}
                                        </span> </strong>
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" style="background-color: #ccc; height: 1px; margin-top: 30px;"></td>
                        </tr>
                        <tr>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px;">
                                    Congratulations! Your booking has been Confirmed.</p>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px;">See below
                                    details of your booking.</p>
                            </td>
                            <td style="width: 40%;text-align: end;">
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px;">
                                    AgentName:Mairaz Pasha</p>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" style="background-color: #f5811f; height: 1px; margin-top: 30px;">
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <p
                                    style="padding-left: 10px; font-size: 17px; line-height: 13px; color: #ababab;">
                                    Travel Itinerary <i class="fa-solid fa-plane"></i> <i
                                        class='fa fa-plane'></i></p>
                            </td>
                        </tr>
                    </table>
        
                    <table style="width: 95%; margin: 10px 25px; border: 1px solid  ;">
                        <!-- Guest Info -->
                        <tr style="margin-top:20px;">
                            <td><img src="{{BaseUrl}}uploads/Vector.png" width="30px" height="20px" style="margin-right: 10px;"  alt="airport">New Delhi <img width="20px" height="20px" style="margin:0px 10px; opacity: 0.5;" src="{{BaseUrl}}uploads/exchange.png"  alt="airport"> Dubai</td>
                            <td style="width: 40%;">
                                <p
                                    style="padding-left: 10px; font-size: 13px; line-height: 13px;text-align: end;">
                                    Trip ID : {{tripId}}</p>
                            </td>
                        </tr>
        
                    </table>
                    <table style="width: 100%; padding: 0px 25px;">
                        <!-- Guest Info -->
                        <tr>
                            <td>
                                <p><img src="{{BaseUrl}}uploads/plane-taking-off.png" width="40px" height="30px" style="margin-right: 10px;"  alt="airport"> <strong>Departure</strong></p>
                            </td>
                            <td style="width: 40%;">
                                <p
                                    style="padding-left: 10px; font-size: 13px; line-height: 13px; text-align: end;">
                                    Airline PNR: {{pnrCode}}</p>
                            </td>
                        </tr>
        
                    </table>
        
                    <table style="width: 100%; padding: 0px 25px;border-bottom: 1px solid;">
                        <!-- Guest Info -->
                        <tr style="margin-top:20px;">
                            <td>
                                <p><strong>Flight</strong></p>
                            </td>
                            <td>
                                <p><strong>Departs</strong></p>
                            </td>
                            <td></td>
                            <td>
                                <p><strong>Arrives</strong></p>
                            </td>
                            <td>
                                <p><strong>Total Duration</strong></p>
                            </td>
                            <td>
                                <p><strong>Aircraft</strong></p>
                            </td>
        
                        </tr>
                        <tr style="margin-top:20px;  src='https://kit.fontawesome.com/a076d05399.js' crossorigin='anonymous'">
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; ">
                                    <img src="{{BaseUrl}}uploads/Emirates_logo.svg" width="50px" height="40px" style="margin-right: 10px; margin-bottom: 10px;"  alt="airport"> <br />
                                    Emirates<br />
                                    EK - 517<br />
                                    Economy Class</p>
                            </td>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; ">{{departureDate}}
                                    At<br />
                                    16:20<br />
                                    <br />
                                    <strong>Indira Gandhi International Airport <br /></strong>
                                    Terminal 3<br /></strong>
                                     <br/>
                                    <span style="color: #785e60; margin-top: 10px;"> Confirmed </span></p>
                            </td>
                            <td><img src="{{BaseUrl}}uploads/arrow.png" width="40px" height="30px" style="margin-right: 10px;"  alt="airport"></td>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; ">{{departureDate}}
                                    At 18:20 <br />
                                    <br />
                                     <strong>Dubai International <br /></strong>
                                    <strong>Airport<br /> </strong>
                                    Terminal 3</p>
                            </td>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; ">3h 30m</p>
                            </td>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; ">Airbus<br />
                                    B777</p>
                            </td>
        
                        </tr>
        
                    </table>
        
                    <table style="width: 100%; padding: 10px 25px;">
                        <!-- Guest Info -->
                        <tr style="margin-top:20px;">
                            <td>
                                <p><img src="{{BaseUrl}}uploads/plane-landing.png" width="40px" height="30px" style="margin-right: 10px;"  alt="airport"><strong>Arrival</strong></p>
                            </td>
                            <td style="width: 40%;">
        
                            </td>
                        </tr>
        
                    </table>
        
                    <table style="width: 100%; padding: 0px 25px;border-bottom: 1px solid;">
                        <!-- Guest Info -->
                        <tr style="margin-top:20px;">
                            <td>
                                <p><strong>Flight</strong></p>
                            </td>
                            <td>
                                <p><strong>Departs</strong></p>
                            </td>
                            <td></td>
                            <td>
                                <p><strong>Arrives</strong></p>
                            </td>
                            <td>
                                <p><strong>Total Duration</strong></p>
                            </td>
                            <td>
                                <p><strong>Aircraft</strong></p>
                            </td>
        
                        </tr>
                        <tr style="margin-top:20px;">
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; ">
                                    <img src="{{BaseUrl}}uploads/Emirates_logo.svg" width="50px" height="40px" style="margin-right: 10px; margin-bottom: 10px;"  alt="airport"> <br />
                                    Emirates<br />
                                    EK - 517<br />
                                    Economy Class</p>
                            </td>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; ">{{returnDate}}
                                    At 16:20<br />
                                    <br />
                                     <strong>Dubai International <br /></strong>
                                    <strong>Airport<br /> </strong>
                                    <br/>
                                    <span style="color: #785e60; margin-top: 10px;"> Confirmed </span></p>
                            </td>
                            <td><img src="{{BaseUrl}}uploads/arrow.png" width="40px" height="30px" style="margin-right: 10px;"  alt="airport"></td>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; ">{{returnDate}}
                                    At 18:20 <br />
                                    <br />
                                   <strong>Indira Gandhi International Airport <br /></strong>
                                    Terminal 3<br />
                                </p>
                            </td>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; ">3h 30m</p>
                            </td>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; ">Airbus<br />
                                    B777</p>
                            </td>
        
                        </tr>
        
                    </table>
        
                    <table style="width: 100%; padding: 0px 25px;border-bottom: 1px solid;">
                        <!-- Guest Info -->
                        <tr style="margin-top:20px;">
                            <td>
                                <p><img src="{{BaseUrl}}uploads/traveler-with-a-suitcase.png" width="30px" /><br/><strong>{{name}}</strong></p>
                            </td>
                            <td style="width: 40%;">
        
                            </td>
                        </tr>
        
                    </table>
                    <table style="width: 100%; padding: 10px 25px;">
                        <!-- Guest Info -->
                        <tr style="margin-top:20px;">
                            <td>
                                <img src="{{BaseUrl}}uploads/person.png" width="30px" />
                            </td>
                            <td style="width: 40%; text-align: end;">
                                <p><strong>Ticket No: {{ticketNumber}}</strong></p>
                            </td>
                        </tr>
        
                    </table>
                    <table style="width: 100%; padding: 0px 25px;border-bottom: 1px solid;">
                        <!-- Guest Info -->
                        <tr style="margin-top:20px;">
                            <td>
                                <p><strong>Flight</strong></p>
                            </td>
                            <td>
                                <p><strong>Sector</strong></p>
                            </td>
                            <td>
                                <p><strong>Date</strong></p>
                            </td>
                            <td>
                                <p><strong>Class</strong></p>
                            </td>
                            <td>
                                <p><strong>Meal</strong></p>
                            </td>
                            <td>
                                <p><strong>Seat</strong></p>
                            </td>
        
                        </tr>
                        <tr style="margin-top:20px;">
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; ">EK 517</p>
                            </td>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; ">DEL – DXB
                                </p>
                            </td>
        
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; "><strong>{{departureDate}}</strong></p>
                            </td>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; ">EconomyClass
                                </p>
                            </td>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; "></p>
                            </td>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; "></p>
                            </td>
        
                        </tr>
        
                    </table>
                    <table style="border-bottom: 1px solid ; width: 100%;">
                        <tr>
                            <th style="width: 20%;">Baggage:</th>
                            <td style="width: 10%;border-right: 1px solid ; padding-right: 10px;">
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; "><span
                                        style="color: #785e60;">Cabin</span> <br /> 5-7 Kg</p>
                            </td>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; "><span
                                        style="color: #785e60;">Check In</span> <br /> Weight 35 Kilograms
                                    Allowed.</p>
                            </td>
                        </tr>
                    </table>
        
                    <table style="width: 100%; padding: 0px 25px;border-bottom: 1px solid;">
                        <!-- Guest Info -->
                        <tr style="margin-top:20px;">
                            <td>
                                <p><strong>Flight</strong></p>
                            </td>
                            <td>
                                <p><strong>Sector</strong></p>
                            </td>
                            <td>
                                <p><strong>Date</strong></p>
                            </td>
                            <td>
                                <p><strong>Class</strong></p>
                            </td>
                            <td>
                                <p><strong>Meal</strong></p>
                            </td>
                            <td>
                                <p><strong>Seat</strong></p>
                            </td>
        
                        </tr>
                        <tr style="margin-top:20px;">
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; ">EK 516</p>
                            </td>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; "> DXB – DEL
                                </p>
                            </td>
        
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; "><strong>{{returnDate}}</strong></p>
                            </td>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; ">EconomyClass
                                </p>
                            </td>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; "></p>
                            </td>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; "></p>
                            </td>
        
                        </tr>
        
                    </table>
                    <table style="border-bottom: 1px solid ; width: 100%;">
                        <tr>
                            <th style="width: 20%;">Baggage:</th>
                            <td style="width: 10%;border-right: 1px solid ; padding-right: 10px;">
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; "><span
                                        style="color: #785e60;">Cabin</span> <br /> 5-7 Kg</p>
                            </td>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; "><span
                                        style="color: #785e60;">Check In</span> <br /> Weight 35 Kilograms
                                    Allowed.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td>
                    <table style="width: 100%; padding: 10px 25px;">
                        <!-- Guest Info -->
                        <tr style="margin-top:20px; ">
                            <td colspan="2" style="border: 1px solid black; text-align: left; padding: 3px 10px;"><img src="{{BaseUrl}}uploads/credit-cards-payment.png" style="margin-right: 10px;" width="30px" />Fare Details</td>
                            
                        </tr>
        
                        <tr>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px;">
                                    1 Adult, (DEL > DXB) </p>
                            </td>
                            <td>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px;">Base Fare</p>
                            </td>
                            <td style="width: 20%;">
                                <p
                                    style="padding-left: 10px; font-size: 13px; line-height: 13px; text-align: end; ">
                                   {{price}}</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px;">Fee & Taxes
                                </p>
                            </td>
                            <td style="width: 20%;">
                                <p
                                    style="padding-left: 10px; font-size: 13px; line-height: 13px; text-align: end; ">
                                    {{taxAndFee}}</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px;">Service
                                    Charge </p>
                            </td>
                            <td style="width: 20%;">
                                <p
                                    style="padding-left: 10px; text-align: end;  font-size: 13px; line-height: 13px;">
                                    Rs. 0.00</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px;">Discount
                                    Price (-)</p>
                            </td>
                            <td style="width: 20%;">
                                <p
                                    style="padding-left: 10px; text-align: end; font-size: 13px; line-height: 13px; ">
                                    Rs. 0.00</p>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2">
                                <hr />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"></p>
                            </td>
                            <td style="width: 20%;">
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px;">Total: {{total}} <strong
                                        style="padding-left: 20px;"> </strong> </p>
                            </td>
                        </tr>
                    </table>
        
                    <table style="width: 100%; padding: 10px 25px;">
                        <!-- Guest Info -->
                        <tr style="margin-top:20px;">
                            <th style=" text-align: left; padding: 3px 10px;">
                                Terms & Conditions</th>
                        </tr>
                        <tr>
                            <td>
                                <ol>
                                    <li style="padding-left: 10px; font-size: 13px; line-height: 16px;">Please
                                        read the following terms and conditions.Check-in counters open 3 hours
                                        prior to departure of fl
                                        ight and close 1 hour prior to departure of flight,you may be denied
                                        boarding if you fail to report on tim
                                        e.</li>
                                    <li style="padding-left: 10px; font-size: 13px; line-height: 16px;">Please
                                        Re-check the passenger name(s) as per the passport/identity proof,
                                        departure, arrival date,tim
                                        e, flight number, terminal, baggage details etc.</li>
                                    <li style="padding-left: 10px; font-size: 13px; line-height: 16px;">. In
                                        case of International travel, please check your requirements for travel
                                        documentation like valid Pas
                                        sport/visa/Ok to Board/travel and medical insurance with the airline and
                                        relevant Embassy or Consula
                                        te before commencing your journey.</li>
                                    <li style="padding-left: 10px; font-size: 13px; line-height: 16px;">The
                                        local authorities in certain countries may impose additional taxes (VAT,
                                        tourist tax etc.), which gen
                                        erally has to be paid locally.</li>
                                    <li style="padding-left: 10px; font-size: 13px; line-height: 16px;">We are
                                        not responsible for any schedule change/flight cancellation by the
                                        airline before and after issu
                                        ance of the tickets</li>
                                    <li style="padding-left: 10px; font-size: 13px; line-height: 16px;">We will
                                        not be held responsible for any loss or damage to traveler’s and his/her
                                        belongings due to any
                                        accident, theft or other Mishap / Unforeseen circumstances)</li>
                                    <li style="padding-left: 10px; font-size: 13px; line-height: 16px;">Any
                                        amendments of the booking will be as per the airline terms and
                                        conditions comprising of penaltie
                                        s, fare difference which may change upon subject to availability by the
                                        airline.</li>
                                    <li style="padding-left: 10px; font-size: 13px; line-height: 16px;">Any
                                        Cancellation/Refund of booking will be handled from case to case basis
                                        depending on the airline
                                        and agency terms and conditions.</li>
                                    <li style="padding-left: 10px; font-size: 13px; line-height: 16px;">For any
                                        amendments, cancellation or ancillary services etc, you may connect with
                                        the agency from w
                                        here you had issued the tickets.</li>
                                </ol>
        
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </td>
  </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
`

            const formatDate = (date) => {
                const options = { day: "2-digit", month: "short", year: "numeric" };
                return new Date(date).toLocaleDateString("en-GB", options).replace(",", "");
            };


            let roundtripData = {
                issueDate: formatDate(new Date()),
                name: data.name,
                bookingReference: bookingReference,
                tripId: tripId,
                pnrCode: pnrNumber,
                departureDate: formatDate(data.departureDate),
                returnDate: formatDate(data.returnDate),
                ticketNumber: ticketNumber,
                price: "Rs " + data.price,
                taxAndFee: "Rs 710.00",
                total: "Rs " + (Number(data.price) + 710),
                BaseUrl: process.env.base_url
            }
            Object.keys(roundtripData).forEach(key => {
                let regex = new RegExp(`{{${key}}}`, "g");
                html = html.replace(regex, roundtripData[key]);
            });

            await htmlToPdf(html, fileName);
            let saveData = await generatedPdfs(saveObject).save()
            res.send({
                code: constants.successCode,
                message: "PDF generated successfully",
            })
        } else if (data.type == "hotel") {

            let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hotel Booking Confirmation</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f4f4f4;">
  <table width="100%" cellspacing="0" cellpadding="0" border="0" style="padding:20px 0;">
    <tr>
      <td align="center">
        <table width="750" cellspacing="0" cellpadding="0" border="0" style="background:#fff; width: 750px; font-family: 'Raleway', sans-serif;
  font-optical-sizing: auto; border:1px solid #ddd; border-radius:6px; overflow:hidden;">
            <tr>
                <td>
                    <table style="width: 100%;">
                        <tr>
                            <td></td>
                    <td style="width: 40%;">
                        <p style="font-size: 17px; text-align: end; padding-right: 30px; line-height: 10px; font-weight: 700; color: #3a508a; ">Confirmation No :</p>
                        <p style="font-size: 17px; text-align: end; padding-right: 30px; line-height: 10px; font-weight: 700; color: #3a508a; ">{{confirmationNo}}</p>
                        <!-- <br/> -->
                        <p style="font-size: 17px;  text-align: end; padding-right: 30px; line-height: 10px; font-weight: 700; color: #3a508a; ">Guest: {{name}}</p>
                        <p style="font-size: 13px; text-align: end; padding-right: 40px; line-height: 10px;">Check in : {{checkIN}}</p>
                        <p style="font-size: 13px; text-align: end; padding-right: 40px; line-height: 10px;">Checkout : {{checkOut}}  2025</p>
                        <p style="font-size: 13px; text-align: end; padding-right: 40px; line-height: 10px; ">Booking Id : {{bookingId}}</p>
                    </td>
                        </tr>
                    </table>
                </td> 
            </tr>
             <tr>
            <td style=" padding: 20px ;"></td>
           </tr>
           <tr>
            <td style="background-color: #374d88; height: 4px; margin-top: 30px;"></td>
           </tr>
           <tr>
            <td>
                <table style="width: 100%; padding: 10px 25px;">
                   <!-- Guest Info -->
          <tr style="margin-top:20px;">
            <th style="background-color:#eeeeee; text-align: left; padding: 3px 10px;">{{hotel}}</th>
          </tr>
          <tr>
            <td>
              <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"> Address: {{address1}}</p>
              <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"> {{address2}}</p>
              <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"> {{address3}}</p>
            </td>
          </tr>
                </table>
                 <table style="width: 100%; padding: 10px 25px;">
                   <!-- Guest Info -->
          <tr style="margin-top:20px;">
            <th style="background-color:#eeeeee; text-align: left; padding: 3px 10px;">Booking Details (1 Room 1 Adult )</th>
          </tr>
          <tr>
            <td>
              <p style="padding-left: 10px; font-size: 13px; line-height: 13px; color:#733b33 ;"> <strong> Room 1: Room </strong>  </p>
              <p style="padding-left: 10px; font-size: 13px; line-height: 13px; color:#733b33 ;   ">Bed and breakfast</p>
              <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"> Description :Room </p>
             
            </td>
          </tr>
                </table>

                  <table style="width: 100%; padding: 10px 25px;">
                   <!-- Guest Info -->
          <tr style="margin-top:20px;">
            <th style="background-color:#eeeeee; text-align: left; padding: 3px 10px;">Guest Details</th>
          </tr>
         <tr>
            <td>
              <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"> 1.<strong style="color: #3a508a; font-size: 15px;">{{name}}</strong>  (Adult)</p>
            </td>
          </tr>
                </table>
            </td>
           </tr>
           <tr>
            <td>
                 <table style="width: 100%; padding: 10px 25px;">
                   <!-- Guest Info -->
          <tr style="margin-top:20px;">
            <th style="background-color:#eeeeee; text-align: left; padding: 3px 10px;">Hotel Rules</th>
          </tr>
          
           <tr>
            <td>
              <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"> <strong>Check-in</strong> </p>
              <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"> Check-in between 12:00 PM - anytime</p>
              <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"> <strong>Check-out</strong> </p>
              <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"> Check-out before 12:00 PM </p>
               <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"> <strong>Check-in Instruction</strong> </p>
               <ul>
                <li style="padding-left: 10px; font-size: 13px; line-height: 18px;">Extra-person charges may apply and vary depending on property policy</li>
                <li style="padding-left: 10px; font-size: 13px; line-height: 18px;">Government-issued photo identification and a credit card, debit card, or cash deposit may be required at
check-in for incidental charges</li>
                <li style="padding-left: 10px; font-size: 13px; line-height: 18px;">Special requests are subject to availability upon check-in and may incur additional charges; special requests
cannot be guaranteed</li>
                <li style="padding-left: 10px; font-size: 13px; line-height: 18px;">This property accepts cash</li>
               </ul>
               <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"> <strong>Special Check-in Instruction</strong> </p>
              <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"> Front desk staff will greet guests on arrival at the property.</p>
               <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"> <strong>Mandatory Fee</strong> </p>
              <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"> You'll be asked to pay the following charges at the property. Fees may include applicable taxes:</p>
              <ul>
                <li style="padding-left: 10px; font-size: 13px; line-height: 18px;">A tax is imposed by the city: Rs 15.00 per accommodation, per night</li>
             </ul>
              <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"> We have included all charges provided to us by the property.</p>
               <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"> <strong>Extra Guest Info</strong> </p> <br/>
              <p style="padding-left: 10px; font-size: 13px; line-height: 13px; margin-top: 10px"> We don't guarantee an Extra Bed for Extra guests, it is subject to availability of the hotel and may be chargeable
as well.</p>
             
            </td>
          </tr>
                </table>
                
                  <table style="width: 100%; padding: 10px 25px;">
                   <!-- Guest Info -->
          <tr style="margin-top:20px;">
            <th style="background-color:#eeeeee; text-align: left; padding: 3px 10px;">Additional Charges</th>
          </tr>
         <tr>
            <td>
              <p style="padding-left: 10px; font-size: 13px; line-height: 13px;">Room 1 <br/>
4.08 USD PerAcommodation PerStay for Fee (mandatory_tax) to be paid at hotel.</p>
<p style="padding-left: 10px; font-size: 13px; line-height: 13px;">
Bed type is subjected to the availability</p>
            </td>
          </tr>
                </table>
            </td>
           </tr>
          

          <!-- Room Details -->
          <tr>
            <td>
                   <table style="width: 100%; padding: 10px 25px;">
                   <!-- Guest Info -->
          <tr style="margin-top:20px;">
            <th style="background-color:#eeeeee; text-align: left; padding: 3px 10px;">Payment Details</th>
          </tr>
         <tr>
            <td>
                <table style="width: 100%;">
                    <tr style="padding: 5px 0px;">
                        <td style="padding-left: 10px; font-size: 13px; line-height: 13px; padding-bottom: 4px;">Base Rate </td>
                        <td style="padding-left: 10px; font-size: 13px; line-height: 13px; padding-bottom: 4px;">{{price}}</td>
                    </tr>
                    <tr>
                        <td style="padding-left: 10px; font-size: 13px; line-height: 13px; padding-bottom: 4px;">Taxes and Fees </td>
                        <td style="padding-left: 10px; font-size: 13px; line-height: 13px; padding-bottom: 4px;">{{taxesAndFees}}</td>
                    </tr>
                    <tr>
                        <td style="padding-left: 10px; background-color:#eeeeee; font-size: 13px; line-height: 13px;"><strong> Total Price </strong></td>
                        <td style="padding-left: 10px; background-color:#eeeeee; font-size: 13px; line-height: 13px;"><strong>{{total}}</strong></td>
                    </tr>
                </table>
            </td>
          </tr>
                </table>
            </td>
          </tr>

       

         <tr style="padding: 10px;">
            <td style="background-color: #374d88; color: white; text-align: center; margin-top: 30px;padding: 10px 0px;"> Thank you for booking with us. Have a great stay!</td>
           </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`
            const formatDate = (date) => {
                const options = { day: "2-digit", month: "short", year: "numeric" };
                return new Date(date).toLocaleDateString("en-GB", options).replace(",", "");
            };
            function findHotel(hotelName) {
                return hotels.find(h => h.hotel.toLowerCase() === hotelName.toLowerCase()) || null;
            }

            // Example usage
            const hotelObj = findHotel(data.hotel);

            let hotelData = {
                confirmationNo: confirmationNo,
                name: data.name,
                checkIN: formatDate(data.checkin),
                checkOut: formatDate(data.checkout),
                bookingId: bookingId,
                hotel: data.hotel,
                address1: hotelObj.street,
                address2: hotelObj.area,
                address3: hotelObj.country,
                price: "Rs " + data.price,
                taxesAndFees: "Rs 115.42",
                total: "Rs " + (Number(data.price) + 115.42),
                BaseUrl: process.env.base_url

            }
            Object.keys(hotelData).forEach(key => {
                let regex = new RegExp(`{{${key}}}`, "g");
                html = html.replace(regex, hotelData[key]);
            });

            await htmlToPdf(html, fileName);

            // saveObject.name = data.guest
            let saveData = await generatedPdfs(saveObject).save()
            res.send({
                code: constants.successCode,
                message: "PDF generated successfully",
            })
        } else if (data.type == "itinerary") {

            let itineraryDaysHtml = "";
            itinerary.forEach(item => {
                itineraryDaysHtml += `
                    <div class="day-label"><span>&#9733;</span> DAY ${item.day} <span>&#9654;</span></div>
                    <div class="day-block">
                        <img src="${item.img}" alt="${item.title}" />
                        <h2 class="detail-title">${item.title}</h2>
                        <div class="tag">${item.tag}</div>
                        ${item.description.map(d => `<p>${d}</p>`).join("")}
                        ${item.note ? `<p><em>${item.note}</em></p>` : ""}
                    </div>
                `;
            });

            let html = `
            <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Dubai Itinerary - Viz Travels</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            color: #2c3e50;
            background: #fff;
        }

        .header img.hero {
            width: 90%;
            max-height: 200px;
            object-fit: cover;
            margin: auto;
            display: flex;
            justify-content: center;
            margin-bottom: 5px;
        }

        .logo {
            text-align: center;
            margin: 0;
        }

        .logo img {
            max-width: 180px;
            margin-top: 20px;
            margin-bottom: 10px;
        }

        .title {
            text-align: center;
            font-size: 30px;
            font-weight: bold;
            color: #336666;
            margin: 5px 0;
        }

        .details {
            text-align: center;
            font-size: 14px;
            line-height: 1.4;
            margin: 0 0 15px 0;
            color: #aaaaaa;
            font-weight: 550;
        }

        .section {
            margin: 15px auto;
            padding: 5px 15px;
            width: 90%;
        }

        .section h2 {
            text-align: center;
            font-size: 20px;
            color: #336666;
            font-weight: 600;
            /* border-bottom: 2px solid #336666; */
            padding-bottom: 3px;
            margin: 10px 0;
        }

        .hotel-card {
            display: flex;
            border: 1px solid #ccc;
            border-radius: 8px;
            align-items: center;
            overflow: hidden;
            gap: 14px;
            margin-bottom: 15px;
        }

        .hotel-card img {
            width: 140px;
            height: 100px;
            object-fit: cover;
        }

        .hotel-info {
            padding: 8px;
            flex: 1;
        }

        .hotel-info h3 {
            margin: 0;
            font-size: 16px;
        }

        .hotel-info h3 span {
            color: red;
        }

        .hotel-info p {
            margin: 2px 0;
            font-size: 14px;
        }

        /* --- Itinerary Styles --- */
        .day-label {
            font-size: 14px;
            color: #555;
            font-weight: 500;
            margin: 20px 0 10px 0;
        }

        .day-label span {
            color: #f37a20;
        }

        .day-block {
            padding-bottom: 20px;
            margin-bottom: 30px;
            border-bottom: 1px solid #ccc;
            overflow: hidden;
        }

        .day-block img {
            width: 35%;
            float: left;
            margin-right: 20px;
            border-radius: 4px;
        }

        .day-block h2 {
            margin: 0;
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .day-block .tag {
            font-size: 14px;
            line-height: 1.4;
            margin: 0 0 15px 0;
            color: #aaaaaa;
            font-weight: 550;
        }

        .day-block p {
            font-size: 14px;
            line-height: 1.6;
            margin: 0 0 10px 0;
        }

        .day-block em {
            font-size: 13px;
            color: #555;
        }

        .detail-title {
            text-align: left !important;
        }


        .section-title {
            color: #006666;
            margin-bottom: 30px;
            font-size: 20px;
            text-transform: uppercase;
        }

        .list {
            margin: 0;
            padding-left: 20px;
        }

        .list-item {
            margin-bottom: 8px;
            font-size: 14px;
        }

        .cancel-policy {
            font-size: 14px;
        }

        .cancel-policy p {
            margin-bottom: 10px;
        }

        /* Responsive for mobile */
        @media (max-width: 768px) {
            .container {
                grid-template-columns: 1fr;
            }
        }

        .container-section {
            width: 90%;
            margin: auto;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
        }

        .outer-section {
            margin-bottom: 40px;
        }

        .footer-section {
            width: 90%;
            margin: auto;
        }

        .tours-title {
            color: #ff6600;
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 10px;
        }

        .tours-list {
            padding-left: 20px;
            margin: 0;
        }

        .tours-item {
            margin-bottom: 8px;
            font-weight: 550;
            font-size: 14px;
        }

        .why-title {
            text-align: center;
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 20px;
            margin-top: 40px;
        }

        .icons-row {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
            text-align: center;
        }

        .icon-box {
            flex: 0 1 120px;
        }

        .icon-box img {
            width: 50px;
            height: 50px;
            margin-bottom: 8px;
        }

        .icon-text {
            font-size: 13px;
        }

        .note {
            font-size: 14px;
            margin-top: 20px;
        }

        .note strong {
            color: #000;
        }

        .footer {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 40px;
            margin-top: 30px;
            font-size: 14px;
            margin-bottom: 30px;
        }

        .footer-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .footer-item img {
            width: 20px;
            height: 20px;
        }

        /* Responsive */
        @media (max-width: 768px) {


            .footer {
                flex-direction: column;
                gap: 15px;
            }
        }
    </style>
</head>

<body>

    <!-- Hero Image -->
    <div class="header">
        <img src="http://localhost:3020/uploads/images/banner-image.jpeg" alt="Dubai" class="hero">
    </div>

    <!-- Logo -->
    <div class="logo">
        <img src="http://localhost:3020/uploads/images/logo.jpeg" alt="Viz Travels Logo">
    </div>

    <!-- Title -->
    <div class="title">DUBAI</div>

    <!-- Details -->
    <div class="details">
        Reference No.: #VT014753 <br>
        Query Id.: #QID027404 <br>
        7 Nights / 8 Days | For 4 Adults, 2 Child, 1 Infant <br>
        Thu 25 to 01 Jan 2026
    </div>

    <!-- Destinations Covered -->
    <div class="section">
        <h2>DESTINATIONS COVERED</h2>
        <p style="text-align:center;" class="details">UAE</p>
    </div>

    <!-- Hotel Section -->
    <div class="section">
        <div class="hotel-card">
            <img src="http://localhost:3020/uploads/images/hotel.jpeg" alt="Golden Sands Hotel">
            <div class="hotel-info">
                <h3>Golden Sands Hotel / 2 Rooms <span>(3 Star)</span></h3>
                <p><b>Staying Dates:</b> 25-12-2025, 27-12-2025, 28-12-2025, 29-12-2025, 30-12-2025, 31-12-2025</p>
                <p><b>Destination:</b> Dubai</p>
                <p><b>Meal Plan:</b> Breakfast</p>
            </div>
        </div>
    </div>

    <!-- Itinerary Section -->
    <div class="section" id="itinerary">
        <h2>DETAILED ITINERARY</h2>
        <!-- Days will be injected here -->
    </div>

    <div class="container-section">
        <!-- Left Column -->
        <div>
            <div class="outer-section">
                <h2 class="section-title">Inclusions</h2>
                <ul class="list">
                    <li class="list-item">Transfers</li>
                    <li class="list-item">Visafees</li>
                    <li class="list-item">Two dinners</li>
                    <li class="list-item">Sightseeing and accommodation with breakfast as per the above-mentioned
                        itinerary</li>
                    <li class="list-item">Assistance of the tour before the trip</li>
                </ul>
            </div>
        </div>

        <!-- Right Column -->
        <div>
            <div class="outer-section">
                <h2 class="section-title">Exclusions</h2>
                <ul class="list">
                    <li class="list-item">Airfares</li>
                    <li class="list-item">GST 5%</li>
                    <li class="list-item">TCS 5% / 20%</li>
                    <li class="list-item">Compulsory tips wherever applicable</li>
                    <li class="list-item">Tourist City Tax which needs to be paid directly at Hotel by Customer</li>
                    <li class="list-item">Anything not mentioned in the "Inclusions"</li>
                    <li class="list-item">Expenses of personal nature such as laundry, mini-bar, telephone charges, food
                        & drink not part of the package</li>
                </ul>
            </div>
        </div>
    </div>

    <div class="container-section">
        <div>
            <div class="outer-section">
                <h2 class="section-title">Important Notes</h2>
                <ul class="list">
                    <li class="list-item">Ensure you have all necessary travel documents including passports, flight
                        tickets, visa, hotel vouchers, and travel insurance.</li>
                    <li class="list-item">Check the local currency of your destination and exchange currency in advance.
                    </li>
                    <li class="list-item">Inform your bank about your travel dates to avoid any issues with your
                        debit/credit cards.</li>
                    <li class="list-item">Save our emergency contact number in your phone: +91 7042917770.</li>
                    <li class="list-item">Carry necessary medications and prescriptions.</li>
                    <li class="list-item">Check the weather forecast for your destination and pack accordingly.</li>
                    <li class="list-item">Include appropriate clothing, especially for any specific activities.</li>
                    <li class="list-item">Keep yourself updated on local news, travel advisories, and safety
                        precautions.</li>
                </ul>
            </div>
        </div>
        <div>
            <div class="outer-section cancel-policy">
                <h2 class="section-title">Cancellation Policy</h2>
                <p>
                    For more interesting packages visit us at <strong>www.viztravels.com</strong>. Above rates are
                    subject to availability. Cancellation charges as per company policies. In case we are not able to
                    provide same hotels as mentioned, similar alternatives will be arranged, and any difference in price
                    will be advised.
                </p>
                <p>
                    Package price does not include expenses of personal nature such as laundry, telephone calls, room
                    service, alcoholic beverages, camera fees, etc. Services not mentioned in inclusions will be charged
                    extra.
                </p>
                <p>
                    Hotel check-in and check-out times as per their policies. Guests must carry valid photo ID’s
                    (Driving License, Passport, Voter Card).
                </p>
            </div>
        </div>
    </div>

    <div class="footer-section">
        <h2 class="tours-title">Tours:</h2>
        <ul class="tours-list">
            <li class="tours-item">DHOW CRUISE DINNER - CREEK</li>
            <li class="tours-item">DUBAI CITY TOURS</li>
            <li class="tours-item">ENJOY AT THE TOP BURJ KHALIFA – 124TH FLOOR</li>
            <li class="tours-item">DESERT SAFARI WITH BBQ DINNER AND LIVE ENTERTAINMENT</li>
            <li class="tours-item">GLOBAL VILLAGE</li>
            <li class="tours-item">DUBAI FRAME</li>
            <li class="tours-item">ABU DHABI CITY TOURS</li>
            <li class="tours-item">The View at The Palm Jumeirah Dubai</li>
            <li class="tours-item">Day At Leisure</li>
        </ul>
    </div>

    <!-- Why Section -->
    <div class="footer-section">
        <h2 class="why-title">WHY YOU SHOULD BOOK PACKAGES FROM VIZ TRAVELS?</h2>
        <div class="icons-row">
            <div class="icon-box">
                <img src="/images/logo1.png" alt="Best Price">
                <div class="icon-text">Best Price Guaranteed</div>
            </div>
            <div class="icon-box">
                <img src="/images/logo1.png" alt="Expert">
                <div class="icon-text">Destination Experts</div>
            </div>
            <div class="icon-box">
                <img src="/images/logo1.png" alt="EMI">
                <div class="icon-text">EMI Options</div>
            </div>
            <div class="icon-box">
                <img src="/images/logo1.png" alt="Support">
                <div class="icon-text">On Trip Support</div>
            </div>
            <div class="icon-box">
                <img src="/images/logo1.png" alt="Customized">
                <div class="icon-text">Customized Package</div>
            </div>
            <div class="icon-box">
                <img src="/images/logo1.png" alt="Local Experts">
                <div class="icon-text">Local Experts</div>
            </div>
            <div class="icon-box">
                <img src="/images/logo1.png" alt="Booking">
                <div class="icon-text">Hassle-free Booking</div>
            </div>
            <div class="icon-box">
                <img src="/images/logo1.png" alt="Review">
                <div class="icon-text">Positive Review</div>
            </div>
            <div class="icon-box">
                <img src="/images/logo1.png" alt="24 Hours">
                <div class="icon-text">24/7 Support</div>
            </div>
        </div>
    </div>

    <!-- Note -->
    <div class="footer-section">
        <p class="note"><strong>Note:</strong> Above give quote is based on current rate of exchange. If rate of
            exchange
            changes at the time of final billing, then package quote will change accordingly**.</p>
    </div>
    <!-- Footer -->
    <div class="footer">
        <div class="footer-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-whatsapp"
                viewBox="0 0 16 16">
                <path
                    d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
            </svg>
            <span>7042917770</span>
        </div>
        <div class="footer-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-whatsapp"
                viewBox="0 0 16 16">
                <path
                    d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
            </svg>
            <span>7042917770</span>
        </div>
        <div class="footer-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope"
                viewBox="0 0 16 16">
                <path
                    d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
            </svg>
            <span>info@viztravels.com</span>
        </div>
        <div class="footer-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                class="bi bi-browser-chrome" viewBox="0 0 16 16">
                <path fill-rule="evenodd"
                    d="M16 8a8 8 0 0 1-7.022 7.94l1.902-7.098a3 3 0 0 0 .05-1.492A3 3 0 0 0 10.237 6h5.511A8 8 0 0 1 16 8M0 8a8 8 0 0 0 7.927 8l1.426-5.321a3 3 0 0 1-.723.255 3 3 0 0 1-1.743-.147 3 3 0 0 1-1.043-.7L.633 4.876A8 8 0 0 0 0 8m5.004-.167L1.108 3.936A8.003 8.003 0 0 1 15.418 5H8.066a3 3 0 0 0-1.252.243 2.99 2.99 0 0 0-1.81 2.59M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
            </svg>
            <span>www.viztravels.com</span>
        </div>
    </div>

    <script>
        const itinerary = [
            {
                day: 1,
                title: "DHOW CRUISE DINNER - CREEK",
                tag: "SIC Sightseeing",
                img: "http://localhost:3020/uploads/images/creek.jpeg",
                description: [
                    "The dhow cruise offers a unique way to explore Dubai Creek. Dhows are traditional Bedouin boats that have been transformed into floating restaurants, providing a blend of tradition and modern comfort.",
                    "Upon arrival, guests are greeted with a welcome drink. As the dhow sets sail, you’ll be served delicious barbecued dishes, enhancing your dining experience on the water."
                ],
                note: "Hotel Pickup and Drop included"
            },
            {
                day: 2,
                title: "DUBAI CITY TOURS",
                tag: "SIC Sightseeing",
                img: "/images/city.jpeg",
                description: [
                    "Begin your tour at the iconic Zabeel Palace for a quick photo stop to capture its architectural marvel. Move on to the renowned Dubai Frame for timeless snapshots.",
                    "Explore the charming Bastakiya neighborhood, delving into the history of Dubai through traditional architecture and alleyways. Board an Abra at the Abra Station for a delightful ride on Dubai Creek."
                ],
                note: null
            },
            {
                day: 2,
                title: "ENJOY AT THE TOP BURJ KHALIFA – 124TH FLOOR",
                tag: "SIC Sightseeing",
                img: "/images/burj-khalifa.jpeg",
                description: [
                    "Dubai’s Burj Khalifa, the tallest building in the world, stands tall and proud amongst the other skyscrapers of the city.",
                    "Visit the Observatory Deck on the 124th–125th floors. The highlight is a breathtaking 360° panoramic view of Dubai’s skyline. The fastest elevator ride adds an extra thrill."
                ],
                note: "NOTE: NON PRIME HOURS TICKET 124-125 FLOOR"
            }, {
                day: 3,
                title: "DESERT SAFARI WITH BBQ DINNER AND LIVE ENTERTAINMENT",
                tag: "SIC Sightseeing",
                img: "https://picsum.photos/400/220?random=4",
                description: [
                    "If you want to experience the life in Dubai or UAE before it became the city it is today, a desert safari trip is a must. Our desert safari trip includes spending a few hours time in a Bedouin-style tent, right in the middle of the desert.",
                    "The tour begins with our vehicle picking you up from your home or hotel and driving you down to the outskirts of the desert. Here starts your exciting desert journey in a 4 X 4 Land Cruiser that would take you on a dune bashing ride. Experience your adrenaline going high up while the sand sweeps around your vehicle and you cascade on the steep sand dunes.",
                    "Once you arrive at the desert campsite, you can enjoy your time by riding a camel, smoking a flavored shisha, drinking the traditional Arabic coffee, enjoying the captivating belly dance and Tanura dance. Do not miss the chance to take some breathtaking pictures of the desert in your camera, especially during sunset. The colors of the setting sun on the sands would leave you mesmerized."
                ],
                note: "NOTE: NON PRIME HOURS TICKET 124-125 FLOOR"
            }, {
                day: 4,
                title: "DESERT SAFARI WITH BBQ DINNER AND LIVE ENTERTAINMENT",
                tag: "SIC Sightseeing",
                img: "https://picsum.photos/400/220?random=4",
                description: [
                    "If you want to experience the life in Dubai or UAE before it became the city it is today, a desert safari trip is a must. Our desert safari trip includes spending a few hours time in a Bedouin-style tent, right in the middle of the desert.",
                    "The tour begins with our vehicle picking you up from your home or hotel and driving you down to the outskirts of the desert. Here starts your exciting desert journey in a 4 X 4 Land Cruiser that would take you on a dune bashing ride. Experience your adrenaline going high up while the sand sweeps around your vehicle and you cascade on the steep sand dunes.",
                    "Once you arrive at the desert campsite, you can enjoy your time by riding a camel, smoking a flavored shisha, drinking the traditional Arabic coffee, enjoying the captivating belly dance and Tanura dance. Do not miss the chance to take some breathtaking pictures of the desert in your camera, especially during sunset. The colors of the setting sun on the sands would leave you mesmerized."
                ],
                note: "NOTE: NON PRIME HOURS TICKET 124-125 FLOOR"
            }
        ];
</body>
</html>`;


            // let hotelData = {
            //     confirmationNo: confirmationNo,
            //     name: data.name,
            //     checkIN: formatDate(data.checkin),
            //     checkOut: formatDate(data.checkout),
            //     bookingId: bookingId,
            //     hotel: data.hotel,
            //     address1: hotelObj.street,
            //     address2: hotelObj.area,
            //     address3: hotelObj.country,
            //     price: "Rs " + data.price,
            //     taxesAndFees: "Rs 115.42",
            //     total: "Rs " + (Number(data.price) + 115.42),
            //     BaseUrl: process.env.base_url

            // }
            // Object.keys(hotelData).forEach(key => {
            //     let regex = new RegExp(`{{${key}}}`, "g");
            //     html = html.replace(regex, hotelData[key]);
            // });

            await htmlToPdf(html, fileName);

            // saveObject.name = data.guest
            let saveData = await generatedPdfs(saveObject).save()
            res.send({
                code: constants.successCode,
                message: "PDF generated successfully",
            })

        } else {
            res.send({
                code: constants.errorCode,
                message: "Invalid type"
            })
        }
    } catch (err) {
        res.send({
            code: constants.catchError,
            message: err.message,
            stack: err.stack
        })
    }
}

exports.getPdfs = async (req, res) => {
    try {
        let data = await generatedPdfs.find().sort({ createdAt: -1 })
        res.send({
            code: constants.successCode,
            message: "Data found",
            data: data
        })

    } catch (err) {
        res.send({
            code: constants.catchError,
            message: err.message,
            stack: err.stack
        })
    }
}

exports.getGeneratedPdf = async (req, res) => {
    try {
        let getData = await generatedPdfs.find({ name: { regex: req.params.name, $options: 'i' } }).sort({ createdAt: -1 })
        res.send({
            code: constants.successCode,
            message: "Data found",
            data: getData
        })
    } catch (err) {
        res.send({
            code: constants.catchError,
            message: err.message,
            stack: err.stack
        })
    }
}

const puppeteer = require("puppeteer");

exports.generateItinerary = async (req, res) => {
    try {
        let data = req.body

        // Read your HTML file
        const htmlPath = path.join(__dirname, "index.html");
        let htmlContent = fs.readFileSync(htmlPath, "utf-8");

        // Launch headless browser
        const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] });
        const page = await browser.newPage();
        let array = ["Yas Water World - Abu Dhabi", "X-Line Marina"];
        let selectedLocations = data.locations.map(item => item.location)
        console.log(data.locations);
        let itineraryData = itineraryLocations.filter(item =>
            selectedLocations.some(title => title.trim().toLowerCase() === item.title.trim().toLowerCase())
        );
        console.log(itineraryData);
        let getHotel = await HOTEL.findOne({ name: data.hotel })
        let dataToUpdate = {
            adult: data.persons.adults,
            hostName: data.hostName,
            child: data.persons.children,
            infant: data.persons.infants,
            night: data.nights,
            day: data.days,
            checkin: data.dates.to,
            isSic: data.isAirportDropSic ? "SIC" : "PVT vehicle",
            checkout: data.dates.from,
            hotelName: getHotel.name,
            hotelImage: getHotel.image,
            itineraryData: JSON.stringify(itineraryData)
        }

        // Replace other payload keys if needed
        Object.entries(dataToUpdate).forEach(([key, value]) => {
            // if (key !== "itineraryData") {
            const regex = new RegExp(`{{${key}}}`, "g");
            htmlContent = htmlContent.replace(regex, value);
            // }
        });

        // Set HTML content
        await page.setContent(htmlContent, { waitUntil: "networkidle0" });

        // Generate PDF
        // const outputPath = path.join(__dirname, "Dubai-Itinerary.pdf");
        let fileName = `itinerary/${Date.now()}.pdf`
        const outputPath = path.join(__dirname, "..", "..", "uploads", fileName);
        await page.pdf({
            path: outputPath,
            format: "A4",
            printBackground: true,
            margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
        });

        await browser.close();
        let saveObject = {
            type: data.type,           // save form type
            name: data.hostName,           // use same key as frontend
            price: data.price,         // save price
            flightDate1: data.dates.from,
            flightDate2: data.dates.to,
            pdfUrl: `/uploads/${fileName}`,
            fileName: fileName,
            date: data.date || new Date()
        }
        let saveData = await generatedPdfs(saveObject).save()
        console.log(`PDF generated at: ${outputPath}`);
        res.send({
            code: constants.successCode,
            message: "PDF generated successfully",
            data: saveData
        })
        //
        // return outputPath;
    } catch (error) {
        res.send({
            code: constants.catchError,
            message: error.message,
            stack: error.stack
        })
    }
};

exports.locations = async (req, res) => {
    try {
        let locations = [
            { "key": "At The Top - Burj Khalifa", "value": "At The Top - Burj Khalifa" },
            { "key": "Al Shindagha Museum", "value": "Al Shindagha Museum" },
            { "key": "Atlantis Aquaventure", "value": "Atlantis Aquaventure" },
            { "key": "Abu Dhabi City Tour", "value": "Abu Dhabi City Tour" },
            { "key": "Aya Universe", "value": "Aya Universe" },
            { "key": "Big Bus Tour", "value": "Big Bus Tour" },
            { "key": "Bird Show - Creek Park", "value": "Bird Show - Creek Park" },
            { "key": "Burj Al Arab - Inside Tour", "value": "Burj Al Arab - Inside Tour" },
            { "key": "Butterfly Garden", "value": "Butterfly Garden" },
            { "key": "Crocodile Park Dubai", "value": "Crocodile Park Dubai" },
            { "key": "Desert Safari", "value": "Desert Safari" },
            { "key": "Dhow Cruise", "value": "Dhow Cruise" },
            { "key": "Dolphin show", "value": "Dolphin show" },
            { "key": "Dubai Aquarium & Under Water Zoo", "value": "Dubai Aquarium & Under Water Zoo" },
            { "key": "Dubai Balloon", "value": "Dubai Balloon" },
            { "key": "Dubai City Tour", "value": "Dubai City Tour" },
            { "key": "Dubai Frame", "value": "Dubai Frame" },
            { "key": "Dubai Miracle Garden", "value": "Dubai Miracle Garden" },
            { "key": "Dubai Park & Resorts", "value": "Dubai Park & Resorts" },
            { "key": "Dubai Safari Park", "value": "Dubai Safari Park" },
            { "key": "Ferrari World Abu Dhabi", "value": "Ferrari World Abu Dhabi" },
            { "key": "Garden Glow Dubai", "value": "Garden Glow Dubai" },
            { "key": "Global Village", "value": "Global Village" },
            { "key": "Green Planet Dubai", "value": "Green Planet Dubai" },
            { "key": "IMG Worlds of Adventure", "value": "IMG Worlds of Adventure" },
            { "key": "La Perle", "value": "La Perle" },
            { "key": "Lost Chambers Aquarium", "value": "Lost Chambers Aquarium" },
            { "key": "Louvre Museum Abu Dhabi", "value": "Louvre Museum Abu Dhabi" },
            { "key": "Madame Tussauds", "value": "Madame Tussauds" },
            { "key": "Mono Rail", "value": "Mono Rail" },
            { "key": "Museum of The Future", "value": "Museum of The Future" },
            { "key": "Qasr Al Watan", "value": "Qasr Al Watan" },
            { "key": "Sea World Abu Dhabi", "value": "Sea World Abu Dhabi" },
            { "key": "Ski Dubai", "value": "Ski Dubai" },
            { "key": "Sky Dive Dubai", "value": "Sky Dive Dubai" },
            { "key": "Sky view Observatory", "value": "Sky view Observatory" },
            { "key": "Sky View Edge Walk", "value": "Sky View Edge Walk" },
            { "key": "Snow Park Abu Dhabi", "value": "Snow Park Abu Dhabi" },
            { "key": "Storm Coaster Dubai", "value": "Storm Coaster Dubai" },
            { "key": "View At The Palm", "value": "View At The Palm" },
            { "key": "Warner Bros World - Abu Dhabi", "value": "Warner Bros World - Abu Dhabi" },
            { "key": "Wild Wadi Water Park", "value": "Wild Wadi Water Park" },
            { "key": "X-Line Marina", "value": "X-Line Marina" },
            { "key": "Yas Water World - Abu Dhabi", "value": "Yas Water World - Abu Dhabi" }
        ]

        res.send({
            code: constants.successCode,
            message: "Success",
            data: locations
        })
    } catch (err) {
        res.send({
            code: constants.catchError,
            message: err.message,
            stack: err.stack
        })
    }
}
