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
	# core.js is missing various shims such as String.prototype.split, which fails in old IEs
	require 'es5-shim'

global.osekkai = require '../'
