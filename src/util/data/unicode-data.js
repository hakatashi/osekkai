/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const fs = require('fs');
const request = require('request');

const codePointAt = require('core-js/library/fn/string/code-point-at');
const fromCodePoint = require('core-js/library/fn/string/from-code-point');

const UDATA_URL = 'http://www.unicode.org/Public/3.1-Update/UnicodeData-3.1.0.txt';

const decompositionTypes = [
	'font',
	'nobreak',
	'initial',
	'medial',
	'final',
	'isolated',
	'circle',
	'super',
	'sub',
	'vertical',
	'wide',
	'narrow',
	'small',
	'square',
	'fraction',
	'compat',
];

request(UDATA_URL, (error, response, data) => {
	let category, type;
	if (error || response.statusCode !== 200) {
		throw new Error();
	}

	const decompositions = {};
	for (const decompositionType of decompositionTypes) {
		decompositions[decompositionType] = {};
	}

	let nextPoint = 0;
	const categories = [];

	const pushCategory = function(codePoint, type) {
		const lastCategory = categories[categories.length - 1];

		if ((lastCategory != null ? lastCategory.to : undefined) !== codePoint - 1) {
			if (lastCategory != null) {
				lastCategory.to = codePoint - 1;
			}
		}

		if ((lastCategory != null ? lastCategory.type : undefined) === type) {
			lastCategory.to = codePoint;
		} else {
			categories.push({
				from: codePoint,
				to: codePoint,
				type,
			});
		}

		return (nextPoint = codePoint + 1);
	};

	for (let line of data.split('\n')) {
		let ISO10646,
			bidiCategory,
			codePoint,
			combiningClasses,
			decimalDigit,
			decomposition,
			digit,
			lowercase,
			mirrored,
			name,
			numeric,
			titlecase,
			unicode1,
			uppercase,
			uppoercase;
		line = line.replace(/#.*$/, '');

		if (line.length === 0) {
			continue;
		}

		[
			codePoint,
			name,
			category,
			combiningClasses,
			bidiCategory,
			decomposition,
			decimalDigit,
			digit,
			numeric,
			mirrored,
			unicode1,
			ISO10646,
			uppoercase,
			lowercase,
			titlecase,
		] = Array.from(line.split(';').map((token) => token.trim()));

		// normalization
		codePoint = parseInt(codePoint, 16);
		decomposition = decomposition.split(' ');
		decimalDigit = parseInt(decimalDigit, 10);
		mirrored = mirrored === 'Y';
		[uppercase, lowercase, titlecase] = Array.from(
			[uppoercase, lowercase, titlecase].map((point) => (point.length === 0 ? null : parseInt(point, 16)))
		);

		if (decomposition[0] != null ? decomposition[0].match(/^<.+>$/) : undefined) {
			type = decomposition[0].replace(/^<(.+)>$/, '$1');
			if (!decompositionTypes.includes(type)) {
				type = 'compat';
			}
			const decomposedString = decomposition
				.slice(1)
				.map((str) => fromCodePoint(parseInt(str, 16)))
				.join('');
			decompositions[type][fromCodePoint(codePoint)] = decomposedString;
		}

		pushCategory(codePoint, category);
	}

	const categoriesObj = {};

	for (category of categories) {
		categoriesObj[category.from] = category.type;
	}

	fs.writeFileSync(`${__dirname}/decompositions.json`, JSON.stringify(decompositions));
	return fs.writeFileSync(`${__dirname}/categories.json`, JSON.stringify(categoriesObj));
});
