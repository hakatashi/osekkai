module.exports = (osekkai) ->
	osekkai.formatters.plain = ->
		ret = []

		for chunk in @chunks
			chunkString = ''
			for token in chunk.tokens then chunkString += token.text
			ret.push chunkString

		return ret
