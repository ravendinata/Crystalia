const Discord = require('discord.js');

module.exports = {
	name: 'about',
	description: 'about page',
	execute(message) {
		const content = new Discord.MessageEmbed()
        .setColor('#ffffff')
        .setTitle(`About Crystalia`)
        .setAuthor('Raven Limadinata', 'https://ravenlimadinata.com/img/profile.png', 'https://ravenlimadinata.com/')
        .addFields(
            { name: 'Version', value: '0.5.2a'},
            { name: 'Description:', value: 'Crystalia is an experimental bot that serves the Japan 48 Group society.'}
        )
        .setFooter('Thank you for using Crystalia!')
        
        return message.channel.send(content);
	},
};