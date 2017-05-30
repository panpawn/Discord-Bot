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
	about: function (target, room, user) {
		Chat.send(room, 'I am a Node.js bot powered by discord.js: https://github.com/panpawn/Discord-Bot');
	},
	ping: function (target, room, user) {
		let exec = require('child_process').exec;
		let bash = exec(process.platform === 'win32' ? 'ping 8.8.8.8 -n 8' : 'ping -c 8 8.8.8.8.8');
		let sentMsg, sentData = '';
		bash.stdout.on('data', function (data) {
			if (!sentMsg) {
				room.send("```\n" + data + "```\n").then(function (message) {
					sentMsg = message;
					sentData = data;
				});
			} else {
				sentData += data;
				sentMsg.edit("```\n" + sentData + "\n```");
			}
		});
	},
	choose: 'pickrandom',
	pick: 'pickrandom',
	pickrandom: function (target, room, user) {
		if (!target) return room.send('```You have not given options to chose from.```');
		let optionsArr = target.split(',');
		let pick = optionsArr[Math.floor(Math.random() * optionsArr.length)].trim();
		Chat.send(room, `Randomly selected: ${pick}`);
	},

	/** Development Commands
	 * These commands should only be used if the operator knows what their doing.
	 */
	js: 'eval',
	eval: function (target, room, user, cmd) {
		if (!target) return Chat.send(room, `Usage: ${Config.cmdchar}${cmd} [target]`);
		try {
			room.send('```' + eval(target) + '```');
		} catch (e) {
			room.send('```' + e.stack + '```');
		}
	},
	reload: 'hotpatch',
	hotpatch: function (target, room, user) {
		try {
			Chat.uncache('./chat');
			Chat = require('./chat');
			Chat.send(room, 'Chat has been hotpatched successfully.');
		} catch (e) {
			Chat.send(room, `Failed to hotpatch chat:\n${e.stack}`);
		}
	},
};
