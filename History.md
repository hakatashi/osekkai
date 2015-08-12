0.2.3
-----

* Small bugfix about upright token
* Export ES5 shim for IE8 along with core.js
* (Alphabet Margin Converter is coming. Hang tight!)

0.2.2
-----

* Small bugfix on converter chaining

0.2.1
-----

* Core
	* Fixed bug on chaining converters
* Converters
	* Fixed bug on exclamations converter
* Formatters
	* Fixed bug on aozora formatter

0.2.0
-----

* Core
	* Add ability to pack multiple chunks together
	* Removed Token.prototype.before()
* Converters
	* New Alphabet-Upright converter is supported
	* New Quotations converter is supported
	* Exclamations converter and Numbers converter can convert each char in long matches into upright

0.1.0
-----

* Core
	* More logic and strong text processing by Chunk is introduced!
	* Continuous quality improvement thanks to [Coveralls](https://coveralls.io/)
	* Browser package size improvement
* Converters
	* Insert margin after exclamations
	* More precise upright-or-plain decision with East Asian Width database
	* Numbers converter is implemented
* Formatters
	* Aozora formatter describes single upright text without ［＃縦中横］

0.0.6
-----

CLI won't work on 0.0.5. Fixed.

0.0.5
-----

Fix small bug.

0.0.4
-----

CLI won't work on 0.0.3. Fixed.

0.0.3
-----

* Improve test quality
* converter.exclamations has length limit now

0.0.2
-----

Small CLI fix

0.0.1
-----

First acceptable beta release (only for node now)
