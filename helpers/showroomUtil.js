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
    const response = await fetch(url, METHOD_GET);
    return await response.json();
}

/**
 * Selects (by filtering) rooms associated with 48 group only
 * @param {*} data The fetched room list
 * @returns Room list with only rooms associated to 48 group
 */
function select48Rooms(data)
{
    var r1 = data.filter(function(x)
    { return x.room_url_key.startsWith("akb48_"); })
    var r2 = data.filter(function(x)
    { return x.room_url_key.startsWith("48_"); })

    return r1.concat(r2);
}

/**
 * Filters the fetched room list data by parameter.
 * @param {*} data  The room list to be filtered
 * @param {*} param Filter parameters the function shouid match
 * @returns Filtered room list
 */
function filterNameAndURLKey(data, param)
{
    var q1 = data.filter(function(x)
    { return x.room_url_key.toLowerCase().includes(param); })

    var q2 = data.filter(function(x)
    { return x.main_name.toLowerCase().includes(param); })

    result = q1.concat(q2);
    var set = new Set(result);
    return Array.from(set);
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
    var json = await getAPI(BASE_ONLIVE_API_URL);
    var data = json.onlives[0].lives;
    var result = select48Rooms(data);
    var page = 1;

    if (param != undefined)
        result = filterNameAndURLKey(result, param);

    const liveCount = result.length;
    let embed = new EmbedBuilder().setColor("ffffff");

    if (liveCount <= 0)
    {
        if (param == undefined)
            embed.setTitle(`:satellite:  No Members Currently Streaming`);
        else
            embed.setTitle(`:satellite:  No Members with Keyword '${param}' is Currently Streaming`);

        return interaction.reply({ embeds: [embed] });
    }

    if (param == undefined)
        embed.setTitle(`:satellite:  Members Currently Streaming | Page 1`)
             .setFooter({ text: `Members/Rooms Streaming: ${liveCount}` });
    else
        embed.setTitle(`:satellite:  Members with Keyword '${param}' Currently Streaming | Page 1`)
             .setFooter({ text: `'${param}' search results: ${liveCount}` });

    for (let string, title, names = 0; names < liveCount; names++)
    {
        string = `https://www.showroom-live.com/${result[names].room_url_key}` +
                 `\nStarted at: ${cl.convertEpochTo24hr(result[names].started_at)}`;
        title = result[names].main_name;

        if (result[names].label != undefined)
            title = title + `|  ${result[names].label}`;
        
        if (result[names].telop != undefined)
            string = string + `\nTelop: ${result[names].telop}`;

        embed.addFields({ name: title, value: `${string}\n\u200B` });

        if (names % 20 == 9 && names != liveCount-1)
            embed.addFields({ name: '\u200B\n::: Break :::', value: '\u200B' });

        if (names % 20 == 19 && names >= 19 && names != liveCount-1)
        {
            await interaction.reply({ embeds: [embed] })
            embed = new EmbedBuilder().setColor("ffffff");
            
            ++page;

            if (param == undefined)
                embed.setTitle(`:satellite:  Members Currently Streaming | Page ${page}`)
                     .setFooter({ text: `Members/Rooms Streaming: ${liveCount}` });
            else
                embed.setTitle(`:satellite:  Members with Keyword '${param}' Currently Streaming | Page ${page}`)
                     .setFooter({ text: `'${param}' search results: ${liveCount}` });
        }
    }

    console.info(`> ${liveCount} Members Streaming | Success!`);

    if (page == 1)
        return interaction.reply({ embeds: [embed] });
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
    var json = await getAPI(BASE_API_URL + "/live/upcoming?genre_id=102");
    var data = json.upcomings;
    var result = select48Rooms(data);

    if (param != undefined)
        result = filterNameAndURLKey(result, param);

    const count = result.length;
    let embed = new EmbedBuilder().setColor("ffffff");

    if (count <= 0)
    {
        if (param == undefined)
            embed.setTitle(`:satellite:  No Scheduled Streams`);
        else
            embed.setTitle(`:satellite:  No Scheduled Streams with Keyword '${param}'`);

        return interaction.reply({ embeds: [embed] });
    }

    if (param == undefined)
        embed.setTitle(`:satellite:  Scheduled Stream | Page 1`)
             .setFooter(`Scheduled Streams: ${count}`);
    else
        embed.setTitle(`:satellite:  Members with Keyword '${param}' Scheduled Stream | Page 1`)
             .setFooter(`'${param}' search results: ${count}`);

    for (let string, title, time, page = 1, names = 0; names < count; names++)
    {
        string = `https://www.showroom-live.com/${result[names].room_url_key}`;
        title = result[names].main_name;

        if (result[names].label != undefined)
            title = title + `|  ${result[names].label}`;

        time = cl.convertEpochTo24hr(result[names].next_live_start_at);

        embed.addField(title, `Scheduled for: ${time}\n${string}\n\u200B`);

        if (names % 20 == 9 && names != liveCount-1)
            embed.addField('\u200B\n::: Break :::', '\u200B');

        if (names % 20 == 19 && names >= 19 && names != count-1)
        {
            message.channel.send(embed)
            embed = new EmbedBuilder().setColor("ffffff");
            
            ++page;

            if (param == undefined)
                embed.setTitle(`:satellite:  Members Currently Streaming | Page ${page}`)
                     .setFooter(`Members/Rooms Streaming: ${count}`);
            else
                embed.setTitle(`:satellite:  Members with Keyword '${param}' Currently Streaming | Page ${page}`)
                     .setFooter(`'${param}' search results: ${count}`);
        }
    }

    console.info(`> ${count} Scheduled Stream(s) | Success!`);

    return interaction.reply({ embeds: [embed] });
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
    var room_id;
    
    if (short != null)
        room_id = await cl.getRoomId(group, short);
    else
        room_id = group;

    const endpoint = "/room/profile?room_id=" + room_id;

    console.info(`=== DEBUG @ API Fetch ===\n> API Endpoint: ${BASE_API_URL + endpoint}`);

    if (room_id == undefined || room_id == -1)
        return interaction.reply("Sorry! We cannot find that room!");

    var json = await getAPI(BASE_API_URL + endpoint);

    console.log(`> Fetch Check: ${json.main_name}`);

    var img_url = json.image.replace("_m.png", "_l.png");

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

    if (json.is_onlive == true)
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

    return interaction.reply({ embeds: [embed] });
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
    const endpoint = "/room/next_live?room_id=" + room_id;

    console.info(`=== DEBUG @ API Fetch ===\n> API Endpoint: ${BASE_API_URL + endpoint}`);

    if (room_id == undefined || room_id == -1)
        return interaction.reply("Sorry! We cannot find that room!");

    var json = await getAPI(BASE_API_URL + endpoint);
    
    const embed = new EmbedBuilder()
    .setColor(cl.getGroupColour(group))
    .setTitle(`Next Scheduled Live`)
    .addFields({ name: "Date/Time:", value: `${json.text}` });

    return interaction.reply({ embeds: [embed] });
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
    const endpoint = "/live/stage_user_list?room_id=" + room_id;

    console.info(`=== DEBUG @ API Fetch ===\n> API Endpoint: ${BASE_API_URL + endpoint}`);

    if (room_id == undefined || room_id == -1)
        return interaction.reply("Sorry! We cannot find that room!");

    var json = await getAPI(BASE_API_URL + endpoint);
    const data = json.stage_user_list;

    if (data[0] == null)
    {
        console.info("> Abort! [Reason: Array Empty! User offline...]");
        return interaction.reply("This member is not currently live streaming.\nPlease check again while member is live streaming.");
    }

    const embed = new EmbedBuilder()
    .setColor("#ffffff")
    .setTitle(`Next Scheduled Live`)
    .setImage(data[0].user.avatar_url);

    for (let i = 0; i < n; i++)
        embed.addFields({ name: `Rank ${i+1}`, value: `${data[i].user.name}` });

    return interaction.reply({ embeds: [embed] });
}

