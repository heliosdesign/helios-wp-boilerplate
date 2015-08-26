# Helios's WordPress Boilerplate

A quick starting point for WordPress themes built from scratch.

**Note:** This theme has been refactored to include the entire directory structure. This means that the "Getting Started" is slightly different.

## Getting Started (Local)

1. Clone this repository into a new project directory: `$ git clone git@github.com:heliosdesign/helios-wp-boilerplate.git [project-name]`
2. Jump into the directory and delete the `.git` directory (unless you want to work on this boilerplate). You can now create a new repo if you want.
3. Download WordPress from [wordpress.org/download](https://wordpress.org/download).
4. Add the WordPress files to the root of the directory. Some of the directory tree will already be there (`wp-content/plugins`, `wp-content/themes`) so just add the missing files to those directories instead of overwriting the whole thing.
5. Run `$ npm install` to get the dependencies for gulp.
6. Create your database and run the install.


## Additional Configuration

We're using an extra bit of trickery to load in asset files depending on the environment. The enqueueing function (found in `base-theme/inc/functions/enqueue-functions.php`) looks to see if a `DEV_ENV` flag is set to `true`. If so, it spits out all the individual, non-minified  files defined in that block. As such, open the `/wp-config.php` file and add `define('DEV_ENV', true);` after the `WP_DEBUG` line (usually found at line 80).

## Before You Begin

## Usage Notes

Create a new WordPress build and navigate to the themes directory (`project-root/wp-content/themes`).

All the styles, scripts and assets should be manipulated in the `src` folder. They will get compiled via Gulp to their final locations.

Make sure you update the theme meta data that gets placed at the top of `style.css`. It can be found in `src/sass/global/_template_header.sass`.


## Gulp Tasks

### Watch

Watches for changes in the `src` folder and runs the appropriate tasks and live reloads the browser.

	gulp watch
	

### Build

Builds all the images, scripts and styles from the `src` folder and publishes a deploy-ready `dist` directory.

	gulp build

## More Gulp Commands

* `gulp styles`: Updates and compiles SASS.
* `gulp scripts`: Concatenates, minifies and compiles the JavaScript.
