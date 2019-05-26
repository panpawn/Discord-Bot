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

const commands = exports.commands = require('./chat-commands').commands;

for (let file of fs.readdirSync(path.resolve(__dirname, 'chat-plugins'))) {
	if (file.substr(-3) !== '.js') continue;
	Object.assign(commands, require('./chat-plugins/' + file).commands);
}

exports.parse = function (message, target, room, user) {
	const cmd = message.substr(1, message.length).split(' ')[0].trim();
	const cmdId = Tools.toId(cmd);
	const trigger = Config.cmdchar;

	if (message.startsWith(Config.cmdchar) && commands[cmdId]) {
		if (Config.logcmds) console.log(`CMD USED: ${message} | user: ${user.username}#${user.discriminator}`);
		try { // try calling the command
			if (typeof commands[cmdId] === 'string') return commands[commands[cmdId]](target, room, user, cmd, trigger); // alias
			commands[cmdId](target, room, user, cmd, trigger); // runs the command
		} catch (e) {
			Chat.send(room, e.stack); // send user crash message
		}
	}
};

exports.send = function (room, message) {
	room.send('```' + message + '```');
};

exports.basicSend = function (room, message) {
	room.send(message);
}

exports.isAdmin = function (user) {
	return Config.admins.includes(user.id);
};
