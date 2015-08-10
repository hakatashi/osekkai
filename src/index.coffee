extend = require 'xtend'
util = require 'util'

class Token
	constructor: (params) ->
		@type = params.type ? 'plain'
		@text = params.text ? ''
		if @type isnt 'plain'
			@original = params.original ? @text
			@length = params.length if params.length?
		@parent = params.parent ? null
		@prev = params.prev ? null
		@next = params.next ? null

	# TODO: Support surrogates
	prevChar: ->
		prevChar = null
		prevToken = @prev
		while prevChar is null and prevToken isnt null
			if prevToken isnt null and prevToken.text.length isnt 0
				prevChar = prevToken.text[prevToken.text.length - 1]
			prevToken = prevToken.prev

		if prevChar is null
			return ''
		else
			return prevChar

	# TODO: Support surrogates
	nextChar: ->
		nextChar = null
		nextToken = @next
		while nextChar is null and nextToken isnt null
			if nextToken isnt null and nextToken.text.length isnt 0
				nextChar = nextToken.text[0]
			nextToken = nextToken.next

		if nextChar is null
			return ''
		else
			return nextChar

	remove: ->
		@prev?.next = @next
		@next?.prev = @prev
		index = @parent.tokens.indexOf this
		@parent.tokens[index..index] = []
		return this

	joinNext: ->
		if @next?
			@text += @next.text
			@next.remove()
		return this

	# Override to add possibility to return null
	substr: (start, length) ->
		substrText = @text.substr start, length
		return new Token
			type: @type
			text: substrText
			prev: @prev
			next: @next

	before: (token) ->
		token.parent = @parent

		@prev?.next = token
		token.prev = @prev

		@prev = token
		token.next = this

		index = @parent.tokens.indexOf this
		@parent.tokens[index .. index - 1] = [token]

		return this

	after: (token) ->
		token.parent = @parent

		@next?.prev = token
		token.next = @next

		@next = token
		token.prev = this

		index = @parent.tokens.indexOf this
		@parent.tokens[index + 1 .. index] = [token]

		return this

class Chunk
	constructor: (tokens = [], options = {}) ->
		@tokens = tokens

		for token in @tokens
			token.parent = this

		@prev = options.prev ? null
		@next = options.next ? null
		@index = options.index ? null

	getText: -> (token.text ? '' for token in @tokens).join ''

	###
	Chunk.prototype.substr(start[, length])
	Null may be returned if unsplittable token will be splitted.
	WARNING: length cannot be omitted
	###
	substr: (start, length) ->
		tokenStart = 0
		tokenEnd = 0
		ret = []

		for token in @tokens
			tokenLength = token.text.length
			tokenEnd += tokenLength

			if start < tokenEnd
				substrStart = Math.max 0, start - tokenStart
				substrLength = Math.min tokenLength, start + length - substrStart

				substrToken = token.substr substrStart, substrLength
				if substrToken is null
					return null
				else
					ret.push substrToken

			if start + length <= tokenEnd
				break

			tokenStart = tokenEnd

		# Glue tokens
		for token, index in ret
			if ret[index + 1]?
				token.next = ret[index + 1]
			if ret[index - 1]?
				token.prev = ret[index - 1]

		return new Chunk ret,
			index: @index
			prev: null
			next: null

	setNext: (chunk) ->
		@next = chunk

		nextChunk = @next
		while nextChunk isnt null
			if nextChunk.tokens[0]?
				@tokens[@tokens.length - 1]?.next = nextChunk.tokens[0]
				break
			else
				nextChunk = nextChunk.next

		return this

	setPrev: (chunk) ->
		@prev = chunk

		prevChunk = @prev
		while prevChunk isnt null
			if prevChunk.tokens[prevChunk.tokens.length - 1]?
				@tokens[0]?.prev = prevChunk.tokens[prevChunk.tokens.length - 1]
				break
			else
				prevChunk = prevChunk.prev

		return this

	concat: (chunk) ->
		if @index isnt chunk.index
			throw new Error 'Concatenating chunks whose indexes differ'

		if @tokens[@tokens.length - 1]? and chunk.tokens[0]?
			chunk.tokens[0].prev = @tokens[@tokens.length - 1]
			@tokens[@tokens.length - 1].next = chunk.tokens[0]
		for token in chunk.tokens
			token.parent = this
		@tokens[@tokens.length..] = chunk.tokens
		@next = chunk.next

		return this

