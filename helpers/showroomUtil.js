const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');
const cl = require('../helpers/crystaliaLibrary.js')
const { JSDOM } = require('jsdom');

const prefix = process.env.prefix;

// node-fetch option flags
const METHOD_GET = { method: "Get" };

// API URLs
const BASE_URL = "https://www.showroom-live.com";
const BASE_API_URL = "https://www.showroom-live.com/api";
const BASE_ONLIVE_API_URL = "https://www.showroom-live.com/api/live/onlives";

/* Breaks down raw URL into only URL key */
function getUrlKey(url) { return url.replace(BASE_URL + '/', ''); }

/** 
 * Fetches API data from the assigned url
 * @param url The URL from which the API should be fetched
 * @returns JSON data fetched from the API url
 */
async function getAPI(url)
{
    try
    {
        const response = await fetch(url, METHOD_GET);
        
        if (!response.ok) 
            throw new Error(`HTTP error! Status: ${response.statusText}`);
        
        return await response.json();
    } 
    catch(ex) { console.error(`Error encountered while fetching data...\nError:\n${ex.message}`); }
}

/**
 * Selects (by filtering) rooms associated with 48 group only
 * @param {*} data The fetched room list
 * @returns Room list with only rooms associated to 48 group
 */
const select48Rooms = data => data.filter(x => x.room_url_key.startsWith('akb48_') || x.room_url_key.startsWith('48_'));

/**
 * Filters the fetched room list data by parameter.
 * @param {*} data  The room list to be filtered
 * @param {*} param Filter parameters the function shouid match
 * @returns Filtered room list
 */
function filterNameAndURLKey(data, param) {
    const result = data.filter(x => x.room_url_key.toLowerCase().includes(param) || x.main_name.toLowerCase().includes(param));
    return Array.from(new Set(result));
}

async function roomIDtoURLKey(room_id)
{
    const result = await getAPI(`https://www.showroom-live.com/api/room/profile?room_id=${room_id}`);
    return await result.room_url_key;
}

async function urlKeyToRoomID(url_key)
{
    const result = await getAPI(`https://www.showroom-live.com/api/room/status?room_url_key=${url_key}`);
    return await result.room_id;
}

/* =======================
    EXPORTED FUNCTIONS
======================= */

/**
 * Get a list of members onlive/streaming,
 * then formats the data into Discord Embed format,
 * then sends the Embed to the requesting server.channel.
 *
 * @param message   Message Return Address
 * @param param     Search parameters (Can take any filter).
 *                  Doesn't need to be [groupName] [memberShort/memberCommon]
 */
async function getOnlive(interaction, param)
{
    const json = await getAPI(BASE_ONLIVE_API_URL);
    var result = select48Rooms(json.onlives[0].lives);
    var page = 1;

    if (param)
        result = filterNameAndURLKey(result, param);

    const liveCount = result.length;
    const embed = new EmbedBuilder().setColor("ffffff");

    if (liveCount <= 0) {
        embed.setTitle(`:satellite:  No Members ${param ? `with Keyword '${param}'` : ''} Currently Streaming`);
        return interaction.editReply({ embeds: [embed] });
    }

    embed.setTitle(`:satellite:  Members ${param ? `with Keyword '${param}'` : ''} Currently Streaming | Page 1`)
        .setFooter({ text: `${param ? `'${param}' search results` : 'Members/Rooms Streaming'}: ${liveCount}` });

    for (let string, title, names = 0; names < liveCount; names++)
    {
        string = `https://www.showroom-live.com/${result[names].room_url_key}` +
                 `\nStarted at: ${cl.convertEpochTo24hr(result[names].started_at)}`;
        title = result[names].main_name;

        if (result[names].label)
            title += `|  ${result[names].label}`;
        
        if (result[names].telop)
            string += `\nTelop: ${result[names].telop}`;

        embed.addFields({ name: title, value: `${string}\n\u200B` });

        if (names % 20 === 9 && names != liveCount - 1)
            embed.addFields({ name: '\u200B\n::: Break :::', value: '\u200B' });

        if (names % 20 === 19 && names >= 19 && names != liveCount - 1)
        {
            await interaction.editReply({ embeds: [embed] })
            embed = new EmbedBuilder().setColor("ffffff");
            
            ++page;

            embed.setTitle(`:satellite:  Members ${param ? `with Keyword '${param}'` : ''} Currently Streaming | Page ${page}`)
                .setFooter({ text: `${param ? `'${param}' search results` : 'Members/Rooms Streaming'}: ${liveCount}` });
        }
    }

    console.info(`> ${liveCount} Members Streaming | Success!`);

    if (page === 1)
        return interaction.editReply({ embeds: [embed] });
    else
        return interaction.followUp({ embeds: [embed] });
}

