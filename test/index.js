/* eslint-env jest */
/*
 * decaffeinate suggestions:
 * DS203: Remove `|| {}` from converted for-own loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// Node.js detection
const osekkai = require('../src');
const expect = require('expect.js');

describe('osekkai', () => {
	let tests = {};

	beforeEach(() => (tests = {}));

	describe('Core', () => {
		it('should accept array of chunks as first argument', () => {
			expect(osekkai.bind(osekkai, ['暇を持て余した', '神々の', '遊び'])).to.not.throwError();
		});

		it('should format array of chunks as array', () => {
			expect(osekkai(['暇を持て余した', '神々の', '遊び']).format('plain')).to.be.eql(['暇を持て余した', '神々の', '遊び']);
		});

		it('should convert array of chunks as array', () => {
			expect(
				osekkai(['暇を持て余した', '神々の', '遊び'])
					.convert('numbers')
					.format('plain')
			).to.be.eql(['暇を持て余した', '神々の', '遊び']);
		});

		it('should correctly handle the empty strings as input', () => {
			const result = osekkai(['', 'a', ''])
				.convert('numbers')
				.format('plain');

			expect(result).to.be.eql(['', 'a', '']);
		});

		it('should error when unknown converter is specified', () => {
			const obj = osekkai('ちくわ大明神');
			expect(obj.convert.bind(obj, 'UNKNOWN')).to.throwError();
		});

		it('should error when unknown formatter is specified', () => {
			const obj = osekkai('ちくわ大明神');
			expect(obj.format.bind(obj, 'UNKNOWN')).to.throwError();
		});

		describe('Tokens', () => {
			afterEach(() => (() => {
				for (const textFrom of Object.keys(tests || {})) {
					const textTo = tests[textFrom];
					const text = osekkai(textFrom).format('object');
					expect(text).to.eql(textTo);
				}
			})());

			it('converts plain texts as is', () => (tests = {
				日本語: [
					{
						type: 'plain',
						text: '日本語',
					},
				],
				お節介: [
					{
						type: 'plain',
						text: 'お節介',
					},
				],
			}));

			describe('osekkai.substr()', () => {
				it('should inherit length property of every margin token on creating substring', () => {
					const osek = osekkai('いあ!いあ!');
					osek.convert('exclamations');
					const chunks = osek.substr(0, 6);
					expect(chunks).to.have.length(1);
					expect(chunks[0].getText()).to.eql('いあ！いあ！');
					expect(chunks[0].tokens).to.have.length(5);
					expect(chunks[0].tokens[2]).to.have.property('length');
					expect(chunks[0].tokens[2].length).to.eql(1);
				});

				it('should be separatable of zero-width upright token into plain', () => {
					const osek = osekkai('1ページ');
					osek.convert('numbers');
					osek.convert('alphabetUpright');
					const result = osek.format('object');
					expect(result).to.eql([
						{
							type: 'upright',
							text: '１',
							original: '1',
						},
						{
							type: 'plain',
							text: 'ページ',
						},
					]);
				});
			});
		});
	});

	describe('Converters', () => {
		describe('Exclamations and Questions', () => {
			let config = {};

			beforeEach(() => (config = {}));

			afterEach(() => (() => {
				for (const textFrom of Object.keys(tests || {})) {
					const textTo = tests[textFrom];
					const text = osekkai(textFrom)
						.convert('exclamations', config)
						.format('object');
					expect(text).to.eql(textTo);
				}
			})());

			it('should convert halfwidth exclamation mark into fullwidth', () => (tests = {
				'なのです!': [
					{
						type: 'plain',
						text: 'なのです',
					},
					{
						type: 'upright',
						text: '！',
						original: '!',
					},
				],
			}));

			it('should convert exclamation after fullwidth character into upright', () => (tests = {
				'まじで……！？': [
					{
						type: 'plain',
						text: 'まじで……',
					},
					{
						type: 'upright',
						text: '!?',
						original: '！？',
					},
				],
			}));

			it('should remain exclamation in latin script plained', () => (tests = {
				'Hey, Teitoku! Teatime is serious matter!!': [
					{
						type: 'plain',
						text: 'Hey, Teitoku! Teatime is serious matter!!',
					},
				],
			}));

			it('should insert 1em margin after exclamations', () => (tests = {
				'ラブライブ！スクールアイドルフェスティバル': [
					{
						type: 'plain',
						text: 'ラブライブ',
					},
					{
						type: 'upright',
						text: '！',
						original: '！',
					},
					{
						type: 'margin',
						length: 1,
						text: '',
						original: '',
					},
					{
						type: 'plain',
						text: 'スクールアイドルフェスティバル',
					},
				],
			}));

			it('should not insert margin before closing parenthesis', () => (tests = {
				'(なんでだよ!)': [
					{
						type: 'plain',
						text: '(なんでだよ',
					},
					{
						type: 'upright',
						text: '！',
						original: '!',
					},
					{
						type: 'plain',
						text: ')',
					},
				],

				'「意外!それは髪の毛ッ!」': [
					{
						type: 'plain',
						text: '「意外',
					},
					{
						type: 'upright',
						text: '！',
						original: '!',
					},
					{
						type: 'margin',
						length: 1,
						text: '',
						original: '',
					},
					{
						type: 'plain',
						text: 'それは髪の毛ッ',
					},
					{
						type: 'upright',
						text: '！',
						original: '!',
					},
					{
						type: 'plain',
						text: '」',
					},
				],

				'『このミステリーがすごい!』大賞': [
					{
						type: 'plain',
						text: '『このミステリーがすごい',
					},
					{
						type: 'upright',
						text: '！',
						original: '!',
					},
					{
						type: 'plain',
						text: '』大賞',
					},
				],

				'【!】不適切なコメントを通報する': [
					{
						type: 'plain',
						text: '【',
					},
					{
						type: 'upright',
						text: '！',
						original: '!',
					},
					{
						type: 'plain',
						text: '】不適切なコメントを通報する',
					},
				],
			}));

			it('should not insert margin before fullwidth spaces', () => (tests = {
				'迎撃！　トラック泊地強襲': [
					{
						type: 'plain',
						text: '迎撃',
					},
					{
						type: 'upright',
						text: '！',
						original: '！',
					},
					{
						type: 'plain',
						text: '　トラック泊地強襲',
					},
				],
			}));

			it('should insert margin before small width spaces', () => (tests = {
				'ラブライブ! The School Idol Movie': [
					{
						type: 'plain',
						text: 'ラブライブ',
					},
					{
						type: 'upright',
						text: '！',
						original: '!',
					},
					{
						type: 'margin',
						length: 3 / 4,
						text: '',
						original: '',
					},
					{
						type: 'plain',
						text: ' The School Idol Movie',
					},
				],
			}));

			it('should not insert margin before line breaks', () => (tests = {
				[`\
がっこうぐらし!
第一話「はじまり」\
`]: [
					{
						type: 'plain',
						text: 'がっこうぐらし',
					},
					{
						type: 'upright',
						text: '！',
						original: '!',
					},
					{
						type: 'plain',
						text: `\

第一話「はじまり」\
`,
					},
				],

				'がっこうぐらし!\r\n第二話「おもいで」': [
					{
						type: 'plain',
						text: 'がっこうぐらし',
					},
					{
						type: 'upright',
						text: '！',
						original: '!',
					},
					{
						type: 'plain',
						text: '\r\n第二話「おもいで」',
					},
				],
			}));

			it('should convert zenkaku exclamation into hankaku if more than one exclamations are listed', () => (tests = {
				'めうめうぺったんたん！！': [
					{
						type: 'plain',
						text: 'めうめうぺったんたん',
					},
					{
						type: 'upright',
						text: '!!',
						original: '！！',
					},
				],
			}));

			it('should only convert maximum of two exclamations in a row by default', () => (tests = {
				'焼きそばだよ!!': [
					{
						type: 'plain',
						text: '焼きそばだよ',
					},
					{
						type: 'upright',
						text: '!!',
						original: '!!',
					},
				],

				'命を燃やせ!!!': [
					{
						type: 'plain',
						text: '命を燃やせ',
					},
					{
						type: 'upright',
						text: '！',
						original: '!',
					},
					{
						type: 'upright',
						text: '！',
						original: '!',
					},
					{
						type: 'upright',
						text: '！',
						original: '!',
					},
				],

				'アウトだよ!!!!': [
					{
						type: 'plain',
						text: 'アウトだよ',
					},
					{
						type: 'upright',
						text: '！',
						original: '!',
					},
					{
						type: 'upright',
						text: '！',
						original: '!',
					},
					{
						type: 'upright',
						text: '！',
						original: '!',
					},
					{
						type: 'upright',
						text: '！',
						original: '!',
					},
				],
			}));

			it('should be configurable of the length of upright exclamations', () => {
				config = {length: 3};

				(tests = {
					'焼きそばだよ!!': [
						{
							type: 'plain',
							text: '焼きそばだよ',
						},
						{
							type: 'upright',
							text: '!!',
							original: '!!',
						},
					],

					'命を燃やせ!!!': [
						{
							type: 'plain',
							text: '命を燃やせ',
						},
						{
							type: 'upright',
							text: '!!!',
							original: '!!!',
						},
					],

					'アウトだよ!!!!': [
						{
							type: 'plain',
							text: 'アウトだよ',
						},
						{
							type: 'upright',
							text: '！',
							original: '!',
						},
						{
							type: 'upright',
							text: '！',
							original: '!',
						},
						{
							type: 'upright',
							text: '！',
							original: '!',
						},
						{
							type: 'upright',
							text: '！',
							original: '!',
						},
					],
				});
			});

			it('should be safe with heading exclamation', () => (tests = {
				'！あてんしょん！': [
					{
						type: 'plain',
						text: '！あてんしょん',
					},
					{
						type: 'upright',
						text: '！',
						original: '！',
					},
				],
			}));
		});

		describe('Numbers', () => {
			let config = {};

			beforeEach(() => {
				config = {};
				(tests = {});
			});

			afterEach(() => (() => {
				for (const textFrom of Object.keys(tests || {})) {
					const textTo = tests[textFrom];
					const text = osekkai(textFrom)
						.convert('numbers', config)
						.format('object');
					expect(text).to.eql(textTo);
				}
			})());

			it('should convert single zenkaku and hankaku number into upright', () => (tests = {
				永遠の0: [
					{
						type: 'plain',
						text: '永遠の',
					},
					{
						type: 'upright',
						text: '０',
						original: '0',
					},
				],

				ガンダム８号機: [
					{
						type: 'plain',
						text: 'ガンダム',
					},
					{
						type: 'upright',
						text: '８',
						original: '８',
					},
					{
						type: 'plain',
						text: '号機',
					},
				],

				'8月7日': [
					{
						type: 'upright',
						text: '８',
						original: '8',
					},
					{
						type: 'plain',
						text: '月',
					},
					{
						type: 'upright',
						text: '７',
						original: '7',
					},
					{
						type: 'plain',
						text: '日',
					},
				],
			}));

			it('should convert up to two numbers into upright by default', () => (tests = {
				ゴルゴ１３: [
					{
						type: 'plain',
						text: 'ゴルゴ',
					},
					{
						type: 'upright',
						text: '13',
						original: '１３',
					},
				],

				ゴルゴ３１１: [
					{
						type: 'plain',
						text: 'ゴルゴ',
					},
					{
						type: 'upright',
						text: '３',
						original: '３',
					},
					{
						type: 'upright',
						text: '１',
						original: '１',
					},
					{
						type: 'upright',
						text: '１',
						original: '１',
					},
				],

				ゴルゴ２０１５: [
					{
						type: 'plain',
						text: 'ゴルゴ',
					},
					{
						type: 'upright',
						text: '２',
						original: '２',
					},
					{
						type: 'upright',
						text: '０',
						original: '０',
					},
					{
						type: 'upright',
						text: '１',
						original: '１',
					},
					{
						type: 'upright',
						text: '５',
						original: '５',
					},
				],
			}));

			it('should be configurable of number of upright numbers with length property', () => {
				config = {length: 3};

				(tests = {
					ゴルゴ１３: [
						{
							type: 'plain',
							text: 'ゴルゴ',
						},
						{
							type: 'upright',
							text: '13',
							original: '１３',
						},
					],

					ゴルゴ３１１: [
						{
							type: 'plain',
							text: 'ゴルゴ',
						},
						{
							type: 'upright',
							text: '311',
							original: '３１１',
						},
					],

					ゴルゴ２０１５: [
						{
							type: 'plain',
							text: 'ゴルゴ',
						},
						{
							type: 'upright',
							text: '２',
							original: '２',
						},
						{
							type: 'upright',
							text: '０',
							original: '０',
						},
						{
							type: 'upright',
							text: '１',
							original: '１',
						},
						{
							type: 'upright',
							text: '５',
							original: '５',
						},
					],
				});
			});

			it('should not convert numbers inside latin script into upright', () => (tests = {
				[`\
10 little Indian boys went out to dine;
1 choked his little self and then there were 9.\
`]: [
					{
						type: 'plain',
						text: `\
10 little Indian boys went out to dine;
1 choked his little self and then there were 9.\
`,
					},
				],

				[`\
10人のインディアンが食事に出かけた
1人がのどを詰まらせて、9人になった\
`]: [
					{
						type: 'upright',
						text: '10',
						original: '10',
					},
					{
						type: 'plain',
						text: `\
人のインディアンが食事に出かけた
\
`,
					},
					{
						type: 'upright',
						text: '１',
						original: '1',
					},
					{
						type: 'plain',
						text: '\
人がのどを詰まらせて、\
',
					},
					{
						type: 'upright',
						text: '９',
						original: '9',
					},
					{
						type: 'plain',
						text: '人になった',
					},
				],
			}));
		});

		describe('Dashes', () => {
			let config = {};

			beforeEach(() => {
				config = {};
				(tests = {});
			});

			afterEach(() => (() => {
				for (const textFrom of Object.keys(tests || {})) {
					const textTo = tests[textFrom];
					const text = osekkai(textFrom)
						.convert('dashes', config)
						.format('object');
					expect(text).to.eql(textTo);
				}
			})());

			it('should convert dashes into U+2500 (BOX DRAWINGS LIGHT HORIZONTAL)', () => (tests = {
				// U+2015
				'――気をつけたほうがいい。もう始まってるかもしれない': [
					{
						type: 'alter',
						text: '──',
						original: '――',
					},
					{
						type: 'plain',
						text: '気をつけたほうがいい。もう始まってるかもしれない',
					},
				],

				// U+2014
				'ド———(ﾟдﾟ)———ン!': [
					{
						type: 'plain',
						text: 'ド',
					},
					{
						type: 'alter',
						text: '───',
						original: '———',
					},
					{
						type: 'plain',
						text: '(ﾟдﾟ)',
					},
					{
						type: 'alter',
						text: '───',
						original: '———',
					},
					{
						type: 'plain',
						text: 'ン!',
					},
				],
			}));

			it('should convert mixed string with U+2014 and U+2015 into single dashes', () => (tests = {
				'ｷﾀ—―—(ﾟ∀ﾟ)—――!!': [
					{
						type: 'plain',
						text: 'ｷﾀ',
					},
					{
						type: 'alter',
						text: '───',
						original: '—―—',
					},
					{
						type: 'plain',
						text: '(ﾟ∀ﾟ)',
					},
					{
						type: 'alter',
						text: '───',
						original: '—――',
					},
					{
						type: 'plain',
						text: '!!',
					},
				],
			}));
		});

		describe('Alphabet Upright', () => {
			let config = {};

			beforeEach(() => {
				config = {};
				(tests = {});
			});

			afterEach(() => (() => {
				for (const textFrom of Object.keys(tests || {})) {
					const textTo = tests[textFrom];
					const text = osekkai(textFrom)
						.convert('alphabetUpright', config)
						.format('object');
					expect(text).to.eql(textTo);
				}
			})());

			it('should convert hankaku alphabet inside Japanese text upright', () => (tests = {
				ピクシブのPDF変換機能: [
					{
						type: 'plain',
						text: 'ピクシブの',
					},
					{
						type: 'upright',
						text: 'Ｐ',
						original: 'P',
					},
					{
						type: 'upright',
						text: 'Ｄ',
						original: 'D',
					},
					{
						type: 'upright',
						text: 'Ｆ',
						original: 'F',
					},
					{
						type: 'plain',
						text: '変換機能',
					},
				],

				'M-1グランプリ': [
					{
						type: 'upright',
						text: 'Ｍ',
						original: 'M',
					},
					{
						type: 'alter',
						text: '－',
						original: '-',
					},
					{
						type: 'upright',
						text: '１',
						original: '1',
					},
					{
						type: 'plain',
						text: 'グランプリ',
					},
				],
			}));

			it('should convert heading and trailing alphabet inside Japanese text upright', () => (tests = {
				スーパーマリオRPG: [
					{
						type: 'plain',
						text: 'スーパーマリオ',
					},
					{
						type: 'upright',
						text: 'Ｒ',
						original: 'R',
					},
					{
						type: 'upright',
						text: 'Ｐ',
						original: 'P',
					},
					{
						type: 'upright',
						text: 'Ｇ',
						original: 'G',
					},
				],

				RPGツクール: [
					{
						type: 'upright',
						text: 'Ｒ',
						original: 'R',
					},
					{
						type: 'upright',
						text: 'Ｐ',
						original: 'P',
					},
					{
						type: 'upright',
						text: 'Ｇ',
						original: 'G',
					},
					{
						type: 'plain',
						text: 'ツクール',
					},
				],

				[`\
艦これRPG
RPGツクール2\
`]: [
					{
						type: 'plain',
						text: '艦これ',
					},
					{
						type: 'upright',
						text: 'Ｒ',
						original: 'R',
					},
					{
						type: 'upright',
						text: 'Ｐ',
						original: 'P',
					},
					{
						type: 'upright',
						text: 'Ｇ',
						original: 'G',
					},
					{
						type: 'plain',
						text: '\n',
					},
					{
						type: 'upright',
						text: 'Ｒ',
						original: 'R',
					},
					{
						type: 'upright',
						text: 'Ｐ',
						original: 'P',
					},
					{
						type: 'upright',
						text: 'Ｇ',
						original: 'G',
					},
					{
						type: 'plain',
						text: 'ツクール',
					},
					{
						type: 'upright',
						text: '２',
						original: '2',
					},
				],
			}));

			it('should not convert lowercase alphabet upright', () => (tests = {
				'Go！プリンセスプリキュア': [
					{
						type: 'plain',
						text: 'Go！プリンセスプリキュア',
					},
				],
			}));

			it('should not convert alphabets inside latin script upright', () => (tests = {
				'ARIA The ANIMATION': [
					{
						type: 'plain',
						text: 'ARIA The ANIMATION',
					},
				],
			}));
		});

		describe('Alphabet Margin', () => {
			let config = {};

			beforeEach(() => (config = {}));

			afterEach(() => (() => {
				for (const textFrom of Object.keys(tests || {})) {
					const textTo = tests[textFrom];
					const text = osekkai(textFrom)
						.convert('alphabetMargin', config)
						.format('object');
					expect(text).to.eql(textTo);
				}
			})());

			it('should insert margins before and after the latin words inside Japanese text', () => (tests = {
				横浜DeNAベイスターズ: [
					{
						type: 'plain',
						text: '横浜',
					},
					{
						type: 'margin',
						text: '',
						original: '',
						length: 1 / 4,
					},
					{
						type: 'plain',
						text: 'DeNA',
					},
					{
						type: 'margin',
						text: '',
						original: '',
						length: 1 / 4,
					},
					{
						type: 'plain',
						text: 'ベイスターズ',
					},
				],
			}));
		});

		describe('Quotations', () => {
			let config = {};

			beforeEach(() => {
				config = {};
				(tests = {});
			});

			afterEach(() => (() => {
				for (const textFrom of Object.keys(tests || {})) {
					const textTo = tests[textFrom];
					const text = osekkai(textFrom)
						.convert('quotations', config)
						.format('object');
					expect(text).to.eql(textTo);
				}
			})());

			it('should convert kind of double quotations around Japanese text into double minutes', () => (tests = {
				'"蠍火"': [
					{
						type: 'alter',
						text: '〝',
						original: '"',
					},
					{
						type: 'plain',
						text: '蠍火',
					},
					{
						type: 'alter',
						text: '〟',
						original: '"',
					},
				],

				'“文学少女”シリーズ': [
					{
						type: 'alter',
						text: '〝',
						original: '“',
					},
					{
						type: 'plain',
						text: '文学少女',
					},
					{
						type: 'alter',
						text: '〟',
						original: '”',
					},
					{
						type: 'plain',
						text: 'シリーズ',
					},
				],

				'ワルツ第17番ト短調”大犬のワルツ”': [
					{
						type: 'plain',
						text: 'ワルツ第17番ト短調',
					},
					{
						type: 'alter',
						text: '〝',
						original: '”',
					},
					{
						type: 'plain',
						text: '大犬のワルツ',
					},
					{
						type: 'alter',
						text: '〟',
						original: '”',
					},
				],

				'"ＨＥＬＬＯ!!"': [
					{
						type: 'alter',
						text: '〝',
						original: '"',
					},
					{
						type: 'plain',
						text: 'ＨＥＬＬＯ!!',
					},
					{
						type: 'alter',
						text: '〟',
						original: '"',
					},
				],
			}));

			it('should not convert kind of double quotations around latin text into double minutes', () => (tests = {
				'"HELLO!!"': [
					{
						type: 'plain',
						text: '"HELLO!!"',
					},
				],

				'Don\'t say “lazy”': [
					{
						type: 'plain',
						text: 'Don\'t say “lazy”',
					},
				],
			}));

			it('should not convert double quotations that encloses one character', () => (tests = {
				'"萌"': [
					{
						type: 'plain',
						text: '"萌"',
					},
				],

				'あ”あ”あ”あ”あ”あ”っー': [
					{
						type: 'plain',
						text: 'あ”あ”あ”あ”あ”あ”っー',
					},
				],
			}));

			it('should not convert double quotations not paired', () => (tests = {
				'あ”ーーーーーーーっ': [
					{
						type: 'plain',
						text: 'あ”ーーーーーーーっ',
					},
				],
			}));
		});

		describe('Converters Chain', () => it('should be able to chain some converters', () => {
			const result = osekkai('"なんだと！？"')
				.convert('exclamations')
				.convert('quotations')
				.format('object');

			expect(result).to.eql([
				{
					type: 'alter',
					text: '〝',
					original: '"',
				},
				{
					type: 'plain',
					text: 'なんだと',
				},
				{
					type: 'upright',
					text: '!?',
					original: '！？',
				},
				{
					type: 'alter',
					text: '〟',
					original: '"',
				},
			]);
		}));
	});

	describe('Formatters', () => {
		describe('plain', () => {
			afterEach(() => (() => {
				for (const textFrom of Object.keys(tests || {})) {
					const textTo = tests[textFrom];
					const text = osekkai(textFrom).format('plain');
					expect(text).to.be.a('string');
					expect(text).to.eql(textTo);
				}
			})());

			it('converts texts as is', () => (tests = {
				日本語: '日本語',
				お節介: 'お節介',
			}));
		});

		describe('aozora', () => {
			afterEach(() => (() => {
				for (const textFrom of Object.keys(tests || {})) {
					const textTo = tests[textFrom];
					const text = osekkai(textFrom, {converters: {exclamations: true}}).format('aozora');
					expect(text).to.be.a('string');
					expect(text).to.eql(textTo);
				}
			})());

			it('converts plain texts as is', () => (tests = {
				日本語: '日本語',
				お節介: 'お節介',
			}));

			it('converts upright text into ［＃縦中横］', () => (tests = {'しんけん!!': 'しんけん［＃縦中横］!!［＃縦中横終わり］'}));

			it('should convert single upright text into zenkaku string', () => (tests = {'ハヤテのごとく!': 'ハヤテのごとく！'}));

			it('should insert fullwidth ideographic space after exclamations', () => (tests = {
				'侵略!イカ娘': '侵略！　イカ娘',
				'侵略!?イカ娘': '侵略［＃縦中横］!?［＃縦中横終わり］　イカ娘',
			}));

			it('should insert halfwidth space after alphabets', () => {
				const text = osekkai('The麻雀')
					.convert('alphabetMargin')
					.format('aozora');
				expect(text).to.eql('The 麻雀');
			});

			it('should convert altered token into corresponding text', () => {
				const text = osekkai('"文学少女"')
					.convert('quotations')
					.format('aozora');
				expect(text).to.eql('〝文学少女〟');
			});

			it('should escape special characters into entities', () => {
				const text = osekkai('《えっ!?》')
					.convert('exclamations')
					.format('aozora');
				expect(text).to.eql('\
※［＃始め二重山括弧、1-1-52］\
えっ［＃縦中横］!?［＃縦中横終わり］\
※［＃終わり二重山括弧、1-1-53］\
');
			});

			it('should be customizable of custom entities', () => {
				const text = osekkai('<ruby>').format('aozora', {
					entities: {
						'<': '&lt;',
						'>': '&gt;',
					},
				});
				expect(text).to.eql('&lt;ruby&gt;');
			});
		});
	});
});
