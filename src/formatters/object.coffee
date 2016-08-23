module.exports = ->
	chunks = []
	for chunk in @chunks
		tokens = []
		for token in chunk.tokens
			tokenObj =
				type: token.type

			tokenObj.text = token.text if token.text?
			tokenObj.length = token.length if token.length?
			tokenObj.original = token.original if token.original?
			tokenObj.transform = token.transform if token.transform?

			tokens.push tokenObj

		chunks.push tokens

	return chunks
