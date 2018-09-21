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
	return (orientation === 'R') || (orientation === 'Tr');
};

module.exports = function(config) {
	if (config.ratio == null) { config.ratio = 0.5; }

	return this.replace([/[“”„〝"]/, /.+?/, /[”“〟〞"]/], function(blocks) {
		let chunk;
		const [quotStart, body, quotEnd] = Array.from(blocks);

		for (var quotation of [quotStart, quotEnd]) {
			const tokenType = __guard__(quotation[0] != null ? quotation[0].tokens[0] : undefined, x => x.type);
			if ((tokenType !== 'plain') && (tokenType !== 'alter')) { return blocks; }
		}

		const bodyText = ((() => {
			const result = [];
			for (chunk of body) { 				result.push(chunk.getText());
			}
			return result;
		})()).join('');

		if (bodyText.length <= 1) { return blocks; }

		const rotateRatio = bodyText.split('').filter(char => isRotateChar(char)).length / bodyText.length;

		if (rotateRatio < config.ratio) {

			for (quotation of [quotStart, quotEnd]) {
				for (chunk of quotation) {
					for (let token of chunk.tokens) {

						if ((token.type === 'plain') || (token.type === 'alter')) {
							if (token.original == null) { token.original = token.text; }
							token.type = 'alter';

							if (quotation === quotStart) {
								token.text = '〝';
							} else { // quotEnd
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
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}