<?php
/*
Template Name: Спасибо за заказ
*/

get_header();
?>

<section class="error thanks">

    <div class="first__overlay">
        <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/image/gradient.png'); ?>" alt="">
    </div>

    <div class="container">

        <div class="error__row row">

            <div class="error__circle">

                <svg width="93" height="85" viewBox="0 0 93 85" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 50.7505L33.4268 76.1775C33.8597 76.6105 34.5767 76.5561 34.9394 76.0629L84.9998 8.00052"
                          stroke="black"
                          stroke-width="16"
                          stroke-linecap="round"/>
                </svg>

            </div>


            <h1 class="error__title">
                <span>СПАСИБО</span><br>
                ЗА ЗАКАЗ!
            </h1>


            <p class="subtitle">
                Ваш заказ принят в обработку. <br>
                Просьба не ждать обратного звонка, ваш заказ уже готовится
            </p>

        </div>

    </div>

</section>

<?php get_footer(); ?>