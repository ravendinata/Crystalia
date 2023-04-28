const { SlashCommandBuilder } = require('discord.js');

console.info("Ping Module Initialized!");

module.exports = 
{
    name: 'ping',
    description: 'Pings the bot',
	data: new SlashCommandBuilder()
			.setName('ping')
			.setDescription('Pings the bot to check if it is online and responsive'),

	async execute(interaction) 
	{
        console.info(`Ping command received from ${interaction.user.tag}`);
		interaction.reply(`Pong! Latency is ${Date.now() - interaction.createdTimestamp}ms.`);
	}
};