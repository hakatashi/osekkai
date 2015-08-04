fs = require 'fs'
request = require 'request'

EAW_URL = 'http://www.unicode.org/Public/UCD/latest/ucd/EastAsianWidth.txt'

request EAW_URL, (error, response, data) ->
	throw new Error() if error or response.statusCode isnt 200

	nextPoint = 0
	widths = []

	pushWidth = (to, type) ->
		if widths[widths.length - 1]?.type is type
			widths[widths.length - 1].to = to
		else
			widths.push
				from: nextPoint
				to: to
				type: type

	for line in data.split '\n'
		line = line.replace /#.*$/, ''

		continue if line.length is 0

		[codepoint, type] = line.split(';').map (token) -> token.trim()
		codepoints = codepoint.split('..').map (token) -> parseInt token, 16

		if codepoints.length is 1
			[from, to] = [codepoints[0], codepoints[0]]
		else
			[from, to] = codepoints

		if nextPoint isnt from
			pushWidth from - 1, 'N'
		else
			pushWidth to, type

		nextPoint = to + 1

	fs.writeFile "#{__dirname}/widths.json", JSON.stringify widths
