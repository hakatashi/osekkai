/*
 * decaffeinate suggestions:
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const ObjectKeys = require('core-js/library/fn/object/keys');
const map = require('core-js/library/fn/array/map');
const codePointAt = require('core-js/library/fn/string/code-point-at');

const binarySearch = require('./binarySearch');

const orientations = require('./data/orientations.json');
const orientationKeys = map(ObjectKeys(orientations), (key) => parseInt(key, 10));

module.exports.get = function(char) {
	if ((typeof char !== 'string') || (char.length === 0)) {
		return null;
	}

	const codePoint = codePointAt(char, 0);

	const index = binarySearch(orientationKeys.length, (n) => orientationKeys[n] <= codePoint);

	return orientations[orientationKeys[index]] != null ? orientations[orientationKeys[index]] : 'R';
};
