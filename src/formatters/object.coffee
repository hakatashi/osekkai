module.exports = (osekkai) ->
	osekkai.formatters.object = ->
		ret = []
		for token in @tokens
			tokenObj =
				type: token.type

			tokenObj.text = token.text if token.text?
			tokenObj.original = token.original if token.original?
			tokenObj.transform = token.transform if token.transform?

			ret.push tokenObj

		return ret
