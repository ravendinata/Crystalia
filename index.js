require('dotenv').config();

const fs = require('fs');
const os = require('os');
const Discord = require('discord.js');
const express = require('express');
const ServerInfo = require('./utils/sysHelper');
const notifier = require('./utils/mailer.js');

const prefix = process.env.prefix;
const port = process.env.PORT || 3000;

const app = express();
app.use(require('express-status-monitor')());

app.get('/', (req, res) => {
  res.send('Initializing System Monitor...');
});

app.listen(port, () => console.log(`\nSystem Monitor Initialized on Port ${port}!\n`));

const client = new Discord.Client();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

// === VAR END === //

// LOAD COMMANDS //
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

/** ====================
 * * MAIN OPERATION * * 
===================== */

client.login(process.env.token);

client.once('ready', () => 
{
	printCommands();

	console.info(`\n========================================`);
	console.info(`Ready! Logged in as ${client.user.tag}`);
	console.info(`========================================`);

	if (process.env.server_type != "dev")
		notifier.sendNotification(`Server Started @ ${os.hostname}!\n${ServerInfo.serverInfo()}`);
});

client.on('message', message => 
{
    if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).toLowerCase().split(" ");
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command) && !client.aliases.has(command)) return;

	if (process.env.server_type == "dev" && !message.member.hasPermission('ADMINISTRATOR'))
	{
		message.reply(`ERROR! Access Denied! You are trying to access Dev Copy but you are not a Developer!` +
		`\nBot in this prefix ${prefix} is Dev Build. Only developers can access it.`);	

		console.info(`${message.member.user.tag} attempted to access Dev Build!`);

		return;
	}

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

function printCommands()
{
	console.info(`\n========================================`);
	console.info("Commands:");
	console.info(`========================================`);
	for (const [key, value] of client.commands)
		console.info(key);

	console.info(`\n========================================`);
	console.info("Aliases:");
	console.info(`========================================`);
	for (const [key, value] of client.aliases)
		console.info(key);
}