ObjectKeys = require 'core-js/library/fn/object/keys'
map = require 'core-js/library/fn/array/map'
reduce = require 'core-js/library/fn/array/reduce'
fromCodePoint = require 'core-js/library/fn/string/from-code-point'

module.exports = (osekkai) ->
	widths = osekkai.util.width.widths
	latinRegexpString = ''

	codePoints = map ObjectKeys(osekkai.util.width.widths), (codePoint) -> parseInt codePoint, 10
	reduce codePoints, (previous, current) ->
		width = widths[previous]

		return current if previous >= 0x10000 or current >= 0x10000

		if width is 'N' or width is 'Na'
			startChar = osekkai.util.regexp.escape fromCodePoint previous
			endChar = osekkai.util.regexp.escape fromCodePoint current
			if current - 1 is previous
				latinRegexpString += startChar
			else
				latinRegexpString += "#{startChar}-#{endChar}"

		return current

	latinRegexpString = "[#{latinRegexpString}]"
	latinWordRegexp = new RegExp "#{latinRegexpString}+", 'g'

	osekkai.converters.alphabetMargin = (config) ->
		@replace latinWordRegexp, (chunks) ->
			tokens = (token for token in chunk.tokens) for chunk in chunks
			text = (chunk for chunk in chunks).join ''

			# Tip: [-1..][0] means the last element of array
			nextChar = tokens[-1..][0]?.nextChar()
			prevChar = tokens[0]?.prevChar()

			for direction in [-1, +1]
				orientation = osekkai.util.orientation.get character

				if direction is +1
					character = nextChar
					adjoiningToken = tokens[-1..][0].next
				else
					character = prevChar
					adjoiningToken = tokens[0].prev

				if not osekkai.util.type.isNewline character and
				(orientation is 'U' or orientation is 'Tu') and
				not osekkai.util.type.category(character) is 'Zs' and
				not adjoiningToken.type is 'margin'
					if direction is +1
						tokens[-1..][0].after new osekkai.Token
							type: 'margin'
							original: ''
							text: ''
							length: 1 / 4
					else
						tokens[-1..][0].before new osekkai.Token
							type: 'margin'
							original: ''
							text: ''
							length: 1 / 4

			return chunks
