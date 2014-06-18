# Helios's WordPress Boilerplate

A quick starting point for WordPress themes built from scratch.


## Usage Notes

Create a new WordPress build and navigate to the themes directory (`project-root/wp-content/themes`).

Clone the boilerplate:

	$ git clone git@github.com:heliosdesign/helios-wp-boilerplate.git [new-theme-name]
	
Jump into the directory and delete the existing git info:

	$ cd [new-theme-name]
	
	$ rm -rf .git
	
You can now create a new repo if you want.

Run `npm install` to ensure you have the necessary node modules.

We are using [Gulp](http://gulpjs.com) here for task management.

All the styles, scripts and assets should be manipulated in the `src` folder. They will get compiled via Gulp to their final locations.

Make sure you update the theme meta data that gets placed at the top of `style.css`. It can be found in `src/sass/global/_template_header.sass`.


## Gulp Tasks

### Watch

Watches for changes in the `src` folder and runs the appropriate tasks and live reloads the browser.

	gulp watch
	

### Build

Builds all the images, scripts and styles from the `src` folder into the proper spots in the root folder.

	gulp build

## More Gulp Commands

* `gulp styles`: Updates and compiles SASS.
* `gulp scripts`: Concatenates, minifies and compiles the JavaScript.
