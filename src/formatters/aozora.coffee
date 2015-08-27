repeat = require 'core-js/library/fn/string/repeat'

module.exports = (osekkai) ->
	# longest first margins array
	margins = [
		char: '　'
		length: 1
	,
		char: ' '
		length: 1 / 4
	]

	osekkai.formatters.aozora = ->
		ret = []

		for chunk in @chunks
			chunkString = ''
			for token in chunk.tokens
				switch token.type
					when 'plain'
						chunkString += token.text

					when 'alter'
						chunkString += token.text

					when 'upright'
						if token.text.length <= 1
							chunkString += osekkai.util.width.zenkaku token.text
						else
							text = osekkai.util.width.hankaku token.text
							chunkString += "［＃縦中横］#{text}［＃縦中横終わり］"

					when 'margin'
						length = token.length
						marginString = ''

						while length >= margins[-1..][0].length
							for margin in margins
								if length >= margin.length
									marginString += margin.char
									length -= margin.length

						chunkString += marginString

			ret.push chunkString

		return ret
