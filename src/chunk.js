/*
 * decaffeinate suggestions:
 * DS103: Rewrite code to no longer use __guard__
 * DS201: Simplify complex destructure assignments
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
class Chunk {
	constructor(tokens = [], options = {}) {
		this.tokens = tokens;

		for (const token of this.tokens) {
			token.parent = this;
		}

		this.prev = options.prev != null ? options.prev : null;
		this.next = options.next != null ? options.next : null;
		this.index = options.index != null ? options.index : null;
	}

	getText() {
		return this.tokens.map((token) => (token.text != null ? token.text : '')).join('');
	}

	/*
	Chunk.prototype.substr(start[, length])
	Null may be returned if unsplittable token will be splitted.
	WARNING: length cannot be omitted
	*/
	substr(start, length) {
		let index;
		let tokenStart = 0;
		let tokenEnd = 0;
		const ret = [];

		for (var token of this.tokens) {
			const tokenLength = token.text.length;
			tokenEnd += tokenLength;

			if (start < tokenEnd) {
				const substrStart = Math.max(0, start - tokenStart);
				const substrLength = Math.min(tokenLength, start + length - tokenStart - substrStart);

				const substrToken = token.substr(substrStart, substrLength);
				if (substrToken === null) {
					return null;
				}
				ret.push(substrToken);
			}

			if (start + length <= tokenEnd) {
				break;
			}

			tokenStart = tokenEnd;
		}

		// Glue tokens
		for (index = 0; index < ret.length; index++) {
			token = ret[index];
			if (ret[index + 1] != null) {
				token.next = ret[index + 1];
			}
			if (ret[index - 1] != null) {
				token.prev = ret[index - 1];
			}
		}

		return new Chunk(ret, {
			index: this.index,
			prev: null,
			next: null,
		});
	}

	setNext(chunk) {
		this.next = chunk;

		let nextChunk = this.next;
		while (nextChunk !== null) {
			if (nextChunk.tokens[0] != null) {
				__guard__(this.tokens[this.tokens.length - 1], (x) => (x.next = nextChunk.tokens[0]));
				break;
			} else {
				nextChunk = nextChunk.next;
			}
		}

		return this;
	}

	setPrev(chunk) {
		this.prev = chunk;

		let prevChunk = this.prev;
		while (prevChunk !== null) {
			if (prevChunk.tokens[prevChunk.tokens.length - 1] != null) {
				if (this.tokens[0] != null) {
					this.tokens[0].prev = prevChunk.tokens[prevChunk.tokens.length - 1];
				}
				break;
			} else {
				prevChunk = prevChunk.prev;
			}
		}

		return this;
	}

	concat(chunk) {
		if (this.index !== chunk.index) {
			throw new Error('Concatenating chunks whose indexes differ');
		}

		if (this.tokens[this.tokens.length - 1] != null && chunk.tokens[0] != null) {
			chunk.tokens[0].prev = this.tokens[this.tokens.length - 1];
			this.tokens[this.tokens.length - 1].next = chunk.tokens[0];
		}
		for (const token of chunk.tokens) {
			token.parent = this;
		}
		this.tokens.splice(this.tokens.length, 9e9, ...[].concat(chunk.tokens));
		this.next = chunk.next;

		return this;
	}
}

module.exports = Chunk;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}
