/**
 * Gulp Configuration
 *
 * All the major configuration options for gulp tasks
 * go in this file.
 */


// The theme that most of the styles are pulled from.
// This will either be the parent theme if you are using
// a child theme or the single theme that you are using.
module.exports.baseTheme = 'base-theme';

module.exports.devDirs = {
  plugins: [
    'base-plugin'
  ],
  themes: [
    'base-theme',
    'child-theme'
  ]
};

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

