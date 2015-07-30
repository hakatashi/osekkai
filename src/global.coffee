# require() osekkai into global

# Node.js detection
if not typeof module isnt 'undefined'
	global = window

global.osekkai = require '../'
