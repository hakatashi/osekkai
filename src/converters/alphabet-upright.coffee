###
Convert Fullwidth-compatible ASCII string into upright
###

util = require '../util'
Token = require '../token'

replace = (config) ->
	prevChar = @prevChar()
	if prevChar is '' or util.type.isNewline prevChar
		prevChar = @nextChar()
	nextChar = @nextChar()
	if nextChar is '' or util.type.isNewline nextChar
		nextChar = @prevChar()

	prevOrientation = util.orientation.get prevChar
	prevWidth = util.width.type prevChar
	nextOrientation = util.orientation.get nextChar
	nextWidth = util.width.type nextChar

	if (
		@prev?.type is 'upright' or
		prevOrientation is 'U' or
		prevOrientation is 'Tu' or
		prevWidth is 'F' or
		prevWidth is 'W' or
		prevWidth is 'A'
	) and (
		@next?.type is 'upright'
		nextOrientation is 'U' or
		nextOrientation is 'Tu' or
		nextWidth is 'F' or
		nextWidth is 'W' or
		nextWidth is 'A'
	)
		tokens = []

		for char in @text
			orientation = util.orientation.get util.width.zenkaku char
			tokens.push new Token
				type: if orientation is 'U' or orientation is 'Tu' then 'upright' else 'alter'
				text: util.width.zenkaku char
				original: char

		@replaceWith tokens

module.exports = (config) ->
	@replace /[\-=/0-9@A-Z－＝／０-９＠Ａ-Ｚ]+/, (chunks) ->
		for chunk in chunks
			for token in chunk.tokens
				if token.type is 'plain'
					replace.call token, config
		return chunks
