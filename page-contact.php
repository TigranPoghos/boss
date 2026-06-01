<?php
/*
Template Name: Контакты
*/

get_header();
?>

<section class="action contact">
    <div class="container">
        <div class="action__row row">

            <h1>
                КОНТАКТЫ <br>
                <span>PIZZA BOSS</span>
            </h1>

            <h3 class="subtitle">
                Заказывайте доставку по Липецку <br>
                или забирайте сами из ближайшей точки.
            </h3>

        </div>
    </div>
</section>

<section class="social">
    <div class="container">

        <div class="social__row row">


            <div class="social__content">

                <p class="subtitle">
                    Заказ по телефону
                </p>

                <a href="tel:716666" class="title">
                    71-66-66
                </a>

                <p class="text">
                    Мы работает для вас <br>
                    с <span>9:00</span> до <span>23:00</span> ежедневно
                </p>

            </div>


        </div>

    </div>
</section>

<section class="delivery">

    <div class="container">

        <div class="delivery__row row">


            <div class="footer__bottom">

                <iframe 
                    src="https://yandex.ru/map-widget/v1/?lang=ru_RU&amp;scroll=true&amp;source=constructor-api&amp;um=constructor%3A0c40550a95135dbb55f8499a0515f271c6d291131313cdf6bad8aaa1d173c847"
                    frameborder="0"
                    allowfullscreen="true"
                    width="100%"
                    height="458"
                    style="display:block;">
                </iframe>

            </div>



            <div class="delivery__wrapper">


                <div class="delivery__item">

                    <h3 class="subtitle">
                        Доставка
                    </h3>

                    <p class="text">
                        В отдаленные районы города +50-100 к заказу.
                        Минимальная сумма доставки на закуски,
                        лапшу, салаты и отдельные роллы 1500 ₽.
                    </p>

                </div>




                <div class="delivery__item">

                    <h3 class="subtitle">
                        Адреса для самовывоза
                    </h3>


                    <div class="delivery__address-content">


                        <?php
                        $addresses = [
                            'ул. Петра Смородина, д. 5А',
                            'ул. Интернациональная д. 42',
                            'ул. Артёмова 3а'
                        ];
                        ?>


                        <?php foreach ($addresses as $address) : ?>

                            <div class="delivery__address">

                                <svg width="14" height="18" viewBox="0 0 14 18">
                                    <path fill="#E12B23"
                                          d="M7.288 17.9085C6.8845 18.03 7.1155 18.03 7.288 17.9085Z"/>
                                </svg>


                                <p class="text">
                                    <?php echo esc_html($address); ?>
                                </p>

                            </div>

                        <?php endforeach; ?>


                    </div>

                </div>





                <div class="delivery__item">

                    <h3 class="subtitle">
                        Оплата
                    </h3>

                    <p class="text">
                        Наличными или картой <br>
                        курьеру / при самовывозе
                    </p>

                </div>


            </div>

        </div>

    </div>

</section>

<?php get_footer(); ?>