/**
 * Chat
 *
 * This handles the bots parser, as well as assigning the bots commands
 *
 * @license MIT license
 */
'use strict';
const fs = require('fs');
const path = require('path');

const commands = Chat.commands = require('./chat-commands').commands;

for (let file of fs.readdirSync(path.resolve(__dirname, 'chat-plugins'))) {
	if (file.substr(-3) !== '.js') continue;
	Object.assign(commands, require('./chat-plugins/' + file).commands);
}

exports.parse = function (message, target, room, user) {
	const cmd = message.substr(1, message.length).split(' ')[0].trim();
	const cmdId = Chat.toId(cmd);

	if (message.startsWith(Config.cmdchar) && commands[cmdId]) {
		if (Config.logcmds) console.log(`CMD USED: ${cmd}`);
		try { // try calling the command
			if (typeof commands[cmdId] === 'string') return commands[commands[cmdId]](target, room, user, cmd); // alias
			commands[cmdId](target, room, user, cmd); // runs the command
		} catch (e) {
			Chat.send(room, e.stack); // send user crash message
		}
	}
};

exports.send = function (room, message) {
	room.send('```' + message + '```');
};

exports.uncache = function (root) { // uncache from: https://github.com/Zarel/Pokemon-Showdown/blob/master/chat.js
	let uncache = [require.resolve(root)];
	do {
		let newuncache = [];
		for (let i of uncache) {
			if (require.cache[i]) {
				newuncache.push.apply(newuncache,
					require.cache[i].children.map(function (module) {
						return module.filename;
					})
				);
				delete require.cache[i];
			}
		}
		uncache = newuncache;
	} while (uncache.length);
};

exports.reload = function () {
	Chat.uncache('./chat');
	Chat = require('./chat');
};

exports.toDurationString = function (number, options) { // toDurationString from: https://github.com/Zarel/Pokemon-Showdown/blob/master/chat.js
	const date = new Date(+number);
	const parts = [date.getUTCFullYear() - 1970, date.getUTCMonth(), date.getUTCDate() - 1, date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()];
	const unitNames = ["second", "minute", "hour", "day", "month", "year"];
	const positiveIndex = parts.findIndex(elem => elem > 0);
	if (options && options.hhmmss) {
		let string = parts.slice(positiveIndex).map(value => value < 10 ? "0" + value : "" + value).join(":");
		return string.length === 2 ? "00:" + string : string;
	}
	return parts.slice(positiveIndex).reverse().map((value, index) => value ? value + " " + unitNames[index] + (value > 1 ? "s" : "") : "").reverse().join(" ").trim();
};

exports.toId = function (text) { // toId from: https://github.com/Zarel/Pokemon-Showdown/blob/master/sim/dex-data.js
	if (text && text.id) {
		text = text.id;
	} else if (text && text.userid) {
		text = text.userid;
	}
	if (typeof text !== 'string' && typeof text !== 'number') return '';
	return ('' + text).toLowerCase().replace(/[^a-z0-9]+/g, '');
};
