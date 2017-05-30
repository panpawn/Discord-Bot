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
		const cmd = process.platform === 'win32' ? 'ping 8.8.8.8 -n 8' : 'ping -c 8 8.8.8.8.8';
		exec(cmd, (error, stdout, stderr) => {
			room.send('```' + stdout + stderr + '```');
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
};
