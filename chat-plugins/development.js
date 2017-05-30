/**
 * Development commands plugin
 * 
 * This houses the bot's development commands.
 * These commands should only be used if the operator knows what their doing.
 *
 * @license MIT license
 */
'use strict';

exports.commands = {
	js: 'eval',
	eval: function (target, room, user, cmd) {
		if (!target) return Chat.send(room, `Usage: ${Config.cmdchar}${cmd} [target]`);
		try {
			Chat.send(room, eval(target));
		} catch (e) {
			Chat.send(room, e.stack);
		}
	},
	reload: 'hotpatch',
	hotpatch: function (target, room, user) {
		try {
			Chat.reload();
			Chat.send(room, 'Chat has been hotpatched successfully.');
		} catch (e) {
			Chat.send(room, `Failed to hotpatch chat:\n${e.stack}`);
		}
	},
};
