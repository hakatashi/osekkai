repeat = require 'core-js/library/fn/string/repeat'

module.exports = (osekkai) ->
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
						if token.text.length is 1
							chunkString += osekkai.util.width.zenkaku token.text
						else
							text = osekkai.util.width.hankaku token.text
							chunkString += "［＃縦中横］#{text}［＃縦中横終わり］"

					when 'margin'
						# Margins will be represented by U+3000 IDEOGRAPHIC SPACE
						# TODO: Support halfwidth margin
						chunkString += repeat '　', Math.floor token.length

			ret.push chunkString

		return ret
