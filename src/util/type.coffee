ObjectKeys = require 'core-js/library/fn/object/keys'
map = require 'core-js/library/fn/array/map'
codePointAt = require 'core-js/library/fn/string/code-point-at'

binarySearch = require './binarySearch'

categories = require './data/categories.json'
categoryKeys = map ObjectKeys(categories), (key) -> parseInt key, 10

type = {}

type.category = (char) ->
	codePoint = codePointAt char, 0

	index = binarySearch categoryKeys.length, (n) -> categoryKeys[n] <= codePoint

	return categories[categoryKeys[index]] ? categories[categories.length - 1]

# See also: Unicode 7.0.0 $5.8 Newline Guidelines
# http://www.unicode.org/versions/Unicode7.0.0/ch05.pdf
type.isNewline = (char) -> typeof char is 'string' and Boolean char.match /// ^ (
		\r | # CR
		\n | # LF
		\r\n | # CRLF
		\x85 # NEL
	) $ ///

module.exports = type
