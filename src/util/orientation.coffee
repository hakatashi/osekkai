ObjectKeys = require 'core-js/library/fn/object/keys'
map = require 'core-js/library/fn/array/map'
codePointAt = require 'core-js/library/fn/string/code-point-at'

binarySearch = require './binarySearch'

orientations = require './data/orientations.json'
orientationKeys = map ObjectKeys(orientations), (key) -> parseInt key, 10

module.exports.get = (char) ->
	if typeof char isnt 'string' or char.length is 0
		return null

	codePoint = codePointAt char, 0

	index = binarySearch orientationKeys.length, (n) -> orientationKeys[n] <= codePoint

	return orientations[orientationKeys[index]] ? 'R'
