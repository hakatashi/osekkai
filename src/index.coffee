extend = require 'xtend'

Osekkai = require './osekkai'

osekkai = (chunks, options) ->
	options = extend osekkai.defaultConfig, options

	if typeof options.converters is 'string'
		options.converters = osekkai.converterPresets[options.converters]

	return new Osekkai chunks, options

osekkai.util = require './util'

osekkai.converters = {}
osekkai.formatters = {}

osekkai.defaultConfig =
	converters: 'default'
	joinableTokens: ['plain']

osekkai.converterPresets =
	default:
		exclamations: false
	vertical:
		exclamations: true

osekkai.Osekkai = Osekkai

# Load built-in converters and formatters
osekkai.converters = require './converters'
osekkai.formatters = require './formatters'

module.exports = osekkai
