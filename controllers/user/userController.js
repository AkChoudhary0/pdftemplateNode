const userService = require("../../services/userService/userService")
const constants = require("../../config/constants")

const bcrypt = require("bcrypt")
const jwtToken = require("jsonwebtoken")



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

exportsconvertPdf = async (req, res) => {
    try {
        let data = req.body
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
        <table width="750" cellspacing="0" cellpadding="0" border="0" style="background:#fff; width: 750px; font-family: 'Raleway', sans-serif;
  font-optical-sizing: auto; border:1px solid #ddd; border-radius:6px; overflow:hidden;">
            <tr>
                <td>
                    <table style="width: 100%;">
                        <tr>
                            <td></td>
                    <td style="width: 40%;">
                        <p style="font-size: 17px; text-align: end; padding-right: 30px; line-height: 10px; font-weight: 700; color: #3a508a; ">PNR: R5QQ8J
</p>
                       
<p style="font-size: 13px; text-align: end; padding-right: 40px; line-height: 10px; ">Booking Id : tpof3</p>
<p style="font-size: 13px; text-align: end; padding-right: 40px; line-height: 10px;">Issued Date : Wed 10 Sep 2025</p>
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
                <table style="width: 100%; padding: 10px 25px; border-bottom: 1px dashed;">
                   <!-- Guest Info -->
          <tr style="margin-top:20px;">
            <th style=" text-align: left; padding: 13px 10px;">Traveller Details</th>
          </tr>
          <tr>
            <td>
                <table border="1px" style=" border-collapse: collapse; width: 100%;">
                    <tr>
                        <th style="border: 1px solid; background-color: #efefef;text-align: left;padding-left: 5px; font-size: 13px; line-height: 13px;">Passenger Name</th>
                        <th style="border: 1px solid; background-color: #efefef; text-align: left; padding-left: 5px; font-size: 13px; line-height: 13px;">Ticket Number</th>
                        <th style="border: 1px solid; background-color: #efefef; text-align: left; padding-left: 5px; font-size: 13px; line-height: 13px;">Frequent Flyer No.</th>
                    </tr>
                    <tr>
                        <td style="border: 1px solid;"> <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"> 1. Mr PANKAJ KUMAR</p></td>
                        <td style="border: 1px solid;"> <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"> R5QQ8J-1</p></td>
                        <td style="border: 1px solid;"> <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"></p></td>
                    </tr>
                </table>
            </td>
          </tr>
                </table>
                <table style="width: 100%; padding: 0px 25px;">
                    <tr>
                        <td>
                            <p><img src="./images/plane-taking-off.png" width="30px" /> DXB - DEL</p>
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
                             <p style="padding-left: 10px; font-size: 13px; line-height: 13px;">Dubai (DXB) <br/><strong>Dubai International Airport
(DXB)</strong> <br/>Terminal 1</p>
<p style="padding-left: 10px; font-size: 13px; line-height: 13px;"><strong>Wednesday <br/>
24 Sep 2025<br/>
11:50 AM</strong> </p>
                        </td>
                        <td>
                               <p style="padding-left: 10px; font-size: 13px; line-height: 13px;">Delhi (DEL)
 <br/><strong>Indira Gandhi International
Airport (DEL)</strong> <br/>Terminal 1</p>
<p style="padding-left: 10px; font-size: 13px; line-height: 13px;"><strong>Wednesday <br/>
24 Sep 2025<br/>
04:50 PM</strong> </p>
                        </td>
                        <td>
                            <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"> <strong> CONFIRMED </strong> <br/>
Airline PNR: R5QQ8J <br/>
Baggage <br/>
Adult: 30 Kg <br/>
Refundable
</p>
                        </td>
                    </tr>
                </table>
               

                  <table style="width: 100%; padding: 10px 25px;">
                   <!-- Guest Info -->
          <tr style="margin-top:20px;">
            <th style=" text-align: left; padding: 3px 10px;">Payment Details</th>
          </tr>
         <tr>
            <td>
                <table style="width: 100%; border: 1px solid; margin-bottom: 20px;">
                    <tr>
                        <td style="width: 50%; border-right: 1px solid;"> <p style="padding-left: 10px; font-size: 13px; line-height: 13px;  margin: 1px;">Base Fare</p></td>
                        <td> <p style="padding-left: 10px; font-size: 13px; line-height: 13px; margin: 1px;">Rs 4460.0</p></td>
                    </tr>
                    <tr>
                        <td style="width: 50%; border-right: 1px solid;"> <p style="padding-left: 10px; font-size: 13px; line-height: 13px;  margin: 1px;">Fee & Surcharge</p></td>
                        <td> <p style="padding-left: 10px; font-size: 13px; line-height: 13px;  margin: 1px;">Rs 4460.0</p></td>
                    </tr>
                    <tr style="background-color: #efefef;">
                        <td style="width: 50%; border-right: 1px solid;"> <p style="padding-left: 10px; font-size: 13px; line-height: 13px;  margin: 1px;"><strong>Total Amount</strong></p></td>
                        <td> <p style="padding-left: 10px; font-size: 13px; line-height: 13px;  margin: 1px;"><strong>Rs 8560.0
</strong></p></td>
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
                        <td style="width: 50%; border: 1px solid;"> <p style="padding-left: 10px; font-size: 13px; line-height: 13px;">PANKAJ KUMAR</p></td>
                        <td style="border: 1px solid;"> <p style="padding-left: 10px; font-size: 13px; line-height: 13px;  margin: 1px;">DXB-DEL</p></td>
                        <td style="border: 1px solid;"> <p style="padding-left: 10px; font-size: 13px; line-height: 13px;  margin: 1px;"></p></td>
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
                   <!-- Guest Info -->
           <tr>
                <td>
                    <table style="width: 100%; padding: 10px 25px;">
                        <!-- Guest Info -->
                        <tr style="margin-top:20px;">
                            <th style=" text-align: left; padding: 3px 10px;">
                                Terms & Conditions</th>
                        </tr>
                        <tr>
                            <td style="padding-bottom: 20px; border-bottom: 1px dashed;">
                                <ul>
                                    <li style="padding-left: 10px; font-size: 13px; line-height: 16px;">All Passengers must carry a Valid Photo Identity Proof at the time of Check-in.</li>
                                    <li style="padding-left: 10px; font-size: 13px; line-height: 16px;">Please
                                        Re-check the passenger name(s) as per the passport/identity proof,
                                        departure, arrival date,tim
                                        e, flight number, terminal, baggage details etc.</li>
                                    <li style="padding-left: 10px; font-size: 13px; line-height: 16px;">This can include: Driving License, Passport, PAN Card, Voter ID Card or any other ID issued by the Government of India. For infant
passengers, it is mandatory to carry the Date of Birth certificate.
</li>
                                    <li style="padding-left: 10px; font-size: 13px; line-height: 16px;">Reach the terminal at least 2 hours prior to the departure for domestic flight and 4 hours prior to the departure of international
flight.
</li>
                                    <li style="padding-left: 10px; font-size: 13px; line-height: 16px;">Flight timings are subject to change without prior notice. Please recheck with the carrier prior to departure</li>
                                    
                                </ul>
        
                            </td>
                        </tr>

                         <tr style="margin-top:20px;">
                            <th style=" text-align: left; padding: 3px 10px;">
                               Baggage Information
</th>
                        </tr>
                        <tr>
                            <td style="padding-bottom: 20px;">
                                <ul>
                                    <li style="padding-left: 10px; font-size: 13px; line-height: 16px;">Free Cabin Baggage Allowance: As per Bureau of Civil Aviation Security (BCAS) guidelines traveling passenger may carry maximum
7 Kgs per person per flight (only one piece measuring not more than 55 cm x 35 cm x 25 cm, including laptops or duty free
shopping bags). The dimensions of the checked Baggage should not exceed 158 cm (62 inches) in overall dimensions (L + W + H).</li>
                                    
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
                                    05 SEP 2025</p>
                                <p
                                    style="font-size: 13px; text-align: end; padding-right: 40px; line-height: 10px;">
                                    FRIDAY</p>
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
                                    MR.PANKAJ KUMAR </p>
                            </td>
                            <td style="width: 40%;">
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px;">
                                    <strong>Booking Reference Flight: <span style="color: red;"> T3BR-F1457556
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
                            <td><img src="./images/Vector.png" width="30px" height="20px" style="margin-right: 10px;"  alt="airport">New Delhi <img width="20px" height="20px" style="margin:0px 10px; opacity: 0.5;" src="./images/exchange.png"  alt="airport"> Duba</td>
                            <td style="width: 40%;">
                                <p
                                    style="padding-left: 10px; font-size: 13px; line-height: 13px;text-align: end;">
                                    Trip ID AGN27705WALTOPORT9905</p>
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
                                    Airline PNR: N84FG2</p>
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
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; ">10 SEP 2025
                                    At<br />
                                    16:20<br />
                                    IndiraGandh<br />
                                    Terminal 3<br />
                                     <br/>
                                    <span style="color: #785e60; margin-top: 10px;"> Confirmed </span></p>
                            </td>
                            <td><img src="./images/arrow.png" width="40px" height="30px" style="margin-right: 10px;"  alt="airport"></td>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; ">10 SEP 2025
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
                                <p><img src="./images/plane-landing.png" width="40px" height="30px" style="margin-right: 10px;"  alt="airport"><strong>Arrival</strong></p>
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
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; ">10 SEP 2025
                                    At<br />
                                    16:20<br />
                                    IndiraGandh<br />
                                    Terminal 3<br />
                                    <br/>
                                    <span style="color: #785e60; margin-top: 10px;"> Confirmed </span></p>
                            </td>
                            <td><img src="./images/arrow.png" width="40px" height="30px" style="margin-right: 10px;"  alt="airport"></td>
                            <td>
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; ">10 SEP 2025
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
                                <p><img src="./images/traveler-with-a-suitcase.png" width="30px" /><br/><strong>MR. PANKAJ KUMAR</strong></p>
                            </td>
                            <td style="width: 40%;">
        
                            </td>
                        </tr>
        
                    </table>
                    <table style="width: 100%; padding: 10px 25px;">
                        <!-- Guest Info -->
                        <tr style="margin-top:20px;">
                            <td>
                                <img src="./images/person.png" width="30px" />
                            </td>
                            <td style="width: 40%; text-align: end;">
                                <p><strong>Ticket No: 1765344874580</strong></p>
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
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px; "><strong>10
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
                            <td colspan="2" style="border: 1px solid black; text-align: left; padding: 3px 10px;"><img src="./images/credit-cards-payment.png" style="margin-right: 10px;" width="30px" />Fare Details</td>
                            
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
                                    AED 1,830.00</p>
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
                                    AED 710.00</p>
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
                                <p style="padding-left: 10px; font-size: 13px; line-height: 13px;">Total <strong
                                        style="padding-left: 20px;"> AED 2840</strong> </p>
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
                        <p style="font-size: 17px; text-align: end; padding-right: 30px; line-height: 10px; font-weight: 700; color: #3a508a; ">9081659829683</p>
                        <!-- <br/> -->
                        <p style="font-size: 17px; margin: 20px 0px; line-height: 10px; font-weight: 700; color: #3a508a; ">Guest: MR PANKAJ KUMAR</p>
                        <p style="font-size: 13px; text-align: end; padding-right: 40px; line-height: 10px;">Check in : SEP, 10 2025</p>
                        <p style="font-size: 13px; text-align: end; padding-right: 40px; line-height: 10px;">Checkout : SEP, 25  2025</p>
                        <p style="font-size: 13px; text-align: end; padding-right: 40px; line-height: 10px; ">Booking Id : tpof3</p>
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
            <th style="background-color:#eeeeee; text-align: left; padding: 3px 10px;">Homeland Hostel</th>
          </tr>
          <tr>
            <td>
              <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"> Address: Sheikh Zayed Rd - Al Barsha 1 - Dubai,</p>
              <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"> Dubai, United Arab Emirates</p>
              <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"> Phone No: 971-501232896
              </p>
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
              <p style="padding-left: 10px; font-size: 13px; line-height: 13px;"> 1.<strong style="color: #3a508a; font-size: 15px;">Mr PANKAJ KUMAR</strong>  (Adult)</p>
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
                        <td style="padding-left: 10px; font-size: 13px; line-height: 13px; padding-bottom: 4px;">Rs. 120009.58</td>
                    </tr>
                    <tr>
                        <td style="padding-left: 10px; font-size: 13px; line-height: 13px; padding-bottom: 4px;">Taxes and Fees </td>
                        <td style="padding-left: 10px; font-size: 13px; line-height: 13px; padding-bottom: 4px;">Rs. 115.42</td>
                    </tr>
                    <tr>
                        <td style="padding-left: 10px; background-color:#eeeeee; font-size: 13px; line-height: 13px;"><strong> Total Price </strong></td>
                        <td style="padding-left: 10px; background-color:#eeeeee; font-size: 13px; line-height: 13px;"><strong>Rs. 1,50,000.0 </strong></td>
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

exports.convertPdf = async (req, res) => {
    try {

    } catch (err) {
        res.send({
            code: constants.catchError,
            message: err.message,
            stack: err.stack
        })
    }
}

