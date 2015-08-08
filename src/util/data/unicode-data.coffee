fs = require 'fs'
request = require 'request'

codePointAt = require 'core-js/library/fn/string/code-point-at'
fromCodePoint = require 'core-js/library/fn/string/from-code-point'

UDATA_URL = 'http://www.unicode.org/Public/3.1-Update/UnicodeData-3.1.0.txt'

decompositionTypes = [
	'font'
	'nobreak'
	'initial'
	'medial'
	'final'
	'isolated'
	'circle'
	'super'
	'sub'
	'vertical'
	'wide'
	'narrow'
	'small'
	'square'
	'fraction'
	'compat'
]

request UDATA_URL, (error, response, data) ->
	throw new Error() if error or response.statusCode isnt 200

	decompositions = {}
	for decompositionType in decompositionTypes
		decompositions[decompositionType] = {}

	nextPoint = 0
	categories = []

	pushCategory = (codePoint, type) ->
		lastCategory = categories[categories.length - 1]

		if lastCategory?.to isnt codePoint - 1
			lastCategory?.to = codePoint - 1

		if lastCategory?.type is type
			lastCategory.to = codePoint
		else
			categories.push
				from: codePoint
				to: codePoint
				type: type

		nextPoint = codePoint + 1

	for line in data.split '\n'
		line = line.replace /#.*$/, ''

		continue if line.length is 0

		[
			codePoint
			name
			category
			combiningClasses
			bidiCategory
			decomposition
			decimalDigit
			digit
			numeric
			mirrored
			unicode1
			ISO10646
			uppoercase
			lowercase
			titlecase
		] = line.split(';').map (token) -> token.trim()

		# normalization
		codePoint = parseInt codePoint, 16
		decomposition = decomposition.split ' '
		decimalDigit = parseInt decimalDigit, 10
		mirrored = mirrored is 'Y'
		[uppercase, lowercase, titlecase] =
			(if point.length is 0 then null else parseInt point, 16) for point in [uppoercase, lowercase, titlecase]

		if decomposition[0]?.match /^<.+>$/
			type = decomposition[0].replace /^<(.+)>$/, '$1'
			type = 'compat' if type not in decompositionTypes
			decomposedString = decomposition[1..].map((str) -> fromCodePoint parseInt str, 16).join ''
			decompositions[type][fromCodePoint codePoint] = decomposedString

		pushCategory codePoint, category

	categoriesObj = {}

	for category in categories
		categoriesObj[category.from] = category.type

	fs.writeFile "#{__dirname}/decompositions.json", JSON.stringify decompositions
	fs.writeFile "#{__dirname}/categories.json", JSON.stringify categoriesObj
