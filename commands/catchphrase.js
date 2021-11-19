require('dotenv').config();

const Discord = require('discord.js');
const cl = require('../utils/crystaliaLibrary.js');
const prefix = process.env.prefix;

/* 
    USE POOLING
    -----------
    Helps prevent module from being disconnedted after long period of inactivity.
    Use .env to add the server details!
*/
var mysql = require('mysql');
var pool = mysql.createPool({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_name
});

console.info("Catchphrase Module Initialized!");

module.exports = 
{
	name: 'catchphrase',
    description: 'Displays catchphrase of selected member',
    aliases: ["cp", "jiko"],
    execute(message, args) 
    {
        if (args[0] == undefined)
        {
            message.channel.send(`No arguments found! Use "catchphrase --help" to get arguments list!`);
            return;
        }

        if (args[0] == '--help')
        {
            const content = new Discord.MessageEmbed()
            .setColor('#ffffff')
            .setTitle(`Crystalia Catchphrase Help`)
            .addFields(
                { name: 'First Argument', value: '***Group name***\nCurrently Available Groups:\n-AKB48\n-SKE48\n-HKT48\n-NMB48\n-NGT48\n-STU48'},
                { name: 'Second Argument', value: '***Member name in the order of: Surname + Name*** or ***common nickname of the member***\n\n*) The name may be typed in any letter case.\n\nNote: For members who have the exact same name (Eg: Yokoyama Yui (Team A) and Yokoyama Yui (Team 8)), please add the team letter/number after the name argument.'},
                { name: `Example (Team 8's Oguri Yui - using Nickname)`, value: `${prefix}catchphrase akb48 yuiyui`},
                { name: `Example (Team 8's Oguri Yui - using Full Name)`, value: `${prefix}catchphrase akb48 oguriyui`},
                { name: `Example (Team 8's Yokoyama Yui)`, value: `${prefix}catchphrase akb48 yokoyamayui8`}
            )

            return message.channel.send(content);
        }

        pool.getConnection((err, con) =>
        {
            color = cl.getGroupColour(args[0]);

            con.query(`SELECT * FROM ` + args[0] + ` WHERE short='` + args[1] + `' OR common='` + args[1] + `'`, function (err, rows)
            {
                if (err) 
                {
                    message.channel.send(`Argument Error: Cannot find specified group ${args[0].toUpperCase()}!`);
                    message.channel.send(`Only Japan groups (AKB48, HKT48, NGT48, NMB48, SKE48, STU48) are available at the moment.`);
                    return;
                }

                if (rows[0] == undefined)
                {
                    message.channel.send(`Argument Error: Cannot find ${args[1]} from the Group ${args[0].toUpperCase()}!`);
                    message.channel.send(`The member may not be available yet or there might be spelling error(s).`);
                    return;
                }

                const result = JSON.stringify(rows[0]);
                const data = JSON.parse(result);

                // console.info(`CP: ${data.catchphrase}`); // Test Point

                if (!data.catchphrase)
                {
                    message.channel.send(`Unfortunately, ${data.name}'s Catchphrase is currently unavailable.`);
                    return;
                }

                const bio = new Discord.MessageEmbed()
                .setColor(color)
                .setTitle(`${data.name}'s (${data.name_kanji}) Catchphrase`)
                .addFields(
                    { name: 'Catchphrase:', value: data.catchphrase }
                )
                .setImage(data.img_url)

                con.release();
                    
                return message.channel.send(bio);
            })
        })
    }
};