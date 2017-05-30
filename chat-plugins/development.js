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
	eval: function (target, room, user, cmd, trigger) {
		if (!target) return Chat.send(room, `Usage: ${trigger}${cmd} [target]`);
		try {
			Chat.send(room, `Javascript\n${eval(target)}`);
		} catch (e) {
			Chat.send(room, `Javascript\n${e.stack}`);
		}
	},
	reload: 'hotpatch',
	hotpatch: function (target, room, user) {
		try {
			Chat.reload();
			Chat.send(room, 'Chat has been hotpatched successfully.');
		} catch (e) {
			Chat.send(room, `Javascript\nFailed to hotpatch chat:\n${e.stack}`);
		}
	},
};
