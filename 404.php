<?php
get_header();
?>

<section class="error">

    <div class="first__overlay">
        <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/image/gradient.png'); ?>" alt="">
    </div>


    <div class="container">

        <div class="error__row row">


            <h2 class="error__number">
                404
            </h2>


            <h1 class="error__title">
                СТРАНИЦА <br>
                НЕ НАЙДЕНА
            </h1>


            <p class="subtitle">
                Похоже вы заблудились. <br>
                Такой страницы нет, <br>
                Но у нас есть отличная пицца!
            </p>


        </div>

    </div>

</section>

<?php get_footer(); ?>