module.exports = {
	name: 'catchphrase',
    description: 'Displays catchphrase of selected member',
    execute(message, args) {
        if (args[0] === 'akb48')
        {
            if (args[1] === 'oguriyui')
            {
                return message.reply('みーんなのハートを（取っちゃう、取っちゃう） 東京から来ました"ゆいゆい"こと小栗有以です');
            }
            else if (args[1] === 'yamauchimizuki')
            {
                return message.reply('今日皆で、Lucky、ずっきー。はい、東京出演のずっきーこと、山内瑞葵です。');
            }
            else if (args[1] === 'Test')
            {
                return message.reply('Catchphrase AKB48');
            }
        }
        else if (args[0] === 'hkt48')
        {
            if (args[1] === 'unjohirona')
            {
                return message.reply('なっぴをよぶときはー？(るーるるるる)ってよんでください！きつねと一緒に会いにいくべさ！弘菜がみんなのめんこちゃんになるど！なっぴこと運上弘菜です!');
            }
        }

        message.channel.send('Cannot Find Member from the Specified Group!');
        message.channel.send(`Group: ${args[0]}`);
        message.channel.send(`Member Name: ${args[1]}`);
    },
};