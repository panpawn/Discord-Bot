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
// (this doesn't actually work (yet))
exports.admins = [];

// logcmds - whether or not to log when a command is used or not
exports.logcmds = false;
