module.exports = (osekkai) ->
	osekkai.converters.exclamations = (config) ->
		config.length ?= 2

		for token in @tokens
			if token.type is 'plain'
				token.replace /[!?！？]+/g, ->
					nextChar = @nextChar()
					nextCharCategory = osekkai.util.type.category nextChar
					nextCharIsNewline = osekkai.util.type.isNewline nextChar

					if @text.length <= config.length
						prevOrientation = osekkai.util.orientation.get @prevChar()

						if prevOrientation is 'U' or prevOrientation is 'Tu'
							@type = 'upright'
							@original = @text
							if @text.length is 1
								@text = osekkai.util.width.zenkaku @text
							else
								@text = osekkai.util.width.hankaku @text

							# Insert margin after Exclamation mark
							# Pe is Punctuation Close of Unicode Category
							if nextChar isnt '' and nextCharCategory isnt 'Pe' and not nextCharIsNewline
								@after new osekkai.Token
									type: 'margin'
									text: ''
									length: 1


					return this
