const codePointAt = require('core-js/library/fn/string/code-point-at');
const fromCodePoint = require('core-js/library/fn/string/from-code-point');

const regexp = {};

regexp.escape = function(text) {
	let ret = '';

	while (text !== '') {
		const codePoint = codePointAt(text);
		const char = fromCodePoint(codePoint);
		text = text.slice(char.length);

		if (codePoint <= 0xff) {
			ret += `\\x${(`00${codePoint.toString(16)}`).slice(-2)}`;
		} else if (codePoint <= 0xffff) {
			ret += `\\u${(`0000${codePoint.toString(16)}`).slice(-4)}`;
		}
	}

	return ret;
};

module.exports = regexp;
