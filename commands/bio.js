module.exports = {
	name: 'bio',
    description: 'Displays bio of selected member',
    execute(message, args) {
        if (args[0] === 'AKB48')
        {
            if (args[1] === 'OguriYui')
            {
                const bio = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Oguri Yui')
                    .setAuthor('AKB48 Fandom', 'https://vignette4.wikia.nocookie.net/akb48/images/8/89/Wiki-wordmark.png/revision/latest?cb=20170617121411', 'https://akb48.fandom.com/')
                    .setDescription('Some description here')
                    .setThumbnail('https://vignette.wikia.nocookie.net/akb48/images/1/10/Oguri_Yui_AKB48_2020.jpg/revision/latest/scale-to-width-down/240?cb=20200814004429')
                    .addField('Inline field title', 'Some value here', true)
                    .setImage('https://vignette.wikia.nocookie.net/akb48/images/1/10/Oguri_Yui_AKB48_2020.jpg/revision/latest/scale-to-width-down/240?cb=20200814004429')
                    .setTimestamp();

                channel.send(bio);
            }
            else if (args[1] === 'YamauchiMizuki')
            {
                return message.reply('今日皆で、Lucky、ずっきー。はい、東京出演のずっきーこと、山内瑞葵です。');
            }
            else if (args[1] === 'Test')
            {
                return message.reply('Catchphrase AKB48');
            }
        }
        else if (args[0] === 'HKT48')
        {
            if (args[1] === 'UnjoHirona')
            {
                return message.reply('なっぴをよぶときはー？(るーるるるる)ってよんでください！きつねと一緒に会いにいくべさ！弘菜がみんなのめんこちゃんになるど！なっぴこと運上弘菜です!');
            }
        }

        message.channel.send(`First argument: ${args[0]}`);
        message.channel.send(`Second argument: ${args[1]}`);
    },
};