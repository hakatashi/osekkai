repeat = require 'core-js/library/fn/string/repeat'
extend = require 'xtend'
util = require '../util'

# longest first margins array
margins = [
	char: '　'
	length: 1
,
	char: ' '
	length: 1 / 4
]

entityPresets =
	aozora:
		'《': '※［＃始め二重山括弧、1-1-52］'
		'》': '※［＃終わり二重山括弧、1-1-53］'
		'［': '※［＃始め角括弧、1-1-46］'
		'］': '※［＃終わり角括弧、1-1-47］'
		'〔': '※［＃始めきっこう（亀甲）括弧、1-1-44］'
		'〕': '※［＃終わりきっこう（亀甲）括弧、1-1-45］'
		'｜': '※［＃縦線、1-1-35］'
		'＃': '※［＃井げた、1-1-84］'
		'※': '※［＃米印、1-2-8］'
	publishing:
		'《': '｜《'
		'》': '｜》'
		'［': '｜［'
		'］': '｜］'
		'〔': '〔'
		'〕': '〕'
		'｜': '｜｜'
		'＃': '＃'
		'※': '※'

defaultConfig =
	entities: 'aozora'

module.exports = (config) ->
	config = extend defaultConfig, config

	if typeof config.entities is 'string'
		config.entities = entityPresets[config.entities] ? {}

	entityChars = (char for own char, entity of config.entities).join ''
	entityCharsRegEx = new RegExp "[#{entityChars.replace /[-\/\\^$*+?.()|[\]{}]/g, '\\$&'}]", 'g'

	escapeText = (text) ->
		text.replace entityCharsRegEx, (char) -> config.entities[char]

	ret = []

	for chunk in @chunks
		chunkString = ''
		for token in chunk.tokens
			switch token.type
				when 'upright'
					if token.text.length <= 1
						chunkString += escapeText util.width.zenkaku token.text
					else
						text = util.width.hankaku token.text
						chunkString += "［＃縦中横］#{escapeText text}［＃縦中横終わり］"

				when 'margin'
					length = token.length
					marginString = ''

					while length >= margins[-1..][0].length
						for margin in margins
							if length >= margin.length
								marginString += margin.char
								length -= margin.length

					chunkString += marginString

				else
					chunkString += escapeText token.text

		ret.push chunkString

	return ret
