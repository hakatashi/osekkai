/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const util = require('../util');
const Token = require('../token');

const replace = function(config) {
	// Getv neighboring next char in advance
	const nextChar = this.nextChar();
	const nextCharCategory = util.type.category(nextChar);
	const nextCharIsNewline = util.type.isNewline(nextChar);

	const prevChar = this.prevChar();
	const prevOrientation = util.orientation.get(prevChar);
	const prevWidth = util.width.type(prevChar);

	// Upright exclamations if next char is uprighting
	if ((prevOrientation === 'U') ||
	(prevOrientation === 'Tu') ||
	(prevWidth === 'F') ||
	(prevWidth === 'W') ||
	(prevWidth === 'A')) {

		if (this.text.length <= config.length) {
			this.type = 'upright';
			if (this.original == null) { this.original = this.text; }

			// Text must be fullwidth if token is one character
			if (this.text.length === 1) {
				this.text = util.width.zenkaku(this.text);
			} else {
				this.text = util.width.hankaku(this.text);
			}

			// Insert margin after Exclamation mark
			// Pe is Punctuation Close of Unicode Category
			if ((nextChar !== '') && (nextCharCategory !== 'Pe') && !nextCharIsNewline) {
				// Do not insert space before space
				// TODO: Reach out to the next char of the next char of...
				if (nextCharCategory === 'Zs') {
					const spaceWidth = util.width.space(nextChar);
					if (spaceWidth < 1) {
						return this.after(new Token({
							type: 'margin',
							original: '',
							text: '',
							length: 1 - spaceWidth
						})
						);
					}
				} else {
					return this.after(new Token({
						type: 'margin',
						original: '',
						text: '',
						length: 1
					})
					);
				}
			} else if ((this.next != null ? this.next.type : undefined) === 'margin') {
				if (this.next.length < 1) { return this.next.length = 1; }
			}

		// Each char of long exclamation series into upright
		} else {
			const tokens = [];

			for (let char of this.text) {
				tokens.push(new Token({
					type: 'upright',
					text: util.width.zenkaku(char),
					original: char
				})
				);
			}

			return this.replaceWith(tokens);
		}
	}
};

module.exports = function(config) {
	if (config.length == null) { config.length = 2; }

	return this.replace(/[!?！？]+/g, function(chunks) {
		for (let chunk of chunks) {
			for (let token of chunk.tokens) {
				if (token.type === 'plain') {
					replace.call(token, config);
				}
			}
		}
		return chunks;
	});
};
