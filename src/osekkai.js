/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS201: Simplify complex destructure assignments
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Token = require('./token');
const Chunk = require('./chunk');
const builtinConverters = require('./converters');
const builtinFormatters = require('./formatters');

class Osekkai {
	constructor(chunks, options = {}) {
		let chunk, index;
		if (typeof chunks === 'string') {
			chunks = [chunks];
			this.singleReturn = true;
		} else if (Array.isArray(chunks)) {
			this.singleReturn = false;
		} else {
			throw new Error('Unknown chunks');
		}

		this.chunks = [];
		for (index = 0; index < chunks.length; index++) {
			const chunkText = chunks[index];
			const token = new Token({
				type: 'plain',
				text: chunkText,
			});
			chunk = new Chunk([token], {index});
			this.chunks.push(chunk);
		}

		// Glue chunks
		for (index = 0; index < this.chunks.length; index++) {
			chunk = this.chunks[index];
			if (this.chunks[index + 1]) {
				chunk.setNext(this.chunks[index + 1]);
			}
			if (this.chunks[index - 1]) {
				chunk.setPrev(this.chunks[index - 1]);
			}
		}

		if (options.converters) {
			this.convert(options.converters);
		}
	}

	convert(converters, config = {}) {
		let converter;
		switch (typeof converters) {
			case 'string':
				var temp = [];
				temp.push([converters, config]);
				converters = temp;
				break;

			case 'object':
				if (!Array.isArray(converters)) {
					temp = [];
					for (converter in converters) {
						config = converters[converter];
						temp.push([converter, config]);
					}
					converters = temp;
				}
				break;

			default:
				throw new Error('Unknown converters');
		}

		for ([converter, config] of converters) {
			if (config === false || config === null) {
				break;
			}

			if (typeof config === 'boolean') {
				builtinConverters[converter].call(this, {});
			} else {
				builtinConverters[converter].call(this, config);
			}

			this.normalize();
		}

		return this;
	}

	getText() {
		return this.chunks.map((chunk) => chunk.getText()).join('');
	}

	// WARNING: length cannnot be omitted
	// Returns array of "array of tokens (simeq block)."
	// Null may be returned if unsplittable token will be splitted.
	substr(start, length) {
		let chunk, index;
		let chunkStart = 0;
		let chunkEnd = 0;
		const ret = [];

		for (index = 0; index < this.chunks.length; index++) {
			chunk = this.chunks[index];
			const chunkLength = chunk.getText().length;
			chunkEnd += chunkLength;

			if (
				start < chunkEnd ||
				// Run on an empty chunk  at start position
				(chunkStart === chunkEnd && chunkEnd === start)
			) {
				const substrStart = Math.max(0, start - chunkStart);
				const substrLength = Math.min(chunkLength, start + length - chunkStart - substrStart);
				ret.push(chunk.substr(substrStart, substrLength));
			}

			if (start + length <= chunkEnd) {
				// If every remaining chunks is empty chunks, let them run on to the ret chunks
				const remainingChunks = this.chunks.slice(index + 1);
				if (start + length === chunkEnd && remainingChunks.length > 0 && remainingChunks.every((chunk) => chunk.getText().length === 0)) {
					ret.push(...remainingChunks.map((chunk) => chunk.substr(0, 0)));
				}
				break;
			}

			chunkStart = chunkEnd;
		}

		// Glue chunks
		for (index = 0; index < ret.length; index++) {
			chunk = ret[index];
			if (ret[index + 1]) {
				chunk.setNext(ret[index + 1]);
			}
			if (ret[index - 1]) {
				chunk.setPrev(ret[index - 1]);
			}
		}

		return ret;
	}

	/*
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
	*/
	replace(patterns, callback) {
		// Sanitize patterns
		let chunks, index;
		if ({}.toString.call(patterns) === '[object RegExp]') {
			patterns = [patterns];
		} else if (!Array.isArray(patterns)) {
			throw new Error('Unknown replacement patterns');
		}

		let splitterStr = '';
		for (const pattern of patterns) {
			splitterStr += `(${pattern.source})`;
		}

		const splitter = new RegExp(splitterStr, 'g');

		const text = this.getText();

		const lumps = text.split(splitter);
		const chunkses = [];

		// TODO: Handle null

		let offset = 0;
		for (index = 0; index < lumps.length; index++) {
			const lump = lumps[index];
			chunkses.push(this.substr(offset, lump.length));
			offset += lump.length;
		}

		// Glue chunkses
		for (index = 0; index < chunkses.length; index++) {
			chunks = chunkses[index];
			if (__guard__(chunkses[index + 1], (x) => x[0])) {
				__guard__(chunks[chunks.length - 1], (x1) => x1.setNext(chunkses[index + 1][0]));
			}
			if (__guard__(chunkses[index - 1], (x2) => x2[chunkses[index - 1].length - 1])) {
				if (chunks[0]) {
					chunks[0].setPrev(chunkses[index - 1][chunkses[index - 1].length - 1]);
				}
			}
		}

		const retChunkses = [];

		// Execute replacement
		for (index = 0; index < chunkses.length; index++) {
			chunks = chunkses[index];
			if (index % (patterns.length + 1) === 0) {
				retChunkses.push(chunks);
			} else if (index % (patterns.length + 1) === 1) {
				var appendChunkses;
				if (patterns.length === 1) {
					appendChunkses = [callback.call(this, chunks)];
				} else {
					appendChunkses = callback.call(this, __range__(0, patterns.length, false).map((i) => chunkses[index + i]));
				}
				retChunkses.splice(retChunkses.length, 9e9, ...[].concat(appendChunkses));
			}
		}

		// Reorganize chunks
		const newChunks = [];
		for (chunks of retChunkses) {
			for (const chunk of chunks) {
				if (newChunks[chunk.index] == null) {
					newChunks[chunk.index] = chunk;
				} else {
					newChunks[chunk.index].concat(chunk);
				}
			}
		}

		// Replace chunks
		this.chunks = newChunks;

		return this;
	}

	format(type, config = {}) {
		if (!builtinFormatters[type]) {
			throw new Error(`Unknown formatter type ${type}`);
		}

		const formatChunks = builtinFormatters[type].call(this, config);

		if (this.singleReturn) {
			return formatChunks[0];
		}
		return formatChunks;
	}

	normalize() {
		return (() => {
			const result = [];
			for (const chunk of this.chunks) {
				// Tip: [..] is a magic for copying array, bro.
				var tokens = chunk.tokens.slice();
				tokens.push({prev: tokens[tokens.length - 1]});

				result.push(
					(() => {
						const result1 = [];
						for (const token of tokens) {
							if (token.type === 'plain' && (token ? token.text : undefined) === '') {
								result1.push(token.remove());
							} else if ((token.prev ? token.prev.type : undefined) === 'plain') {
								if ((token ? token.type : undefined) === 'plain' && token.prev.parent === token.parent) {
									result1.push(token.prev.joinNext());
								} else {
									result1.push(undefined);
								}
							} else {
								result1.push(undefined);
							}
						}
						return result1;
					})()
				);
			}
			return result;
		})();
	}
}

module.exports = Osekkai;

function __guard__(value, transform) {
	return typeof value !== 'undefined' && value !== null ? transform(value) : undefined;
}
function __range__(left, right, inclusive) {
	const range = [];
	const ascending = left < right;
	const end = !inclusive ? right : ascending ? right + 1 : right - 1;
	for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
		range.push(i);
	}
	return range;
}
