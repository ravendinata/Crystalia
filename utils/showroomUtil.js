const Discord = require('discord.js');
const fetch = require('node-fetch');
const cl = require('../utils/crystaliaLibrary.js')
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
async function getOnlive(message, param)
{
    let waiter = new cl.Waiter(message);
    await waiter.send(`Fetching onlive member list. Please wait...`);

    var json = await getAPI(BASE_ONLIVE_API_URL);
    var data = json.onlives[0].lives;
    var result = select48Rooms(data);

    if (param != undefined)
        result = filterNameAndURLKey(result, param);

    const liveCount = result.length;
    let embed = new Discord.MessageEmbed().setColor("ffffff");

    if (liveCount <= 0)
    {
        if (param == undefined)
            embed.setTitle(`:satellite:  No Members Currently Streaming`);
        else
            embed.setTitle(`:satellite:  No Members with Keyword '${param}' is Currently Streaming`);

        waiter.delete();
        return message.channel.send(embed);
    }

    if (param == undefined)
        embed.setTitle(`:satellite:  Members Currently Streaming | Page 1`)
             .setFooter(`Members/Rooms Streaming: ${liveCount}`);
    else
        embed.setTitle(`:satellite:  Members with Keyword '${param}' Currently Streaming | Page 1`)
             .setFooter(`'${param}' search results: ${liveCount}`);

    for (let string, title, page = 1, names = 0; names < liveCount; names++)
    {
        string = `https://www.showroom-live.com/${result[names].room_url_key}` +
                 `\nStarted at: ${cl.convertEpochTo24hr(result[names].started_at)}`;
        title = result[names].main_name;

        if (result[names].label != undefined)
            title = title + `|  ${result[names].label}`;
        
        if (result[names].telop != undefined)
            string = string + `\nTelop: ${result[names].telop}`;

        embed.addField(title, `${string}\n\u200B`);

        if (names % 20 == 9 && names != liveCount-1)
            embed.addField('\u200B\n::: Break :::', '\u200B');

        if (names % 20 == 19 && names >= 19 && names != liveCount-1)
        {
            message.channel.send(embed);
            embed = new Discord.MessageEmbed().setColor("ffffff");
            
            ++page;

            if (param == undefined)
                embed.setTitle(`:satellite:  Members Currently Streaming | Page ${page}`)
                     .setFooter(`Members/Rooms Streaming: ${liveCount}`);
            else
                embed.setTitle(`:satellite:  Members with Keyword '${param}' Currently Streaming | Page ${page}`)
                     .setFooter(`'${param}' search results: ${liveCount}`);
        }
    }

    console.info(`> ${liveCount} Members Streaming | Success!`);

    waiter.delete();
    return message.channel.send(embed);
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
async function getScheduledStream(message, param)
{
    let waiter = new cl.Waiter(message);
    await waiter.send(`Fetching scheduled stream list. Please wait...`);

    var json = await getAPI(BASE_API_URL + "/live/upcoming?genre_id=102");
    var data = json.upcomings;
    var result = select48Rooms(data);

    if (param != undefined)
        result = filterNameAndURLKey(result, param);

    const count = result.length;
    let embed = new Discord.MessageEmbed().setColor("ffffff");

    if (count <= 0)
    {
        if (param == undefined)
            embed.setTitle(`:satellite:  No Scheduled Streams`);
        else
            embed.setTitle(`:satellite:  No Scheduled Streams with Keyword '${param}'`);

        waiter.delete();
        return message.channel.send(embed);
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
            embed = new Discord.MessageEmbed().setColor("ffffff");
            
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

    waiter.delete();
    return message.channel.send(embed);
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
async function getRoomInfo(message, group, short)
{
    var room_id;
    
    if (short != null)
        room_id = await cl.getRoomId(group, short);
    else
        room_id = group;

    const endpoint = "/room/profile?room_id=" + room_id;

    console.info(`=== DEBUG @ API Fetch ===\n> API Endpoint: ${BASE_API_URL + endpoint}`);

    if (room_id == undefined || room_id == -1)
        return message.channel.send("Sorry but we cannot find that room!");

    let waiter = new cl.Waiter(message);
    if (short != null)
        await waiter.send(`Fetching room information for ${group} ${short}...`);
    else
        await waiter.send(`Fetching room information using Room ID: ${group}...`);


    var json = await getAPI(BASE_API_URL + endpoint);
    var isLive = "Not Streaming [Offline]";

    console.log(`> Fetch Check: ${json.main_name}`);

    var img_url = json.image.replace("_m.png", "_l.png");

    const embed = new Discord.MessageEmbed()
    .setColor(cl.getGroupColour(group))
    .setTitle(`${json.main_name} Room Info`)
    .addFields
    (
        { name: 'Room Name', value: json.main_name },
        { name: 'Room Level', value: json.room_level },
        { name: 'Room ID', value: json.room_id },
        { name: 'Follower', value: json.follower_num }
    )
    .setImage(img_url)
    .setURL(`https://www.showroom-live.com/${json.room_url_key}`);

    if (json.is_onlive == true)
    {
        embed.addFields
        (
            { name: 'Streaming Now', value: "Streaming [Online]" },
            { name: 'Current Stream Start Time', value: cl.convertEpochTo24hr(json.current_live_started_at) },
            { name: 'Current Stream Viewer Count', value: json.view_num }
        )
    }
    else
        embed.addField('Streaming Now', "Not Streaming [Offline]");

    embed.addFields
    (
        { name: 'Stream Streak', value: json.live_continuous_days + " days" },
        { name: 'Room Description', value: json.description }
    )

    waiter.delete();
    return message.channel.send(embed);
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
async function getNextLive(message, group, short)
{
    const room_id = await cl.getRoomId(group, short);
    const endpoint = "/room/next_live?room_id=" + room_id;

    console.info(`=== DEBUG @ API Fetch ===\n> API Endpoint: ${BASE_API_URL + endpoint}`);

    if (room_id == undefined || room_id == -1)
        return message.channel.send("Sorry but we cannot find that room!");

    let waiter = new cl.Waiter(message);
    await waiter.send(`Fetching next scheduled live for ${group} ${short}...`);

    var json = await getAPI(BASE_API_URL + endpoint);
    const embed = new Discord.MessageEmbed()
    .setColor(cl.getGroupColour(group))
    .setTitle(`Next Scheduled Live`)
    .addField("Date/Time:", json.text);

    waiter.delete();
    return message.channel.send(embed);
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
async function getStageUserList(message, group, short, n = 13)
{
    const room_id = await cl.getRoomId(group, short);
    const endpoint = "/live/stage_user_list?room_id=" + room_id;

    console.info(`=== DEBUG @ API Fetch ===\n> API Endpoint: ${BASE_API_URL + endpoint}`);

    if (room_id == undefined || room_id == -1)
        return message.channel.send("Sorry but we cannot find that room!");

    let waiter = new cl.Waiter(message);
    await waiter.send("Fetching stage user list...");

    var json = await getAPI(BASE_API_URL + endpoint);
    const data = json.stage_user_list;

    if (data[0] == null)
    {
        console.info("> Abort! [Reason: Array Empty! User offline...]");
        waiter.delete();
        return message.channel.send("This member is not currently live streaming.\nPlease check again while member is live streaming.");
    }

    const embed = new Discord.MessageEmbed()
    .setColor("#ffffff")
    .setTitle(`Next Scheduled Live`)
    .setImage(data[0].user.avatar_url);

    for (let i = 0; i < n; i++)
        embed.addField(`Rank ${i+1}`, data[i].user.name);

    waiter.delete();
    return message.channel.send(embed);
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

    const embed = new Discord.MessageEmbed()
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

async function count(message, param)
{
    let waiter = new cl.Waiter(message);
    await waiter.send("Counting number of members currently streaming...");

    var json = await getAPI(BASE_ONLIVE_API_URL);
    var data = json.onlives[0].lives;
    var result = select48Rooms(data);

    if (param != undefined)
        result = filterNameAndURLKey(result, param);

    const liveCount = result.length;
    let embed = new Discord.MessageEmbed().setColor("ffffff");
                    
    if (param == undefined)
        embed.setDescription(`${liveCount} members are streaming now`);
    else
        embed.setDescription(`${liveCount} members with keyword '${param}' are streaming now`);

    console.info(`> ${liveCount} Members Streaming | Success!`);

    waiter.delete();
    return message.channel.send(embed);
}

async function convert(message, param)
{
    var key;

    if (!isNaN(param))
        key = await roomIDtoURLKey(param);
    else
        key = await urlKeyToRoomID(param);

    let embed = new Discord.MessageEmbed().setColor("ffffff");
    embed.setDescription(`${param} => ${key}`);

    return message.channel.send(embed);
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