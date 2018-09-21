/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// require() osekkai into global

// Node.js detection
let global;
if (!typeof module !== 'undefined') {
	global = window;
}

// IE detection
const isIE = function() {
	const myNav = navigator.userAgent.toLowerCase();

	if (myNav.indexOf('msie') !== -1) {
		return parseInt(myNav.split('msie')[1]);
	}
	return false;
};

if (isIE() && (isIE() <= 8)) {
	// core.js is missing various shims such as String.prototype.split, which fails in old IEs
	require('es5-shim');
}

global.osekkai = require('../');
