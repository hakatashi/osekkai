# require() osekkai into global

# Node.js detection
if not typeof module isnt 'undefined'
	global = window

# IE detection
isIE = ->
	myNav = navigator.userAgent.toLowerCase()

	if myNav.indexOf('msie') != -1
		parseInt myNav.split('msie')[1]
	else
		false

if isIE() and isIE() <= 8
	require 'core-js/es5'

global.osekkai = require '../'
