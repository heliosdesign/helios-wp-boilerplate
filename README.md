# Helios's WordPress Boilerplate

A quick starting point for WordPress projects.

**Note:** This theme has been refactored to include the entire directory structure.

**Note:** This boilerplate has been refactord _again_ to include WordPress core.

Current WordPress Version: `5.1.1`

## Getting Started (Local)

1. Clone this repository into a new project directory: `$ git clone git@github.com:heliosdesign/helios-wp-boilerplate.git [project-name]`.
2. Jump into the directory and delete the `.git` directory (unless you want to work on this boilerplate). You can now create a new repo if you want to.
3. Run `$ npm install` or `$ yarn install` to get the tooling dependencies.
4. Update "project" information in `gulpconfig.js`.
5. Run `$ gulp create` to create all the new projects defined in `gulpconfig.js`.
6. Create your database.
7. Copy the `wp-config-local-sample.php` to `wp-config-local.php` and put the database credentials in the latter. You should also set the home URL in this config file if needed.
8. Run the WordPress install by navigating to the URL and following the directions.

We use the `--recursive` flag so that submodules also get initialized. Current submodule list:

- wp-admin-classes: [https://github.com/dansundy/wp-admin-classes](https://github.com/dansundy/wp-admin-classes)

## Before You Begin

There are some more things you will want to tweak/configure/delete.

### Gulp Config

Whenever you add, delete, or change the name of a plugin or theme you should update the `gulpconfig.js` file. This tells gulp all the information about that "project" and also sets the information for themes.

This is also how you can create new projects. Just add a node with the correct info and then run `$ gulp create --proj [project-id]`. More info in the Gulp Tasks section.

The `gulpconfig.js` file is fully commented so you may find answers there if you have any questions.

### Child Themes

If you have created a child theme, have a look in the `src/sass/styles.sass` file to see how the style system works. Similarly, there are instructions in the `functions.php` file. See the **Gulp Tasks** section for information on how to run tasks for a child theme as opposed to the base theme.

### Project Plugin

It has become more common (and viewed as best practice) to pull site functionality out of themes and into plugins. As such, there is a plugin template included in this repository.

Within that plugin is a set of classes to make adding settings panels, custom post types and meta boxes easier.

### db.php

The `db.php` file, found in the `wp-content` directory, includes some functions for updating URLs, forcing theme directories and changing the upload location.

### Security

There is an example `htaccess.txt` file that includes recommended security settings. Rename this file `.htaccess` and then save permalinks in your WordPress dashboard to instantiate apache routing.

There is a second `.htaccess` file in the `uploads/` directory that is preventing `.php` scripts from executing in the uploads directory. As per [the codex](https://codex.wordpress.org/Hardening_WordPress#WP-Content.2FUploads), this can break the theme if it requires PHP execution in `uploads/`. Remove or comment this out if that is the case.

## Gulp Tasks

Everything is done with gulp.

`gulp`
Compiles the sass, runs a linter and bundles the JavaScript files and watches the `src/` for changes.

`gulp create`

Reads the `gulpconfig.js` file and creates new projects based on the info provided. This task will not overwrite existing folders it checks and exits before moving any files. Use the `--proj`, `-p` flag to specify a single project to create. The `--type`, `-t` flags won't do anything for this task.

`gulp build`
Gets the specified working directory ready for deployment. It runs and compiles the sass into minified css, and uglifies all the JS files.

### Other Tasks

`gulp styles`: Compile SASS in `src/sass/`.

_Note: If the file is called `style.sass` it will be compiled to `/style.css`. Any other compilable sass file will end up in the `/css/` directory._

`gulp scripts`: Bundle the JavaScripts in `src/js/`.

`gulp lint`: Use ESLint to make sure there are no JS errors.

`gulp imagemin`: Minify all the images in `src/assets/img/`.

`gulp svgmin`: Optimize svgs in `src/assets/svg/`.

`gulp info`: Creates a SASS variable file that provides meta data about the theme.

`gulp buildProject`: Reads the `gulpconfig.js` file and copies relevant templates to the proper directory.

_Note: Use `gulp create` instead of this so that info variables are also set up)._

All tasks are run on all projects defined in the `gulpconfig.js` file unless an option is used to specify which directory to use.

### Gulp Task Options

##### --project, --proj, -p [project-id]

Run any task on a specific "project" (theme or plugin). If left out the task will be run on all themes or plugins defined in the config file.

```
$ gulp build --proj base-plugin
// Will only build the base-plugin project.
```

##### --type, -t [project-type]

Run any task on all projects with a specific type.

```
$ gulp --type theme
// Builds and watches all registered projects with the type 'theme'.
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
$gulp build -d --proj base-theme
// Build the base theme but don't minify styles or scripts.
```

## Deployment

This setup provides flexibility in how to deploy a project. Separate deploy hooks can be used to deploy each theme and custom plugin. Or you could deploy the whole wp-content directory and just get fancy with the `.gitignore` file.

## Known Issues

Occasionally gulp throws an error that looks like this:

```
(FSEvents.framework) FSEventStreamFlushSync(): failed assertion '(SInt64)last_id > 0LL'
```

I don't think it actually affects anything, but I usually re-run most recent task and it goes away.
