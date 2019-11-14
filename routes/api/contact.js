const route = require("express").Router();
const nodemailer = require("nodemailer");

const { userAuthViaToken, adminAuth } = require("../../middlewares");
const { getContact, addToContact } = require("../../controllers");
const config = require("../../config.prod");

route.get("/", userAuthViaToken, async (req, res) => {
  try {
    const contact = await getContact();
    res.status(200).send({
      success: true,
      user: req.user,
      contact
    });
  } catch (err) {
    res.status(500).send({
      error: "Internal Server Error"
    });
  }
});

route.post("/", adminAuth, async (req, res) => {
  try {
    await addToContact(req.body.body);
    res.status(200).send({
      success: true,
      message: "Contact successfully added"
    });
  } catch (err) {
    res.status(500).send({
      error: "Internal Server Error"
    });
  }
});

route.post("/mail", userAuthViaToken, async (req, res) => {
  try {
    const EMAIL_ID = config.EMAIL_ID;
    const EMAIL_PASS = config.EMAIL_PASS;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_ID,
        pass: EMAIL_PASS
      }
    });
    const mailOptions = {
      from: EMAIL_ID,
      to: EMAIL_ID,
      subject: "Message from a user",
      html: `<p>${req.body.message}</p>
      <p>From <br/>
      ${req.body.name} <br/>
      Email : ${req.body.email}</p>`
    };
    const info = await transporter.sendMail(mailOptions);
    res.status(200).send({
      success: true,
      message: "mail sent"
    });
  } catch (err) {
    res.status(500).send({
      error: "Internal Server Error"
    });
  }
});

module.exports = route;
