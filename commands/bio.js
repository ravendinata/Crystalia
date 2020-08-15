const Discord = require('discord.js');
const fandomURL = 'https://akb48.fandom.com/';
const fandomIconURL = 'https://vignette4.wikia.nocookie.net/akb48/images/8/89/Wiki-wordmark.png';

module.exports = {
	name: 'bio',
    description: 'Displays bio of selected member',
    execute(message, args) {
        if (args[0] === 'AKB48')
        {
            const color = '#ffa3ed';

            if (args[1] === 'OguriYui')
            {
                const bio = new Discord.MessageEmbed()
                    .setColor(color)
                    .setTitle(`Oguri Yui's (小栗有以) Biography`)
                    .setAuthor('AKB48 Fandom', fandomIconURL, fandomURL)
                    .addFields(
                        { name: 'Nickname:', value: 'Yuiyui (ゆいゆい)'},
                        { name: 'Birthdate:', value: 'December 26, 2001'},
                        { name: 'Birthplace:', value: 'Tokyo, Japan'},
                        { name: 'Height:', value: '163cm'},
                        { name: 'Group:', value: 'AKB48'},
                        { name: 'Team:', value: 'Team 8/Team A'}
                    )
                    .setImage('https://vignette.wikia.nocookie.net/akb48/images/1/10/Oguri_Yui_AKB48_2020.jpg')

                return message.channel.send(bio);
            }
            else if (args[1] === 'YamauchiMizuki')
            {
                const bio = new Discord.MessageEmbed()
                    .setColor(color)
                    .setTitle(`Yamauchi Mizuki's (山内瑞葵) Biography`)
                    .setAuthor('AKB48 Fandom', fandomIconURL, fandomURL)
                    .addFields(
                        { name: 'Nickname:', value: 'Zukkii (ずっきー)'},
                        { name: 'Birthdate:', value: 'September 20, 2001'},
                        { name: 'Birthplace:', value: 'Tokyo, Japan'},
                        { name: 'Blood Type:', value: 'O'},
                        { name: 'Height:', value: '160cm'},
                        { name: 'Group:', value: 'AKB48'},
                        { name: 'Team:', value: 'Team 4'}
                    )
                    .setImage('https://vignette.wikia.nocookie.net/akb48/images/3/3f/Yamauchi_Mizuki_AKB48_2020.jpg')

                return message.channel.send(bio);
            }
            else if (args[1] === 'KuboSatone')
            {
                const bio = new Discord.MessageEmbed()
                    .setColor(color)
                    .setTitle(`Kubo Satone's (久保怜音) Biography`)
                    .setAuthor('AKB48 Fandom', fandomIconURL, fandomURL)
                    .addFields(
                        { name: 'Nickname:', value: 'Satopii (さとぴー)'},
                        { name: 'Birthdate:', value: 'November 20, 2003'},
                        { name: 'Birthplace:', value: 'Kanagawa, Japan'},
                        { name: 'Blood Type:', value: 'O'},
                        { name: 'Height:', value: '157cm'},
                        { name: 'Group:', value: 'AKB48'},
                        { name: 'Team:', value: 'Team B'}
                    )
                    .setImage('https://vignette.wikia.nocookie.net/akb48/images/5/5b/Kubo_Satone_AKB48_2020.jpg')

                return message.channel.send(bio);
            }
            else if (args[1] === 'MurayamaYuiri')
            {
                const bio = new Discord.MessageEmbed()
                    .setColor(color)
                    .setTitle(`Murayama Yuiri's (村山彩希) Biography`)
                    .setAuthor('AKB48 Fandom', fandomIconURL, fandomURL)
                    .addFields(
                        { name: 'Nickname:', value: 'Yuiri (ゆいり)\nYuiringo~ (ゆいりんご〜)'},
                        { name: 'Birthdate:', value: 'June 15, 1997'},
                        { name: 'Birthplace:', value: 'Kanagawa, Japan'},
                        { name: 'Blood Type:', value: 'O'},
                        { name: 'Height:', value: '155.7cm'},
                        { name: 'Group:', value: 'AKB48'},
                        { name: 'Team:', value: 'Team 4'}
                    )
                    .setImage('https://vignette.wikia.nocookie.net/akb48/images/1/1a/Murayama_Yuiri_AKB48_2020.jpg')

                return message.channel.send(bio);
            }
            else if (args[1] === 'Test')
            {
                return message.reply('Bio AKB48');
            }
        }
        else if (args[0] === 'HKT48')
        {
            const color = '#000000';

            if (args[1] === 'UnjoHirona')
            {
                const bio = new Discord.MessageEmbed()
                    .setColor(color)
                    .setTitle(`Unjo Hirona's (運上弘菜) Biography`)
                    .setAuthor('AKB48 Fandom', fandomIconURL, fandomURL)
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

        message.channel.send('Cannot Find Member from the Specified Group!');
        message.channel.send(`Group: ${args[0]}`);
        message.channel.send(`Member Name: ${args[1]}`);
    },
};