codePointAt = require 'core-js/library/fn/string/code-point-at'
widths = require './data/widths.json'
decompositions = require './data/decompositions.json'

width = {}

# Build reverse hash (= composition) of some decompositions
compositions = {}
for type in ['wide', 'narrow']
	compositions[type] = {}
	for composition, decomposition of decompositions[type]
		compositions[type][decomposition] = composition

width.get = (char) ->
	if typeof char isnt 'string' or char.length is 0
		return null

	codePoint = codePointAt char, 0
	type = 'R'

	for orientation in orientations
		if orientation.from <= codePoint <= orientation.to
			type = orientation.type

	return type

width.composeHankakuChar = (char) -> compositions.wide[char] ? char
width.composeZenkakuChar = (char) -> compositions.narrow[char] ? char

width.decomposeHankakuChar = (char) -> decompositions.narrow[char] ? char
width.decomposeZenkakuChar = (char) -> decompositions.width[char] ? char

width.hankaku = (string) ->
	ret = ''

	for char in string
		char = width.composeZenkakuChar char
		char = width.decomposeZenkakuChar char
		ret += char

	return ret

width.zenkaku = (string) ->
	ret = ''

	for char in string
		char = width.composeHankakuChar char
		char = width.decomposeHankakuChar char
		ret += char

	return ret

module.exports = width
