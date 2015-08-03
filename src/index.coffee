extend = require 'xtend'
orientation = require './util/orientation'

class Osekkai
	constructor: (text, options) ->
		@text = text
		@tokens = []

		@parse()

	parse: ->
		@tokens = [
			type: 'plain'
			text: @text
		]

		return this

	format: (type, options) ->
		if not osekkai.formatters[type]?
			throw new Error "Unknown formatter type #{type}"

		return osekkai.formatters[type].call this, @text

osekkai = ->
	switch typeof arguments[0]
		when 'string'
			text = arguments[0]
			options = arguments[1] or {}
		when 'object'
			options = arguments[0]
			text = optoins.text
		else
			throw new Error 'Unsupported arguments'

	options = extend osekkai.defaultConfig, options

	return new Osekkai text, options

osekkai.converters = {}
osekkai.formatters = {}

osekkai.defaultConfig =
	converters: 'vertical'

# Load built-in converters and formatters
require('./formatters/plain') osekkai

module.exports = osekkai
