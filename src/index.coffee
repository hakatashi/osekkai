extend = require 'xtend'
orientation = require './util/orientation'

class Token
	constructor: (params) ->
		@type = params.type ? 'plain'
		@text = params.text ? ''
		if @type isnt 'plain'
			@original = params.original ? @text
		@parent = params.parent
		@prev = params.prev ? null
		@next = params.next ? null

	replace: (pattern, callback) ->
		if typeof pattern is 'string'
			splitter = new RegExp "(#{pattern.replace /[-\/\\^$*+?.()|[\]{}]/g, '\\$&'})", 'g'
		else if pattern instanceof RegExp
			splitter = new RegExp "(#{pattern.source})", 'g'
		else
			throw new Error 'Unknown replacement pattern'

		prev = @prev
		tokens = @text.split(splitter).map (token) =>
			current = new Token
				type: @type
				text: token
				parent: @parent
				prev: prev
			prev?.next = current
			prev = current

		for token, index in tokens
			if index % 2 == 1
				tokens[index] = callback.call token

		@parent.replaceToken this, tokens

		return this

	prevChar: ->
		prevChar = null
		prevToken = @prev
		while prevChar is null and prevToken isnt null
			if prevToken isnt null and prevToken.text.length isnt 0
				prevChar = prevToken.text[prevToken.text.length - 1]
			prevToken = prevToken.prev

		return prevChar

	nextChar: ->
		nextChar = null
		nextToken = @next
		while nextChar is null and nextToken isnt null
			if nextToken isnt null and nextToken.text.length isnt 0
				nextChar = nextToken.text[0]
			nextToken = nextToken.next

		return nextChar

	remove: ->
		@prev?.next = @next
		@next?.prev = @prev
		index = @parent.tokens.indexOf this
		@parent.tokens[index..index] = []
		return this

class Osekkai
	constructor: (text, options = {}) ->
		@text = text
		@tokens = []
		@converters = options.converters ? {}

		@parse()

	parse: ->
		@tokens = [
			new Token
				type: 'plain'
				text: @text
				parent: this
				prev: null
				next: null
		]

		for own converter, config of @converters
			if config isnt false
				osekkai.converters[converter].call this
				@normalize()

		return this

	format: (type, options) ->
		if not osekkai.formatters[type]?
			throw new Error "Unknown formatter type #{type}"

		return osekkai.formatters[type].call this

	normalize: ->
		# Tip: [..] is hack for copying array, bro.
		for token in @tokens[..]
			if token.prev?.type is 'plain'
				if token.prev?.text is ''
					token.prev.remove()
				else if token.type is 'plain'
					@joinToken token.prev

	replaceToken: (token, tokens) ->
		index = @tokens.indexOf token
		@tokens[index..index] = tokens
		return this

	joinToken: (token) ->
		if token.next?
			token.text += token.next.text
			token.next.remove()
		return this

osekkai = ->
	switch typeof arguments[0]
		when 'string'
			text = arguments[0]
			options = arguments[1] ? {}
		when 'object'
			options = arguments[0]
			text = optoins.text
		else
			throw new Error 'Unsupported arguments'

	options = extend osekkai.defaultConfig, options

	if typeof options.converters is 'string'
		options.converters = osekkai.converterPresets[options.converters]

	return new Osekkai text, options

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

# Load built-in converters and formatters
require('./converters/exclamations') osekkai
require('./formatters/plain') osekkai
require('./formatters/object') osekkai
require('./formatters/aozora') osekkai

module.exports = osekkai
