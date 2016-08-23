repeat = require 'core-js/library/fn/string/repeat'

replace = (config) ->
	if @type is 'plain'
		@original = @text
		@type = 'alter'

	@text = repeat '─', @text.length

module.exports = (config) ->
	@replace /[—―]+/g, (chunks) ->
		for chunk in chunks
			for token in chunk.tokens
				replace.call token, config
		return chunks
