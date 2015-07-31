fs = require 'fs'
request = require 'request'

UTR50_URL = 'http://www.unicode.org/Public/vertical/revision-13/VerticalOrientation-13.txt'

request UTR50_URL, (error, response, data) ->
	throw new Error() if error or response.statusCode isnt 200

	nextPoint = 0
	orientations = []

	pushOrientation = (to, type) ->
		if orientations[orientations.length - 1]?.type is type
			orientations[orientations.length - 1].to = to
		else
			orientations.push
				from: nextPoint
				to: to
				type: type

	for line in data.split '\n'
		continue if line.length is 0 or line[0] is '#'

		[codepoint, type] = line.split(';').map (token) -> token.trim()
		codepoints = codepoint.split('..').map (token) -> parseInt token, 16

		if codepoints.length is 1
			[from, to] = [codepoints[0], codepoints[0]]
		else
			[from, to] = codepoints

		if nextPoint isnt from
			pushOrientation from - 1, 'R'
		else
			pushOrientation to, type

		nextPoint = to + 1

	fs.writeFile "#{__dirname}/orientations.json", JSON.stringify orientations
