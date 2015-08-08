# Node.js detection
if typeof module isnt 'undefined' and module.exports?
	inNode = yes
else
	inNode = no

# require() modules in node
if inNode
	expect = require 'expect.js'
	osekkai = require '../src'
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

		describe 'Exclamations', ->

			afterEach ->
				for own from, to of tests
					text = osekkai from, converters: exclamations: true
					expect(text.format('object')).to.eql to

			it 'should convert halfwidth exclamation mark into fullwidth', ->
				tests =
					'なのです!': [
						type: 'plain'
						text: 'なのです'
					,
						type: 'upright'
						text: '！'
						original: '!'
					]

			it 'should insert 1em margin after exclamations', ->
				tests =
					'ラブライブ！スクールアイドルフェスティバル': [
						type: 'plain'
						text: 'ラブライブ'
					,
						type: 'upright'
						text: '！'
						original: '！'
					,
						type: 'margin'
						length: 1
						text: ''
						original: ''
					,
						type: 'plain'
						text: 'スクールアイドルフェスティバル'
					]

			it 'should not insert margin before line breaks', ->
				tests =
					"""
					がっこうぐらし!
					第一話「はじまり」
					""" : [
						type: 'plain'
						text: 'がっこうぐらし'
					,
						type: 'upright'
						text: '！'
						original: '!'
					,
						type: 'plain'
						text: """

						第一話「はじまり」
						"""
					]

					'がっこうぐらし!\r\n第二話「おもいで」' : [
						type: 'plain'
						text: 'がっこうぐらし'
					,
						type: 'upright'
						text: '！'
						original: '!'
					,
						type: 'plain'
						text: '\r\n第二話「おもいで」'
					]

			it 'should convert zenkaku exclamation into hankaku if more than one exclamations are listed', ->
				tests =
					'めうめうぺったんたん！！': [
						type: 'plain'
						text: 'めうめうぺったんたん'
					,
						type: 'upright'
						text: '!!'
						original: '！！'
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
						original: '!!'
					]

					'命を燃やせ!!!': [
						type: 'plain'
						text: '命を燃やせ!!!'
					]

					'アウトだよ!!!!!': [
						type: 'plain'
						text: 'アウトだよ!!!!!'
					]

			it 'should be safe with heading exclamation', ->
				tests =
					'！あてんしょん！': [
						type: 'plain'
						text: '！あてんしょん'
					,
						type: 'upright'
						text: '！'
						original: '！'
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
					'侵略!?イカ娘': '侵略［＃縦中横］!?［＃縦中横終わり］イカ娘'

			it 'should convert single upright text into zenkaku string', ->
				tests =
					'侵略!イカ娘': '侵略！イカ娘'
