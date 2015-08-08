fs = require 'fs'
util = require 'util'
stream = require 'stream'

program = require 'commander'
iconv = require 'iconv-lite'
osekkai = require './'
pkg = require './package.json'

program
.version pkg.version
.description pkg.description
.usage '[options] <file>'
.option '-o, --output <file>', 'Write output to <file> instead of stdout', String
.option '-c, --config <json>', 'Configure osekkai', String
.option '-f, --format <formatter>', 'Format result with specified formatter', String
.option '--input-encoding <encoding>', 'Specify encoding to read from input. Defaults to utf8', String
.option '--output-encoding <encoding>', 'Specify encoding to write to output. Defaults to utf8', String
.parse process.argv

program.config = JSON.parse program.config ? '{}'
program.format ?= 'aozora'

# Process input
if program.args?[0] is undefined
	input = process.stdin
else
	input = fs.createReadStream program.args[0]

# Encoding defaults to UTF-8
program.inputEncoding ?= 'utf8'
program.outputEncoding ?= 'utf8'

# Store data to buffer
bufferIn = new Buffer(0)

input.on 'data', (chunk) ->
	bufferIn = Buffer.concat [bufferIn, chunk]
input.on 'end', ->
	inputString = iconv.decode bufferIn, program.inputEncoding
	outputString = osekkai(inputString, program.config).format program.format
	bufferOut = iconv.encode outputString, program.outputEncoding

	# Process output
	if program.output is undefined
		output = process.stdout
	else
		output = fs.createWriteStream program.output

	output.write bufferOut

	# Write out
	if output isnt process.stdout
		output.end()
