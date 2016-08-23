util = require '../util'

isRotateChar = (char) ->
	orientation = util.orientation.get char
	return orientation is 'R' or orientation is 'Tr'

module.exports = (config) ->
	config.ratio ?= 0.5

	@replace [/[“”„〝"]/, /.+?/, /[”“〟〞"]/], (blocks) ->
		[quotStart, body, quotEnd] = blocks

		for quotation in [quotStart, quotEnd]
			tokenType = quotation[0]?.tokens[0]?.type
			return blocks if tokenType isnt 'plain' and tokenType isnt 'alter'

		bodyText = (chunk.getText() for chunk in body).join ''

		return blocks if bodyText.length <= 1

		rotateRatio = bodyText.split('').filter((char) -> isRotateChar(char)).length / bodyText.length

		if rotateRatio < config.ratio

			for quotation in [quotStart, quotEnd]
				for chunk in quotation
					for token in chunk.tokens

						if token.type is 'plain' or token.type is 'alter'
							token.original ?= token.text
							token.type = 'alter'

							if quotation is quotStart
								token.text = '〝'
							else # quotEnd
								token.text = '〟'

		return blocks
