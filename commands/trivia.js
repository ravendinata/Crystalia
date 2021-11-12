require('dotenv').config();

/* GLOBALS */
const Discord = require('discord.js');
const cl = require('../utils/crystaliaLibrary.js');

var MAX_ITEM;
var last = -1;

/* SQL Pool */
var mysql = require('mysql');
var pool = mysql.createPool({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_name
});

pool.getConnection((err, con) =>
{
    if (err)
        return console.info(err);

    con.query(`SELECT COUNT(id) AS items FROM trivia`, function (err, rows)
    {
        const result = JSON.stringify(rows[0]);
        const data = JSON.parse(result);

        setItemMax(data.items);
    })
})

/* Command Begin */

console.info("Trivia Module Initialized!");

module.exports = 
{
    name: 'trivia',
    description: 'Displays a randomly picked trivia',
    execute(message, args)
    {
        if (args[0] == undefined)
        {
            var min = 1;
            var id = chooseTrivia(min, MAX_ITEM);

            pool.getConnection((err, con) =>
            {
                con.query(`SELECT * FROM trivia WHERE id=` + id, function(err, rows)
                {
                    if (err || rows[0] == undefined)
                    {
                        console.info(err);
                        return message.channel.send(`We have just encountered an error. Please try again later.`);
                    }

                    return message.channel.send(createEmbed(rows[0]));
                })
            })
        }
        else
        {
            pool.getConnection((err, con) => 
            {
                con.query(`SELECT * FROM trivia WHERE groupName='` + args[0] + `' OR memberNick='` + args[0] + `' OR memberShort ='` + args[0] + `'`, function (err, rows)
                {
                    if (err)
                    {
                        console.info(err);
                        return message.channel.send(`We have just encountered an error. Please try again later.`);
                    }

                    if (rows[0] == undefined)
                        return message.channel.send(`We can't seem to find anything with that argument/parameter :(`);

                    var min = 0;
                    var max = rows.length-1;

                    var id = chooseTrivia(min, max);

                    return message.channel.send(createEmbed(rows[id]));
                })
            })
        }
    }
}

/*   Command End
   ===============
   Extra Functions   */

function setItemMax(max) { MAX_ITEM = max; }

function createEmbed(plainData)
{
    console.info(`Creating embed...`);
    const result = JSON.stringify(plainData);
    const data = JSON.parse(result);

    console.info(data);

    const color = cl.getGroupColour(data.groupName);

    const output = new Discord.MessageEmbed()
    .setColor(color)
    .setTitle(`Trivia`)
    .setDescription(data.trivia);

    console.info(`Posting embed...`);
    return output;
}

function chooseTrivia(min, max)
{
    var change = 0;

    var sel = cl.selectRandomAndCompare(min, max, last, change);
    change = sel.change;
    console.info(`=== DEBUG ===\n> Last TID: ${last} | Curr TID: ${sel.id} | C: ${change}`);
    last = sel.id;

    return sel.id;
}