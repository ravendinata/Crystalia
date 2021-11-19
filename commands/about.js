const Discord = require('discord.js');

console.info("About Module Initialized!");

module.exports = 
{
	name: 'about',
	description: 'About Page',
	execute(message) 
    {
		const content = new Discord.MessageEmbed()
        .setColor('#ffffff')
        .setTitle(`About Crystalia`)
        .setAuthor('Raven Limadinata', 'https://ravenlimadinata.com/img/profile.png', 'https://ravenlimadinata.com/')
        .addFields(
            { name: 'Version', value: '0.7.3a'},
            { name: 'Description:', value: 'Crystalia is an experimental bot that serves the Japan 48 Group society.'}
        )
        .setFooter('Thank you for using Crystalia!')
        
        return message.channel.send(content);
	},
};