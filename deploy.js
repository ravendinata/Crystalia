require('dotenv').config();

const { argv } = require('node:process');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');

const fs = require('node:fs');
const path = require('node:path');

const rest = new REST({ version: '10' }).setToken(process.env.token);

if (argv[2] === "clean")
{
	rest.put(Routes.applicationCommands(process.env.client_id), { body: [] })
		.then(() => console.log('Successfully cleaned all application commands.'))
		.catch(console.error);
}
else 
{
	const commands = [];
	const commandsPath = path.join(__dirname, 'commands');
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) 
	{
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		commands.push(command.data.toJSON());
		console.log(`Pushed command: ${command.data.name}`);
	}

	rest.put(Routes.applicationCommands(process.env.client_id), { body: commands })
		.then(() => console.log('Successfully registered application commands.'))
		.catch(console.error);
}