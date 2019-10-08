/**
 * Configuration File
 *
 * This handles various settings of the bot
 *
 * @license MIT license
 */
'use strict';

// login - The information required for the bot to login to discord.
// You have the option of either using a token or the username and
// password; you don't have to use both.
exports.login = {
	token: '',
	username: '',
	password: '',
};

// cmdchar - The character the bot will use for its commands
exports.cmdchar = '.';
 
// admins - Users who can have access to the bots commands.
// WARNING: Some commands, such as eval, can access the computers filesystem.
exports.admins = [];

// logcmds - whether or not to log when a command is used or not
exports.logcmds = false;

// watchConfig - whether or not config.js should be watched for changes or not.
exports.watchConfig = true;

// fnbrAPI - the API key used for fetching data from https://fnbr.co
exports.fnbrAPI = '';

// github - for tracking changes of GitHub repositories. 'rooms' is an array of
// all rooms (by id) that should be notified of these changes.
exports.github = {
	port: '',
	secret: '',
	rooms: [''],
};
