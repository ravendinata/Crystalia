const os = require('os');
const ps = require('process');

const Discord = require('discord.js');

/* GLOBALS */

const serverInfo =
`\n========================================
Server Info @ ${os.hostname} - ${process.env.server_type}:
========================================
CPU: ${os.cpus()[0].model} @ ${os.cpus()[0].speed} MHz x ${os.cpus().length} threads
Sys: ${os.platform} - ver. ${os.version} release ${os.release}git 
Mem: ${Math.floor(ps.memoryUsage.rss() / 1000000)} MB [Used] / ${Math.floor(os.totalmem / 1000000)} MB [Total]`;

// === VAR END === //

console.info("Server Info Module Initialized!");

module.exports =
{
    name: 'serverinfo',
    description: 'Command to get server information',
    aliases: ["srvinfo", "srvinf"],
    execute(message, args)
    {
        const embed = new Discord.MessageEmbed();

        embed.setColor("000000").setDescription(serverInfo);

        return message.channel.send(embed);
    }
}