/*
 * decaffeinate suggestions:
 * DS103: Rewrite code to no longer use __guard__
 * DS104: Avoid inline assignments
 * DS201: Simplify complex destructure assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class Token {
	constructor(params) {
		this.type = params.type != null ? params.type : 'plain';
		this.text = params.text != null ? params.text : '';
		if (this.type !== 'plain') {
			this.original = params.original != null ? params.original : null;
			if (params.length != null) {
				this.length = params.length;
			}
		}
		this.parent = params.parent != null ? params.parent : null;
		this.prev = params.prev != null ? params.prev : null;
		this.next = params.next != null ? params.next : null;
	}

	// TODO: Support surrogates
	prevChar() {
		let prevChar = null;
		let prevToken = this.prev;
		while (prevChar === null && prevToken !== null) {
			if (prevToken !== null && prevToken.text.length !== 0) {
				prevChar = prevToken.text[prevToken.text.length - 1];
			}
			prevToken = prevToken.prev;
		}

		if (prevChar === null) {
			return '';
		}
		return prevChar;
	}

	// TODO: Support surrogates
	nextChar() {
		let nextChar = null;
		let nextToken = this.next;
		while (nextChar === null && nextToken !== null) {
			if (nextToken !== null && nextToken.text.length !== 0) {
				nextChar = nextToken.text[0];
			}
			nextToken = nextToken.next;
		}

		if (nextChar === null) {
			return '';
		}
		return nextChar;
	}

	remove() {
		if (this.prev != null) {
			this.prev.next = this.next;
		}
		if (this.next != null) {
			this.next.prev = this.prev;
		}
		const index = this.parent.tokens.indexOf(this);
		this.parent.tokens.splice(index, index - index + 1, ...[].concat([]));
		return this;
	}

	joinNext() {
		if (this.next != null) {
			this.text += this.next.text;
			this.next.remove();
		}
		return this;
	}

	// Override to add possibility to return null
	substr(start, length) {
		const params = {text: this.text.substr(start, length)};
		if (this.type != null) {
			params.type = this.type;
		}
		// TODO: Consider
		if (this.original != null) {
			params.original = this.original;
		}
		if (this.prev != null) {
			params.prev = this.prev;
		}
		if (this.next != null) {
			params.next = this.next;
		}
		if (this.length != null) {
			params.length = this.length;
		}

		if (this.type === 'upright' && length === 0) {
			params.type = 'plain';
			delete params.original;
		}

		return new Token(params);
	}

	before(token) {
		token.parent = this.parent;

		if (this.prev != null) {
			this.prev.next = token;
		}
		token.prev = this.prev;

		this.prev = token;
		token.next = this;

		const index = this.parent.tokens.indexOf(this);
		this.parent.tokens.splice(index, index - 1 - index + 1, ...[].concat([token]));

		return this;
	}

	after(token) {
		let ref;
		token.parent = this.parent;

		if (this.next != null) {
			this.next.prev = token;
		}
		token.next = this.next;

		this.next = token;
		token.prev = this;

		const index = this.parent.tokens.indexOf(this);
		this.parent.tokens.splice((ref = index + 1), index - ref + 1, ...[].concat([token]));

		return this;
	}

	replaceWith(tokens) {
		// Glue tokens
		let index;
		for (index = 0; index < tokens.length; index++) {
			const token = tokens[index];
			token.parent = this.parent;
			if (tokens[index + 1] != null) {
				token.next = tokens[index + 1];
			}
			if (tokens[index - 1] != null) {
				token.prev = tokens[index - 1];
			}
		}

		if (this.prev != null) {
			this.prev.next = tokens[0] != null ? tokens[0] : null;
		}
		if (tokens[0] != null) {
			tokens[0].prev = this.prev;
		}
		if (this.next != null) {
			let left;
			this.next.prev = (left = tokens[tokens.length - 1]) != null ? left : null;
		}
		__guard__(tokens[tokens.length - 1], (x) => (x.next = this.next));

		index = this.parent.tokens.indexOf(this);
		this.parent.tokens.splice(index, index - index + 1, ...[].concat(tokens));

		this.prev = null;
		this.next = null;
		this.parent = null;

		return this;
	}
}

module.exports = Token;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}
