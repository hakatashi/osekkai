/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const util = require('../util');
const Token = require('../token');

const replace = function(config) {
	let prevChar = this.prevChar();
	if ((prevChar === '') || util.type.isNewline(prevChar)) {
		prevChar = this.nextChar();
	}
	const prevOrientation = util.orientation.get(prevChar);
	const prevWidth = util.width.type(prevChar);

	if ((prevOrientation === 'U') ||
	(prevOrientation === 'Tu') ||
	(prevWidth === 'F') ||
	(prevWidth === 'W') ||
	(prevWidth === 'A')) {
		if (this.text.length <= config.length) {
			this.type = 'upright';
			this.original = this.text;

			// Text must be fullwidth if token is one character
			if (this.text.length === 1) {
				return this.text = util.width.zenkaku(this.text);
			}
			return this.text = util.width.hankaku(this.text);
		}
		const tokens = [];

		for (const char of this.text) {
			tokens.push(new Token({
				type: 'upright',
				text: util.width.zenkaku(char),
				original: char,
			}));
		}

		return this.replaceWith(tokens);
	}
};

module.exports = function(config) {
	if (config.length == null) {
		config.length = 2;
	}

	return this.replace(/[0-9０-９]+/g, (chunks) => {
		for (const chunk of chunks) {
			for (const token of chunk.tokens) {
				if (token.type === 'plain') {
					replace.call(token, config);
				}
			}
		}
		return chunks;
	});
};