class Osekkai
	constructor: (chunks, options = {}) ->
		if typeof chunks is 'string'
			chunks = [chunks]
			@singleReturn = yes
		else if Array.isArray chunks
			chunks = chunks
			@singleReturn = no
		else
			throw new Error 'Unknown chunks'

		@chunks = []
		for chunkText, index in chunks
			token = new Token
				type: 'plain'
				text: chunkText
			chunk = new Chunk [token],
				index: index
			@chunks.push chunk

		# Glue chunks
		for chunk, index in @chunks
			if @chunks[index + 1]?
				chunk.setNext @chunks[index + 1]
			if @chunks[index - 1]?
				chunk.setPrev @chunks[index - 1]

		if options.converters?
			@convert options.converters

	convert: (converters, config = {}) ->
		switch typeof converters
			when 'string'
				temp = []
				temp.push [converters, config]
				converters = temp

			when 'object'
				if not Array.isArray converters
					temp = []
					for converter, config of converters
						temp.push [converter, config]
					converters = temp

			else
				throw new Error 'Unknown converters'

		for [converter, config] in converters
			break if config is false or config is null

			if typeof config is 'boolean'
				osekkai.converters[converter].call this, {}
			else
				osekkai.converters[converter].call this, config

			@normalize()

		return this

	getText: -> (chunk.getText() for chunk in @chunks).join ''

	# WARNING: length cannnot be omitted
	# Returns array of "array of tokens (simeq block)."
	# Null may be returned if unsplittable token will be splitted.
	substr: (start, length) ->
		chunkStart = 0
		chunkEnd = 0
		ret = []

		for chunk in @chunks
			chunkLength = chunk.getText().length
			chunkEnd += chunkLength

			if start < chunkEnd
				substrStart = Math.max 0, start - chunkStart
				substrLength = Math.min chunkLength, start + length - substrStart
				ret.push chunk.substr substrStart, substrLength

			if start + length <= chunkEnd
				break

			chunkStart = chunkEnd

		# Glue chunks
		for chunk, index in ret
			if ret[index + 1]?
				chunk.setNext ret[index + 1]
			if ret[index - 1]?
				chunk.setPrev ret[index - 1]

		return ret

	###
	Osekkai.prototype.replace: Replace text by pattern
	@param pattern {RegExp | Array of RegExp} - The pattern(s) which this method replaces
		APIs can use Array of RegExp to split the matched string into some blocks.
		If you didn't specify any parenthesis for pattern, the entire match string will be returned.
		If specified Array of RegExp is about to split the unsplittable token,
		then the match is skipped and callback is not called for the match.
		Do not include parenthesis matches in the patterns.
		Replacement will always be performed with global option (//g)
	@param callback {Function(blocks)} - The callback called for each matches of pattern
	@example
		osekkai(['ho', 'ge ', 'fuga']).replace([/\w+/, / /, /\w+/], function (blocks) {
			console.log(blocks);
			-> Something like the following are printed.
				[ // matches
					[ // Chunks
						[ // Tokens
							{type: 'plain', text: 'ho'}
						],
						[ // Tokens
							{type: 'plain', text: 'ge'}
						]
					],
					[ // Chunks
						[ // Tokens
							{type: 'plain', text: ' '}
						]
					],
					[ //Chunks
						[ //Tokens
							{type: 'plain', text: 'fuga'}
						]
					]
				]
		});
	###
	replace: (patterns, callback) ->
		# Sanitize patterns
		if util.isRegExp patterns
			patterns = [patterns]
		else if not Array.isArray patterns
			throw new Error 'Unknown replacement patterns'

		splitterStr = ''
		for pattern in patterns
			splitterStr += "(#{pattern.source})"

		splitter = new RegExp splitterStr, 'g'

		text = @getText()

		lumps = text.split splitter
		chunkses = []

		# TODO: Handle null

		offset = 0
		for lump, index in lumps
			chunkses.push @substr offset, lump.length
			offset += lump.length

		# Glue chunkses
		for chunks, index in chunkses
			if chunkses[index + 1]?[0]?
				chunks[chunks.length - 1]?.setNext chunkses[index + 1][0]
			if chunkses[index - 1]?[chunkses[index - 1].length - 1]?
				chunks[0]?.setPrev chunkses[index - 1][chunkses[index - 1].length - 1]

		retChunkses = []

		# Execute replacement
		for chunks, index in chunkses
			if index % (patterns.length + 1) is 0
				retChunkses.push chunks
			else if index % (patterns.length + 1) is 1
				if patterns.length is 1
					appendChunkses = [callback.call this, chunks]
				else
					appendChunkses = callback.call this, (chunkses[index + i] for i in [0...patterns.length])
				retChunkses[retChunkses.length..] = appendChunkses

		# Reorganize chunks
		newChunks = []
		for chunks in retChunkses
			for chunk in chunks
				if not newChunks[chunk.index]?
					newChunks[chunk.index] = chunk
				else
					newChunks[chunk.index].concat chunk

		# Replace chunks
		@chunks = newChunks

		return this

	format: (type, options) ->
		if not osekkai.formatters[type]?
			throw new Error "Unknown formatter type #{type}"

		formatChunks = osekkai.formatters[type].call this

		if @singleReturn
			return formatChunks[0]
		else
			return formatChunks

	normalize: ->
		for chunk in @chunks
			# Tip: [..] is a magic for copying array, bro.
			tokens = chunk.tokens[..]
			tokens.push prev: tokens[tokens.length - 1]

			for token, index in tokens
				if token.type is 'plain' and token?.text is ''
					token.remove()
				else if token.prev?.type is 'plain'
					if token?.type is 'plain' and token.prev.parent is token.parent
						token.prev.joinNext()

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

osekkai.Token = Token
osekkai.Chunk = Chunk
osekkai.Osekkai = Osekkai

# Load built-in converters and formatters
require('./converters/exclamations') osekkai
require('./converters/numbers') osekkai
require('./formatters/plain') osekkai
require('./formatters/object') osekkai
require('./formatters/aozora') osekkai

module.exports = osekkai
