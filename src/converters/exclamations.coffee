module.exports = (osekkai) ->
	osekkai.converters.exclamations = ->
		for token in @tokens
			if token.type is 'plain'
				token.replace /!/g, (token) ->
					token.type = 'upright'
					token.text = '!'
					return token
