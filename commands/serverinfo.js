const Discord = require('discord.js');
const ServerInfo = require('../utils/sysHelper');

console.info("Server Info Module Initialized!");

module.exports =
{
    name: 'serverinfo',
    description: 'Command to get server information',
    aliases: ["srvinfo", "srvinf"],
    execute(message, args)
    {
        const embed = new Discord.MessageEmbed();

        switch(args[0])
        {
            default: case "platform":
                embed.setColor("000000").setDescription(ServerInfo.serverInfo());
                break;
            
            case "resusage": case "resourceusage":
                embed.setColor("000000").setDescription(ServerInfo.resourceUsageReport());
                break;
        }

        return message.channel.send(embed);
    }
}