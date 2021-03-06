/**
 * Chat Commands
 *
 * This is where the main commands are defined
 *
 * TODO:
 * -restart/reload command(s)
 * -calender command
 *
 * @license MIT license
 */
'use strict';

exports.commands = {
	help: 'about',
	about: function (target, room, user) {
		Chat.send(room, 'I am a Node.js bot powered by discord.js: https://github.com/panpawn/Discord-Bot');
	},
	ping: function (target, room, user) {
		if (!Chat.isAdmin(user)) return Chat.send(room, "Access denied.");
		let exec = require('child_process').exec;
		const cmd = process.platform === 'win32' ? 'ping 8.8.8.8 -n 8' : 'ping -c 8 8.8.8.8.8';
		exec(cmd, (error, stdout, stderr) => {
			Chat.send(room, stdout + stderr);
		});
	},
	choose: 'pickrandom',
	pick: 'pickrandom',
	pickrandom: function (target, room, user) {
		if (!target) return Chat.send(room, 'You have not given options to chose from.');
		let optionsArr = target.split(',');
		let pick = optionsArr[Math.floor(Math.random() * optionsArr.length)].trim();
		Chat.send(room, `Randomly selected: ${pick}`);
	},
	uptime: function (target, room, user) {
		const uptime = process.uptime();
		let uptimeText = '';
		if (uptime > 24 * 60 * 60) {
			let uptimeDays = Math.floor(uptime / (24 * 60 * 60));
			uptimeText = uptimeDays + " " + (uptimeDays === 1 ? "day" : "days");
			let uptimeHours = Math.floor(uptime / (60 * 60)) - uptimeDays * 24;
			if (uptimeHours) uptimeText += ", " + uptimeHours + " " + (uptimeHours === 1 ? "hour" : "hours");
		} else {
			uptimeText = Tools.toDurationString(uptime * 1000);
		}
		Chat.send(room, `Uptime: ${uptimeText}`);
	},
};
