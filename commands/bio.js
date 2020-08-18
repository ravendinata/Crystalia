const Discord = require('discord.js');
var mysql = require('mysql');

var pool = mysql.createPool({
    host: 'us-cdbr-east-02.cleardb.com',
    user: 'bf0b2d2a04cd04',
    password: 'c82ad2e3',
    database: 'heroku_774353f79cb52ed'
});

/* con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to Database!");
})  */

module.exports = {
	name: 'bio',
    description: 'Displays bio of selected member',
    execute(message, args) {
        pool.getConnection((err, con) => 
        {
            if (args[0] === 'akb48') var color = '#ff69b3';
            else if (args[0] === 'hkt48') var color = '#000000';
            else if (args[0] === 'ngt48') var color = '#ff0000';
            else if (args[0] === 'nmb48') var color = '#eb9d47';
            else if (args[0] === 'ske48') var color = '#f7b501';
            else if (args[0] === 'stu48') var color = '#d0e7f9';

            con.query(`SELECT * FROM ` + args[0]+ ` WHERE short='` + args[1] + `'`, function (err, rows)
            {
                if (err) 
                {
                    message.channel.send(`Argument Error: Cannot Find Specified Group!\nGroup: ${args[0]}`);
                    return;
                };

                if (rows[0] == undefined)
                {
                    message.channel.send(`Argument Error: Cannot Find Member from the Specified Group!\nGroup: ${args[0]}\nMember Name: ${args[1]}`);
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
        /* else if (args[0] === 'hkt48')
        {
            const color = '#000000';

            if (args[1] === 'unjohirona')
            {
                const bio = new Discord.MessageEmbed()
                    .setColor(color)
                    .setTitle(`Unjo Hirona's (運上弘菜) Biography`)
                    .addFields(
                        { name: 'Nickname:', value: 'Nappi (なっぴ)'},
                        { name: 'Birthdate:', value: 'August 9, 1998'},
                        { name: 'Birthplace:', value: 'Obira, Hokkaido, Japan'},
                        { name: 'Blood Type:', value: 'B'},
                        { name: 'Height:', value: '155cm'},
                        { name: 'Group:', value: 'HKT48'},
                        { name: 'Team:', value: 'Team KIV'}
                    )
                    .setImage('https://vignette.wikia.nocookie.net/akb48/images/8/84/Unjo_Hirona_HKT48_2019.jpg')

                return message.channel.send(bio);
            }
        }
        else if (args[0] === 'ske48')
        {
            const color = '#f7b501';

            if (args[1] === 'sudaakari')
            {
                const bio = new Discord.MessageEmbed()
                    .setColor(color)
                    .setTitle(`Suda Akari's (須田亜香里) Biography`)
                    .addFields(
                        { name: 'Nickname:', value: 'Akarin (あかりん)\nDasu (だす)'},
                        { name: 'Birthdate:', value: 'October 31, 1991'},
                        { name: 'Birthplace:', value: 'Nagoya, Aichi, Japan'},
                        { name: 'Blood Type:', value: 'A'},
                        { name: 'Height:', value: '159cm'},
                        { name: 'Group:', value: 'SKE48'},
                        { name: 'Team:', value: 'Team E'}
                    )
                    .setImage('http://stage48.net/wiki/images/0/00/SudaAkariE2019.jpg')

                return message.channel.send(bio);
            }
        }
        else if (args[0] === 'nmb48')
        {
            const color = '#eb9d47';

            if (args[1] === 'umeyamacocona')
            {
                const bio = new Discord.MessageEmbed()
                    .setColor(color)
                    .setTitle(`Umeyama Cocona's (梅山恋和) Biography`)
                    .addFields(
                        { name: 'Nickname:', value: 'Cocona (ココナ)'},
                        { name: 'Birthdate:', value: 'August 7, 2003'},
                        { name: 'Birthplace:', value: 'Osaka, Japan'},
                        { name: 'Blood Type:', value: 'O'},
                        { name: 'Height:', value: '157cm'},
                        { name: 'Group:', value: 'NMB48'},
                        { name: 'Team:', value: 'Team BII'}
                    )
                    .setImage('http://stage48.net/wiki/images/2/26/UmeyamaCoconaBII2019.jpg')

                return message.channel.send(bio);
            }
        }
        else if (args[0] === 'stu48')
        {
            const color = '#d0e7f9';

            if (args[1] === 'takinoyumiko')
            {
                const bio = new Discord.MessageEmbed()
                    .setColor(color)
                    .setTitle(`Takino Yumiko's (瀧野由美子) Biography`)
                    .addFields(
                        { name: 'Nickname:', value: 'Yumirin (ゆみりん)'},
                        { name: 'Birthdate:', value: 'September 24, 1997'},
                        { name: 'Birthplace:', value: 'Yamaguchi, Japan'},
                        { name: 'Blood Type:', value: 'O'},
                        { name: 'Height:', value: '164cm'},
                        { name: 'Group:', value: 'STU48'},
                        { name: 'Team:', value: 'STU'}
                    )
                    .setImage('http://stage48.net/wiki/images/f/f6/TakinoYumikoSTU2019.jpg')

                return message.channel.send(bio);
            }
        }
        else if (args[0] === 'ngt48')
        {
            const color = '#ff0000';

            if (args[1] === 'hommahinata')
            {
                const bio = new Discord.MessageEmbed()
                    .setColor(color)
                    .setTitle(`Homma Hinata's (本間日陽 ) Biography`)
                    .addFields(
                        { name: 'Nickname:', value: 'Hinatan (ひなたん)\nHinaHina (ひなひな) '},
                        { name: 'Birthdate:', value: 'November 10, 1999'},
                        { name: 'Birthplace:', value: 'Murakami, Niigata, Japan'},
                        { name: 'Blood Type:', value: 'B'},
                        { name: 'Height:', value: '159cm'},
                        { name: 'Group:', value: 'NGT48'},
                        { name: 'Team:', value: '1st Generation'}
                    )
                    .setImage('http://stage48.net/wiki/images/f/fa/HommaHinata2019.jpg')

                return message.channel.send(bio);
            }
        } */

        /* message.channel.send('Argument Error: Cannot Find Member from the Specified Group!');
        message.channel.send(`Group: ${args[0]}`);
        message.channel.send(`Member Name: ${args[1]}`); */
    },
};