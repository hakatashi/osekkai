module.exports = (osekkai) ->
	osekkai.formatters.aozora = ->
		ret = ''
		zenkaku =
			'!': '！'
			'?': '？'
		hankaku =
			'！': '!'
			'？': '?'
		for token in @tokens
			switch token.type
				when 'plain'
					ret += token.text

				when 'upright'
					if token.text.length is 1
						text = zenkaku[token.text] ? token.text
					else
						text = token.text.split('').map((char) -> hankaku[char] ? char).join ''

					ret += "［＃縦中横］#{text}［＃縦中横終わり］"

		return ret
