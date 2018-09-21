/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const repeat = require('core-js/library/fn/string/repeat');

const replace = function(config) {
	if (this.type === 'plain') {
		this.original = this.text;
		this.type = 'alter';
	}

	return this.text = repeat('─', this.text.length);
};

module.exports = function(config) {
	return this.replace(/[—―]+/g, (chunks) => {
		for (const chunk of chunks) {
			for (const token of chunk.tokens) {
				replace.call(token, config);
			}
		}
		return chunks;
	});
};
