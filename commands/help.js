const Discord = require('discord.js');

module.exports = {
	name: 'help',
	description: 'Help me',
	execute(message, args) {
        if (args[0] === 'a' || args[0] === undefined)  
        {
            const content = new Discord.MessageEmbed()
                .setColor('#ffffff')
                .setTitle(`Crystalia Commands`)
                .addFields(
                    { name: 'Bio', value: 'Bio is used to retrieve biodata of a member. Currently only works with Japan members.\nFormat: bio -[group] -[memberName]\nExample: bio -akb48 -oguriYui'},
                    { name: 'Catchphrase', value: 'Catchphrase is used to print the catchphrase of a member. Only works with Japan members.\nFormat: catchphrase -[group] -[memberName]\nExample: catchphrase -akb48 -oguriYui'},
                    { name: 'About', value: 'Displays About Page.\nCommand: about'}
                )
                .setDescription(`The next time you forget the commands, you can try using 'help -s' for a summary of the commands only!`)
                .setFooter('Thank you for using Crystalia!')
            
            return message.channel.send(content);
        }
        else if (args[0] === 's')
        {
            const content = new Discord.MessageEmbed()
                .setColor('#ffffff')
                .setTitle(`Crystalia Commands`)
                .addFields(
                    { name: 'Bio', value: 'bio -[group] -[memberName]\nExample: bio -akb48 -oguriYui'},
                    { name: 'Catchphrase', value: 'catchphrase -[group] -[memberName]\nExample: catchphrase -akb48 -oguriYui'},
                    { name: 'About', value: 'about'}
                )
                .setFooter('Thank you for using Crystalia!')
            
            return message.channel.send(content);
        }
	},
};