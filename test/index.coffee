# Node.js detection
if typeof module isnt 'undefined' and module.exports?
	inNode = yes
else
	inNode = no

# require() modules in node
if inNode
	chai = require 'chai'
	assert = chai.assert
	expect = chai.expect
	should = chai.should()
	osekkai = require '../'
# Bring global object to local in browser
else
	assert = window.chai.assert
	expect = window.chai.expect
	osekkai = window.osekkai

TEST_IN = '日本語組版の壮大なお節介'
TEST_OUT = '日本語組版の壮大なお節介'

describe 'osekkai', ->
	tests = {}

	describe 'Core', ->

		describe 'Tokens', ->
			afterEach ->
				for own from, to of tests
					text = osekkai(from, {}).format 'object'
					expect(text).to.deep.equal to
				tests = {}

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
					expect(text.format('object')).to.deep.equal to
				tests = {}

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
						text: 'Hey, Teitoku'
					,
						type: 'plain'
						text: '!'
					,
						type: 'plain'
						text: ' Teatime is serious matter'
					,
						type: 'plain'
						text: '!'
					,
						type: 'plain'
						text: '!'
					]

	describe 'Formatters', ->

		it 'should throw error when unsupported formatters are specified', ->
			text = osekkai TEST_IN
			format = text.format.bind(text, 'blah')
			expect(format).to.throw Error

		describe 'plain', ->
			afterEach ->
				for own from, to of tests
					text = osekkai(from).format('plain')
					expect(text).to.be.a 'string'
					expect(text).to.equal to

			it 'converts texts as is', ->
				tests =
					'日本語': '日本語'
					'お節介': 'お節介'
