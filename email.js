const nodemailer = require("nodemailer");

const sendEmail = async () => {
  try {
    // 1. Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",      // e.g. "smtp.gmail.com"
      port: 587,      // e.g. 465 (SSL) or 587 (TLS)
    //   secure: true,// true if port 465
      auth: {
        user: "anil@idryno.com",    // your email
        pass: "pxhj omhd ojxs ecxr",    // app password or real password
      },
    });

    // 2. Email options
    const mailOptions = {
      from: `"testttt" <anil@idryno.com>`,
      to: "choudhary22anil@gmail.com",
        subject: "No Subject",
      text:"this is the testing email",
     
    };

    // 3. Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent: %s", info.messageId);

    return info;
  } catch (err) {
    console.error("❌ Error sending email:", err);
    throw err;
  }
};

console.log("checking++++++",sendEmail())

sendEmail()