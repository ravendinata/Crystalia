module.exports = {
	name: 'pong',
    description: 'Pong!',
    execute(message, args) {
        message.reply('ping');
        message.channel.send('ping');
    },
};