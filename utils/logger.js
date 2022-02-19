const fs = require('fs');

let dateObject = new Date();
let date_today = dateObject.getFullYear() + ("0" + (dateObject.getMonth() + 1)).slice(-2) + ("0" + dateObject.getDate()).slice(-2);
let time_now = ("0" + dateObject.getHours()).slice(-2) + ("0" + dateObject.getMinutes()).slice(-2);

if (!fs.existsSync('logs'))
    fs.mkdirSync('logs');

function appendLog(log)
{
    fs.appendFile('./logs/log.log', `${log}\r\n`, (err) =>
    {
        if (err)
        {
            console.info(err);
        }
    });
}

function info(message)
{
    console.info(message);
    appendLog(`[INFO]  ${date_today} - ${time_now}:  ${message}`);
}

module.exports = { info };