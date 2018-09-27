module.exports = {
	root: true,
	env: {
		node: true,
		mocha: true,
	},
	extends: [
		'@hakatashi',
	],
	// add your custom rules here
	rules: {
		'max-params': 'off',
		'no-underscore-dangle': 'off',
		'prefer-object-spread': 'off',
	},
	globals: {},
};
