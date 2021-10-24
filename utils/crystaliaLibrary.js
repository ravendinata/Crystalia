require('dotenv').config();

const Discord = require('discord.js');
const prefix = process.env.prefix;

/*
    CRYSTALIA FRAMEWORK
    ===================
    Version 0.1a
*/

// Randomizer Functions
function randomInteger(min, max)
{
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomInteger(max)
{
    return Math.floor(Math.random() * max);
}

function selectRandomAndCompare(min, max, last, change = 0)
{
    var n = randomInteger(max) + min;

    if (n == last && max != 0)
    {
        if (n == 0)
            n++;
        else if (n == max)
            n--;
        else
            randomInteger(1) == 1 ? n++ : n--;

        change = n - last;
    }

    return { id: n, change: change };
}

// Colour Function
function getGroupColour(group)
{
    if (group === 'akb48') return '#ff69b3';
    else if (group === 'hkt48') return '#000000';
    else if (group === 'ngt48') return '#ff0000';
    else if (group === 'nmb48') return '#eb9d47';
    else if (group === 'ske48') return '#f7b501';
    else if (group === 'stu48') return '#d0e7f9';
}


/*========================================
    MODULE EXPORTS
========================================*/

module.exports =
{
    randomInteger,
    getGroupColour,
    selectRandomAndCompare
}