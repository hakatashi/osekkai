class Token
	constructor: (params) ->
		@type = params.type ? 'plain'
		@text = params.text ? ''
		if @type isnt 'plain'
			@original = if params.original? then params.original else null
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
		params = text: @text.substr start, length
		params.type = @type if @type?
		# TODO: Consider
		params.original = @original if @original?
		params.prev = @prev if @prev?
		params.next = @next if @next?
		params.length = @length if @length?

		if @type is 'upright' and length is 0
			params.type = 'plain'
			delete params.original

		return new Token params

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

	replaceWith: (tokens) ->
		# Glue tokens
		for token, index in tokens
			token.parent = @parent
			if tokens[index + 1]?
				token.next = tokens[index + 1]
			if tokens[index - 1]?
				token.prev = tokens[index - 1]

		@prev?.next = tokens[0] ? null
		tokens[0]?.prev = @prev
		@next?.prev = tokens[tokens.length - 1] ? null
		tokens[tokens.length - 1]?.next = @next

		index = @parent.tokens.indexOf this
		@parent.tokens[index..index] = tokens

		@prev = null
		@next = null
		@parent = null

		return this

module.exports = Token
