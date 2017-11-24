const nodemailer = require('nodemailer');
const config1 = require('../config/default');
exports.post=async function(ctx, next) {
    var a=ctx.body;
    let smtpTransport;
    try {
        smtpTransport = nodemailer.createTransport({
            host: 'smtp.yandex.ru',
            port: 465,
            secure: true, // true for 465, false for other ports 587
            auth: {
                user: config1.emailFrom,
                pass: config1.emailPassword
            }
        });
    } catch (e) {
        return console.log('Error: ' + e.name + ":" + e.message);
    }

    let mailOptions = {
        from: config1.emailFrom, // sender address
        to: config1.emailTo, // list of receivers
        subject: 'Заказ на сайте bteam', // Subject line
        text: 'Заказ на сайте bteam', // plain text body
        html: getMessage() // html body
    };

    smtpTransport.sendMail(mailOptions, (error, info) => {
        if (error) {
            // return console.log(error);
            return console.log('Error');
        } else {
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }
    });

}


function getMessage() {

    return `
    <p>You have a new contact request</p>
    `
}


/*
`
<p>You have a new contact request</p>
<h3>Contact Details</h3>
<ul>
  <li>Name: ${req.body.name}</li>
  <li>Company: ${req.body.company}</li>
  <li>Email: ${req.body.email}</li>
  <li>Phone: ${req.body.phone}</li>
</ul>
<h3>Message</h3>
<p>${req.body.message}</p>
<h3>Headers</h3>
<ul>
  <li>cookie: ${req.headers.cookie}</li>
  <li>user-agent: ${req.headers["user-agent"]}</li>
  <li>referer: ${req.headers["referer"]}</li>
  <li>IP: ${req.ip}</li>
</ul>
  `*/