/**
 * Get a list of scheduled streams,
 * then formats the data into Discord Embed format,
 * then sends the Embed to the requesting server.channel.
 *
 * @param message   Message Return Address
 * @param param     Search parameters (Can take any filter).
 *                  Doesn't need to be [groupName] [memberShort/memberCommon]
 */
async function getScheduledStream(interaction, param)
{
    const json = await getAPI(`${BASE_API_URL}/live/upcoming?genre_id=102`);
    var result = select48Rooms(json.upcomings);

    if (param)
        result = filterNameAndURLKey(result, param);

    const count = result.length;
    let embed = new EmbedBuilder().setColor("ffffff");

    if (count <= 0)
    {
        embed.setTitle(`:satellite:  No Scheduled Streams ${param ? `with Keyword '${param}'` : ''}`);
        return interaction.editReply({ embeds: [embed] });
    }
    
    embed.setTitle(`:satellite:  ${param ? `Members with Keyword '${param}' ` : ''} Scheduled Stream | Page 1`)
         .setFooter({ text: `${param ? `'${param}' search results` : 'Scheduled Streams'}: ${count}` });

    for (let string, title, time, page = 1, names = 0; names < count; names++)
    {
        string = `https://www.showroom-live.com/${result[names].room_url_key}`;
        title = result[names].main_name;

        if (result[names].label)
            title += `|  ${result[names].label}`;

        time = cl.convertEpochTo24hr(result[names].next_live_start_at);

        embed.addFields({ name: title, value: `Scheduled for: ${time}\n${string}\n\u200B` });

        if (names % 20 == 9 && names != count-1)
        embed.addFields({ name: '\u200B\n::: Break :::', value: '\u200B' });

        if (names % 20 == 19 && names >= 19 && names != count-1)
        {
            message.channel.send(embed)
            embed = new EmbedBuilder().setColor("ffffff");
            
            ++page;

            embed.setTitle(`:satellite:  ${param ? `Members with Keyword '${param}' ` : ''} Scheduled Stream | Page ${page}`)
                .setFooter({ text: `${param ? `'${param}' search results` : 'Scheduled Streams'}: ${count}` });
        }
    }

    console.info(`> ${count} Scheduled Stream(s) | Success!`);

    return interaction.editReply({ embeds: [embed] });
}

/**
 * Get room ID from database (uses regular member search format), then
 * uses the room ID to get room data from API, then
 * creates a Discord Embed and formats the data for display, then
 * sends the Embed to the requesting server.channel.
 * 
 * ? Need to add more info fields?
 * 
 * @param message   Message Return Address
 * @param group     The group of the member requested (ex: AKB48)
 * @param short     The member identifier, could be memberShort or common
 *                  (ex: yamauchimizuki or zukkii)
 */
async function getRoomInfo(interaction, group, short)
{
    const room_id = await cl.getRoomId(group, short);
    const endpoint = `${BASE_API_URL}/room/profile?room_id=${room_id}`;

    console.info(`=== DEBUG @ API Fetch ===\n> API Endpoint: ${endpoint}`);

    if (room_id == undefined || room_id == -1)
        return interaction.editReply("Sorry! We cannot find that room!");

    const json = await getAPI(endpoint);

    console.log(`> Fetch Check: ${json.main_name}`);

    const img_url = json.image.replace("_m.png", "_l.png");

    const embed = new EmbedBuilder()
    .setColor(cl.getGroupColour(group))
    .setTitle(`${json.main_name} Room Info`)
    .addFields
    (
        { name: 'Room Name', value: `${json.main_name}` },
        { name: 'Room Level', value: `${json.room_level}` },
        { name: 'Room ID', value: `${json.room_id}` },
        { name: 'Follower', value: `${json.follower_num}` },
    )
    .setImage(img_url)
    .setURL(`https://www.showroom-live.com/${json.room_url_key}`);

    if (json.is_onlive)
    {
        embed.addFields
        (
            { name: 'Streaming Now', value: "Streaming [Online]" },
            { name: 'Current Stream Start Time', value: `${cl.convertEpochTo24hr(json.current_live_started_at)}` },
            { name: 'Current Stream Viewer Count', value: `${json.view_num}` }
        )
    }
    else
        embed.addFields({ name: 'Streaming Now', value: "Not Streaming [Offline]" });

    console.info(`${json.description}`);

    embed.addFields
    (
        { name: 'Stream Streak', value: `${json.live_continuous_days} continuous days` },
        { name: 'Room Description', value: `${json.description.substring(0, 990)}\n\n**<< Read more on SHOWROOM >>**` }
    )

    return interaction.editReply({ embeds: [embed] });
}

