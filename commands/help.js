const Discord = require('discord.js');

module.exports = {
	name: 'help',
	description: 'Help me',
	execute(message, args) {
        if (args[0] === undefined)
        {
            const content = new Discord.MessageEmbed()
            .setColor('#ffffff')
            .setTitle(`Crystalia Commands`)
            .addFields(
                { name: 'Bio', value: '`bio [group] [memberName]`\n`Example: bio akb48 oguriYui`'},
                { name: 'Catchphrase', value: '`catchphrase [group] [memberName]`\n`Example: catchphrase akb48 oguriYui`'},
                { name: 'About', value: '`about`'}
            )
            .setDescription(`Use 'help -a' for a detailed list of the commands.\n**Note: Always add the prefix before the command!**`)
            .setFooter('Thank you for using Crystalia!')
            
            return message.channel.send(content);
        }
        else if (args[0] === '-a')  
        {
            const content = new Discord.MessageEmbed()
            .setColor('#ffffff')
            .setTitle(`Crystalia Commands`)
            .addFields(
                { name: 'Bio', value: 'Bio is used to retrieve biodata of a member.\nCurrently only works with Japan members.\n`Format: bio [group] [memberName or common nickname]`\n`Example: bio akb48 oguriYui`'},
                { name: 'Catchphrase', value: 'Catchphrase is used to print the catchphrase of a member.\nCurrently only works with Japan members.\n`Format: catchphrase [group] [memberName or common nickname]`\n`Example: catchphrase akb48 oguriYui`'},
                { name: 'About', value: 'Displays About Page.\n`Command: about`'}
            )
            .setDescription(`**Note: Always add the prefix before the command!**`)
            .setFooter('Thank you for using Crystalia!')
            
            return message.channel.send(content);
        }
	},
};