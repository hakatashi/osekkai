module.exports = (osekkai) ->
	replace = (config) ->
		# Getv neighboring next char in advance
		nextChar = @nextChar()
		nextCharCategory = osekkai.util.type.category nextChar
		nextCharIsNewline = osekkai.util.type.isNewline nextChar

		prevChar = @prevChar()
		prevOrientation = osekkai.util.orientation.get prevChar
		prevWidth = osekkai.util.width.type prevChar

		# Upright exclamations if next char is uprighting
		if prevOrientation is 'U' or
		prevOrientation is 'Tu' or
		prevWidth is 'F' or
		prevWidth is 'W' or
		prevWidth is 'A'

			if @text.length <= config.length
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
					# Do not insert space before space
					# TODO: Reach out to the next char of the next char of...
					if nextCharCategory is 'Zs'
						spaceWidth = osekkai.util.width.space nextChar
						if spaceWidth < 1
							@after new osekkai.Token
								type: 'margin'
								text: ''
								length: 1 - spaceWidth
					else
						@after new osekkai.Token
							type: 'margin'
							text: ''
							length: 1
				else if @next?.type is 'margin'
					@next.length = 1 if @next.length < 1

			# Each char of long exclamation series into upright
			else
				tokens = []

				for char in @text
					tokens.push new osekkai.Token
						type: 'upright'
						text: osekkai.util.width.zenkaku char
						original: char

				@replaceWith tokens

	osekkai.converters.exclamations = (config) ->
		config.length ?= 2

		@replace /[!?！？]+/g, (chunks) ->
			for chunk in chunks
				for token in chunk.tokens
					if token.type is 'plain'
						replace.call token, config
			return chunks
