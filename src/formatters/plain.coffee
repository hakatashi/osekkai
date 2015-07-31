module.exports = (osekkai) ->
	osekkai.formatters.plain = ->
		ret = ''
		for token in @tokens then ret += token.text
		return ret
