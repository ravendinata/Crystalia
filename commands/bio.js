const Discord = require('discord.js');

module.exports = {
	name: 'bio',
    description: 'Displays bio of selected member',
    execute(message, args) {
        if (args[0] === 'akb48')
        {
            const color = '#ff69b3';

            if (args[1] === 'oguriyui')
            {
                const bio = new Discord.MessageEmbed()
                    .setColor(color)
                    .setTitle(`Oguri Yui's (小栗有以) Biography`)
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
            else if (args[1] === 'yamauchimizuki')
            {
                const bio = new Discord.MessageEmbed()
                    .setColor(color)
                    .setTitle(`Yamauchi Mizuki's (山内瑞葵) Biography`)
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
            else if (args[1] === 'kubosatone')
            {
                const bio = new Discord.MessageEmbed()
                    .setColor(color)
                    .setTitle(`Kubo Satone's (久保怜音) Biography`)
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
            else if (args[1] === 'murayamayuiri')
            {
                const bio = new Discord.MessageEmbed()
                    .setColor(color)
                    .setTitle(`Murayama Yuiri's (村山彩希) Biography`)
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
        }
        else if (args[0] === 'hkt48')
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
        }

        message.channel.send('Argument Error: Cannot Find Member from the Specified Group!');
        message.channel.send(`Group: ${args[0]}`);
        message.channel.send(`Member Name: ${args[1]}`);
    },
};