/**
 * Get room ID from database (uses regular member search format), then
 * uses the room ID to get next live time from API, then
 * creates a Discord Embed and formats the data for display, then
 * sends the Embed to the requesting server.channel.
 * 
 * ? Change display formatting?
 * 
 * @param message   Message Return Address
 * @param group     The group of the member requested (ex: AKB48)
 * @param short     The member identifier, could be memberShort or common
 *                  (ex: yamauchimizuki or zukkii)
 */
async function getNextLive(interaction, group, short)
{
    const room_id = await cl.getRoomId(group, short);
    const endpoint = `${BASE_API_URL}/room/next_live?room_id=${room_id}`;

    console.info(`=== DEBUG @ API Fetch ===\n> API Endpoint: ${endpoint}`);

    if (room_id == undefined || room_id == -1)
        return interaction.editReply("Sorry! We cannot find that room!");

    const json = await getAPI(endpoint);
    
    const embed = new EmbedBuilder()
    .setColor(cl.getGroupColour(group))
    .setTitle(`Next Scheduled Live`)
    .addFields({ name: "Date/Time:", value: `${json.text}` });

    return interaction.editReply({ embeds: [embed] });
}

/**
 * Get room ID from database (uses regular member search format), then
 * uses the room ID to get stage user list from API, then
 * creates a Discord Embed and formats the data for display, then
 * sends the Embed to the requesting server.channel.
 *
 * Note:
 * Stage User = Users that qualify in the Top 100 Live Rankking
 * 
 * ? Change 'n' parameter name?
 * 
 * @param message   Message Return Address
 * @param group     The group of the member requested (ex: AKB48)
 * @param short     The member identifier, could be memberShort or common
 *                  (ex: yamauchimizuki or zukkii)
 * @param n         Number of stage users to display (1-n)
 */
async function getStageUserList(interaction, group, short, n = 13)
{
    const room_id = await cl.getRoomId(group, short);
    const endpoint = `${BASE_API_URL}/live/stage_user_list?room_id=${room_id}`;

    console.info(`=== DEBUG @ API Fetch ===\n> API Endpoint: ${endpoint}`);

    if (room_id == undefined || room_id == -1)
        return interaction.editReply("Sorry! We cannot find that room!");

    const json = await getAPI(endpoint);
    const data = json.stage_user_list;

    if (data[0] == null)
    {
        console.info("> Abort! [Reason: Array Empty! User offline...]");
        return interaction.editReply("This member is not currently live streaming.\nPlease check again while member is live streaming.");
    }

    const embed = new EmbedBuilder()
    .setColor("#ffffff")
    .setTitle(`Next Scheduled Live`)
    .setImage(data[0].user.avatar_url);

    for (let i = 0; i < n; i++)
        embed.addFields({ name: `Rank ${i+1}`, value: `${data[i].user.name}` });

    return interaction.editReply({ embeds: [embed] });
}

async function count(interaction, param)
{
    const json = await getAPI(BASE_ONLIVE_API_URL);
    var result = select48Rooms(json.onlives[0].lives);

    if (param)
        result = filterNameAndURLKey(result, param);

    const embed = new EmbedBuilder().setColor("ffffff");
    embed.setDescription(`${result.length} members ${param ? `with keyword '${param}' ` : ''}are streaming now`);

    console.info(`> ${result.length} Members Streaming | Success!`);

    return interaction.editReply({ embeds: [embed] });
}

async function convert(interaction, param)
{
    const key = isNaN(param) ? await urlKeyToRoomID(param) : await roomIDtoURLKey(param);
    const embed = new EmbedBuilder().setColor("ffffff").setDescription(`${param} => ${key}`);
    return interaction.editReply({ embeds: [embed] });
}


/** ====================
 * * MODULE EXPORTS * * 
==================== **/

module.exports =
{
    count,
    convert,
    getOnlive,
    getScheduledStream,
    getRoomInfo,
    getNextLive,
    getStageUserList
}