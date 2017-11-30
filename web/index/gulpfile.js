var gulp		= require('gulp');
var wrap 		= require('gulp-wrap');
var rename		= require('gulp-rename');
var concat 		= require('gulp-concat');
var declare 	= require('gulp-declare');
var handlebars 	= require('gulp-handlebars');


const TEMP_BUILD_DIRECTORY	= 'src/build/tmp';
const NAMESPACE_TEMPLATE	= 'src/build/templates/namespace.wrap.js.template';


const DIST_DIRECTORY			= __dirname + '/public';

const NAMESPACE_JS_BUILD_NAME	= 'namespace.js';
const JS_BUILD_NAME				= 'app.js';
const JS_DIST_BUILD_NAME		= DIST_DIRECTORY + '/' + JS_BUILD_NAME;


const FILES = {
	namespace:	['node_modules/oktopost-namespace/src/Namespace.js'],
	js:			['src/build/tmp/namespace.js'].concat(getDependencies()),
	jsProd:		[ JS_DIST_BUILD_NAME ]
};


function getDependencies()
{
	return require('oktopost-namespace').getDependencies(
		__dirname,
		function () {},
		function (root)
		{
			var load = [
				root.Space.Boot
			];
		});
}


const Build = {
	buildNamespace: function ()
	{
		gulp.src(FILES.namespace)
			.pipe(wrap({src: NAMESPACE_TEMPLATE}))
			.pipe(rename(NAMESPACE_JS_BUILD_NAME))
			.pipe(gulp.dest(TEMP_BUILD_DIRECTORY));
	},
	
	buildJs: function ()
	{
		gulp.src(FILES.js)
			.pipe(concat(JS_BUILD_NAME))
			.pipe(gulp.dest(DIST_DIRECTORY));
	},

    buildLibs: function ()
    {
        gulp.src(
        	[
        		'node_modules/handlebars/dist/handlebars.runtime.min.js',
        		'node_modules/jquery/dist/jquery.js'
			])
			.pipe(gulp.dest(DIST_DIRECTORY));
    },
	
	buildViews: function ()
	{
		gulp.src(['src/view/Templates/**/*'])
			.pipe(handlebars())
			.pipe(wrap('Handlebars.template(<%= contents %>)'))
			.pipe(declare({
				namespace: 'Handlebars.template',
				noRedeclare: true,
				processName: function (filePath) {
					return declare.processNameByPath(filePath.replace('src/view/Templates', ''));
				}
			}))
			.pipe(concat('space.templates.js'))
			.pipe(gulp.dest(DIST_DIRECTORY));
	
		gulp.src(['src/view/Partials/**/*'])
			.pipe(handlebars())
			.pipe(wrap('Handlebars.registerPartial(<%= processPartialName(file.relative) %>, Handlebars.template(<%= contents %>));', {}, {
				imports: {
					processPartialName: function (fileName) {
						return JSON.stringify(fileName.replace('.hbs.js', ''));
					}
				}
			}))
			.pipe(concat('space.partials.js'))
			.pipe(gulp.dest(DIST_DIRECTORY));
		
		gulp.src(['src/view/Helpers/**/*'])
			.pipe(concat('space.helpers.js'))
			.pipe(gulp.dest(DIST_DIRECTORY));
	}
};


gulp.task('build-namespace', Build.buildNamespace);
gulp.task('build-libs', Build.buildLibs);
gulp.task('build-views', Build.buildViews);
gulp.task('build-js', [ 'build-libs', 'build-views', 'build-namespace' ], Build.buildJs);
gulp.task('build', [ 'build-js' ]);