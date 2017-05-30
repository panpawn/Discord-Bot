/**
 * Chat Commands
 *
 * This is where the commands are defined
 *
 * TODO:
 * -restart/reload command(s)
 * -calender command
 *
 * @license MIT license
 */
exports.commands = {
	help: 'about',
	about: function (target, user, room) {
		room.send('```I am a node.js bot powered by discord.js: https://github.com/panpawn/Discord-Bot```');
	},
	ping: function (target, user, room) {
		let exec = require('child_process').exec;
		exec('ping 8.8.8.8 -n 8', (error, stdout, stderr) => {
			room.send('```' + stdout + stderr + '```');
		});
	},
	choose: 'pickrandom',
	pick: 'pickrandom',
	pickrandom: function (target, user, room) {
		if (!target) return room.send('```You have not given options to chose from.```');
		let optionsArr = target.split(',');
		let pick = optionsArr[Math.floor(Math.random() * optionsArr.length)].trim();
		room.send('```' + 'Randomly selected: ' + pick + '```');
	},

	/** Development Commands
	 * These commands should only be used if the operator knows what their doing.
	 */
	js: 'eval',
	eval: function (target, user, room) {
		if (!target) return room.send('```Usage: .eval [target]```');
		try {
			room.send('```' + eval(target) + '```');
		} catch (e) {
			room.send('```' + e.stack + '```');
		}
	},
	reload: 'hotpatch',
	hotpatch: function (target, user, room) {
		try {
			Chat.uncache('./chat');
			Chat = require('./chat');
			room.send('```Chat has been hotpatched successfully.```');
		} catch (e) {
			room.send('```Failed to hotpatch chat:\n' + e.stack + '```');
		}
	},
};
