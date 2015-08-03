orientations = require './data/orientations.json'

orientation = {}

orientation.get = (char) ->
	if typeof char isnt 'string' or char.length is 0
		throw new Error()

	return char.codePointAt 0

module.exports = orientation
