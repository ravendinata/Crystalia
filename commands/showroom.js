const { selectRandomAndCompare } = require('../utils/crystaliaLibrary.js');
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
            default: case "onlive": case "streaming": case "live":
                console.time(`[PM] On Live`);
                showroomClient.getOnlive(message, param);
                console.timeEnd(`[PM] On Live`);
                break;

            case "schedule": case "sched": case "scheduled":
                console.time(`[PM] Schedule`);
                showroomClient.getScheduledStream(message, param);
                console.timeEnd(`[PM] Schedule`);
                break;

            case "roominfo": case "room": case "info":
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
            case "liverank": case "rank":
                console.time(`[PM] Stage User`);
                showroomClient.getLiveRanking(message, param, optParam);
                console.timeEnd(`[PM] Stage User`);
                break;

            case "count": case "num": case "number":
                console.time(`[PM] Count`);
                showroomClient.count(message, param);
                console.timeEnd(`[PM] Count`);
                break;

            case "convert": case "translate": case "conv": case "tl":
                console.time(`[PM] Convert`);
                showroomClient.convert(message, param);
                console.timeEnd(`[PM] Convert`);
                break;

        }
    }
}