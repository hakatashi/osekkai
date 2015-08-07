module.exports = (grunt) ->
	require('load-grunt-tasks') grunt
	require('time-grunt') grunt

	grunt.initConfig
		pkg: grunt.file.readJSON 'package.json'

		banner: """
			/*!
			 * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>
			 * <%= pkg.homepage %>
			 * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>
			 * Licensed under MIT License
			 */
		"""

		coffee:
			build:
				expand: true
				cwd: '.'
				src: ['*.coffee', 'src/**/*.coffee', 'test/**/*.coffee', '!Gruntfile.coffee']
				dest: '.'
				ext: '.es6'

		babel:
			build:
				expand: true
				cwd: '.'
				src: ['*.es6', 'src/**/*.es6', 'test/**/*.es6']
				dest: '.'
				ext: '.js'

		concat:
			shebang:
				options:
					banner: '#!/usr/bin/env node\n\n'
				src: 'cli.js'
				dest: 'cli.js'

		browserify:
			build:
				options:
					banner: '<%= banner %>'
				src: 'src/global.js'
				dest: 'build/osekkai.js'

		# Lint Cafe
		coffeelint:
			options:
				no_tabs:
					level: 'ignore'
				indentation:
					level: 'ignore'
				max_line_length:
					value: 120
			module: ['src/**/*.coffee', 'test/**/*.coffee', '!cli.coffee']

		# Server side mocha test
		mochaTest:
			module:
				options:
					reporter: 'spec'
				src: ['test/index.js']

		# Client side mocha test
		mocha:
			test:
				options:
					reporter: 'Spec'
					run: true
				src: ['test/index.html']

		copy:
			dist:
				expand: true
				cwd: 'build/'
				src: '*'
				dest: 'dist/'
				filter: 'isFile'

		execute:
			orientations:
				src: 'src/util/data/orientations.js'
				dest: 'src/util/data/orientations.json'
			widths:
				src: 'src/util/data/widths.js'
				dest: 'src/util/data/widths.json'
			unicodeData:
				src: 'src/util/data/unicode-data.js'
				dest: 'src/util/data/decompositions.json'

		uglify:
			dist:
				options:
					banner: '<%= banner %>'
					sourceMap: true
				src: 'dist/osekkai.js'
				dest: 'dist/osekkai.min.js'

	# hack to make grunt-contrib-concat NOT insert CRLF on Windows:
	# https://github.com/gruntjs/grunt-contrib-concat/issues/105
	grunt.util.linefeed = '\n'

	grunt.registerTask 'build', ['newer:coffee', 'newer:babel', 'concat:shebang', 'newer:execute', 'browserify']
	grunt.registerTask 'test', ['coffeelint:module', 'mochaTest:module', 'mocha']
	grunt.registerTask 'dist', ['build', 'test', 'copy', 'uglify']

	grunt.registerTask 'default', ['build', 'test']
