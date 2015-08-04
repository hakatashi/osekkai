core = require 'core-js/library'
widths = require './data/widths.json'

module.exports.get = (char) ->
	if typeof char isnt 'string' or char.length is 0
		throw new Error()

	codePoint = core.String.codePointAt char, 0
	type = 'R'

	for orientation in orientations
		if orientation.from <= codePoint <= orientation.to
			type = orientation.type

	return type
