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

describe 'osekkai', ->
	tests = {}

	describe 'Core', ->

		describe 'Tokens', ->
			afterEach ->
				for own from, to of tests
					expect(osekkai(from).tokens).to.deep.equal to
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
