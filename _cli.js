/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
let input;
const fs = require('fs');
const util = require('util');
const stream = require('stream');

const program = require('commander');
const iconv = require('iconv-lite');
const osekkai = require('./');
const pkg = require('./package.json');

program
	.version(pkg.version)
	.description(pkg.description)
	.usage('[options] <file>')
	.option('-o, --output <file>', 'Write output to <file> instead of stdout', String)
	.option('-c, --config <json>', 'Configure osekkai', String)
	.option('-f, --format <formatter>', 'Format result with specified formatter', String)
	.option('--input-encoding <encoding>', 'Specify encoding to read from input. Defaults to utf8', String)
	.option('--output-encoding <encoding>', 'Specify encoding to write to output. Defaults to utf8', String)
	.parse(process.argv);

program.config = JSON.parse(program.config != null ? program.config : '{}');
if (program.format == null) {
	program.format = 'aozora';
}

// Process input
if ((program.args != null ? program.args[0] : undefined) === undefined) {
	input = process.stdin;
} else {
	input = fs.createReadStream(program.args[0]);
}

// Encoding defaults to UTF-8
if (program.inputEncoding == null) {
	program.inputEncoding = 'utf8';
}
if (program.outputEncoding == null) {
	program.outputEncoding = 'utf8';
}

// Store data to buffer
let bufferIn = new Buffer(0);

input.on('data', (chunk) => bufferIn = Buffer.concat([bufferIn, chunk]));
input.on('end', () => {
	let output;
	const inputString = iconv.decode(bufferIn, program.inputEncoding);
	const outputString = osekkai(inputString, program.config).format(program.format);
	const bufferOut = iconv.encode(outputString, program.outputEncoding);

	// Process output
	if (program.output === undefined) {
		output = process.stdout;
	} else {
		output = fs.createWriteStream(program.output);
	}

	output.write(bufferOut);

	// Write out
	if (output !== process.stdout) {
		return output.end();
	}
});
