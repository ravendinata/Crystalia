const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { CommonVariables, getGroupColour } = require('../helpers/crystaliaLibrary.js');

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
    data: new SlashCommandBuilder()
            .setName('catchphrase')
            .setDescription('Displays catchphrase of selected member')
            .addStringOption(option =>
                option.setName('group')
                    .setDescription('Group Name')
                    .setRequired(true)
                    .addChoices(
                        { name: 'AKB48', value: 'akb48' },
                        { name: 'SKE48', value: 'ske48' },
                        { name: 'NMB48', value: 'nmb48' },
                        { name: 'HKT48', value: 'hkt48' },
                        { name: 'NGT48', value: 'ngt48' },
                        { name: 'STU48', value: 'stu48' }
                    ))
            .addStringOption(option =>
                option.setName('member')
                    .setDescription('Member Name')
                    .setRequired(true)),

    async execute(interaction) 
    {
        const group = interaction.options.getString('group');
        const member = interaction.options.getString('member');
        
        const color = getGroupColour(group);

        pool.getConnection((err, con) =>
        {
            if (err)
            {
                interaction.reply(`Failed to connect to database!`);
                console.info(err);
            }

            con.query(`SELECT * FROM ${group} WHERE short=?;`, member, function (err, rows)
            {
                if (err)
                {
                    interaction.reply(`Our apologies. We have encountered an error while accessing the database.`);
                    console.info(err);
                    return;
                }

                if (rows.length == 0)
                {
                    interaction.reply(`We are sorry, but we currently do not have ${member}'s biography in our database!`);
                    console.info(`  No data found for ${member} in ${group}!`);
                    return;
                }

                const result = JSON.stringify(rows[0]);
                const data = JSON.parse(result);

                if (!data.catchphrase)
                {
                    interaction.reply(`Unfortunately, ${data.name}'s Catchphrase is currently unavailable.`);
                    return;
                }

                const embed = new EmbedBuilder()
                                .setTitle(`${data.name}'s (${data.name_kanji}) Catchphrase`)
                                .setColor(color)
                                .addFields(
                                    { name: 'Catchphrase:', value: data.catchphrase }
                                )
                                .setImage(data.img_url)

                con.release();
                    
                return interaction.reply({ embeds: [embed] });
            })
        })
    }
};