const showroomClient = require('../utils/showroomUtil.js')

console.info("Showroom Module Initialized!");

module.exports =
{
    name: 'showroom',
    description: 'Showroom Info command',
    aliases: ["sr", "sroom"],
    execute(message, args)
    {
        let opt = args[0];
        let param = args[1];
        let optParam = args[2];

        switch(opt)
        {
            default: case "onlive": case "streaming":
                console.time(`[PM] On Live`);
                showroomClient.getOnlive(message, param);
                console.timeEnd(`[PM] On Live`);
                break;

            case "roominfo": case "info":
                console.time(`[PM] Room Info`);
                showroomClient.getRoomInfo(message, param, optParam);
                console.timeEnd(`[PM] Room Info`);
                break;

            case "next": case "nextlive": case "scheduled":
                console.time(`[PM] Next Live`);
                showroomClient.getNextLive(message, param, optParam);
                console.timeEnd(`[PM] Next Live`);
                break;

            case "stage": case "podium": case "ranking": case "stageuser":
                console.time(`[PM] Stage User`);
                showroomClient.getStageUserList(message, param, optParam);
                console.timeEnd(`[PM] Stage User`);
                break;

            case "count":
                console.time(`[PM] Stage User`);
                showroomClient.count(message, param);
                console.timeEnd(`[PM] Stage User`);
                break;
        }
    }
}