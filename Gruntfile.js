/*
 * js-data
 * http://github.com/jmdobry/js-data
 *
 * Copyright (c) 2014 Jason Dobry <http://jmdobry.github.io/js-data>
 * Licensed under the MIT license. <https://github.com/jmdobry/js-data/blob/master/LICENSE>
 */
module.exports = function (grunt) {
  'use strict';

  require('jit-grunt')(grunt, {
    coveralls: 'grunt-karma-coveralls',
    instrument: 'grunt-istanbul',
    storeCoverage: 'grunt-istanbul',
    makeReport: 'grunt-istanbul'
  });
  require('time-grunt')(grunt);

  var pkg = grunt.file.readJSON('package.json');

  // Project configuration.
  grunt.initConfig({
    pkg: pkg,
    clean: {
      coverage: ['coverage/'],
      dist: ['dist/']
    },
    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js', 'test/*.js'],
      jshintrc: '.jshintrc'
    },
    watch: {
      dist: {
        files: ['src/**/*.js'],
        tasks: ['build']
      },
      n: {
        files: ['src/**/*.js', 'test/both/**/*.js', 'test/node/**/*.js'],
        tasks: ['n']
      }
    },
    uglify: {
      main: {
        options: {
          banner: '/**\n' +
            '* @author Jason Dobry <jason.dobry@gmail.com>\n' +
            '* @file js-data.min.js\n' +
            '* @version <%= pkg.version %> - Homepage <http://www.js-data.io/>\n' +
            '* @copyright (c) 2014 Jason Dobry\n' +
            '* @license MIT <https://github.com/js-data/js-data/blob/master/LICENSE>\n' +
            '*\n' +
            '* @overview Data store.\n' +
            '*/\n'
        },
        files: {
          'dist/js-data.min.js': ['dist/js-data.js']
        }
      }
    },
    browserify: {
      options: {
        browserifyOptions: {
          standalone: 'JSData'
        }
      },
      dist: {
        files: {
          'dist/js-data.js': ['src/index.js']
        }
      }
    },
    karma: {
      options: {
        configFile: './karma.conf.js'
      },
      dev: {
        browsers: ['Chrome'],
        autoWatch: true,
        singleRun: false,
        reporters: ['spec'],
        preprocessors: {}
      },
      min: {
        browsers: ['Firefox'],
        options: {
          files: [
            'dist/js-data.min.js',
            'bower_components/js-data-http/dist/js-data-http.min.js',
            'bower_components/js-data-localstorage/dist/js-data-localstorage.min.js',
            'karma.start.js',
            'test/both/**/*.js',
            'test/browser/**/*.js'
          ]
        }
      },
      ci: {
        browsers: ['Firefox']
      }
    },
    coveralls: {
      options: {
        coverage_dir: 'coverage'
      }
    },
    mochaTest: {
      all: {
        options: {
          reporter: 'spec'
        },
        src: ['mocha.start.js', 'test/both/**/*.js', 'test/node/**/*.js']
      }
    }
  });

  grunt.registerTask('version', function (filePath) {
    var file = grunt.file.read(filePath);

    file = file.replace(/<%= pkg\.version %>/gi, pkg.version);

    grunt.file.write(filePath, file);
  });

  grunt.registerTask('banner', function () {
    var file = grunt.file.read('dist/js-data.js');

    var banner = '/**\n' +
      '* @author Jason Dobry <jason.dobry@gmail.com>\n' +
      '* @file js-data.js\n' +
      '* @version ' + pkg.version + ' - Homepage <http://www.js-data.io/>\n' +
      '* @copyright (c) 2014 Jason Dobry \n' +
      '* @license MIT <https://github.com/js-data/js-data/blob/master/LICENSE>\n' +
      '*\n' +
      '* @overview Data store.\n' +
      '*/\n';

    file = banner + file;

    grunt.file.write('dist/js-data.js', file);
  });

  grunt.registerTask('n', ['mochaTest']);
  grunt.registerTask('b', ['karma:ci', 'karma:min']);
  grunt.registerTask('w', ['n', 'watch:n']);

  grunt.registerTask('test', ['build', 'n', 'b']);
  grunt.registerTask('build', [
    'clean',
    'jshint',
    'browserify',
    'banner',
    'uglify:main'
  ]);
  grunt.registerTask('go', ['build', 'watch:dist']);
  grunt.registerTask('default', ['build']);
};
