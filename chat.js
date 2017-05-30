/**
 * Chat
 *
 * This handles the bots parser, as well as assigning the bots commands
 *
 * @license MIT license
 */
'use strict';

const commands = Chat.commands = require('./chat-commands').commands;

exports.parse = function (message, target, room, user) {
	const cmd = message.substr(1, message.length).split(' ')[0].trim();
	
	if (message.startsWith(Config.cmdchar) && commands[cmd]) {
		if (Config.logcmds) console.log(`CMD USED: ${cmd}`);
		try { // try calling the command
			if (typeof commands[cmd] === 'string') return commands[commands[cmd]](target, user, room); // alias
			commands[cmd](target, user, room); // runs the command
		} catch (e) {
			room.send('```' + e + '```'); // send user crash message
		}
	}
};

exports.uncache = function (root) {
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

exports.toId = function (text) {
	if (text && text.id) {
		text = text.id;
	} else if (text && text.userid) {
		text = text.userid;
	}
	if (typeof text !== 'string' && typeof text !== 'number') return '';
	return ('' + text).toLowerCase().replace(/[^a-z0-9]+/g, '');
};
