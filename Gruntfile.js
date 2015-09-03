module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		'uglify': {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: 'dist/multi-event.js',
				dest: 'dist/multi-event.min.js'
			}
		},
		'babel': {
			// options: {
			// 	sourceMap: true
			// },
			dist: {
				files: {
					'dist/multi-event.js': 'src/multi-event-es6.js'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['babel', 'uglify']);

};
