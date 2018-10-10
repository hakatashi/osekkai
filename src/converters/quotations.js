/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const util = require('../util');

const isRotateChar = function(char) {
	const orientation = util.orientation.get(char);
	return orientation === 'R' || orientation === 'Tr';
};

module.exports = function(config) {
	if (typeof config.ratio !== 'number') {
		config.ratio = 0.5;
	}

	return this.replace([/[“”„〝"]/, /.+?/, /[”“〟〞"]/], (blocks) => {
		const [quotStart, body, quotEnd] = Array.from(blocks);

		for (const quotationChunk of [quotStart[quotStart.length - 1], quotEnd[0]]) {
			const tokenType = quotationChunk && quotationChunk.tokens[0] && quotationChunk.tokens[0].type;
			if (tokenType !== 'plain' && tokenType !== 'alter') {
				return blocks;
			}
		}

		const bodyText = body.map((chunk) => chunk.getText()).join('');

		if (bodyText.length <= 1) {
			return blocks;
		}

		const rotateRatio = bodyText.split('').filter((char) => isRotateChar(char)).length / bodyText.length;

		if (rotateRatio < config.ratio) {
			for (const quotation of [quotStart, quotEnd]) {
				for (const chunk of quotation) {
					for (const token of chunk.tokens) {
						if (token.type === 'plain' || token.type === 'alter') {
							if (!token.original) {
								token.original = token.text;
							}
							token.type = 'alter';

							if (quotation === quotStart) {
								token.text = '〝';
							} else {
								// quotEnd
								token.text = '〟';
							}
						}
					}
				}
			}
		}

		return blocks;
	});
};

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}
