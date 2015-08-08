module.exports = (osekkai) ->
	osekkai.converters.exclamations = (config) ->
		config.length ?= 2

		# TODO: Perform replacement via method for Osekkai
		for token in @tokens
			if token.type is 'plain'
				token.replace /[!?！？]+/g, ->
					# Getv neighboring next char in advance
					nextChar = @nextChar()
					nextCharCategory = osekkai.util.type.category nextChar
					nextCharIsNewline = osekkai.util.type.isNewline nextChar

					if @text.length <= config.length
						prevOrientation = osekkai.util.orientation.get @prevChar()

						# Upright exclamations if next char is uprighting
						if prevOrientation is 'U' or prevOrientation is 'Tu'
							@type = 'upright'
							@original = @text

							# Text must be fullwidth if token is one character
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

					# TODO: Make long exclamation arrays upright

					return this
