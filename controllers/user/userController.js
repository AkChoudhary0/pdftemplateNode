const userService = require("../../services/userService/userService")
const constants = require("../../config/constants")
const generatedPdfs = require("../../models/user/generatedPdfs")

const bcrypt = require("bcrypt")
const jwtToken = require("jsonwebtoken")
const { date } = require("joi")

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
        let data = req.body
        data.email = "tajgateway2@gmail.com"
        data.name = "Sakshi"
        data.phone = "9371000044"
        let hashedPassword = await bcrypt.hash("Sakshi@123", 10)
        data.password = hashedPassword
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

exports.loginUser = async (req, res) => {
    try {
        let data = req.body
        let user = await userService.findOneUser({ email: data.email })
        if (!user) {
            res.send({
                code: constants.userNotFound,
                message: "User not found"
            })
            return;
        }

        let isMatch = await bcrypt.compare(data.password, user.password)
        if (!isMatch) {
            res.send({
                code: constants.invalidCredentials,
                message: "Invalid credentials"
            })
            return;
        }

        let token = jwtToken.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
        res.send({
            code: constants.successCode,
            message: "Login successful",
            data: {
                user,
                token
            }
        })
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

        const fs = require("fs");
        const path = require("path");
        const pdf = require("html-pdf-node");

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
            return `Ticket No: ${number}`;
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
                                <p><img src="./images/plane-taking-off.png" width="30px" /> {{source}} - {{destination}}</p>
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
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"><strong>IndiGo 6E 1462</strong> <br/>Economy Class</p>
                            </td>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px;">{{source}} <br/><strong>Dubai International Airport (DXB)</strong> <br/>Terminal 1</p>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"><strong>{{departureDate}}<br/>{{departureTime}}</strong></p>
                            </td>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px;">{{destination}} <br/><strong>Indira Gandhi International Airport (DEL)</strong> <br/>Terminal 1</p>
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
                                        <td style="border: 1px solid;"> <p style="padding-left: 10px; font-size: 13px; line-height: 13px; margin: 1px;"></p></td>
                                    </tr>
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
            let onewayData = {
                pnrCode: pnrNumber,
                bookingId: bookingCode,
                issueDate: new Date(),
                name: data.name,
                ticketNumber: pnrNumber + "-" + 1,
                source: data.source,
                destination: data.destination,
                baseFare: "Rs " + data.price,
                feeAndSurcharge: "Rs 4460.0",
                totalAmount: "Rs " + totalAmount,
                "pax-name": data.name,
                segments: data.source + " - " + data.destination,
                departureDate: data.date,
                departureTime: "11:50 AM",
                arrivalDate: data.date,
                arrivalTime: "04:50 PM",

            }
            Object.keys(onewayData).forEach(key => {
                let regex = new RegExp(`{{${key}}}`, "g");
                html = html.replace(regex, onewayData[key]);
            });


            htmlToPdf(html, fileName + ".pdf");

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
                            <td><img src="./controllers/user/image/Vector.png" width="30px" height="20px" style="margin-right: 10px;"  alt="airport">New Delhi <img width="20px" height="20px" style="margin:0px 10px; opacity: 0.5;" src="./controllers/user/images/exchange.png"  alt="airport"> Duba</td>
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
                                <p><img src="./images/plane-taking-off.png" width="40px" height="30px" style="margin-right: 10px;"  alt="airport"> <strong>Departure</strong></p>
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
                        <tr style="margin-top:20px;">
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; ">
                                    Emirates<br />
                                    EK - 517<br />
                                    Economy Class</p>
                            </td>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; ">{{departureDate}}
                                    At<br />
                                    16:20<br />
                                    IndiraGandh<br />
                                    Terminal 3<br />
                                     <br/>
                                    <span style="color: #785e60; margin-top: 10px;"> Confirmed </span></p>
                            </td>
                            <td><img src="./controller/user/images/arrow.png" width="40px" height="30px" style="margin-right: 10px;"  alt="airport"></td>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; ">{{departureDate}}
                                    At 18:20 <br />
                                    DubaiInternational <br />
                                    Airport<br />
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
                                <p><img src="./controllers/user/images/plane-landing.png" width="40px" height="30px" style="margin-right: 10px;"  alt="airport"><strong>Arrival</strong></p>
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
                                    Emirates<br />
                                    EK - 517<br />
                                    Economy Class</p>
                            </td>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; ">{{returnDate}}
                                    At<br />
                                    16:20<br />
                                    IndiraGandh<br />
                                    Terminal 3<br />
                                    <br/>
                                    <span style="color: #785e60; margin-top: 10px;"> Confirmed </span></p>
                            </td>
                            <td><img src="./images/arrow.png" width="40px" height="30px" style="margin-right: 10px;"  alt="airport"></td>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; ">{{returnDate}}
                                    At 18:20 <br />
                                    DubaiInternational <br />
                                    Airport<br />
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
        
                    <table style="width: 100%; padding: 0px 25px;border-bottom: 1px solid;">
                        <!-- Guest Info -->
                        <tr style="margin-top:20px;">
                            <td>
                                <p><img src="./controller/user/images/traveler-with-a-suitcase.png" width="30px" /><br/><strong>{{name}}</strong></p>
                            </td>
                            <td style="width: 40%;">
        
                            </td>
                        </tr>
        
                    </table>
                    <table style="width: 100%; padding: 10px 25px;">
                        <!-- Guest Info -->
                        <tr style="margin-top:20px;">
                            <td>
                                <img src="./controller/userimages/person.png" width="30px" />
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
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; "><strong>{{issueDate}}</strong></p>
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
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; "><strong>25
                                        SEP 2025</strong></p>
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
                            <td colspan="2" style="border: 1px solid black; text-align: left; padding: 3px 10px;"><img src="./controller/user/images/credit-cards-payment.png" style="margin-right: 10px;" width="30px" />Fare Details</td>
                            
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
                                    AED 0.00</p>
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
                                    AED 0.00</p>
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
                price: "AED " + data.price,
                taxAndFee: "AED 710.00",
                total: "AED " + (Number(data.price) + 710),
            }
            Object.keys(roundtripData).forEach(key => {
                let regex = new RegExp(`{{${key}}}`, "g");
                html = html.replace(regex, roundtripData[key]);
            });

            htmlToPdf(html, fileName + ".pdf");
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
                        <p style="font-size: 17px; margin: 20px 0px; line-height: 10px; font-weight: 700; color: #3a508a; ">Guest: {{name}}</p>
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
                <li style="padding-left: 10px; font-size: 13px; line-height: 18px;">A tax is imposed by the city: AED 15.00 per accommodation, per night</li>
             </ul>
              <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"> We have included all charges provided to us by the property.</p>
               <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"> <strong>Extra Guest Info</strong> </p>
              <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"> We don't guarantee an Extra Bed for Extra guests, it is subject to availability of the hotel and may be chargeable
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
                name: data.guest,
                checkIN: formatDate(data.checkin),
                checkOut: formatDate(data.checkout),
                bookingId: bookingId,
                hotel: data.hotel,
                address1: hotelObj.street,
                address2: hotelObj.area,
                address3: hotelObj.country,
                price: "Rs " + data.price,
                taxesAndFees: "AED 115.42",
                total: "Rs " + (Number(data.price) + 115.42),
            }
            Object.keys(hotelData).forEach(key => {
                let regex = new RegExp(`{{${key}}}`, "g");
                html = html.replace(regex, hotelData[key]);
            });

            htmlToPdf(html, fileName + ".pdf");
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

