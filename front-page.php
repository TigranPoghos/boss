<?php 
/*
Template Name: Главная
*/

get_header(); 
?>

<section class="first">
    <div class="first__overlay">
        <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/image/gradient.png'); ?>" alt="">
    </div>

    <div class="container">
        <div class="first__row row">

            <h1>
                Голодный? <br>
                <span>Зови Босса.</span>
            </h1>

            <h3 class="subtitle">
                Пицца, роллы и WOK <br>
                с доставкой по Липецку
            </h3>

            <div class="first__buttons">

                <a href="#pizza" class="button button-red shine-button">
                    <span>Смотреть меню</span>
                </a>

                <a href="<?php echo esc_url(home_url('/action/')); ?>" class="button button-orange shine-button">
                    <span>Акции</span>
                </a>

            </div>

            <div class="first__info">

                <div class="first__info-item">
                    <p class="text">
                        Быстрая доставка <br>
                        <span>от 30 минут</span>
                    </p>
                </div>

                <div class="first__info-item">
                    <p class="text">
                        Горячее и свежее <br>
                        <span>прямо к вам</span>
                    </p>
                </div>

                <div class="first__info-item">
                    <p class="text">
                        Бонусы и акции <br>
                        <span>для своих</span>
                    </p>
                </div>

            </div>

        </div>
    </div>
</section>

<section class="search">
    <div class="container">
        <div class="search__row row">
            <div class="filters__search">
                <input type="text" placeholder="Найти блюдо">
            </div>
        </div>
    </div>
</section>

<section class="filters">
    <div class="container">
        <div class="filters__row row">
            <div class="filters__wrapper">

                <a href="#pizza" class="filters__item"><span class="text">Пицца</span></a>
                <a href="#roll" class="filters__item"><span class="text">Роллы</span></a>
                <a href="#set" class="filters__item"><span class="text">Сеты</span></a>
                <a href="#wok" class="filters__item"><span class="text">WOK</span></a>
                <a href="#snack" class="filters__item"><span class="text">Закуски</span></a>
                <a href="#salad" class="filters__item"><span class="text">Салаты</span></a>
                <a href="#dessert" class="filters__item"><span class="text">Десерты</span></a>
                <a href="#drink" class="filters__item"><span class="text">Напитки</span></a>

            </div>
        </div>
    </div>
</section>

<section class="promo">
    <div class="container">
        <div class="promo__row row swiper mySwiper">

            <div class="often__top">
                <div class="often__title">
                    <h2 class="title">Акции</h2>
                </div>

                <a href="<?php echo esc_url(home_url('/action/')); ?>" class="menu__link">
                    <span>Все акции</span>
                </a>
            </div>

            <div class="promo__wrapper swiper-wrapper">

                <div class="promo__item swiper-slide">
                    <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/image/promo.png'); ?>" alt="">
                </div>

                <div class="promo__item swiper-slide">
                    <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/image/promo-2.png'); ?>" alt="">
                </div>

                <div class="promo__item swiper-slide">
                    <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/image/promo-3.png'); ?>" alt="">
                </div>

            </div>

            <div class="swiper-btn promo__buttons">
                <button class="swiper-btn-prev js-promo-prev" type="button"></button>
                <button class="swiper-btn-next js-promo-next" type="button"></button>
            </div>

        </div>
    </div>
</section>

<section class="often">
    <div class="container">
        <div class="often__row row">

            <div class="often__top">
                <div class="often__title">
                    <h2 class="title">Хиты <span>Boss</span></h2>
                </div>
            </div>

            <div class="menu__wrapper">

                <?php for ($i = 1; $i <= 4; $i++) : ?>

                    <article class="menu__item">

                        <button class="menu__item-overlay" data-id="<?php echo esc_attr($i); ?>" type="button"></button>

                        <div class="menu__item-img">
                            <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/image/Партизан.webp'); ?>" alt="">
                        </div>

                        <div class="menu__item-content">
                            <h3 class="menu__title">Пепперони</h3>

                            <p class="menu__text">
                                Пикантная пепперони, моцарелла, фирменный соус
                            </p>

                            <div class="menu__buttons">
                                <button class="menu__button button button-red shine-button" type="button">
                                    <span class="menu__button-text">В корзину</span>
                                </button>

                                <p class="menu__price">от 649 <span>₽</span></p>
                            </div>
                        </div>

                    </article>

                <?php endfor; ?>

            </div>

        </div>
    </div>
</section>

<?php
$menu_sections = [
    'pizza'   => 'Пицца',
    'roll'    => 'Роллы',
    'set'     => 'Сеты',
    'wok'     => 'Лапша Wok',
    'snack'   => 'Закуски',
    'salad'   => 'Салаты',
    'dessert' => 'Десерты',
    'drink'   => 'Напитки',
];
?>

<?php foreach ($menu_sections as $section_id => $section_title) : ?>

    <section id="<?php echo esc_attr($section_id); ?>" class="menu">
        <div class="container">
            <div class="menu__row row">

                <div class="often__top">
                    <div class="menu__top-title">
                        <h2 class="title"><?php echo esc_html($section_title); ?></h2>
                    </div>
                </div>

                <div class="menu__wrapper">

                    <?php for ($i = 1; $i <= 8; $i++) : ?>

                        <article class="menu__item">

                            <button class="menu__item-overlay" data-id="<?php echo esc_attr($i); ?>" type="button"></button>

                            <div class="menu__item-img">
                                <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/image/Партизан.webp'); ?>" alt="">
                            </div>

                            <div class="menu__item-content">
                                <h3 class="menu__title">Пепперони</h3>

                                <p class="menu__text">
                                    Пикантная пепперони, моцарелла, фирменный соус
                                </p>

                                <div class="menu__buttons">
                                    <button class="menu__button button button-red shine-button" type="button">
                                        <span class="menu__button-text">В корзину</span>
                                    </button>

                                    <p class="menu__price">от 649 <span>₽</span></p>
                                </div>
                            </div>

                        </article>

                    <?php endfor; ?>

                </div>

            </div>
        </div>
    </section>

<?php endforeach; ?>

<?php get_footer(); ?>