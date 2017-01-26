/**
 * Gulp Configuration
 *
 * All the major configuration options for gulp tasks
 * go in this file.
 */

module.exports.plugins = [
  {id: 'base-plugin'}
];

module.exports.projects = [
  // Themes
  {
    id: 'base-theme',
    name: 'Helios WP Boilerplate',
    description: 'A quick starting point for WordPress themes built from scratch.',
    version: '0.0.0',
    type: 'theme'
  },
  {
    id: 'child-theme',
    name: 'Helios WP Boilerplate (Child Theme)',
    description: 'A quick starting point for WordPress child themes.',
    parent: 'base-theme',
    version: '0.0.0',
    type: 'theme'
  },

  // Plugins
  {
    id: 'base-plugin',
    type: 'plugin'
  }
];

// Development Directories are individual project or theme (or other)
// directories. For example 'base-plugin' and 'child-theme'.
// module.exports.projects = {
//   plugins: module.exports.plugins,
//   themes: module.exports.themes
// };

// The root directory where the themes and plugin folders
// are found. This will likely not need to be changed.
module.exports.baseDir = './wp-content';

// Directories in the rootDir that will be watched by Gulp.
// This will probably not be changed. 
//
// If you do want to add another directory for whatever reason 
// you will need to also create a correlating whitelist. 
// E.g. If you want to watch the directory ./wp-content/uploads 
// you'll have to add uploads: ['whatever-dir', 'another-dir'] 
// to the devDirs object.
module.exports.watchDirs = [
  'plugins',
  'themes'
];

