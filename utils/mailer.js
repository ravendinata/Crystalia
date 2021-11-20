require('dotenv').config();

const Mailer = require('nodemailer');

var transporter = Mailer.createTransport
({
    service: 'gmail',
    auth:
    {
        user: process.env.mail_user,
        pass: process.env.mail_password
    }
});

module.exports =
{
    sendNotification(mailContent)
    {
        var mailOptions =
        {
            from: 'skyrin.crystalia@gmail.com',
            to: 'raven.limadinata@outlook.com',
            subject: 'Crystalia Notification (Do Not Reply)',
            text: mailContent
        }

        transporter.sendMail(mailOptions, function(err, info)
        {
            if (err)
                console.info(err);
            else
                console.info("Notification Sent! | " + info.response);
        });
    }
}