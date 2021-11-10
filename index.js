require('dotenv').config();

const Discord = require('discord.js');
const fs = require('fs');
const prefix = process.env.prefix;
const client = new Discord.Client();

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) 
{
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => 
{
	console.info(`\n========================================`);
	console.log(`Ready! Logged in as ${client.user.tag}`);
	console.info(`========================================`);
});

client.on('message', message => {
    if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).toLowerCase().split(" ");
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try 
	{
		if (args[0] == undefined)
			console.info(`Called command: ${command} with no arguments`);
		else
	    	console.info(`Called command: ${command} with argument ${args}`);
		
		client.commands.get(command).execute(message, args);
	} 
	catch (error)
	{
		console.error(error);
		message.reply('There was an error trying to execute that command!');
	}
});

client.login(process.env.token);