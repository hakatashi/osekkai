module.exports = (osekkai) ->
	osekkai.converters.exclamations = (config) ->
		config.length ?= 2

		for token in @tokens
			if token.type is 'plain'
				token.replace /[!?！？]+/g, ->
					prevOrientation = osekkai.util.orientation.get @prevChar()

					if prevOrientation is 'U' or prevOrientation is 'Tu'
						@type = 'upright'

					return this
