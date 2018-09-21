/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const ObjectKeys = require('core-js/library/fn/object/keys');
const map = require('core-js/library/fn/array/map');
const reduce = require('core-js/library/fn/array/reduce');
const fromCodePoint = require('core-js/library/fn/string/from-code-point');

const util = require('../util');
const Token = require('../token');

const {widths} = util.width;
let latinRegexpString = '';

const codePoints = map(ObjectKeys(util.width.widths), (codePoint) => parseInt(codePoint, 10));
reduce(codePoints, (previous, current) => {
	const width = widths[previous];

	if ((previous >= 0x10000) || (current >= 0x10000)) {
		return current;
	}

	if ((width === 'N') || (width === 'Na')) {
		const startChar = util.regexp.escape(fromCodePoint(previous));
		const endChar = util.regexp.escape(fromCodePoint(current));
		if ((current - 1) === previous) {
			latinRegexpString += startChar;
		} else {
			latinRegexpString += `${startChar}-${endChar}`;
		}
	}

	return current;
});

latinRegexpString = `[${latinRegexpString}]`;
const latinWordRegexp = new RegExp(`${latinRegexpString}+`, 'g');

module.exports = function(config) {
	return this.replace(latinWordRegexp, (chunks) => {
		let tokens;
		let chunk;
		for (chunk of chunks) {
			({tokens} = (chunk));
		}
		const text = ((() => {
			const result = [];
			for (chunk of chunks) {
 				result.push(chunk);
			}
			return result;
		})()).join('');

		// Tip: [-1..][0] means the last element of array
		const nextChar = __guard__(tokens.slice(-1)[0], (x) => x.nextChar());
		const prevChar = tokens[0] != null ? tokens[0].prevChar() : undefined;

		for (const direction of [-1, +1]) {
			var adjoiningToken, character;
			const orientation = util.orientation.get(character);

			if (direction === +1) {
				character = nextChar;
				adjoiningToken = tokens.slice(-1)[0].next;
			} else {
				character = prevChar;
				adjoiningToken = tokens[0].prev;
			}

			if ((character !== '') &&
			!util.type.isNewline(character &&
			((orientation === 'U') || (orientation === 'Tu')) &&
			(!util.type.category(character) === 'Zs') &&
			(!adjoiningToken.type === 'margin'))) {
				if (direction === +1) {
					tokens.slice(-1)[0].after(new Token({
						type: 'margin',
						original: '',
						text: '',
						length: 1 / 4,
					}));
				} else {
					tokens.slice(-1)[0].before(new Token({
						type: 'margin',
						original: '',
						text: '',
						length: 1 / 4,
					}));
				}
			}
		}

		return chunks;
	});
};

function __guard__(value, transform) {
	return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
