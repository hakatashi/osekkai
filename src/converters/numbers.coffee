module.exports = (osekkai) ->
	replace = (config) ->
		if @text.length <= config.length
			prevChar = @prevChar()
			if prevChar is '' or osekkai.util.type.isNewline prevChar
				prevChar = @nextChar()
			prevOrientation = osekkai.util.orientation.get prevChar
			prevWidth = osekkai.util.width.type prevChar

			# Upright exclamations if next char is uprighting
			if prevOrientation is 'U' or
			prevOrientation is 'Tu' or
			prevWidth is 'F' or
			prevWidth is 'W' or
			prevWidth is 'A'
				@type = 'upright'
				@original = @text

				# Text must be fullwidth if token is one character
				if @text.length is 1
					@text = osekkai.util.width.zenkaku @text
				else
					@text = osekkai.util.width.hankaku @text

	osekkai.converters.numbers = (config) ->
		config.length ?= 2

		@replace /[0-9０-９]+/g, (chunks) ->
			for chunk in chunks
				for token in chunk.tokens
					if token.type is 'plain'
						replace.call token, config
			return chunks
