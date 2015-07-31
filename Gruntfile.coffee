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
				src: ['src/{,*/}*.coffee', 'test/{,*/}*.coffee', '!Gruntfile.coffee']
				dest: '.'
				ext: '.js'

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
			module: ['src/{,*/}*.coffee', 'test/{,*/}*.coffee', '!cli.coffee']

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

		uglify:
			dist:
				options:
					banner: '<%= banner %>'
					sourceMap: true
				src: 'dist/osekkai.js'
				dest: 'dist/osekkai.min.js'

	grunt.registerTask 'build', ['coffee', 'browserify']
	grunt.registerTask 'test', ['coffeelint:module', 'mochaTest:module', 'mocha']
	grunt.registerTask 'dist', ['build', 'test', 'copy', 'uglify']

	grunt.registerTask 'default', ['build', 'test']
