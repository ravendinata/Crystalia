const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const ServerInfo = require('../helpers/sysHelper');

console.info("Server Info Module Initialized!");

module.exports =
{
    name: 'serverinfo',
    description: 'Command to get server information',
    data: new SlashCommandBuilder()
            .setName('serverinfo')
            .setDescription('Displays server information')
            .addStringOption(option => 
                option.setName('type')
                    .setDescription('Type of information to display')
                    .setRequired(true)
                    .addChoices(
                        { name: 'Platform', value: 'platform' },
                        { name: 'Resource Usage', value: 'resusage' }
                    )),
                    
    execute(interaction)
    {
        const type = interaction.options.getString('type');
        const embed = new EmbedBuilder().setTitle("Server Information");

        switch(type.toLowerCase())
        {
            default: case "platform":
                embed.setColor("000000").setDescription(ServerInfo.serverInfo());
                break;
            
            case "resusage": case "resourceusage":
                embed.setColor("000000").setDescription(ServerInfo.resourceUsageReport());
                break;
        }

        return interaction.reply({ embeds: [embed] });
    }
}