# Helios's WordPress Boilerplate

A quick starting point for WordPress projects.

**Note:** This theme has been refactored to include the entire directory structure.

**Note:** This boilerplate has been refactord *again* to include WordPress core.

Current WordPress Version: `4.7.1`


## Getting Started (Local)

1. Clone this repository into a new project directory: `$ git clone git@github.com:heliosdesign/helios-wp-boilerplate.git [project-name]`
2. Jump into the directory and delete the `.git` directory (unless you want to work on this boilerplate). You can now create a new repo if you want to.
3. Run `$ npm install` to get the tooling dependencies.
4. If you change the name of your theme, child theme or base plugin (as you should), make sure you adjust `gulpconfig.js`.
5. Change the meta information at the top of `src/sass/global/_template-header.sass` in the theme directory.
6. Run `$ gulp` to recompile the CSS with the new template information and to make sure Gulp is running without errors.
7. Create your database and run the WordPress install by navigating to the URL and following the directions.


## Additional Configuration

*Note: This secton is moot at the moment. The only thing we were using the `DEV_ENV` flag for was unminified JavaScripts. Right now we're compiling to the same file (`file.bundle.js`). Just use `gulp build` before you deploy to make sure the JS is minified.*

We're using an extra bit of trickery to load in asset files depending on the environment. The enqueueing function (found in `base-theme/inc/functions/enqueue-functions.php`) looks to see if a `DEV_ENV` flag is set to `true`. If so, it spits out all the individual, non-minified  files defined in that block. As such, open the `/wp-config.php` file and add `define('DEV_ENV', true);` after the `WP_DEBUG` line close to bottom of the file.


## Before You Begin

There are some more things you will want to tweak/configure/delete.

### Template Information

Make sure to update the meta data that gets placed at the top of `style.css`. This can be found in `src/sass/global/_template-header.sass` in the base theme or child theme.

The version number in the template header of the current theme in use also sets the cache busters on enqueued styles and scripts. So if you make a major change you should update the version in `_template-header.sass`.

### Gulp Config

Whenever you add, delete, or change the name of a plugin or theme you should update the `gulpconfig.js` file. This tells gulp which themes are custom and in development and which are from vendors.

### Child Themes

This project has an example child theme included. If you do not want to use a child theme, just delete the whole folder. If you are planning to use it, have a look in the `src/sass/styles.sass` file to see how the style system works. Similarly, there are instructions in the `functions.php` file. See the **Gulp Tasks** section for information on how to run tasks for a child theme as opposed to the base theme.

### Project Plugin

It has become more common (and viewed as best practice) to pull site functionality out of themes and into plugins. As such, there is a base-plugin template included in this repository.

Within that plugin is a set of classes to make adding settings panels, custom post types and meta boxes easier.


### db.php

The `db.php` file, found in the `wp-content` directory, includes some functions for updating URLs, forcing theme directories and changing the upload location.


## Gulp Tasks

Everything is done with gulp. Here is a list of useful tasks:


`gulp`
	
Compiles the sass, runs a linter and bundles the JavaScript files and watches the `src/` for changes.

`gulp build`
	
Gets the specified working directory ready for deployment. It runs and compiles the sass into minified css, and uglifies all the JS files.

### Other Tasks

`gulp styles`: Compile SASS in `src/sass/`. 

*Note: If the file is called `style.sass` it will be compiled to `/style.css`. Any other compilable sass file will end up in the `/css/` directory.* 

`gulp scripts`: Bundle the JavaScripts in `src/js/`.

`gulp lint`: Use ESLint to make sure there are no JS errors.

`gulp imagemin`: Minify all the images in `src/assets/img/`.

`gulp svgmin`: Optimize svgs in `src/assets/svg/`.



All tasks are run on all plugins and themes defined in the `gulpconfig.js` file unless an option is used to specify which directory to use.


### Gulp Task Options

##### --theme [theme-name], --plugin [plugin-name]

Run any task on a specific theme or plugin. The name is optional. If left out the task will be run on all themes or plugins defined in the config file.

```
$ gulp build --theme child-theme
// Will only build the child theme.

$ gulp imagemin --plugin
// Will minify any images in custom plugins (not in themes).
```

##### --dev, -d

Run the task in development mode (ie. don't minify scripts and styles). All tasks are run in dev mode by default except `gulp build`.

```
$ gulp build --dev
// Doesn't  minify styles and scripts.
```


##### --prod, -p

Run the task in production mode.

```
gulp watch -p
// Will minify everything while you are developing.
```

##### Combining

It's fine to combine options.

```
$gulp build -d --theme base-theme
// Build the base theme but don't minify styles or scripts.
```



## Deployment

This setup provides flexibility in how to deploy a project. Separate deploy hooks can be used to deploy each theme and custom plugin. Or you could deploy the whole wp-content directory and just get fancy with the `.gitignore` file.
