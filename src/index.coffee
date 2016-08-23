extend = require 'xtend'

Osekkai = require './osekkai'

osekkai = (chunks, options) ->
	options = extend osekkai.defaultConfig, options

	if typeof options.converters is 'string'
		options.converters = osekkai.converterPresets[options.converters]

	return new Osekkai chunks, options

osekkai.defaultConfig =
	converters: 'default'
	joinableTokens: ['plain']

osekkai.converterPresets =
	default:
		exclamations: false
	vertical:
		exclamations: true

osekkai.Osekkai = Osekkai

module.exports = osekkai
