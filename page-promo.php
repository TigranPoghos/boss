<?php
/*
Template Name: Акции
*/

get_header();
?>

<section class="action">
    <div class="container">
        <div class="action__row row">

            <h1>
                АКЦИИ<br>
                <span>PIZZA BOSS</span>
            </h1>

            <h3 class="subtitle">
                Скидки, подарки и выгодные комбо <br>
                для тех, кто любит заказывать по-боссовски.
            </h3>

        </div>
    </div>
</section>

<section class="promo promo__page">
    <div class="container">
        <div class="promo__row row">

            <div class="promo__wrapper">

                <div class="promo__item">
                    <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/image/promo.png'); ?>" alt="">
                </div>

                <div class="promo__item">
                    <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/image/promo-2.png'); ?>" alt="">
                </div>

                <div class="promo__item">
                    <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/image/promo-3.png'); ?>" alt="">
                </div>

            </div>

        </div>
    </div>
</section>

<?php get_footer(); ?>