
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
  var cssFiles = [
            'app/base.css',
            'app/bower_components/ng-image-gallery/dist/ng-image-gallery.min.css'
          ];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    cssmin: {
      options: {
         banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
      },
      target: {
        files: {
          'app/base.min.css': [
            'app/base.css', 
            /*'app/bower_components/html5-boilerplate/dist/css/normalize.css', 
            'app/bower_components/html5-boilerplate/dist/css/main.css', 
            'app/bower_components/ng-image-gallery/dist/ng-image-gallery.min.css'*/
          ]
        }
      },
      inline: {
        files: {
          'app/inline.min.css': [
            'app/bower_components/html5-boilerplate/dist/css/normalize.css', 
            'app/bower_components/html5-boilerplate/dist/css/main.css'
          ]
        }
      }
    },
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
      options: {
        livereload: {
        host: 'localhost',
        port: 8000,
        key: grunt.file.read('path/to/ssl.key'),
        cert: grunt.file.read('path/to/ssl.crt')
        // you can pass in any other options you'd like to the https server, as listed here: http://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener
      }
      },
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
    },
    imagemin: {                          // Task
      dynamic: {                         // Another target
        files: [{
          expand: true,                  // Enable dynamic expansion
          cwd: 'app/img/',                   // Src matches are relative to this path
          src: ['**/*.{png,jpg}'],   // Actual patterns to match
          dest: 'app/distImg/'                  // Destination path prefix
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-ng-annotate'); 
  grunt.loadNpmTasks('grunt-contrib-imagemin');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('images', ['imagemin']);

  grunt.registerTask('default', ['jshint', 'ngAnnotate', 'concat', 'uglify', 'cssmin']);

};
