/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const child_process = require('child_process');

module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		banner: `\
/*!
 * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>
 * <%= pkg.homepage %>
 * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>
 * Licensed under MIT License
 */\
`,

		concat: {
			shebang: {
				options: {
					banner: '#!/usr/bin/env node\n\n',
				},
				src: '_cli.js',
				dest: 'cli.js',
			},
		},

		browserify: {
			build: {
				options: {
					banner: '<%= banner %>',
				},
				src: 'src/global.js',
				dest: 'build/osekkai.js',
			},
		},

		copy: {
			dist: {
				expand: true,
				cwd: 'build/',
				src: '*',
				dest: 'dist/',
				filter: 'isFile',
			},
		},

		execute: {
			orientations: {
				src: 'src/util/data/orientations.js',
				dest: 'src/util/data/orientations.json',
			},
			widths: {
				src: 'src/util/data/widths.js',
				dest: 'src/util/data/widths.json',
			},
			unicodeData: {
				src: 'src/util/data/unicode-data.js',
				dest: 'src/util/data/decompositions.json',
			},
		},

		uglify: {
			dist: {
				options: {
					banner: '<%= banner %>',
					sourceMap: true,
				},
				src: 'dist/osekkai.js',
				dest: 'dist/osekkai.min.js',
			},
		},

		clean: {
			build: ['build/*'],
		},
	});

	// hack to make grunt-contrib-concat NOT insert CRLF on Windows:
	// https://github.com/gruntjs/grunt-contrib-concat/issues/105
	grunt.util.linefeed = '\n';

	grunt.registerMultiTask('execute', function() {
		const done = this.async();
		return child_process.exec(`node \"${this.filesSrc[0]}\"`, done);
	});

	grunt.registerTask('build', ['concat:shebang', 'newer:execute', 'browserify']);
	grunt.registerTask('dist', ['build', 'copy', 'uglify']);

	return grunt.registerTask('default', ['build']);
};
