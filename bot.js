/**
 * Main Application File
 *
 * This starts the bot as well as handles sending
 * messages to the parser.
 *
 * @license MIT license
 */
'use strict';

const path = require('path');
const fs = require('fs');

const LOGIN = false;

try {
	eval(`let a = "1, 2"; let [b, ...c] = a.split(','); c;`);
} catch (e) {
	console.log("We require Node.js v6 or later; you're using " + process.version);
	process.exit();
}

// Check if discord.js is installed
try {
		require.resolve('discord.js');
} catch (e) {
		console.log('ERROR: discord.js is not installed yet - installing now (running `npm install discord.js`).');
		let exec = require('child_process').exec;
		exec('npm install discord.js', (error, stdout, stderr) => {
			if (error) console.log(`ERROR while installing discord.js: ${error}`);
			console.log(stdout + stderr)
			console.log('discord.js has been installed - run node bot.js again.');
		});
}

const Discord = require('discord.js');
const bot = new Discord.Client();

try {
		require.resolve('./config');
} catch (e) { // config.js doesn't exist (yet)
		if (e.code !== 'MODULE_NOT_FOUND') throw e; // should never happen

		console.log("config.js doesn't exist - creating one with default settings...");
		fs.writeFileSync(path.resolve(__dirname, './config.js'),
			fs.readFileSync(path.resolve(__dirname, './config-example.js'))
		);
} finally {
		global.Config = require('./config');
}

if (Config.login.token) bot.login(Config.login.token, tryLogin);
if (Config.login.username && Config.login.password) bot.login(Config.login.username, Config.login.password, tryLogin);

function tryLogin (error, token) { // Login check function
		if (error) {
			return console.log(`There was an error logging in: ${error}`);
		} else {
			console.log(`Logged in successfully.`);
			LOGIN = true;
		}
}
//if (!LOGIN) return; // Stop here if the bot can't login.

global.Chat = {};
Chat = Object.assign(Chat, require('./chat'));
 
bot.on('message', message => {
		//if (Config.admins && !(Config.admins.includes(message.author))) return;
		if (message.author !== bot.user) return; // user has not specified who can access commands

		const msg = message.content;
		let tar = (msg.includes(' ') ? msg.substr(msg.indexOf(' ') + 1) : '');
		Chat.parse(msg, tar, message.channel, message.author);
});

bot.on('ready', () => {
		const startedMessage = ['Bot has been successfully started.', '- dependency discord.js has been installed', '- config.js exists', '- modern node version in use'];
		console.log(startedMessage.join('\n'));
});
