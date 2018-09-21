/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const fs = require('fs');
const request = require('request');

const UTR50_URL = 'http://www.unicode.org/Public/vertical/revision-13/VerticalOrientation-13.txt';

request(UTR50_URL, (error, response, data) => {
	let from, type;
	if (error || (response.statusCode !== 200)) {
		throw new Error();
	}

	let nextPoint = 0;
	const orientations = [];

	const pushOrientation = function(to, type) {
		if (__guard__(orientations[orientations.length - 1], (x) => x.type) === type) {
			return orientations[orientations.length - 1].to = to;
		}
		return orientations.push({
			from: nextPoint,
			to,
			type,
		});
	};

	for (const line of data.split('\n')) {
		var codepoint, to;
		if ((line.length === 0) || (line[0] === '#')) {
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
			pushOrientation(from - 1, 'R');
		} else {
			pushOrientation(to, type);
		}

		nextPoint = to + 1;
	}

	const newOrientations = {};

	for (const orientation of orientations) {
		newOrientations[orientation.from] = orientation.type;
	}

	return fs.writeFileSync(`${__dirname}/orientations.json`, JSON.stringify(newOrientations));
});

function __guard__(value, transform) {
	return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
