require('dotenv').config();

const Discord = require('discord.js');
const prefix = process.env.prefix;

console.info("Help Module Initialized!");

module.exports = 
{
	name: 'help',
	description: 'Help me',
	execute(message, args) 
    {
        if (args[0] === undefined)
        {
            const content = new Discord.MessageEmbed()
            .setColor('#ffffff')
            .setTitle(`Crystalia Commands`)
            .addFields(
                { name: 'Bio', value: `${prefix}bio [group] [memberName]\n\n**Example:** ${prefix}bio akb48 oguriYui`},
                { name: 'Catchphrase', value: `${prefix}catchphrase [group] [memberName]\n\n**Example:** ${prefix}catchphrase akb48 oguriYui`},
                { name: 'About', value: `${prefix}about`}
            )
            .setDescription(`Use '${prefix}help -a' for a detailed list of the commands.\n**Note: Always add the prefix before the command!**`)
            .setFooter('Thank you for using Crystalia!')
            
            return message.channel.send(content);
        }
        else if (args[0] === '-a')  
        {
            const content = new Discord.MessageEmbed()
            .setColor('#ffffff')
            .setTitle(`Crystalia Commands`)
            .addFields(
                { name: 'Bio', value: `Bio is used to retrieve biodata of a member.\nCurrently only works with Japan members.\n\n**Format:** ${prefix}bio [group] [memberName or common nickname]\n\n**Example:** ${prefix}bio akb48 oguriYui`},
                { name: 'Catchphrase', value: `Catchphrase is used to print the catchphrase of a member.\nCurrently only works with Japan members.\n\n**Format:** ${prefix}catchphrase [group] [memberName or common nickname]\n\n**Example:** ${prefix}catchphrase akb48 oguriYui`},
                { name: 'About', value: `Displays About Page.\n**Command:** ${prefix}about`},
            )
            .setFooter('Thank you for using Crystalia!')
            
            return message.channel.send(content);
        }
	},
};