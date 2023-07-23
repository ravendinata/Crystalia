const { SlashCommandBuilder } = require('discord.js');
const { selectRandomAndCompare, CommonVariables } = require('../helpers/crystaliaLibrary.js');
const showroomClient = require('../helpers/showroomUtil.js')

console.info("Showroom Module Initialized!");

module.exports =
{
    name: 'showroom',
    description: 'Showroom Info command',
    data: new SlashCommandBuilder()
            .setName('showroom')
            .setDescription('Showroom Info command')
            // Onlive Subcommand
            .addSubcommand(subcommand =>
                subcommand.setName('onlive')
                    .setDescription('Get On Live Stream')
                    .addStringOption(option =>
                        option.setName('filter')
                            .setDescription('Filter query')
                            .setRequired(false)))
            
            // Scheduled Stream Subcommand
            .addSubcommand(subcommand =>
                subcommand.setName('scheduled-stream')
                    .setDescription('Get Scheduled Stream')
                    .addStringOption(option =>
                        option.setName('filter')
                            .setDescription('Filter query')
                            .setRequired(false)))

            // Room Info Subcommand
            .addSubcommand(subcommand =>
                subcommand.setName('room-info')
                    .setDescription('Get Room Info')
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
                            .setRequired(true)))

            // Next Live Subcommand
            .addSubcommand(subcommand =>
                subcommand.setName('next-stream')
                    .setDescription('Get Next Live Stream')
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
                            .setRequired(true)))
                            
            // Stage User List Subcommand
            .addSubcommand(subcommand =>
                subcommand.setName('stage-user-list')
                    .setDescription('Get Stage User List')
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
                            .setRequired(true)))

            // Active Live Streams Count Subcommand
            .addSubcommand(subcommand =>
                subcommand.setName('active-live-streams-count')
                    .setDescription('Get Count of Active Live Streams')
                    .addStringOption(option =>
                        option.setName('filter')
                            .setDescription('Filter query')
                            .setRequired(false)))

            // Convert Subcommand
            .addSubcommand(subcommand =>
                subcommand.setName('convert')
                    .setDescription('Convert Room ID to URL Key and vice versa')
                    .addStringOption(option =>
                        option.setName('parameter')
                            .setDescription('Parameter')
                            .setRequired(true))),

    async execute(interaction)
    {
        const opt = interaction.options.getSubcommand();

        switch(opt)
        {
            case "onlive":
                console.time(`[PM] On Live`);
                showroomClient.getOnlive(interaction, 
                                         interaction.options.getString('filter'));
                console.timeEnd(`[PM] On Live`);
                break;

            case "scheduled-stream":
                console.time(`[PM] Schedule`);
                showroomClient.getScheduledStream(interaction,
                                                  interaction.options.getString('filter'));
                console.timeEnd(`[PM] Schedule`);
                break;

            case "room-info":
                console.time(`[PM] Room Info`);
                showroomClient.getRoomInfo(interaction, 
                                           interaction.options.getString('group'),
                                           interaction.options.getString('member'));
                console.timeEnd(`[PM] Room Info`);
                break;

            case "next-stream":
                console.time(`[PM] Next Live`);

                showroomClient.getNextLive(interaction,
                                           interaction.options.getString('group'),
                                           interaction.options.getString('member'));
                console.timeEnd(`[PM] Next Live`);
                break;

            case "stage-user-list":
                console.time(`[PM] Stage User`);
                showroomClient.getStageUserList(interaction,
                                                interaction.options.getString('group'),
                                                interaction.options.getString('member'));
                console.timeEnd(`[PM] Stage User`);
                break;

            case "active-live-streams-count":
                console.time(`[PM] Active Live Stream Count`);
                showroomClient.count(interaction,
                                     interaction.options.getString('filter'));
                console.timeEnd(`[PM] Count`);
                break;

            case "convert":
                console.time(`[PM] Convert`);
                showroomClient.convert(interaction,
                                       interaction.options.getString('parameter'));
                console.timeEnd(`[PM] Convert`);
                break;
        }
    }
}