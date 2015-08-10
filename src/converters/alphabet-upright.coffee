module.exports = (osekkai) ->
	###
	Convert Fullwidth-compatible ASCII string into upright
	###

	replace = (config) ->
		prevChar = @prevChar()
		if prevChar is '' or osekkai.util.type.isNewline prevChar
			prevChar = @nextChar()
		nextChar = @nextChar()
		if nextChar is '' or osekkai.util.type.isNewline nextChar
			nextChar = @prevChar()

		prevOrientation = osekkai.util.orientation.get prevChar
		prevWidth = osekkai.util.width.type prevChar
		nextOrientation = osekkai.util.orientation.get nextChar
		nextWidth = osekkai.util.width.type nextChar

		console.log prevChar, nextChar

		if (
			prevOrientation is 'U' or
			prevOrientation is 'Tu' or
			prevWidth is 'F' or
			prevWidth is 'W' or
			prevWidth is 'A'
		) and (
			nextOrientation is 'U' or
			nextOrientation is 'Tu' or
			nextWidth is 'F' or
			nextWidth is 'W' or
			nextWidth is 'A'
		)
			tokens = []

			for char in @text
				tokens.push new osekkai.Token
					type: 'upright'
					text: osekkai.util.width.zenkaku char
					original: char

			@replaceWith tokens

	osekkai.converters.alphabetUpright = (config) ->
		@replace /[\-=/0-9@A-Z－＝／０-９＠Ａ-Ｚ]+/, (chunks) ->
			for chunk in chunks
				for token in chunk.tokens
					if token.type is 'plain'
						replace.call token, config
			return chunks
