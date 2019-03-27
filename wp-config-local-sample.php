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

define( 'WP_SITEURL', 'http://localhost/helios-wp-boilerplate' );
define( 'WP_HOME', 'http://localhost/helios-wp-boilerplate' );

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'db_name');
/** MySQL database username */
define('DB_USER', 'db_user');
/** MySQL database password */
define('DB_PASSWORD', 'db_password');
/** MySQL hostname */
define('DB_HOST', 'localhost');
/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');
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
define('AUTH_KEY',         'dgD@,iuy-I6k,oieSldPF&Mq[07 M7#E@+!9#FOz[C4-rWfopN F-]L6V-rh]~/C');
define('SECURE_AUTH_KEY',  'o~-){v2IG&PgGRj{!ny+2l@1sO/f +y:-A6NCm@0UUIA^u6o6,T^E)Eo-`Bz?wP1');
define('LOGGED_IN_KEY',    '5<_g GrfOs7K>=DEx#1i(-G889N)mI|s+ov4|v~V%-bhGMxZ?U-:0.,cS&L7zmQB');
define('NONCE_KEY',        ']j3EC4R))|Pq6<TSWnZB&H#p*ZAd9}=0]wo7G{/>E*J|m[Fp_~jo.&LgdZN9NCy>');
define('AUTH_SALT',        '-[p3zz4NR/gKcxx&JvJbr_}2mh/|eJb`m+p6A#:WPAjEj|PCW7n|A{4#*[c6*J78');
define('SECURE_AUTH_SALT', 'ym$W2cfkm+CEx+4;T2-{AY-;#3CZ]%CUi@OUCGTT)(7rT98[` P3HhTX*1#RTjt}');
define('LOGGED_IN_SALT',   'QAC%vBtN5%H)jDJ+T?Fv=/5|_)a+ha]q#*qNk&yLYa,rH#NE5/Ap3w}Kf0mF{PyV');
define('NONCE_SALT',       ',M=~SOUl76`A|+K*O?]h][#ri |mO*V:7Y SX0Kbi64/{@,s[DZb3miIpLmGkkN6');
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

/* That's all, stop editing! Happy blogging. */