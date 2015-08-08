ObjectKeys = require 'core-js/library/fn/object/keys'
map = require 'core-js/library/fn/array/map'
codePointAt = require 'core-js/library/fn/string/code-point-at'

binarySearch = require './binarySearch'

widths = require './data/widths.json'
widthKeys = map ObjectKeys(widths), (key) -> parseInt key, 10

decompositions = require './data/decompositions.json'

width = {}

# Build reverse hash (= composition) of some decompositions
compositions = {}
for type in ['wide', 'narrow']
	compositions[type] = {}
	for composition, decomposition of decompositions[type]
		compositions[type][decomposition] = composition

width.type = (char) ->
	return null if typeof char isnt 'string' or char.length is 0

	codePoint = codePointAt char, 0
	index = binarySearch widthKeys.length, (n) -> widthKeys[n] <= codePoint

	return widths[widthKeys[index]] ? 'A'

width.composeHankakuChar = (char) -> compositions.wide[char] ? char
width.composeZenkakuChar = (char) -> compositions.narrow[char] ? char

width.decomposeHankakuChar = (char) -> decompositions.narrow[char] ? char
width.decomposeZenkakuChar = (char) -> decompositions.wide[char] ? char

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

# Width property of characters categorized Unicode Category Zs (Separator, Space)
# This property is mainly depends on Unicode 7.0.0 §6.2 General Punctuation
# and its unofficial documentation https://www.cs.tut.fi/~jkorpela/chars/spaces.html
# See also: http://www.unicode.org/versions/Unicode7.0.0/ch06.pdf
#
# U+200B and U+FEFF are zero-width spaces but not categorized to 'Zs'
# because they are 'Zero-width' and not visible for theory.
spaceWidths =
	'\x20': 1 / 4 # SPACE
	'\xA0': 1 / 4 # NO-BREAK SPACE
	'\u1680': 1 / 2 # OGHAM SPACE MARK
	'\u180E': 0 # MONGOLIAN VOWEL SEPARATOR
	'\u2000': 1 / 2 # EN QUAD
	'\u2001': 1 # EM QUAD
	'\u2002': 1 / 2 # EN SPACE
	'\u2003': 1 # EM SPACE
	'\u2004': 1 / 3 # THREE-PER-EM SPACE
	'\u2005': 1 / 4 # FOUR-PER-EM SPACE
	'\u2006': 1 / 6 # SIX-PER-EM SPACE
	'\u2007': 1 / 2 # FIGURE SPACE
	'\u2008': 1 / 5 # PUNCTUATION SPACE ...practically the same with THIS SPACE
	'\u2009': 1 / 5 # THIN SPACE
	'\u200A': 1 / 6 # HAIR SPACE
	'\u202F': 4 / 18 # NARROW NO-BREAK SPACE
	'\u205F': 4 / 18 # MEDIUM MATHEMATICAL SPACE
	'\u3000': 1 # IDEOGRAPHIC SPACE

width.space = (space) ->
	spaceWidths[space] ? 0

width.spaces = (spaces) ->
	ret = 0
	for space in spaces
		ret += width.space space
	return ret

module.exports = width
