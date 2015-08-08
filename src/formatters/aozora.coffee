repeat = require 'core-js/library/fn/string/repeat'

module.exports = (osekkai) ->
	osekkai.formatters.aozora = ->
		ret = ''
		for token in @tokens
			switch token.type
				when 'plain'
					ret += token.text

				when 'upright'
					if token.text.length is 1
						ret += osekkai.util.width.zenkaku token.text
					else
						text = osekkai.util.width.hankaku token.text
						ret += "［＃縦中横］#{text}［＃縦中横終わり］"

				when 'margin'
					# Margins will be represented by U+3000 IDEOGRAPHIC SPACE
					# TODO: Support halfwidth margin
					ret += repeat '　', Math.floor token.length

		return ret
