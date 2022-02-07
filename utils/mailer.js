const Mailer = require('nodemailer');

var mailSvc = Mailer.createTransport
({
    pool: true,
    host: process.env.mail_host,
    port: process.env.mail_port,
    secure: true,
    auth:
    {
        user: process.env.mail_user,
        pass: process.env.mail_password
    },
    tls: { rejectUnauthorized: false, },
});

module.exports =
{
    sendNotification(mailContent)
    {
        var message =
        {
            from: 'crystalia@skyrin.tech',
            to: 'raven.limadinata@outlook.com',
            subject: 'Crystalia Notification (Do Not Reply)',
            text: mailContent
        };

        mailSvc.sendMail(message, function(err, info)
        {
            if (err)
                console.info(err);
            else
                console.info("Notification Sent! | " + info.response);
        });
    }
}