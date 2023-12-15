const { EmbedBuilder } = require('discord.js');
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

// ========== Common Variables ========== //
class CommonVariables
{
    static groups = (
        { name: 'AKB48', value: 'akb48' },
        { name: 'SKE48', value: 'ske48' },
        { name: 'NMB48', value: 'nmb48' },
        { name: 'HKT48', value: 'hkt48' },
        { name: 'NGT48', value: 'ngt48' },
        { name: 'STU48', value: 'stu48' }
    );
}

// ========== Waiter Class ========== //
class Waiter
{
    constructor(message) { this.message = message; }

    async send(content = "Please wait...")
    {
        
        this.ref = await this.message.channel.send({ 
            embeds: [ new EmbedBuilder().setDescription(content).setColor("ffffff") ] 
        });
    }

    async delete() 
    { 
        try { return await this.ref.delete(); }
        catch (error) 
        { 
            console.info(error); 
            this.message.channel.send({
                embeds: [ new EmbedBuilder()
                          .setDescription("Sorry... We have encountered an error!")
                          .setColor("ff0000") ]
            });
        }
    }
}

// ========== Randomizer Functions ========== //

/**
 * Randomly select an integer within the defined min-max range,
 *
 * @param min    Minimum integer selected exclusive
 * @param max    Maximum integer selected inclusive
 */
function randomInteger(min, max)
{
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomInteger(max)
{
    return Math.floor(Math.random() * max);
}


/**
 * Randomly select an integer within the defined min-max range,
 * then compare with the last selected integer,
 * use the comparison result to select a new integer last and current is same.
 *
 * Returns:
 * id: Selected integer;
 * change: Difference from last selected integer if selected int needs changing
 *         due n == last;
 * 
 * @param min       Minimum integer selected exclusive
 * @param max       Maximum integer selected inclusive
 * @param last      Integer variable in the caller's scope representing 
 *                  the last integer selected
 */
function selectRandomAndCompare(min, max, last)
{
    var n = randomInteger(max) + min;
    var change = 0;

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


// ========== Misc ========== //

/**
 * Simple utility that returns hex color value of different groups
 * ? Use alternate method (enum) ?
 * @param group Group name (ex: AKB48)
 */
function getGroupColour(group)
{
    if (group === 'akb48') return '#ff69b3';
    else if (group === 'hkt48') return '#000000';
    else if (group === 'ngt48') return '#ff0000';
    else if (group === 'nmb48') return '#eb9d47';
    else if (group === 'ske48') return '#f7b501';
    else if (group === 'stu48') return '#d0e7f9';
}

/**
 * Converts epoch (UNIX) time into formatted 24-hour time
 * @param epoch Epoch time to be converted
 */
function convertEpochTo24hr(epoch)
{
    var date = new Date(epoch * 1000); // Convert epoch to date format

    var hh = (date.getUTCHours() + 9) % 24; // 9 hours offset to match JST
    var mm = "0" + date.getMinutes();
    var ss = "0" + date.getSeconds();

    return hh + ':' + mm.slice(-2) + ':' + ss.slice(-2) + ' JST'; 
}

/**
 * Gets Showroom room id from member database.
 * * Returns a Promise.
 * 
 * @param group The group of the member requested (ex: AKB48)
 * @param short The member identifier, could be memberShort or common
 *              (ex: yamauchimizuki or zukkii)
 */
function getRoomId(group, short)
{
    var id;

    pool.getConnection((err, con) =>
    {
        if (err)
        {
            console.info(err);
            return -1;
        }

        con.query(`SELECT sr_roomid FROM ${group} WHERE short=? OR common=?;`, [short, short], function(err, rows)
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
            
            con.release();
        })

    })

    return new Promise(resolve => { setTimeout(() => { resolve(id); }, 2000); })
}

/** ====================
 * * MODULE EXPORTS * * 
===================== */

module.exports =
{
    Waiter: Waiter, // Waiter class
    CommonVariables: CommonVariables, // Common variables

    randomInteger,
    getGroupColour,
    selectRandomAndCompare,
    convertEpochTo24hr,
    getRoomId,
}