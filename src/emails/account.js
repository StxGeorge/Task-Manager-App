
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'fsaraco@autogenesis.eu',
        subject: 'Welcome!',
        text: `Hello ${name}, Welcome to Our great Service!`
    });
};

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'fsaraco@autogenesis.eu',
        subject: 'Good Bye',
        text: `Hello ${name}, We are sorry to see you go, please tell us if we can change
         something to accomodate your needs in the future`
    });
};

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
};
