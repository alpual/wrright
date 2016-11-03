
module.exports = function(grunt) {

  var jsFiles = [
            'app/angular-pageslide-directive.js',
            'app/angular-tilehex-directive.js',
            'app/pageslideCtrl.js',
            'app/tilehexCtrl.js',
            'app/app.js', 
            'app/js/preloader.js',          
            'app/view1/view1.js',
            'app/view2/view2.js',
            'app/works/works.js',
            'app/contact/contact.js',
            'app/directives.js'        
          ];
  var minSafeFiles = [
            'app/angular-pageslide-directive.annotated.js',
            'app/angular-tilehex-directive.annotated.js',
            'app/pageslideCtrl.annotated.js',
            'app/tilehexCtrl.annotated.js',
            'app/app.annotated.js', 
            'app/js/preloader.annotated.js',          
            'app/view1/view1.annotated.js',
            'app/view2/view2.annotated.js',
            'app/works/works.annotated.js',          
            'app/contact/contact.annotated.js',
            'app/directives.annotated.js'        
          ];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: minSafeFiles,
        dest: 'app/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
        beautify: false
      },
      dist: {
        files: {
          'app/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
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
      tasks: ['jshint']
    },
    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      app: {
        files: [{
          expand: true,
          src: jsFiles,
          ext: '.annotated.js', // Dest filepaths will have this extension.
          extDot: 'last'       // Extensions in filenames begin after the last dot
        }]
    }
}
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-ng-annotate'); 

  grunt.registerTask('test', ['jshint']);

  grunt.registerTask('default', ['jshint', 'ngAnnotate', 'concat', 'uglify']);

};
