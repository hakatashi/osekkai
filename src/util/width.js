/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const ObjectKeys = require('core-js/library/fn/object/keys');
const map = require('core-js/library/fn/array/map');
const codePointAt = require('core-js/library/fn/string/code-point-at');

const binarySearch = require('./binarySearch');

const widths = require('./data/widths.json');
const widthKeys = map(ObjectKeys(widths), key => parseInt(key, 10));

const decompositions = require('./data/decompositions.json');

const width = {};

// Build reverse hash (= composition) of some decompositions
const compositions = {};
for (let type of ['wide', 'narrow']) {
	compositions[type] = {};
	for (let composition in decompositions[type]) {
		const decomposition = decompositions[type][composition];
		compositions[type][decomposition] = composition;
	}
}

width.type = function(char) {
	if ((typeof char !== 'string') || (char.length === 0)) { return null; }

	const codePoint = codePointAt(char, 0);
	const index = binarySearch(widthKeys.length, n => widthKeys[n] <= codePoint);

	return widths[widthKeys[index]] != null ? widths[widthKeys[index]] : 'A';
};

width.composeHankakuChar = char => compositions.wide[char] != null ? compositions.wide[char] : char;
width.composeZenkakuChar = char => compositions.narrow[char] != null ? compositions.narrow[char] : char;

width.decomposeHankakuChar = char => decompositions.narrow[char] != null ? decompositions.narrow[char] : char;
width.decomposeZenkakuChar = char => decompositions.wide[char] != null ? decompositions.wide[char] : char;

width.hankaku = function(string) {
	let ret = '';

	for (let char of string) {
		char = width.composeZenkakuChar(char);
		char = width.decomposeZenkakuChar(char);
		ret += char;
	}

	return ret;
};

width.zenkaku = function(string) {
	let ret = '';

	for (let char of string) {
		char = width.composeHankakuChar(char);
		char = width.decomposeHankakuChar(char);
		ret += char;
	}

	return ret;
};

// Width property of characters categorized Unicode Category Zs (Separator, Space)
// This property is mainly depends on Unicode 7.0.0 §6.2 General Punctuation
// and its unofficial documentation https://www.cs.tut.fi/~jkorpela/chars/spaces.html
// See also: http://www.unicode.org/versions/Unicode7.0.0/ch06.pdf
//
// U+200B and U+FEFF are zero-width spaces but not categorized to 'Zs'
// because they are 'Zero-width' and not visible for theory.
const spaceWidths = {
	'\x20': 1 / 4, // SPACE
	'\xA0': 1 / 4, // NO-BREAK SPACE
	'\u1680': 1 / 2, // OGHAM SPACE MARK
	'\u180E': 0, // MONGOLIAN VOWEL SEPARATOR
	'\u2000': 1 / 2, // EN QUAD
	'\u2001': 1, // EM QUAD
	'\u2002': 1 / 2, // EN SPACE
	'\u2003': 1, // EM SPACE
	'\u2004': 1 / 3, // THREE-PER-EM SPACE
	'\u2005': 1 / 4, // FOUR-PER-EM SPACE
	'\u2006': 1 / 6, // SIX-PER-EM SPACE
	'\u2007': 1 / 2, // FIGURE SPACE
	'\u2008': 1 / 5, // PUNCTUATION SPACE ...practically the same with THIS SPACE
	'\u2009': 1 / 5, // THIN SPACE
	'\u200A': 1 / 6, // HAIR SPACE
	'\u202F': 4 / 18, // NARROW NO-BREAK SPACE
	'\u205F': 4 / 18, // MEDIUM MATHEMATICAL SPACE
	'\u3000': 1 // IDEOGRAPHIC SPACE
};

width.space = space => spaceWidths[space] != null ? spaceWidths[space] : 0;

width.spaces = function(spaces) {
	let ret = 0;
	for (let space of spaces) {
		ret += width.space(space);
	}
	return ret;
};

width.widths = widths;

module.exports = width;
