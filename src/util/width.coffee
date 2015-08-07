codePointAt = require 'core-js/library/fn/string/code-point-at'
widths = require './data/widths.json'
decompositions = require './data/decompositions.json'

# Build reverse hash (= composition) of some decompositions
compositions = {}
for type in ['wide', 'narrow']
	compositions[type] = {}
	for composition, decomposition of decompositions[type]
		compositions[type][decomposition] = composition

module.exports.get = (char) ->
	if typeof char isnt 'string' or char.length is 0
		return null

	codePoint = codePointAt char, 0
	type = 'R'

	for orientation in orientations
		if orientation.from <= codePoint <= orientation.to
			type = orientation.type

	return type
