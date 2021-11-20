require('dotenv').config();

const fs = require('fs');
const os = require('os');
const Discord = require('discord.js');
const notifier = require('./utils/mailer.js');

const prefix = process.env.prefix;

const serverInfo =
`\n========================================
Server Info @ ${os.hostname}:
========================================
CPU: ${os.cpus()[0].model} @ ${os.cpus()[0].speed} MHz x ${os.cpus().length} threads
Sys: ${os.platform} - ver. ${os.version} release ${os.release}`

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) 
{
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);

	if (command.aliases != null)
	{
		for (const alias of command.aliases)
			client.aliases.set(alias, command);
	}
}

client.once('ready', () => 
{
	console.info(serverInfo);

	console.info(`\n========================================`);
	console.info(`Ready! Logged in as ${client.user.tag}`);
	console.info(`========================================`);

	if (process.env.server_type != "dev")
		notifier.sendNotification(`Server Started @ ${os.hostname}!\n ${serverInfo}`);

});

client.on('message', message => 
{
    if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).toLowerCase().split(" ");
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command) && !client.aliases.has(command)) return;

	try
	{
		if (args[0] == undefined)
			console.info(`Called command: ${command} with no arguments`);
		else
	    	console.info(`Called command: ${command} with argument ${args}`);
		
		const executable = client.commands.get(command) || client.aliases.get(command);
		executable.execute(message, args);
	} 
	catch (error)
	{
		console.error(error);
		message.reply('There was an error trying to execute that command!');
	}
});

client.login(process.env.token);