/**
 * GitHub Alerts
 *
 * Primary code from https://github.com/Ecuacion/Pokemon-Showdown-Node-Bot/tree/master/features/github
 * Also, code from https://github.com/smogon/GitHub-Bot
 * This handles alerting our Development room of GitHub updates/changes.
 * This was converted to work on PS servers by jd, and then converted to work on GitHub by panpawn.
 *
 * @license MIT license
 */
'use strict';

const usernames = require('./github-usernames');

if (!Config.github) return;

let updates = {};

const github = exports.github = require('githubhook')({
	port: Config.github.port,
	secret: Config.github.secret,

});

function sendMessage(message) {
	for (let room of Config.github.rooms) {
		Chat.basicSend(bot.channels.get(room), message);
	}
}

function getRepo(repo) {
	switch (repo) {
		case 'Pokemon-Showdown':
			repo = 'server';
			break;
		case 'Pokemon-Showdown-Client':
			repo = 'client';
			break;
		case 'Pokemon-Showdown-Dex':
			repo = 'dex';
			break;
		default:
			repo = repo.toLowerCase();
	}

	return repo;
}

github.on('push', function push(repo, ref, result) {
	let url = result.compare;
	let branch = /[^/]+$/.exec(ref)[0];
	let message = [];
	repo = getRepo(repo);
	const userid = result.pusher.name.toLowerCase().replace(/[^a-z0-9]+/g, '');
	const username = usernames[userid] || userid;
	const action = result.forced ? 'force-pushed' : 'pushed';
	const number = result.commits.length === 1 ? `1 new commit` : `${result.commits.length} new commits`;

	message.push(`[${repo}] ${username} ${action} ${number} to ${branch}:`);

	result.commits.forEach(function (commit) {
		const commitMessage = commit.message;
		const commitUsername = usernames[commit.author.name] || commit.author.name;
		const commitHash = commit.id.substring(0, 6);
		const commitUrl = commit.url;
		let shortCommit = /.+/.exec(commitMessage)[0];
		if (commitMessage !== shortCommit) {
			shortCommit += '...';
		}
		message.push(`${commitHash} ${commitUsername}: ${shortCommit} (${commitUrl})`);
	});

	sendMessage(message.join('\n'));
});

github.on('pull_request', function pullRequest(repo, ref, result) {
	const COOLDOWN = 10 * 60 * 1000;
	const requestNumber = result.pull_request.number;
	const url = result.pull_request.html_url;
	let action = result.action;
	const userid = result.sender.login.toLowerCase().replace(/[^a-z0-9]+/g, '');
	const username = usernames[userid] || userid;
	repo = getRepo(repo);
	if (!updates[repo]) updates[repo] = {};
	if (action === 'synchronize') {
		action = 'updated';
	}
	if (action === 'labeled' || action === 'unlabeled') {
		// Nobody cares about labels
		return;
	}
	const now = Date.now();
	if (updates[repo][requestNumber] && updates[repo][requestNumber] + COOLDOWN > now) {
		return;
	}
	updates[repo][requestNumber] = now;
	let message = `[${repo}] ${username} ${action} pull request #${requestNumber}: ${result.pull_request.title} (${url})`;

	sendMessage(message);
});

github.listen();
