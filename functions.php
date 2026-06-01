<?php

if (!defined('ABSPATH')) {
	exit;
}


/**
 * Настройка темы
 */
function boss_theme_setup() {

	add_theme_support('title-tag');
	add_theme_support('post-thumbnails');
	add_theme_support('menus');

	add_theme_support('html5', [
		'search-form',
		'comment-form',
		'comment-list',
		'gallery',
		'caption',
		'style',
		'script',
	]);

}

add_action('after_setup_theme', 'boss_theme_setup');


/**
 * Подключение файлов
 */
function boss_theme_assets() {

	$theme_dir = get_template_directory();
	$theme_uri = get_template_directory_uri();


	// CSS
	wp_enqueue_style(
		'boss-style',
		$theme_uri . '/assets/dist/style.css',
		[],
		filemtime($theme_dir . '/assets/dist/style.css')
	);


	wp_enqueue_style(
		'swiper-style',
		'https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.css'
	);



	// jQuery WP
	wp_enqueue_script('jquery');


	// jQuery mask
	wp_enqueue_script(
		'jquery-mask',
		'https://cdn.jsdelivr.net/npm/jquery.maskedinput@1.4.1/src/jquery.maskedinput.min.js',
		['jquery'],
		null,
		true
	);


	// Swiper
	wp_enqueue_script(
		'swiper-script',
		'https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js',
		[],
		null,
		true
	);



	// Главный JS
	wp_enqueue_script(
		'boss-script-main',
		$theme_uri . '/assets/script/script.js',
		[
			'jquery',
			'jquery-mask',
			'swiper-script'
		],
		filemtime($theme_dir . '/assets/script/script.js'),
		true
	);



	// Basket
	wp_enqueue_script(
		'boss-script-basket',
		$theme_uri . '/assets/script/basket.js',
		[
			'boss-script-main'
		],
		filemtime($theme_dir . '/assets/script/basket.js'),
		true
	);



	// Filters
	wp_enqueue_script(
		'boss-script-filters',
		$theme_uri . '/assets/script/filters.js',
		[
			'boss-script-main'
		],
		filemtime($theme_dir . '/assets/script/filters.js'),
		true
	);



	// Card
	wp_enqueue_script(
		'boss-script-card',
		$theme_uri . '/assets/script/card.js',
		[
			'jquery',
			'boss-script-main'
		],
		filemtime($theme_dir . '/assets/script/card.js'),
		true
	);



	wp_localize_script(
		'boss-script-card',
		'bossCardData',
		[
			'ajax_url' => admin_url('admin-ajax.php'),
		]
	);

}

add_action('wp_enqueue_scripts', 'boss_theme_assets');



/**
 * ACF JSON
 */
add_filter('acf/settings/save_json', function () {
	return get_template_directory() . '/acf-json';
});


add_filter('acf/settings/load_json', function ($paths) {

	unset($paths[0]);

	$paths[] = get_template_directory() . '/acf-json';

	return $paths;

});



/**
 * CPT Товары
 */
function boss_register_products_cpt() {

	register_post_type('product', [

		'labels' => [
			'name' => 'Товары',
			'singular_name' => 'Товар',
			'add_new_item' => 'Добавить товар',
			'edit_item' => 'Редактировать товар',
		],

		'public' => true,
		'menu_icon' => 'dashicons-cart',
		'supports' => [
			'title',
			'thumbnail'
		],

		'show_in_rest' => true,

	]);

}

add_action('init', 'boss_register_products_cpt');



/**
 * Категории товаров
 */
function boss_register_product_taxonomy() {

	register_taxonomy(
		'product_category',
		'product',
		[

			'labels' => [
				'name' => 'Категории',
				'singular_name' => 'Категория',
			],

			'hierarchical' => true,
			'public' => true,
			'show_in_rest' => true,

		]
	);

}

add_action('init', 'boss_register_product_taxonomy');


/**
 * Размеры картинок
 */
add_image_size('product-thumb', 400, 400, false);
add_image_size('promo-thumb', 900, 450, true);