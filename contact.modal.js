const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: String,
    email: { type: String, required: true },
    phone: String,
    message: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Contact", contactSchema);