async function getLiveRanking(message, group, short, n = 13) 
{
    const room_id = await cl.getRoomId(group, short);
    const key = await roomIDtoURLKey(room_id);

    console.info(`\n=== DEBUG @ API Fetch ===\n> URL Key: ${key}`);

    let waiter = new cl.Waiter(message);
    await waiter.send("Fetching live ranking...");

    var dom;
    try
    {
        dom = await JSDOM.fromURL(`https://www.showroom-live.com/r/${key}`, 
                                  { resources:"usable", runScripts: "dangerously" })
    } 
    catch(ex) { waiter.delete(); }

    const node = dom.window.document.getElementById('js-live-data');
    const json = JSON.parse(node.getAttribute("data-json"));
    const ranking = json.ranking.live_ranking;
    
    dom.window.close();

    if (ranking[0] == null)
    {
        console.info("> Abort! [Reason: User offline...]");
        waiter.delete();
        return message.channel.send("This member is not currently live streaming.\nPlease check again while member is live streaming.");
    }

    const embed = new EmbedBuilder()
    .setColor("#ffffff")
    .setTitle(`Live Ranking as of ${cl.convertEpochTo24hr(ranking[0].updated_at)}`)
    .setImage(ranking[0].user.avatar_url)

    for (let i = 0; i < n; i++)
    {
        embed.addField(`Rank ${i+1}`, 
                       `${ranking[i].user.name}\nPoints: ${ranking[i].point}`);
    }

    waiter.delete();
    return message.channel.send(embed);
}

async function count(interaction, param)
{
    var json = await getAPI(BASE_ONLIVE_API_URL);
    var data = json.onlives[0].lives;
    var result = select48Rooms(data);

    if (param != undefined)
        result = filterNameAndURLKey(result, param);

    const liveCount = result.length;
    let embed = new EmbedBuilder().setColor("ffffff");
                    
    if (param == undefined)
        embed.setDescription(`${liveCount} members are streaming now`);
    else
        embed.setDescription(`${liveCount} members with keyword '${param}' are streaming now`);

    console.info(`> ${liveCount} Members Streaming | Success!`);

    return interaction.reply({ embeds: [embed] });
}

async function convert(interaction, param)
{
    var key;

    if (!isNaN(param))
        key = await roomIDtoURLKey(param);
    else
        key = await urlKeyToRoomID(param);

    let embed = new EmbedBuilder().setColor("ffffff");
    embed.setDescription(`${param} => ${key}`);

    return interaction.reply({ embeds: [embed] });
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
    getStageUserList,
    getLiveRanking
}