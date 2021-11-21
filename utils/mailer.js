require('dotenv').config();

const Mailer = require('nodemailer');

var gmailSvc = Mailer.createTransport
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
        var message =
        {
            from: 'skyrin.crystalia@gmail.com',
            to: 'raven.limadinata@outlook.com',
            subject: 'Crystalia Notification (Do Not Reply)',
            text: mailContent
        };

        gmailSvc.sendMail(message, function(err, info)
        {
            if (err)
                console.info(err);
            else
                console.info("Notification Sent! | " + info.response);
        });
    }
}