/**
 * Fortnite plugin
 * 
 * This uses FNBR's API to fetch the item shop.
 *
 * @license MIT license
 */
'use strict';

const https = require('https');
const puppeteer = require('puppeteer');
const URL = require('url');
const fs = require('fs');
var CronJob = require('cron').CronJob;
new CronJob('1 20 * * *', function() { // everday at 8:01 EST
	console.log('item shop posting triggered');
	bot.channels.forEach(function (channel, id) {
		console.log('id: ' + id);
		if (id === '576600954510770176') {
			console.log('found channel');
			Chat.commands['itemshop'](null, channel, null);
			return;
		}
	});
}, null, true, 'America/New_York');

const imageSize = 130;

const colors = {
	common: {
		bg: 'background: radial-gradient(#bebebe,#646464);',
		border: 'border: 2px solid #b1b1b1;;',
	},
	uncommon: {
		bg: 'background: radial-gradient(#60aa3a,#175117);',
		border: 'border: 2px solid #87e339;',
	},
	rare: {
		bg: 'background: radial-gradient(#49acf2,#143977);',
		border: 'border: 2px solid #37d1ff;',
	},
	epic: {
		bg: 'background: radial-gradient(#b15be2,#4b2483);',
		border: 'border: 2px solid #e95eff;',
    },
    marvel: {
        bg: 'background: radial-gradient(#c53334,#761b1b);',
        border: 'border: 2px solid #ef3537;',
    },
	legendary: {
		bg: 'background: radial-gradient(#d37841,#78371d);',
		border: 'border: 2px solid #e98d4b;',
	},
};

function screenshot(callback) {
	puppeteer.launch().then(function (browser) {
		browser.newPage().then(function (page) {
			page.setViewport({width: 1920, height: 1080}).then(function () {
				page.goto(URL.pathToFileURL('./shop.html'), {waitUntil: 'networkidle0'}).then(function () {
					page.$('body > div > table').then(function (selector) {
						selector.screenshot({path: 'itemshop.png'}).then(function (img) {
							browser.close();
							return callback(img);
						});
					});
				});
			});
		});
	});
}

exports.commands = {
  	fortnite: 'itemshop',
	itemshop: function (target, room, user) {
		const date = new Date();
		const stamp = `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
		if (!user || Chat.isAdmin(user)) {
			const options = {
				host: 'fnbr.co',
				port: 443,
				path: `/api/shop`,
				method: 'GET',
				headers: {
					'x-api-key': Config.fnbrAPI,
			},
			};
			let body = '';
			const self = Chat;
			const r = room;
			https.get(options, function (res, error) {
				res.on('data', function (data) {
					body += data;
				});
				res.on('end', function () {
					let buff = `<div><table><tr><td colspan="4" style="text-align: center; color: white;"><span style="font-size: 20px; font-weight: bold;">Fortnite Item Shop</span><br />${stamp}</td></tr><tr><td valign="top"><table cellspacing="10" style="float: left;"><tr><td colspan="2" style="color: white; text-align: center;"><span style="font-size: 20px; font-weight: bold;">Featured</span></td>`;
					let shop = false;
					try {
						shop = (JSON.parse(body).data);
					} catch (e) {
						self.send(r, "Could not fetch shop.");
						return;
					}
					if (!shop) return self.send(r, 'oh no, something failed while trying to load the shop');
					const featured = shop.featured;
					const daily = shop.daily;
					let itemCount = 0;
					function newRow(count) {
						if (count % 2 !== 0) return true;
						return false;
					}
					featured.forEach(item => {
						itemCount++;
						if (newRow(itemCount)) {
							buff += '</tr><tr>';
						};
						let marquee = false; // item.name.length > 15;
						buff += `<td style="font-family: Arial; ${colors[item.rarity].bg} ${colors[item.rarity].border}"><div style="position: relative;"><img src="${item.images.icon}" width="${imageSize}" height="${imageSize}"><div style="text-align: center; position: absolute; bottom: 1px; color: white; background: rgba(0,0,0,.3); width: 100%;"><strong>${marquee ? '<marquee scrollamount="5">' : ''}${item.name}${marquee ? '</marquee>' : ''}</strong><br /><span>${item.priceIconLink ? `<img style="vertical-align:middle" src="${item.priceIconLink}" width="16" height="16">` : ''}${item.price}</span></div></div></td>`;
					});
					buff += '</tr></table></td><td valign="top"><table cellspacing="10" style="float: left;"><tr><td colspan="2" style="color: white; text-align: center;"><span style="font-size: 20px; font-weight: bold;">Daily</span></td>';
					
					daily.forEach(item => {
						itemCount++;
						if (newRow(itemCount)) {
							buff += '</tr><tr>';
						};
						let marquee = false; // item.name.length > 15;
						buff += `<td style="font-family: Arial; ${colors[item.rarity].bg} ${colors[item.rarity].border}"><div style="position: relative;"><img src="${item.images.icon}" width="${imageSize}" height="${imageSize}"><div style="text-align: center; position: absolute; bottom: 1px; color: white; background: rgba(0,0,0,.3); width: 100%;"><strong>${marquee ? '<marquee scrollamount="5">' : ''}${item.name}${marquee ? '</marquee>' : ''}</strong><br /><span>${item.priceIconLink ? `<img style="vertical-align:middle" src="${item.priceIconLink}" width="16" height="16">` : ''}${item.price}</span></div></div></td>`;
					});
					buff += '</tr></table></td></tr><tr><td colspan="4" style="text-align: center; color: white;"><small>Powered by the API from fnbr.co</small></td></tr></table></div>';

					fs.writeFileSync('shop.html', '<html><body bgcolor="#1E1E1E">' + buff + '</bod></html>', 'utf8');

					screenshot(function (buffer) {
						room.send("Current Fortnite Item Shop", {files: [{attachment: buffer}]});
					});
				});
				res.on('error', function (e) {
					self.send(r, `Crashed while trying to get the shop: ${e.code}`);
				});
			});
		} else {
			room.send("Current Fortnite Item Shop", {files: [{attachment: 'itemshop.png'}]});
		}
	},
};
