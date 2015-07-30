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

	it 'works', ->
		expect(osekkai('hoge')).to.equal 'hoge'
