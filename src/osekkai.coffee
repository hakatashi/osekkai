Token = require './token'
Chunk = require './chunk'
util = require './util'
builtinConverters = require './converters'
builtinFormatters = require './formatters'

class Osekkai
	constructor: (chunks, options = {}) ->
		if typeof chunks is 'string'
			chunks = [chunks]
			@singleReturn = yes
		else if Array.isArray chunks
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
				builtinConverters[converter].call this, {}
			else
				builtinConverters[converter].call this, config

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

		for chunk, index in @chunks
			chunkLength = chunk.getText().length
			chunkEnd += chunkLength

			if start < chunkEnd or
			# Run on an empty chunk  at start position
			chunkStart is chunkEnd is start
				substrStart = Math.max 0, start - chunkStart
				substrLength = Math.min chunkLength, start + length - chunkStart - substrStart
				ret.push chunk.substr substrStart, substrLength

			if start + length <= chunkEnd
				# If every remaining chunks is empty chunks, let them run on to the ret chunks
				remainingChunks = @chunks.slice(index + 1)
				if remainingChunks.length > 0 and remainingChunks.every((chunk) -> chunk.getText().length is 0)
					ret.push.apply ret, remainingChunks.map (chunk) -> chunk.substr 0, 0
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
		if {}.toString.call(patterns) is '[object RegExp]'
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

	format: (type, config = {}) ->
		if not builtinFormatters[type]?
			throw new Error "Unknown formatter type #{type}"

		formatChunks = builtinFormatters[type].call this, config

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

module.exports = Osekkai
