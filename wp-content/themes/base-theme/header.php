<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>

<?php get_template_part( 'snippets/head', 'meta' ); ?>
<?php get_template_part( 'snippets/head', 'icons' ); ?>

<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

  <header class="site-header" role="banner">

    <span class="hgroup">
      <h1 class="site-title"><a href="<?php echo home_url( '/' ); ?>" title="<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
      <h2 class="site-description"><?php bloginfo( 'description' ); ?></h2>
    </span>

    <nav role="navigation" class="site-navigation">
      <h1 class="screen-reader-text"><?php _e( 'Menu', 'Helios' ); ?></h1>
      <div class="screen-reader-text skip-link"><a href="#content" title="<?php esc_attr_e( 'Skip to content', 'Helios' ); ?>"><?php _e( 'Skip to content', 'Helios' ); ?></a></div>

      <?php wp_nav_menu( array( 'theme_location' => 'primary' ) ); ?>
    </nav><?php // .site-navigation ?>

  </header><?php // .site-header ?>

  <div class="site-main">