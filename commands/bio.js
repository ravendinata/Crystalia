const Discord = require('discord.js');
var mysql = require('mysql');

var pool = mysql.createPool({
    host: 'us-cdbr-east-02.cleardb.com',
    user: 'bf0b2d2a04cd04',
    password: 'c82ad2e3',
    database: 'heroku_774353f79cb52ed'
});

//Original connection method
/* con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to Database!");
})  */

module.exports = {
	name: 'bio',
    description: 'Displays bio of selected member',
    execute(message, args) {
        if (args[0] == undefined)
        {
            message.channel.send(`No arguments found! Use "bio --help" to get arguments list!`);
            return;
        }

        if (args[0] == '-help')
        {
            const content = new Discord.MessageEmbed()
                .setColor('#ffffff')
                .setTitle(`Crystalia Bio Help`)
                .addFields(
                    { name: 'First Argument', value: 'This should be the group name.\nCurrently Available Groups:\n-AKB48\n-SKE48\n-HKT48\n-NMB48\n-NGT48\n-STU48'},
                    { name: 'Second Argument', value: 'This should be the name of the member in the order of: Surname + Name\nThe name may be typed in any letter case.\nNote: For members who have the exact same name (Eg: Yokoyama Yui (Team A) and Yokoyama Yui (Team 8)), please add the team letter/number after the name argument.'},
                    { name: 'Example', value: `bio -akb48 -oguriyui (For Team 8's Oguri Yui)\nor\nbio -akb48 -yokoyamayui8 (For Team 8's Yokoyama Yui)`}
                )
            return message.channel.send(content);
        }

        pool.getConnection((err, con) => 
        {

            if (args[0] === 'akb48') var color = '#ff69b3';
            else if (args[0] === 'hkt48') var color = '#000000';
            else if (args[0] === 'ngt48') var color = '#ff0000';
            else if (args[0] === 'nmb48') var color = '#eb9d47';
            else if (args[0] === 'ske48') var color = '#f7b501';
            else if (args[0] === 'stu48') var color = '#d0e7f9';

            con.query(`SELECT * FROM ` + args[0] + ` WHERE short='` + args[1] + `' OR common='` + args[1] + `'`, function (err, rows)
            {
                if (err) 
                {
                    message.channel.send(`Argument Error: Cannot find specified group ${args[0].toUpperCase()}!`);
                    message.channel.send(`Only Japan groups (AKB48, HKT48, NGT48, NMB48, SKE48, STU48) are available at the moment.`);
                    return;
                };

                if (rows[0] == undefined)
                {
                    message.channel.send(`Argument Error: Cannot find ${args[1]} from the Group ${args[0].toUpperCase()}!`);
                    message.channel.send(`The member may not be available yet or there might be spelling error(s).`);
                    return;
                }

                const result = JSON.stringify(rows[0]);
                const data = JSON.parse(result);

                const bio = new Discord.MessageEmbed()
                .setColor(color)
                .setTitle(`${data.name}'s (${data.name_kanji}) Biography`)
                .addFields(
                    { name: 'Nickname:', value: data.nickname},
                    { name: 'Birthdate:', value: data.birthdate},
                    { name: 'Birthplace:', value: data.birthplace},
                    { name: 'Height:', value: data.height},
                    { name: 'Bloodtype:', value: data.bloodtype},
                    { name: 'Group:', value: data.group},
                    { name: 'Team:', value: data.team}
                )
                .setImage(data.img_url)

                con.release();
                    
                return message.channel.send(bio);
            })
        })
    },
};