module.exports = function() {
	const ret = [];

	for (const chunk of this.chunks) {
		let chunkString = '';
		for (const token of chunk.tokens) {
			chunkString += token.text;
		}
		ret.push(chunkString);
	}

	return ret;
};
