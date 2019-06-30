/**
 * Fortnite plugin
 * 
 * This uses FNBR's API to fetch the item shop.
 * Authors: panpawn, jd4564
 * API: fnbr.co
 *
 * @license MIT license
 */
'use strict';

const https = require('https');
const puppeteer = require('puppeteer');
const URL = require('url');
const fs = require('fs');
const CronJob = require('cron').CronJob;

if (!bot.isHotpatched) {
	new CronJob('1 20 * * *', function() { // everday at 8:01 EST
		console.log('item shop posting triggered');
		bot.channels.forEach(function (channel, id) {
			if (id === '576600954510770176') {
				console.log('posting item shop...');
				Chat.commands['itemshop'](null, channel, null);
				console.log('item shop posted')
				return;
			}
		});
	}, null, true, 'America/New_York');
}

const imageSize = 130;

const colors = {
	common: {
		bg: '#bebebe,#646464',
		border: '#b1b1b1',
	},
	uncommon: {
		bg: '#60aa3a,#175117',
		border: '#87e339',
	},
	rare: {
		bg: '#49acf2,#143977',
		border: '#37d1ff',
	},
	epic: {
		bg: '#b15be2,#4b2483',
		border: '#e95eff',
	},
	marvel: {
		bg: '#c53334,#761b1b',
		border: '#ef3537',
	},
	legendary: {
		bg: '#d37841,#78371d',
		border: '#e98d4b',
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
		if (!Config.fnbrAPI) return Chat.send(room, "This bot does not have an API key configured to use this command.");
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

					function newRow(count) {
						if (count % 2 !== 0) return true;
						return false;
					}

					let featuredItemCount = 0;
					featured.forEach(item => {
						featuredItemCount++;
						if (newRow(featuredItemCount)) {
							buff += '</tr><tr>';
						};
						buff += `<td style="font-family: Arial; background: radial-gradient(${colors[item.rarity].bg}); border: 2px solid ${colors[item.rarity].border};"><div style="position: relative;"><img src="${item.images.icon}" width="${imageSize}" height="${imageSize}"><div style="text-align: center; position: absolute; bottom: 1px; color: white; background: rgba(0,0,0,.3); width: 100%;"><strong>${item.name}</strong><br /><span>${item.priceIconLink ? `<img style="vertical-align:middle" src="${item.priceIconLink}" width="16" height="16">` : ''}${item.price}</span></div></div></td>`;
					});
					buff += '</tr></table></td><td valign="top"><table cellspacing="10" style="float: left;"><tr><td colspan="2" style="color: white; text-align: center;"><span style="font-size: 20px; font-weight: bold;">Daily</span></td>';

					let dailyItemCount = 0;
					daily.forEach(item => {
						dailyItemCount++;
						if (newRow(dailyItemCount)) {
							buff += '</tr><tr>';
						};
						buff += `<td style="font-family: Arial; background: radial-gradient(${colors[item.rarity].bg}); border: 2px solid${colors[item.rarity].border};"><div style="position: relative;"><img src="${item.images.icon}" width="${imageSize}" height="${imageSize}"><div style="text-align: center; position: absolute; bottom: 1px; color: white; background: rgba(0,0,0,.3); width: 100%;"><strong>${item.name}</strong><br /><span>${item.priceIconLink ? `<img style="vertical-align:middle" src="${item.priceIconLink}" width="16" height="16">` : ''}${item.price}</span></div></div></td>`;
					});
					buff += '</tr></table></td></tr><tr><td colspan="4" style="text-align: center; color: white;"><small>Powered by the API from fnbr.co</small></td></tr></table></div>';

					fs.writeFileSync('shop.html', '<html><body bgcolor="#1E1E1E">' + buff + '</body></html>', 'utf8');

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
