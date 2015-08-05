# Node.js detection
if typeof module isnt 'undefined' and module.exports?
	inNode = yes
else
	inNode = no

# require() modules in node
if inNode
	expect = require 'expect.js'
	osekkai = require '../'
# Inport Global to Local
else
	expect = window.expect
	osekkai = window.osekkai

TEST_IN = '日本語組版の壮大なお節介'
TEST_OUT = '日本語組版の壮大なお節介'

describe 'osekkai', ->
	tests = {}

	afterEach -> tests = {}

	describe 'Core', ->

		describe 'Tokens', ->
			afterEach ->
				for own from, to of tests
					text = osekkai(from, {}).format 'object'
					expect(text).to.eql to

			it 'converts plain texts as is', ->
				tests =
					'日本語': [
						type: 'plain'
						text: '日本語'
					]
					'お節介': [
						type: 'plain'
						text: 'お節介'
					]

	describe 'Converters', ->

		describe 'Exclamations-upright', ->

			afterEach ->
				for own from, to of tests
					text = osekkai from, converters: exclamations: true
					expect(text.format('object')).to.eql to

			it 'should convert halfwidth exclamation mark into fullwidth', ->
				tests =
					'8時だョ!全員集合': [
						type: 'plain'
						text: '8時だョ'
					,
						type: 'upright'
						text: '!'
					,
						type: 'plain'
						text: '全員集合'
					]

			it 'should remain exclamation in latin script plained', ->
				tests =
					'Hey, Teitoku! Teatime is serious matter!!': [
						type: 'plain'
						text: 'Hey, Teitoku! Teatime is serious matter!!'
					]

			it 'should only convert maximum of tow exclamations in a row by default', ->
				tests =
					'焼きそばだよ!!': [
						type: 'plain'
						text: '焼きそばだよ'
					,
						type: 'upright'
						text: '!!'
					]

					'命を燃やせ!!!': [
						type: 'plain'
						text: '命を燃やせ!!!'
					]

					'アウトだよ!!!!!': [
						type: 'plain'
						text: 'アウトだよ!!!!!'
					]

	describe 'Formatters', ->

		it 'should throw error when unsupported formatters are specified', ->
			text = osekkai TEST_IN
			format = text.format.bind(text, 'blah')
			expect(format).to.throwError()

		describe 'plain', ->
			afterEach ->
				for own from, to of tests
					text = osekkai(from).format('plain')
					expect(text).to.be.a 'string'
					expect(text).to.eql to

			it 'converts texts as is', ->
				tests =
					'日本語': '日本語'
					'お節介': 'お節介'

		describe 'aozora', ->
			afterEach ->
				for own from, to of tests
					text = osekkai(from, converters: exclamations: true).format 'aozora'
					expect(text).to.be.a 'string'
					expect(text).to.eql to

			it 'converts plain texts as is', ->
				tests =
					'日本語': '日本語'
					'お節介': 'お節介'

			it 'converts upright text into ［＃縦中横］', ->
				tests =
					'8時だョ!全員集合': '8時だョ［＃縦中横］！［＃縦中横終わり］全員集合'
