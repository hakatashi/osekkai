/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
/*
Convert Fullwidth-compatible ASCII string into upright
*/

const util = require('../util');
const Token = require('../token');

const replace = function(config) {
	let prevChar = this.prevChar();
	if (prevChar === '' || util.type.isNewline(prevChar)) {
		prevChar = this.nextChar();
	}
	let nextChar = this.nextChar();
	if (nextChar === '' || util.type.isNewline(nextChar)) {
		nextChar = this.prevChar();
	}

	const prevOrientation = util.orientation.get(prevChar);
	const prevWidth = util.width.type(prevChar);
	const nextOrientation = util.orientation.get(nextChar);
	const nextWidth = util.width.type(nextChar);

	if (
		((this.prev != null ? this.prev.type : undefined) === 'upright' ||
			prevOrientation === 'U' ||
			prevOrientation === 'Tu' ||
			prevWidth === 'F' ||
			prevWidth === 'W' ||
			prevWidth === 'A') &&
		((this.next != null ? this.next.type : undefined) === 'upright',
		nextOrientation === 'U' || nextOrientation === 'Tu' || nextWidth === 'F' || nextWidth === 'W' || nextWidth === 'A')
	) {
		const tokens = [];

		for (const char of this.text) {
			const orientation = util.orientation.get(util.width.zenkaku(char));
			tokens.push(
				new Token({
					type: orientation === 'U' || orientation === 'Tu' ? 'upright' : 'alter',
					text: util.width.zenkaku(char),
					original: char,
				})
			);
		}

		return this.replaceWith(tokens);
	}
};

module.exports = function(config) {
	return this.replace(/[\-=/0-9@A-Z－＝／０-９＠Ａ-Ｚ]+/, (chunks) => {
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
