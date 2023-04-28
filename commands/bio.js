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

//Original connection method
/* con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to Database!");
})  */

console.info("Bio Module Initialized!");

module.exports = 
{
	name: 'bio',
    description: 'Displays bio of selected member',
    data: new SlashCommandBuilder()
            .setName('bio')
            .setDescription('Displays bio of selected member')
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
                const result = JSON.stringify(rows[0]);
                const data = JSON.parse(result);

                const embed = new EmbedBuilder()
                                .setTitle(`${data.name}'s (${data.name_kanji}) Biography`)
                                .setColor(color)
                                .addFields(
                                    { name: 'Nickname:', value: data.nickname },
                                    { name: 'Birthdate:', value: data.birthdate },
                                    { name: 'Birthplace:', value: data.birthplace },
                                    { name: 'Height:', value: data.height },
                                    { name: 'Bloodtype:', value: data.bloodtype },
                                    { name: 'Group:', value: data.group },
                                    { name: 'Team:', value: data.team }
                                )
                                .setImage(data.img_url)

                con.release();    
                interaction.reply({ embeds: [embed]});
            })
        })
    }
};