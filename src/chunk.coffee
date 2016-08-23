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
				substrLength = Math.min tokenLength, start + length - tokenStart - substrStart

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

module.exports = Chunk
