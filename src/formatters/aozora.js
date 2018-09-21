/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS203: Remove `|| {}` from converted for-own loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const repeat = require('core-js/library/fn/string/repeat');
const extend = require('xtend');
const util = require('../util');

// longest first margins array
const margins = [
	{
		char: '　',
		length: 1,
	},
	{
		char: ' ',
		length: 1 / 4,
	},
];

const entityPresets = {
	aozora: {
		'《': '※［＃始め二重山括弧、1-1-52］',
		'》': '※［＃終わり二重山括弧、1-1-53］',
		'［': '※［＃始め角括弧、1-1-46］',
		'］': '※［＃終わり角括弧、1-1-47］',
		'〔': '※［＃始めきっこう（亀甲）括弧、1-1-44］',
		'〕': '※［＃終わりきっこう（亀甲）括弧、1-1-45］',
		'｜': '※［＃縦線、1-1-35］',
		'＃': '※［＃井げた、1-1-84］',
		'※': '※［＃米印、1-2-8］',
	},
	publishing: {
		'《': '｜《',
		'》': '｜》',
		'［': '｜［',
		'］': '｜］',
		'〔': '〔',
		'〕': '〕',
		'｜': '｜｜',
		'＃': '＃',
		'※': '※',
	},
};

const defaultConfig = {entities: 'aozora'};

module.exports = function(config) {
	let char;
	config = extend(defaultConfig, config);

	if (typeof config.entities === 'string') {
		config.entities = entityPresets[config.entities] != null ? entityPresets[config.entities] : {};
	}

	const entityChars = (() => {
		const result = [];
		for (char of Object.keys(config.entities || {})) {
			const entity = config.entities[char];
			result.push(char);
		}
		return result;
	})().join('');
	const entityCharsRegEx = new RegExp(`[${entityChars.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}]`, 'g');

	const escapeText = (text) => text.replace(entityCharsRegEx, (char) => config.entities[char]);

	const ret = [];

	for (const chunk of this.chunks) {
		let chunkString = '';
		for (const token of chunk.tokens) {
			var text;
			switch (token.type) {
				case 'upright':
					if (token.text.length <= 1) {
						chunkString += escapeText(util.width.zenkaku(token.text));
					} else {
						text = util.width.hankaku(token.text);
						chunkString += `［＃縦中横］${escapeText(text)}［＃縦中横終わり］`;
					}
					break;

				case 'margin':
					var {length} = token;
					var marginString = '';

					while (length >= margins.slice(-1)[0].length) {
						for (const margin of margins) {
							if (length >= margin.length) {
								marginString += margin.char;
								length -= margin.length;
							}
						}
					}

					chunkString += marginString;
					break;

				default:
					chunkString += escapeText(token.text);
			}
		}

		ret.push(chunkString);
	}

	return ret;
};
