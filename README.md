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

There are some more things you may want to tweak/configure/delete.

### Template Information

Make sure to update the meta data that gets placed at the top of `style.css`. This can be found in `src/sass/global/_template-header.sass` in the base theme or child theme.

### Child Themes

This project has an example child theme included. If you do not want to use a child theme, just delete the whole folder. If you are planning to use it, have a look in the `src/sass/styles.sass` file to see how the style system works. Similarly, there are instructions in the `functions.php` file. See the **Gulp Tasks** section for information on how to run tasks for a child theme as opposed to the base theme.

### Project Plugin

It has become more common (and percieved as best practice) to pull site functionality out of themes and into plugins. As such, there is a base-plugin template included in this repository.

Within that plugin is a set of classes to make adding settings panels, custom post types and meta boxes much easier.

## Gulp Tasks

Everything is done with gulp. Here is a list of useful tasks:

	$ gulp
	
Compiles the sass, runs a jshint on the javascript files and watches for changes &mdash; all in the `base-theme` directory.

	$ gulp child
	
Does the same thing as `gulp` but instead, does it in the `child-theme` directory.

	$ gulp build
	
Gets the `base-theme` ready for deployment. It runs and compiles the sass into minified css, and uglifies all the JS files.

	$ gulp build:child
	
Same as `gulp build` except that it does it in the `child-theme` directory.

## Deployment

This setup gives us flexibility in how to deploy the project. Separate deploy hooks can be used to deploy each theme and custom plugin. Or you could deploy the whole wp-content directory and just get fancy with the `.gitignore` file.
