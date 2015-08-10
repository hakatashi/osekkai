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
					text = osekkai(from).format 'object'
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
			config = {}

			beforeEach ->
				config = {}

			afterEach ->
				for own from, to of tests
					text = osekkai(from).convert('exclamations', config).format 'object'
					expect(text).to.eql to

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

			it 'should convert exclamation after fullwidth character into upright', ->
				tests =
					'まじで……！？': [
						type: 'plain'
						text: 'まじで……'
					,
						type: 'upright'
						text: '!?'
						original: '！？'
					]

			it 'should remain exclamation in latin script plained', ->
				tests =
					'Hey, Teitoku! Teatime is serious matter!!': [
						type: 'plain'
						text: 'Hey, Teitoku! Teatime is serious matter!!'
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

			it 'should not insert margin before closing parenthesis', ->
				tests =
					'(なんでだよ!)': [
						type: 'plain'
						text: '(なんでだよ'
					,
						type: 'upright'
						text: '！'
						original: '!'
					,
						type: 'plain'
						text: ')'
					]

					'「意外!それは髪の毛ッ!」': [
						type: 'plain'
						text: '「意外'
					,
						type: 'upright'
						text: '！'
						original: '!'
					,
						type: 'margin'
						length: 1
						text: ''
						original: ''
					,
						type: 'plain'
						text: 'それは髪の毛ッ'
					,
						type: 'upright'
						text: '！'
						original: '!'
					,
						type: 'plain'
						text: '」'
					]

					'『このミステリーがすごい!』大賞': [
						type: 'plain'
						text: '『このミステリーがすごい'
					,
						type: 'upright'
						text: '！'
						original: '!'
					,
						type: 'plain'
						text: '』大賞'
					]

					'【!】不適切なコメントを通報する': [
						type: 'plain'
						text: '【'
					,
						type: 'upright'
						text: '！'
						original: '!'
					,
						type: 'plain'
						text: '】不適切なコメントを通報する'
					]

			it 'should not insert margin before fullwidth spaces', ->
				tests =
					'迎撃！　トラック泊地強襲': [
						type: 'plain'
						text: '迎撃'
					,
						type: 'upright'
						text: '！'
						original: '！'
					,
						type: 'plain'
						text: '　トラック泊地強襲'
					]

			it 'should insert margin before small width spaces', ->
				tests =
					'ラブライブ! The School Idol Movie': [
						type: 'plain'
						text: 'ラブライブ'
					,
						type: 'upright'
						text: '！'
						original: '!'
					,
						type: 'margin'
						length: 3 / 4
						text: ''
						original: ''
					,
						type: 'plain'
						text: ' The School Idol Movie'
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

			it 'should only convert maximum of two exclamations in a row by default', ->
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

					'アウトだよ!!!!': [
						type: 'plain'
						text: 'アウトだよ!!!!'
					]

			it 'should be configurable of the length of upright exclamations', ->
				config =
					length: 3

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
						text: '命を燃やせ'
					,
						type: 'upright'
						text: '!!!'
						original: '!!!'
					]

					'アウトだよ!!!!': [
						type: 'plain'
						text: 'アウトだよ!!!!'
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

		describe 'Numbers', ->
			config = {}

			beforeEach ->
				config = {}
				tests = {}

			afterEach ->
				for own from, to of tests
					text = osekkai(from).convert('numbers', config).format 'object'
					expect(text).to.eql to

			it 'should convert single zenkaku and hankaku number into upright', ->
				tests =
					'永遠の0': [
						type: 'plain'
						text: '永遠の'
					,
						type: 'upright'
						text: '０'
						original: '0'
					]

					'ガンダム８号機': [
						type: 'plain'
						text: 'ガンダム'
					,
						type: 'upright'
						text: '８'
						original: '８'
					,
						type: 'plain'
						text: '号機'
					]

					'8月7日': [
						type: 'upright'
						text: '８'
						original: '8'
					,
						type: 'plain'
						text: '月'
					,
						type: 'upright'
						text: '７'
						original: '7'
					,
						type: 'plain'
						text: '日'
					]

			it 'should convert up to two numbers into upright by default', ->
				tests =
					'ゴルゴ１３': [
						type: 'plain'
						text: 'ゴルゴ'
					,
						type: 'upright'
						text: '13'
						original: '１３'
					]

					'ゴルゴ３１１': [
						type: 'plain'
						text: 'ゴルゴ３１１'
					]

					'ゴルゴ２０１５': [
						type: 'plain'
						text: 'ゴルゴ２０１５'
					]

			it 'should be configurable of number of upright numbers with length property', ->
				config =
					length: 3

				tests =
					'ゴルゴ１３': [
						type: 'plain'
						text: 'ゴルゴ'
					,
						type: 'upright'
						text: '13'
						original: '１３'
					]

					'ゴルゴ３１１': [
						type: 'plain'
						text: 'ゴルゴ'
					,
						type: 'upright'
						text: '311'
						original: '３１１'
					]

					'ゴルゴ２０１５': [
						type: 'plain'
						text: 'ゴルゴ２０１５'
					]

			it 'should not convert numbers inside latin script into upright', ->
				tests =
					"""
					10 little Indian boys went out to dine;
					1 choked his little self and then there were 9.
					""" : [
						type: 'plain'
						text: """
						10 little Indian boys went out to dine;
						1 choked his little self and then there were 9.
						"""
					]

					"""
					10人のインディアンが食事に出かけた
					1人がのどを詰まらせて、9人になった
					""" : [
						type: 'upright'
						text: '10'
						original: '10'
					,
						type: 'plain'
						text: """
						人のインディアンが食事に出かけた

						"""
					,
						type: 'upright'
						text: '１'
						original: '1'
					,
						type: 'plain'
						text: """
						人がのどを詰まらせて、
						"""
					,
						type: 'upright'
						text: '９'
						original: '9'
					,
						type: 'plain'
						text: '人になった'
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
					'しんけん!!': 'しんけん［＃縦中横］!!［＃縦中横終わり］'

			it 'should convert single upright text into zenkaku string', ->
				tests =
					'ハヤテのごとく!': 'ハヤテのごとく！'

			it 'should insert fullwidth ideographic space after exclamations', ->
				tests =
					'侵略!イカ娘': '侵略！　イカ娘'
					'侵略!?イカ娘': '侵略［＃縦中横］!?［＃縦中横終わり］　イカ娘'
