module.exports = (osekkai) ->
	osekkai.formatters.aozora = ->
		ret = ''
		console.log @tokens
		for token in @tokens
			switch token.type
				when 'plain'
					ret += token.text

				when 'upright'
					ret += "［＃縦中横］#{token.text}［＃縦中横終わり］"

		return ret
