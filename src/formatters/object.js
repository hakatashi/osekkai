/*
 * decaffeinate suggestions:
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
module.exports = function() {
	const chunks = [];
	for (let chunk of this.chunks) {
		const tokens = [];
		for (let token of chunk.tokens) {
			const tokenObj =
				{type: token.type};

			if (token.text != null) { tokenObj.text = token.text; }
			if (token.length != null) { tokenObj.length = token.length; }
			if (token.original != null) { tokenObj.original = token.original; }
			if (token.transform != null) { tokenObj.transform = token.transform; }

			tokens.push(tokenObj);
		}

		chunks.push(tokens);
	}

	return chunks;
};
