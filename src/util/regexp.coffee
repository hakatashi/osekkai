codePointAt = require 'core-js/library/fn/string/code-point-at'
fromCodePoint = require 'core-js/library/fn/string/from-code-point'

regexp = {}

regexp.escape = (text) ->
	ret = ''

	while text isnt ''
		codePoint = codePointAt text
		char = fromCodePoint codePoint
		text = text[char.length..]

		if codePoint <= 0xff
			ret += "\\x#{('00' + codePoint.toString 16)[-2..]}"
		else if codePoint <= 0xffff
			ret += "\\u#{('0000' + codePoint.toString 16)[-4..]}"

	return ret

module.exports = regexp
