module.exports = function() {
	const ret = [];

	for (let chunk of this.chunks) {
		let chunkString = '';
		for (let token of chunk.tokens) { chunkString += token.text; }
		ret.push(chunkString);
	}

	return ret;
};
