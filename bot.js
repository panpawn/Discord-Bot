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
let startupMessage = ['Attempting to startup bot...'];

try {
	eval(`let a = "1, 2"; let [b, ...c] = a.split(','); c;`);
	startupMessage.push(`- Modern version of Node.js in use (${process.version})`);
} catch (e) {
	console.log("We require Node.js v6 or later; you're using " + process.version);
	process.exit();
}

// Check if discord.js is installed
try {
		require.resolve('discord.js');
		startupMessage.push(`- Discord.js is installed`);
} catch (e) {
		console.log('ERROR: discord.js is not installed yet - installing now (running `npm install discord.js`).');
		let exec = require('child_process').exec;
		exec('npm install discord.js', (error, stdout, stderr) => {
			if (error) console.log(`ERROR while installing discord.js: ${error}`);
			console.log(stdout + stderr);
			console.log('discord.js has been installed - run node bot.js again.');
		});
}

const Discord = require('discord.js');
global.bot = new Discord.Client();
bot.isHotpatched = false;

try {
		require.resolve('./config');
		startupMessage.push(`- ./config.js exists`);
} catch (e) { // config.js doesn't exist (yet)
		if (e.code !== 'MODULE_NOT_FOUND') throw e; // should never happen

		console.log("config.js doesn't exist - creating one with default settings...");
		fs.writeFileSync(path.resolve(__dirname, './config.js'),
			fs.readFileSync(path.resolve(__dirname, './config-example.js'))
		);
} finally {
		global.Config = require('./config');
}

if (Config.watchConfig) {
	fs.watchFile(path.resolve(__dirname, 'config.js'), function (curr, prev) {
		if (curr.mtime <= prev.mtime) return;
		try {
			delete require.cache[require.resolve('./config.js')];
			global.Config = require('./config.js');
			console.log('Reloaded config.js');
		} catch (e) {}
	});
}

let loggedIn = false;
if (Config.login.token) bot.login(Config.login.token).then(loggedIn = true).catch(console.error);
if (Config.login.username && Config.login.password) bot.login(Config.login.username, Config.login.password, tryLogin).then(loggedIn = true).catch(console.error);

if (loggedIn) {
	startupMessage.push(`- Logged in successfully`);
} else {
	startupMessage.push(`- Bot failed to log in`);
	console.log(startupMessage.join('\n'));
	return;
}

global.Chat = require('./chat');
global.Tools = require('./tools');
 
bot.on('message', message => {
		const msg = message.content;
		let tar = (msg.includes(' ') ? msg.substr(msg.indexOf(' ') + 1) : '');
		Chat.parse(msg, tar, message.channel, message.author);
});

bot.on('ready', () => {
		startupMessage.push('Bot has been sucessfully started!');
		console.log(startupMessage.join('\n'));
});
