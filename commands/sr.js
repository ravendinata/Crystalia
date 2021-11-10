/* 
    ALIAS for showroom command 
    ==========================
    Extra Path! Need to reimplement!
*/

module.exports =
{
    name: 'sr',
    description: 'Alias for showroom command',
    execute(message, args)
    {
        const sr = require('../commands/showroom.js');
        sr.execute(message, args);
    }
}