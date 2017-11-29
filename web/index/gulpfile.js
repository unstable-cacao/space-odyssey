var gulp	= require('gulp');
var wrap 	= require('gulp-wrap');
var rename	= require('gulp-rename');
var concat 	= require('gulp-concat');


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
				root.Space.App
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
	}
};


gulp.task('build-namespace', Build.buildNamespace);
gulp.task('build-js', [ 'build-namespace' ], Build.buildJs);
gulp.task('build', [ 'build-js' ]);