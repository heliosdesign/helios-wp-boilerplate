/**
 * Gulp Configuration
 *
 * All the major configuration options for gulp tasks.
 */

// The root directory where the themes and plugin folders
// are found. This will likely not need to be changed.
module.exports.baseDir = './wp-content';

// Where the project templates are located. This probably
// won't need to be changed.
module.exports.templateDir = './templates';

// Projects
//
// This does a lot of heavy lifting. Make sure the data here is accurate.
// 1. The project id (required). This must match the directory name of that theme or plugin.
// 2. The theme name. Show up in the admin dashboard.
// 3. The theme description. Also appears in the theme meta.
// 4. Version number. Update this to bust caches for CSS and JS files as well.
// 5. The project type (required). Will be 'theme' or 'plugin' unless you've got something crazy going on.
// 6. Parent ID (require for child themes). The id of the parent theme (ie. 1).
module.exports.projects = [
  // Themes
  {
    id: 'base-theme', // 1
    name: 'Helios WP Boilerplate', // 2
    description: 'A quick starting point for WordPress themes built from scratch.', // 3
    version: '0.0.0', // 4
    type: 'theme' // 5
  },
  {
    id: 'child-theme',
    name: 'Helios WP Boilerplate (Child Theme)',
    description: 'A quick starting point for WordPress child themes.',
    parent: 'base-theme', // 6
    version: '0.0.0',
    type: 'theme'
  },

  // Plugins
  {
    id: 'base-plugin',
    type: 'plugin'
  }
];