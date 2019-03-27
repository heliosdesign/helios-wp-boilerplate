<?php

/**
 * This config file is yours to hack on. It will work out of the box on Pantheon
 * but you may find there are a lot of neat tricks to be used here.
 *
 * See our documentation for more details:
 *
 * https://pantheon.io/docs
 */

/**
 * Local configuration information.
 *
 * If you are working in a local/desktop development environment and want to
 * keep your config separate, we recommend using a 'wp-config-local.php' file,
 * which you should also make sure you .gitignore.
 */
if (file_exists(dirname(__FILE__) . '/wp-config-local.php')):
  # IMPORTANT: ensure your local config does not include wp-settings.php
  require_once(dirname(__FILE__) . '/wp-config-local.php');

/**
 * Production environment settings. Everything you need should already be set.
 */
else:
    /**
     * This block will be executed if you have NO wp-config-local.php. 
		 * Insert alternate config here if necessary.
     *
     */
    define('DB_NAME',          'database_name');
    define('DB_USER',          'database_username');
    define('DB_PASSWORD',      'database_password');
    define('DB_HOST',          'database_host');
    define('DB_CHARSET',       'utf8');
    define('DB_COLLATE',       '');
    
    define('AUTH_KEY',         '#vs-#TpA+cSK?d|uY6]&~TFcf+ lS(`f+|q|#4B0+giiBh+EC 9kH`m[o6#S,gy(');
    define('SECURE_AUTH_KEY',  '0S:RLoz{?=ZgBpm>w!%Wc&I9q%b}nn(<R%:oe6|(=Wjg(w*DBLGy!ftIblK,0vS4');
    define('LOGGED_IN_KEY',    'y/<XbhZ(doX>~d|Qz+/<I@b%[zUX.|D+Ij&LWtL&S|^I}n%ks6-tqPKdsls5dx|E');
    define('NONCE_KEY',        ':WXxlm>j2X|z@wsnnD!,A7AE2>D(5pI$k+KE6H-qih]l:W,uvckAL,d g1)S_=X<');
    define('AUTH_SALT',        '(AHu|8-+a5[Iu 5|%D~DY|.>EvC zwA,>][{}~e;h(QTH67|4Gymta- Y^A}DHp#');
    define('SECURE_AUTH_SALT', '@((@fl90?Z&C0Jd-=jpQV:_Xbdq-lMGh*R/ 7syhBI~GLt=_iWv[z`-8TUC>Y3j-');
    define('LOGGED_IN_SALT',   'FYzCjn+Z(G-tzD@u<*+-.T}Q+>-s7~V WZmUaNQBL+8g@^=Y^KtUp .jQIJ]hqLV');
    define('NONCE_SALT',       'v#;r|2!~V4DgyEnC| .|gmvU|>3%r(Pf}8Zt~=xySBmL|OR-/Da&b&DOsUzXV~}!');
endif;

/** Standard wp-config.php stuff from here on down. **/


/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * WordPress Localized Language, defaults to English.
 *
 * Change this to localize WordPress. A corresponding MO file for the chosen
 * language must be installed to wp-content/languages. For example, install
 * de_DE.mo to wp-content/languages and set WPLANG to 'de_DE' to enable German
 * language support.
 */
define('WPLANG', '');

/**
 * For security, don't allow file editing in theme.
 */
if ( ! defined( 'DISALLOW_FILE_EDIT' ) ) {
	define('DISALLOW_FILE_EDIT', true);
}

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 */

if ( ! defined( 'WP_DEBUG' ) ) {
  define('WP_DEBUG', false);
}

/* That's all, stop editing! Happy Pressing. */




/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');