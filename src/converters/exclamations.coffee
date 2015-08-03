module.exports = (osekkai) ->
	osekkai.converters.exclamations = ->

		for token in @tokens
			if token.type is 'plain'
				token.replace /!/g, ->
					prevOrientation = osekkai.util.orientation.get @prevChar()

					if prevOrientation is 'U' or prevOrientation is 'Tu'
						@type = 'upright'
						@text = '!'

					return this
