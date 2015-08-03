module.exports = (osekkai) ->
	osekkai.formatters.object = ->
		ret = []
		for token in @tokens
			ret.push
				type: token.type
				text: token.text
		return ret
