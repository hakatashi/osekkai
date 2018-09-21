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

const categories = require('./data/categories.json');
const categoryKeys = map(ObjectKeys(categories), (key) => parseInt(key, 10));

const type = {};

type.category = function(char) {
	const codePoint = codePointAt(char, 0);

	const index = binarySearch(categoryKeys.length, (n) => categoryKeys[n] <= codePoint);

	return categories[categoryKeys[index]] != null ? categories[categoryKeys[index]] : categories[categories.length - 1];
};

// See also: Unicode 7.0.0 $5.8 Newline Guidelines
// http://www.unicode.org/versions/Unicode7.0.0/ch05.pdf
type.isNewline = (char) => typeof char === 'string' && Boolean(char.match(new RegExp('^(\
\\r|\
\\n|\
\\r\\n|\
\\x85\
)$')));

module.exports = type;
