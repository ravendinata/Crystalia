const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { CommonVariables, getGroupColour } = require('../helpers/crystaliaLibrary.js');
const { Database } = require('../helpers/database.js');
const { Error } = require('../helpers/constants.js');

const GROUP_LOGO = require(`${process.env.data_path}/group_logo.json`);
const BASE_URLS = require(`${process.env.data_path}/base_urls.json`);

console.info("Bio Module Initialized!");

module.exports = 
{
	name: 'bio',
    description: 'Displays bio of selected member',
    data: new SlashCommandBuilder()
            .setName('bio')
            .setDescription('Displays bio of selected member')
            .addStringOption(option =>
                option.setName('group')
                    .setDescription('Group Name')
                    .setRequired(true)
                    .addChoices(
                        { name: 'AKB48', value: 'akb48' },
                        { name: 'SKE48', value: 'ske48' },
                        { name: 'NMB48', value: 'nmb48' },
                        { name: 'HKT48', value: 'hkt48' },
                        { name: 'NGT48', value: 'ngt48' },
                        { name: 'STU48', value: 'stu48' }
                    ))
            .addStringOption(option =>
                option.setName('member')
                    .setDescription('Member Name')
                    .setRequired(true)),
    
    async execute(interaction) 
    {
        await interaction.deferReply();

        const group = interaction.options.getString('group');
        const member = interaction.options.getString('member');
        
        const color = getGroupColour(group);

        const db = Database.getInstance();
        const mem_data = db.getMember(group, member);

        console.info(mem_data);

        if (mem_data === Error.GROUP_NOT_FOUND)
        {
            console.info("  Group not found!");
            interaction.editReply(`Cannot find group ${group.toUpperCase()}.`);
            return;
        }

        if (mem_data === Error.MEM_NOT_FOUND)
        {
            console.info("  Member not found!");
            interaction.editReply(`Cannot find member ${member} in ${group.toUpperCase()}.`);
            return;
        }

        const embed = new EmbedBuilder()
                        .setTitle(`${member}'s Biography`)
                        .setColor(color)
                        .setAuthor({ name: `${group.toUpperCase()}`, iconURL: GROUP_LOGO[group], url: BASE_URLS.group_homepage[group] })
                        .addFields(
                            { name: 'Birthdate', value: mem_data.getBirthdate(), inline: true },
                            { name: 'Birthplace', value: mem_data.getBirthplace(), inline: true },
                            { name: 'Height', value: mem_data.getHeight(), inline: true },
                            { name: 'Bloodtype', value: mem_data.getBloodtype(), inline: true },
                            { name: '\u200B', value: '\u200B', inline: true},
                            { name: 'Agency', value: mem_data.getAgency(), inline: true },
                            { name: "Generation", value: mem_data.getGeneration(), inline: true },
                        )
                        .setImage(mem_data.getProfilePicture())
                        .setThumbnail(mem_data.getThumbnail());
        
        if (mem_data.getTeam() != null)
            embed.addFields({ name: 'Team', value: mem_data.getTeam() });

        let sns_text = "";
        if (mem_data.hasTwitter())
            sns_text += `Twitter: [@${mem_data.getHandleTwitter()}](https://twitter.com/${mem_data.getURLTwitter()})`;

        if (mem_data.hasInstagram())
        {
            if (sns_text.length > 0)
                sns_text += "\n";

            sns_text += `Instagram: [@${mem_data.getHandleInstagram()}](https://www.instagram.com/${mem_data.getURLInstagram()})`;
        }

        if (sns_text.length > 0)
            embed.addFields({ name: 'SNS', value: sns_text });

        embed.addFields({ name: 'Official Profile Page', value: `[Group Site](${mem_data.getURLKoushiki()} 'This will take you to the member's official profile on the group's homepage.')` });

        console.info("  Replying...");
        interaction.editReply({ embeds: [embed]});
    }
};