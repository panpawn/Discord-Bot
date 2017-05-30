/**
 * Conversions commands plugin
 * 
 * This is where the conversion command is housed, as well
 * as various different conversions that it might use.
 *
 * @license MIT license
 */
'use strict';

exports.commands = {
    temp: 'conversion',
    c: 'conversion',
    convert: 'conversion',
    conversion: function (target, room, user, cmd, trigger) {
        if (!target) return Chat.send(room, `Usage: ${trigger}${cmd} [temp][C/F] - Attempts to convert a given temperature.`);
        let tarId = Chat.toId(target);
        if (tarId.includes('c')) {
            let num = tarId.substr(0, tarId.length - 1);
            if (!Number(num)) return Chat.send(room, 'Invalid number to convert.');
            return Chat.send(room, Math.round((num * 9/5) + 32) + '°F');
        } else if (tarId.includes('f')) {
            let num = tarId.substr(0, tarId.length - 1);
            if (!Number(num)) return Chat.send(room, 'Invalid number to convert.');
            return Chat.send(room, Math.round((num - 32) * 5/9) + '°C');
        } else {
            Chat.send(room, 'Unknown conversion.');
        }
    },
};
