/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const fs = require('fs');
const request = require('request');

const EAW_URL = 'http://www.unicode.org/Public/UCD/latest/ucd/EastAsianWidth.txt';

request(EAW_URL, (error, response, data) => {
	let from, type;
	if (error || (response.statusCode !== 200)) {
		throw new Error();
	}

	let nextPoint = 0;
	const widths = [];

	const pushWidth = function(to, type) {
		if (__guard__(widths[widths.length - 1], (x) => x.type) === type) {
			return widths[widths.length - 1].to = to;
		}
		return widths.push({
			from: nextPoint,
			to,
			type,
		});
	};

	for (let line of data.split('\n')) {
		var codepoint, to;
		line = line.replace(/#.*$/, '');

		if (line.length === 0) {
			continue;
		}

		[codepoint, type] = Array.from(line.split(';').map((token) => token.trim()));
		const codepoints = codepoint.split('..').map((token) => parseInt(token, 16));

		if (codepoints.length === 1) {
			[from, to] = Array.from([codepoints[0], codepoints[0]]);
		} else {
			[from, to] = Array.from(codepoints);
		}

		if (nextPoint !== from) {
			pushWidth(from - 1, 'N');
		} else {
			pushWidth(to, type);
		}

		nextPoint = to + 1;
	}

	const widthsObj = {};

	for (const width of widths) {
		widthsObj[width.from] = width.type;
	}

	return fs.writeFileSync(`${__dirname}/widths.json`, JSON.stringify(widthsObj));
});

function __guard__(value, transform) {
	return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
