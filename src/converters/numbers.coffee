util = require '../util'
Token = require '../token'

replace = (config) ->
	prevChar = @prevChar()
	if prevChar is '' or util.type.isNewline prevChar
		prevChar = @nextChar()
	prevOrientation = util.orientation.get prevChar
	prevWidth = util.width.type prevChar

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
				@text = util.width.zenkaku @text
			else
				@text = util.width.hankaku @text

		else
			tokens = []

			for char in @text
				tokens.push new Token
					type: 'upright'
					text: util.width.zenkaku char
					original: char

			@replaceWith tokens

module.exports = (config) ->
	config.length ?= 2

	@replace /[0-9０-９]+/g, (chunks) ->
		for chunk in chunks
			for token in chunk.tokens
				if token.type is 'plain'
					replace.call token, config
		return chunks
