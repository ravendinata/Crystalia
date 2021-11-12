/** 
    ALIAS for showroom command
    ==========================
    * TODO: This Method takes extra path! Try to reimplement.
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