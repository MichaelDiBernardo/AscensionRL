module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
          'lib/rot.min.js',
          'lib/sprintf.min.js',
          'src/utils.js',
          'src/constants.js',
          'src/arlrandom.js',
          'src/roll.js',
          'src/game.js',
          'src/mixins.js',
          'src/repository.js',
          'src/messagerouter.js',
          'src/glyph.js',
          'src/stats.js',
          'src/skills.js',
          'src/sheet.js',
          'src/items.js',
          'src/wearables.js',
          'src/inventory.js',
          'src/equipment.js',
          'src/entity.js',
          'src/dudes.js',
          'src/tile.js',
          'src/level.js',
          'src/loaders.js',
          'src/screens.js',
          'src/main.js'
        ],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    qunit: {
      files: ['test.html']
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'qunit']
    },
    copy: {
      main: {
        files: [
            {src: 'index-dev.html', dest: 'index.html'},
            {src: 'index-dist-html', dest: 'dist/index.html'},
            {cwd: 'lib/screens/', src: '*', dest: 'dist/lib/screens/', expand: true}
          ]
      },
    },
    asset_cachebuster: {
      options: {
        buster: Date.now(),
        htmlExtension: 'html'
      },
      default: {
        files: {
          'index.html': ['index-dev.html'],
          'dist/index.html': ['index-dist.html'],
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-asset-cachebuster');

  grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask('build', ['concat', 'uglify', 'copy', 'asset_cachebuster']);

  grunt.registerTask('default', ['jshint', 'qunit', 'concat', 'uglify', 'copy', 'asset_cachebuster']);

};
