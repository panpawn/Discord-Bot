/**
 * Tools
 *
 * This handles the bots utility functions
 *
 * @license MIT license
 */
'use strict';

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

exports.reloadChat = function () {
	bot.isHotpatched = true;

	Tools.uncache('./chat');
	Chat = require('./chat');

	Tools.uncache('./tools');
	Tools = require('./tools');
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

exports.asyncForEach = async function (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}
