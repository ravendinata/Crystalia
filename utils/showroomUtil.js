const Discord = require('discord.js');
const fetch = require('node-fetch');
const cl = require('../utils/crystaliaLibrary.js')

const prefix = process.env.prefix;

// node-fetch option flags
const METHOD_GET = { method: "Get" };

// API URLs
const BASE_URL = "https://www.showroom-live.com";
const BASE_API_URL = "https://www.showroom-live.com/api";
const BASE_ONLIVE_API_URL = "https://www.showroom-live.com/api/live/onlives";

/* Breaks down raw URL into only URL key */
function getUrlKey(url) { return url.replace(BASE_URL + '/', ''); }

/* =======================
    EXPORTED FUNCTIONS
======================= */

/**
 *
 * Get a list of members onlive/streaming,
 * then formats the data into Discord Embed format,
 * then sends the Embed to the requesting server.channel.
 *
 * @param message   Message Return Address
 * @param param     Search parameters (Can take any filter).
 *                  Doesn't need to be [groupName] [memberShort/memberCommon]
 */
function getOnlive(message, param)
{
    fetch(BASE_ONLIVE_API_URL, METHOD_GET)
    .then(res => res.json())
    .then((json) =>
    {
        var data = json.onlives[0].lives;
        var r1 = data.filter(function(x)
        { return x.room_url_key.startsWith("akb48_"); })
        var r2 = data.filter(function(x)
        { return x.room_url_key.startsWith("48_"); })

        var result = r1.concat(r2);

        if (param != undefined)
        {
            var q1 = result.filter(function(x)
            { return x.room_url_key.toLowerCase().includes(param); })

            var q2 = result.filter(function(x)
            { return x.main_name.toLowerCase().includes(param); })

            result = q1.concat(q2);
            var set = new Set(result);
            result = Array.from(set);
        }

        const liveCount = result.length;
        let embed = new Discord.MessageEmbed().setColor("ffffff");

        if (liveCount <= 0)
        {
            if (param == undefined)
                embed.setTitle(`:satellite:  No Members Currently Streaming`);
            else
                embed.setTitle(`:satellite:  No Members with Keyword '${param}' is Currently Streaming`);

            return message.channel.send(embed);
        }
        else
        {
            if (param == undefined)
                embed.setTitle(`:satellite:  Members Currently Streaming | Page 1`)
                     .setFooter(`Members/Rooms Streaming: ${liveCount}`);
            else
                embed.setTitle(`:satellite:  Members with Keyword '${param}' Currently Streaming | Page 1`)
                     .setFooter(`'${param}' search results: ${liveCount}`)
        }

        for (let string, title, page = 1, names = 0; names < liveCount; names++)
        {
            string = `https://www.showroom-live.com/${result[names].room_url_key}`;
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
                message.channel.send(embed)
                embed = new Discord.MessageEmbed().setColor("ffffff");
                
                ++page;

                if (param == undefined)
                    embed.setTitle(`:satellite:  Members Currently Streaming | Page ${page}`)
                         .setFooter(`Members/Rooms Streaming: ${liveCount}`);
                else
                    embed.setTitle(`:satellite:  Members with Keyword '${param}' Currently Streaming | Page ${page}`)
                         .setFooter(`'${param}' search results: ${liveCount}`)
            }
        }

        console.info(`> ${liveCount} Members Streaming | Success!`);

        return message.channel.send(embed);
    })
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
    const room_id = await cl.getRoomId(group, short);
    const endpoint = "/room/profile?room_id=" + room_id;

    console.info(`=== DEBUG @ API Fetch ===\n> API Endpoint: ${BASE_API_URL + endpoint}`);

    if (room_id == undefined || room_id == -1)
        return message.channel.send("Sorry but we cannot find that room!");

    fetch(BASE_API_URL + endpoint, METHOD_GET)
    .then(res => res.json())
    .then(json => 
    {
        var isLive;
        var currStreamStart = cl.convertEpochTo24hr(json.current_live_started_at);

        console.log(`> Fetch Check: ${json.main_name}`);

        if (json.is_onlive == true)
            isLive = "Yes [Online]";
        else
        {
            isLive = "Not Streaming [Offline]";
            currStreamStart = isLive;
        }

        const embed = new Discord.MessageEmbed()
        .setColor(cl.getGroupColour(group))
        .setTitle(`${json.main_name} Room Info`)
        .addFields(
            { name: 'Room Name', value: json.main_name },
            { name: 'Room Level', value: json.room_level },
            { name: 'Room ID', value: json.room_id },
            { name: 'Follower', value: json.follower_num },
            { name: 'Streaming Now', value: isLive },
            { name: 'Current Stream Start Time', value: currStreamStart },
            { name: 'Current Viewer', value: json.view_num },
            { name: 'Room Description', value: json.description }
        )
        .setImage(json.image)

        return message.channel.send(embed);
    })
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

    fetch(BASE_API_URL + endpoint, METHOD_GET)
    .then(res => res.json())
    .then(json => 
    {
        const embed = new Discord.MessageEmbed()
        .setColor(cl.getGroupColour(group))
        .setTitle(`Next Scheduled Live`)
        .addField("Date/Time:", json.text)

        return message.channel.send(embed);
    })
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

    fetch(BASE_API_URL + endpoint, METHOD_GET)
    .then(res => res.json())
    .then(json => 
    {
        const data = json.stage_user_list;

        if (data[0] == null)
        {
            console.info("> Abort! [Reason: Array Empty! User offline...]");
            return message.channel.send("This member is not currently live streaming.\nPlease check again while member is live streaming.");
        }

        const embed = new Discord.MessageEmbed()
        .setColor("#ffffff")
        .setTitle(`Next Scheduled Live`)
        .setImage(data[0].user.avatar_url)

        for (let i = 0; i < n; i++)
            embed.addField(`Rank ${i+1}`, data[i].user.name);

        return message.channel.send(embed);
    })
}

async function count(message, param)
{
    fetch(BASE_ONLIVE_API_URL, METHOD_GET)
    .then(res => res.json())
    .then((json) =>
    {
        var data = json.onlives[0].lives;
        var r1 = data.filter(function(x)
        { return x.room_url_key.startsWith("akb48_"); })
        var r2 = data.filter(function(x)
        { return x.room_url_key.startsWith("48_"); })

        var result = r1.concat(r2);

        if (param != undefined)
        {
            var q1 = result.filter(function(x)
            { return x.room_url_key.toLowerCase().includes(param); })

            var q2 = result.filter(function(x)
            { return x.main_name.toLowerCase().includes(param); })

            result = q1.concat(q2);
            var set = new Set(result);
            result = Array.from(set);
        }

        const liveCount = result.length;
        let embed = new Discord.MessageEmbed().setColor("ffffff");
                        
        if (param == undefined)
            embed.setDescription(`${liveCount} members are streaming now`);
        else
            embed.setDescription(`${liveCount} members with keyword '${param}' are streaming now`);

        console.info(`> ${liveCount} Members Streaming | Success!`);

        return message.channel.send(embed);
    })
}


/** ====================
 * * MODULE EXPORTS * * 
==================== **/

module.exports =
{
    count,
    getOnlive,
    getRoomInfo,
    getNextLive,
    getStageUserList
}