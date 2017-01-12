# Helios's WordPress Boilerplate

A quick starting point for WordPress themes built from scratch.

**Note:** This theme has been refactored to include the entire directory structure.


## Getting Started (Local)

1. Clone this repository into a new project directory: `$ git clone git@github.com:heliosdesign/helios-wp-boilerplate.git [project-name]`
2. Jump into the directory and delete the `.git` directory (unless you want to work on this boilerplate). You can now create a new repo if you want to.
3. Download WordPress from [wordpress.org](https://wordpress.org).
4. Add all the WordPress files &mdash; except for the `wp-content` directory &mdash; to the root of the project. Add any of the plugins or themes that you want to their respective directories in `wp-content`.
5. Run `$ npm install` to get the tooling dependencies.
6. If you change the name of your theme, child theme or base plugin (as you should), make sure you adjust the appropriate path in the `chdirs` object at the top of `gulpfile.js`.
7. Change the meta information at the top of `src/sass/global/_template-header.sass` in the theme directory.
8. Run `$ gulp` to recompile the CSS with the new template information and to make sure Gulp is running without errors.
9. Create your database and run the WordPress install by navigating to the URL and following the directions.


## Additional Configuration

*Note: This secton is moot right now. The only thing we were using the `DEV_ENV` flag for was unminified JavaScripts. Right now we're compiling to the same file (`bundle.min.js`). Just use `gulp build` before you deploy to make sure the JS is minified.*

We're using an extra bit of trickery to load in asset files depending on the environment. The enqueueing function (found in `base-theme/inc/functions/enqueue-functions.php`) looks to see if a `DEV_ENV` flag is set to `true`. If so, it spits out all the individual, non-minified  files defined in that block. As such, open the `/wp-config.php` file and add `define('DEV_ENV', true);` after the `WP_DEBUG` line close to bottom of the file.


## Before You Begin

There are some more things you may want to tweak/configure/delete.

### Template Information

Make sure to update the meta data that gets placed at the top of `style.css`. This can be found in `src/sass/global/_template-header.sass` in the base theme or child theme.

### Child Themes

This project has an example child theme included. If you do not want to use a child theme, just delete the whole folder. If you are planning to use it, have a look in the `src/sass/styles.sass` file to see how the style system works. Similarly, there are instructions in the `functions.php` file. See the **Gulp Tasks** section for information on how to run tasks for a child theme as opposed to the base theme.

### Project Plugin

It has become more common (and viewed as best practice) to pull site functionality out of themes and into plugins. As such, there is a base-plugin template included in this repository.

Within that plugin is a set of classes to make adding settings panels, custom post types and meta boxes easier.


### db.php

The `db.php` file, found in the `wp-content` directory, includes some functions for updating URLs, forcing theme directories and changin the upload location.


## Gulp Tasks

Everything is done with gulp. Here is a list of useful tasks:


`gulp`
	
Compiles the sass, runs a linter and bundles the JavaScript files and watches the `src/` for changes.

`gulp build`
	
Gets the specified working directory ready for deployment. It runs and compiles the sass into minified css, and uglifies all the JS files.

`gulp build:all`

Runs `gulp build` on each of the paths in the `chdirs` object in `gulpfile.js`. More on the `chdirs` object below.


#### Options

You can run `gulp` and `gulp build` on any directory. Of course, it will only do something if that directory contains a `src/` folder.

If you will be running the command regularly (which is most likely the case), add the path in the `chdirs` object near the top of `gulpfile.js`. Once that is done you can run gulp on that directory with the `--dir` or `-d` flag.

#### Example
In `gulpfile.js`:

```
var chdirs = {
    default: './wp-content/themes/base-theme',
    child: './wp-content/themes/child-theme'    // <= Add this path.
};
```
Then run the command:

```
$ gulp build --dir child
    or
$ gulp build -d child
```
You can also use the `--path` or `-p` command to define the path specifically:

```
$ gulp build --path ./wp-content/themes/child-theme
    or
$ gulp build -p ./wp-content/themes/child-theme
```

But that might get pretty cumbersome.



## Deployment

This setup provides flexibility in how to deploy a project. Separate deploy hooks can be used to deploy each theme and custom plugin. Or you could deploy the whole wp-content directory and just get fancy with the `.gitignore` file.
