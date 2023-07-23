const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const PackageInfo = require('../package.json');

console.info("About Module Initialized!");

module.exports = 
{
	name: 'about',
	description: 'About Page',
    data: new SlashCommandBuilder()
            .setName('about')
            .setDescription('About Page'),

	execute(interaction) 
    {      
		const content = new EmbedBuilder()
        .setColor('#ffffff')
        .setTitle(`About Crystalia`)
        .setAuthor(
            { 
                name: 'Raven Limadinata', 
                iconURL: 'https://ravenlimadinata.com/img/profile.png', 
                url: 'https://ravenlimadinata.com/'
            }
        )
        .addFields(
            { name: 'Version', value: `${PackageInfo.version}` },
            { name: 'Description:', value: `${PackageInfo.description}` },
        );
        
        return interaction.reply({ embeds: [content] });
	},
};