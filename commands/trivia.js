/* GLOBALS */
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const cl = require('../helpers/crystaliaLibrary.js');

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
    {
        console.info(err);
        return -1;
    }

    con.query(`SELECT COUNT(id) AS items FROM trivia;`, function (err, rows)
    {
        if (err)
        {
            console.info(err);
            return -1;
        }

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
    data: new SlashCommandBuilder()
            .setName('trivia')
            .setDescription('Displays a randomly picked trivia')
            .addStringOption(option =>
                option.setName('keyword')
                    .setDescription('Keyword to specify trivia category')
                    .setRequired(false)),

    execute(interaction)
    {
        const keyword = interaction.options.getString('keyword');

        if (keyword == null)
        {
            var min = 1;
            var id = chooseTrivia(min, MAX_ITEM);

            pool.getConnection((err, con) =>
            {
                con.query(`SELECT * FROM trivia WHERE id=?;`, id, function(err, rows)
                {
                    if (err || rows[0] == undefined)
                    {
                        console.info(err);
                        return interaction.reply(`We have just encountered an error. Please try again later.`);
                    }

                    con.release();

                    return interaction.reply({ embeds: [createEmbed(rows[0])] });
                })
            })
        }
        else
        {
            pool.getConnection((err, con) => 
            {
                con.query(`SELECT * FROM trivia WHERE groupName=? OR memberNick=? OR memberShort=?;`, [keyword, keyword, keyword], function (err, rows)
                {
                    if (err)
                    {
                        console.info(err);
                        return interaction.reply(`We have just encountered an error. Please try again later.`);
                    }

                    if (rows[0] == undefined)
                        return interaction.reply(`We can't seem to find anything with that argument/parameter :(`);

                    var min = 0;
                    var max = rows.length-1;

                    var id = chooseTrivia(min, max);

                    con.release();

                    return interaction.reply({ embeds: [createEmbed(rows[id])] });
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
    const color = cl.getGroupColour(data.groupName);

    const output = new EmbedBuilder()
    .setColor(color)
    .setTitle(`Trivia`)
    .setDescription(`${data.trivia}`);

    console.info(`Posting embed...`);
    return output;
}

function chooseTrivia(min, max)
{
    var sel = cl.selectRandomAndCompare(min, max, last);
    console.info(`=== DEBUG ===\n> Last TID: ${last} | Curr TID: ${sel.id} | C: ${sel.change}`);
    last = sel.id;

    return sel.id;
}