require('dotenv').config();

const { Client, Collection, GatewayIntentBits, PermissionsBitField} = require('discord.js');

const fs = require('fs');
const os = require('os');

const { Database } = require('./helpers/database.js');
const logger = require('./helpers/logger.js');
const ServerInfo = require('./helpers/sysHelper.js');
const notifier = require('./helpers/mailer.js');
const webapp = require('./web/webapp.js');

var prefix = process.env.prefix;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();
client.aliases = new Collection();

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

// LOAD DATABASE //
Database.getInstance();

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

/* client.on("messageCreate", async message => 
{
    if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(" ");
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command) && !client.aliases.has(command)) return;

	if (process.env.server_type == "dev" && !message.member.permissions.has(PermissionsBitField.Flags.Administrator))
	{
		message.reply(`ERROR! Access Denied! You are trying to access Dev Copy but you are not a Developer!` +
		`\nBot in this prefix ${prefix} is Dev Build. Only developers can access it.`);	

		console.info(`${message.member.user.tag} attempted to access Dev Build!`);

		return;
	}

	try
	{
		if (args[0] == undefined)
			logger.info(`Called command: ${command} with no arguments`);
		else
	    	logger.info(`Called command: ${command} with argument ${args}`);
		
		const executable = client.commands.get(command) || client.aliases.get(command);
		executable.execute(message, args);
	} 
	catch (error)
	{
		console.error(error);
		message.reply('There was an error trying to execute that command!');
	}
}); */

client.on('interactionCreate', async interaction => 
{
	console.info(`\n> Interaction from Channel: ${interaction.channel}; By: ${interaction.user.tag} (UID: ${interaction.user.id})`);
	
	try
	{
		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) return;

		if (interaction.isChatInputCommand())
		{
			console.info(`> Command Received!`);
			console.info(`  Command Name\t: ${command.name}`);
			await command.execute(interaction);
			console.info(''); // Prints a blank line. Just cosmetics for the console logger.
		}
		else if (interaction.isAutocomplete())
		{
			console.info(`> Autocomplete Request Received!`);
			await command.autocomplete(interaction);
		}
		else return;
	} 
	catch (exception)
	{
		if (interaction.isAutocomplete)
			return;
		
		if (exception.toString().startsWith('[') || exception.toString().startsWith('DiscordAPIError[10062]: Unknown interaction'))
			return;

		console.error(`> Error caught! Details:\n${exception}`);
		console.info(''); // Prints a blank line. Just cosmetics for the console logger.
			
		try { await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true }); }
		catch (exception) { await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });}
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