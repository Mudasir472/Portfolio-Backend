const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db");
const Contact = require("./contact.modal");
const nodemailer = require("nodemailer");

dotenv.config();
connectDB();

const app = express();
app.use(cors({
    origin: ["https://portfolio-backend-two-iota.vercel.app", "http://localhost:5173", "*"], // React frontend URL
    credentials: true,
}));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Portfolio Backend Running 🚀");
});

app.post("/contact", async (req, res) => {
    try {
        const { firstName, lastName, email, phone, message } = req.body;

        if (!firstName || !email || !message) {
            return res.status(400).json({
                success: false,
                msg: "Please fill required fields"
            });
        }

        // Save in MongoDB
        await Contact.create({ firstName, lastName, email, phone, message });

        // (Optional) Send Email
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: email,
            to: process.env.MAIL_USER,
            replyTo: email,
            subject: `📬 New Contact Message from ${firstName} ${lastName}`,
            html: `
                <div style="max-width:600px;margin:auto;padding:20px;
              background:#f8f9fa;border-radius:10px;
              font-family:Arial,Helvetica,sans-serif;">
      
      <h2 style="color:#333;margin-bottom:10px;">
        New Portfolio Contact
      </h2>
      
      <p style="color:#555;">You received a new contact message from your portfolio.</p>

      <div style="background:white;padding:15px;border-radius:8px;
                  border:1px solid #ddd;">
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "N/A"}</p>
          <p><strong>Message:</strong><br>
            <span style="white-space:pre-line;">${message}</span>
          </p>
      </div>

      <p style="margin-top:15px;color:#777;font-size:13px;">
        Sent on: ${new Date().toLocaleString()}
      </p>
  </div>
  `
        });

        res.json({ success: true, msg: "Message Sent Successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, msg: "Server Error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server Running on ${PORT}`));
