const Discord = require('discord.js');
const fetch = require('node-fetch');

console.info("Showroom Module Initialized!");

module.exports =
{
    name: 'showroom',
    description: 'Showroom Info Utility',
    execute(message, args)
    {
        let url = "https://www.showroom-live.com/api/live/onlives";
        let opt = { method: "Get" };

        console.time(`showroom`);

        fetch(url, opt)
        .then(res => res.json())
        .then((json) =>
        {
            var data = json.onlives[2].lives;
            var result = data.filter(function(x)
            { return x.room_url_key.startsWith("48_"); })

            if (args[0] != undefined)
            {
                var q1 = result.filter(function(x)
                { return x.room_url_key.toLowerCase().includes(args[0]); })

                var q2 = result.filter(function(x)
                { return x.main_name.toLowerCase().includes(args[0]); })

                result = q1.concat(q2);
            }

            const string = JSON.stringify(result);
            const output = JSON.parse(string);

            /* console.info("\nMembers On Live:");
            for (names in output)
                console.info(output[names].main_name); */
            
            const embed = new Discord.MessageEmbed()
            .setColor("ffffff")
            .setTitle(`:satellite:  Members on Live Now`)

            for (names in output)
                embed.addField(output[names].main_name, 
                               `https://www.showroom-live.com/${output[names].room_url_key}`);

            return message.channel.send(embed);
        })

        console.timeEnd(`showroom`);
    }
}