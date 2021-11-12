require('dotenv').config();

const Discord = require('discord.js');
const prefix = process.env.prefix;

/*
    CRYSTALIA FRAMEWORK
    ===================
    Version 0.1a
*/

// Genarate SQL Pool
var mysql = require('mysql');
var pool = mysql.createPool({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_name
});

// ========== Randomizer Functions ========== //

function randomInteger(min, max)
{
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomInteger(max)
{
    return Math.floor(Math.random() * max);
}

function selectRandomAndCompare(min, max, last, change = 0)
{
    var n = randomInteger(max) + min;

    if (n == last && max != 0)
    {
        if (n == 0)
            n++;
        else if (n == max)
            n--;
        else
            randomInteger(1) == 1 ? n++ : n--;

        change = n - last;
    }

    return { id: n, change: change };
}


// ========== Data / Info Puller ========== //

/* Colour Function */
function getGroupColour(group)
{
    if (group === 'akb48') return '#ff69b3';
    else if (group === 'hkt48') return '#000000';
    else if (group === 'ngt48') return '#ff0000';
    else if (group === 'nmb48') return '#eb9d47';
    else if (group === 'ske48') return '#f7b501';
    else if (group === 'stu48') return '#d0e7f9';
}

/* Converts UNIX Timestamp (Epoch) to hh:mm:ss time (24 hour) */
function convertEpochTo24hr(epoch)
{
    var date = new Date(epoch * 1000);

    var hh = date.getHours();
    var mm = "0" + date.getMinutes();
    var ss = "0" + date.getSeconds();

    // Return 24hr time in hh:mm:ss format
    return hh + ':' + mm.substr(-2) + ':' + ss.substr(-2); 
}

function getRoomId(group, short)
{
    var id;

    pool.getConnection((err, con) =>
    {
        con.query(`SELECT sr_roomid FROM ` + group + ` WHERE short='` + short + `' OR common='` + short + `'`, function(err, rows)
        {
            if (err) 
            {
                console.info(err);
                return -1;
            }

            if (rows[0] == undefined)
            {
                console.info("No rows found!");
                return undefined;
            }

            const result = JSON.stringify(rows[0]);
            const data = JSON.parse(result);

            id = data.sr_roomid;

            console.info(`=== DEBUG @ ID Search ===\n> Search Check: ${id}`);
        })
    })

    return new Promise(resolve => { setTimeout(() => { resolve(id); }, 2000); })
}


/** ====================
 * * MODULE EXPORTS * * 
===================== */

module.exports =
{
    randomInteger,
    getGroupColour,
    selectRandomAndCompare,
    convertEpochTo24hr,
    getRoomId
}