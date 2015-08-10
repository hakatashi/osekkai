repeat = require 'core-js/library/fn/string/repeat'

module.exports = (osekkai) ->
	replace = (config) ->
		if @type is 'plain'
			@original = @text
			@type = 'alter'

		@text = repeat '─', @text.length

	osekkai.converters.dashes = (config) ->
		@replace /[—―]+/g, (chunks) ->
			for chunk in chunks
				for token in chunk.tokens
					replace.call token, config
			return chunks
