/**
 * Gulp Configuration
 *
 * All the major configuration options for gulp tasks
 * go in this directory.
 */


// The theme that most of the styles are pulled from.
// This will either be the parent theme if you are using
// a child theme or the single theme that you are using.
module.exports.basetheme = 'base-theme';

// A list of themes under development.
module.exports.themes = [
  'base-theme',
  'child-theme'
];

// A list of plugins under development.
module.exports.plugins = [
  'base-plugin'
];

// The root directory where the themes and plugin folders
// are found. This will likely not need to be changed.
module.exports.rootDir = './wp-content';

// Directories in the rootDir that will be watched by Gulp.
// This will probably not be changed. 
//
// If you do want to add another directory for whatever reason 
// you will need to also create a correlating whitelist. 
// E.g. If you want to watch the directory ./wp-content/uploads 
// you'll have to add module.exports.uploads and whitelist the 
// directoies that should be watched.
module.exports.watchDirs = [
  'plugins',
  'themes'
];