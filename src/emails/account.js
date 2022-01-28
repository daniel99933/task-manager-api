const sgMail = require("@sendgrid/mail")

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "yltamaf@connect.ust.hk",
        subject: "Welcome to the task manager app!",
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.` 
    })
}

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "yltamaf@connect.ust.hk",
        subject: "Your task manager account is removed",
        text: `Hi ${name},

Sorry to hear that you removed your account on task manager. Please let us know what we can improve, your feedback is extremely important to us. Hope to see you again in the future!

Best,
Task Manager App`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}