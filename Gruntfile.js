/**
 * Created by jingweirong on 16/3/14.
 */
module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                // 此处定义的banner注释将插入到输出文件的顶部
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        less: {
            development: {
                files: [{
                    expand: true,
                    cwd: './www/static/less',
                    src: ['**/*.less'],
                    dest: './www/static/css',
                    ext: '.css'
                }]
            }
        },
        watch: {
            options: {
                livereload: true
            },
            scripts: {
                files: ['./www/static/less/**/*.less'],
                tasks: ['less'],
                options: {
                    spawn: false,
                },
            },
        }

    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // 只需在命令行上输入"grunt"，就会执行default task
    //grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
    grunt.registerTask('default', ['watch']);

};