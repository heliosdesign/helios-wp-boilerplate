<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'helios-wp-boiler');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', 'root');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '#9D s3&[8-YB5TB3.$_V%/;/5_lN>:R6G)L6|/CgO?hf&JB0K1)(C2_J1EXD,?Y:');
define('SECURE_AUTH_KEY',  '+=m]eCx) hkx+A@;889RUQDm-h8mt,H=(7gQD<Pqi1>o#KXw4JK 4ArB1.$j5P7w');
define('LOGGED_IN_KEY',    '8_W-?S{*lfP%2j9v@r9KT^%7qM.<,=|k/NaWg[CpAlqKX^!=qk,/{|(|mVmm,w/q');
define('NONCE_KEY',        '<szwNdl7[};Mu8r0B:AQpn<K;+=qX^lYEcQVHgDq+4[AFey=L`&-1nw*nSbK8SOK');
define('AUTH_SALT',        'i)fdeQqfl8-~7[EAG3lhRY{l]Ago-=[/-;Rhl(IRY+ZcPEFQFC8K1D^;k=5g}A|;');
define('SECURE_AUTH_SALT', 'OB}`8YOMe=t>ksAWj-`L_J4*kcJJ+B@-tqZr`1q/|@0+n7-z?GD;^k!|{yQy1=vC');
define('LOGGED_IN_SALT',   '<hS5e+Z6JMbh2;+p`uMxC/nFr;=Yx{+<s+!8u!dN2qD<1(^0mal)fLuVJ7`))yXi');
define('NONCE_SALT',       'F|QN?S2hds>UsT*_xl_6J]jfe&+WRl1es>2>U|pK<{|H6[hS]Z1NslrI`<jcml%j');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', true);
define('DEV_ENV', true);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
