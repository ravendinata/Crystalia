const os = require('os');
const ps = require('process');

/* =====================
    EXPORTED SYMBOLS
===================== */

function serverInfo()
{
    let cpu = os.cpus()[0];
    let cpuCount = os.cpus().length;

    let memUse = Math.floor(ps.memoryUsage.rss() / 1000000);
    let memTot = Math.floor(os.totalmem / 1000000);

    const string =
    `\n========================================
    Server Info @ ${os.hostname} - ${process.env.server_type}:
    ========================================
    CPU: ${cpu.model} @ ${cpu.speed} MHz x ${cpuCount} threads
    Sys: ${os.platform} - ver. ${os.version} release ${os.release}
    Mem: ${memUse} MB [Used] / ${memTot} MB [Total]`;

    return string;
}

function resourceUsageReport()
{
    const resUsage = process.resourceUsage();

    let string =
    `\n========================================
    Resource Usage Report:
    ========================================
    Usr CPU Time: ${resUsage.userCPUTime / 1000} ms
    Sys CPU Time: ${resUsage.systemCPUTime / 1000} ms
    RSS Max: ${resUsage.maxRSS / 1000} MB
    fs: ${resUsage.fsRead} [Read] / ${resUsage.fsWrite} [Write]
    \n
    __***Non-Windows Only:***__
    context switch: ${resUsage.voluntaryContextSwitches} [Volu] / ${resUsage.involuntaryContextSwitches} [Invo]`

    return string;
}


/** ====================
 * * MODULE EXPORTS * * 
==================== **/

module.exports =
{
    serverInfo,
    resourceUsageReport
}