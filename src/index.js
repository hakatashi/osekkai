const Osekkai = require('./osekkai');

const osekkai = function(chunks, options) {
	options = Object.assign({}, osekkai.defaultConfig, options);

	if (typeof options.converters === 'string') {
		options.converters = osekkai.converterPresets[options.converters];
	}

	return new Osekkai(chunks, options);
};

osekkai.defaultConfig = {
	converters: 'default',
	joinableTokens: ['plain'],
};

osekkai.converterPresets = {
	default: {
		exclamations: false,
	},
	vertical: {
		exclamations: true,
	},
};

osekkai.Osekkai = Osekkai;

module.exports = osekkai;
