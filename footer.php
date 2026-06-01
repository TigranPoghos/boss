</main>

<div class="header__opacite"></div>
<div class="opacite"></div>

<aside class="basket">
    <div class="basket__top">
        <h3 class="basket__title">Корзина</h3>

        <button class="basket__close" type="button">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M13 13L7.00002 7.00002M7.00002 7.00002L1 1M7.00002 7.00002L13 1M7.00002 7.00002L1 13"
                stroke="#E12B23"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"/>
            </svg>
        </button>
    </div>


    <div class="basket__menu">
        <!-- JS сюда будет добавлять товары -->
    </div>


    <button class="basket__clean" type="button">
        <span>Очистить корзину</span>
    </button>


    <div class="basket__result">

        <div class="basket__result-price">

            <div class="basket__result-text">
                Итого
            </div>

            <div class="basket__result-price">
                <span class="price-value">0</span>
                <span class="price-currency">₽</span>
            </div>

        </div>


        <a class="basket__result-button button button-red shine-button"
           href="<?php echo esc_url(home_url('/checkout/')); ?>">
            <span>К оформлению заказа</span>
        </a>

    </div>
</aside>

<article class="card">

    <button class="card__close" type="button" aria-label="Закрыть">
        ×
    </button>

    <div class="card__img">
        <img src="" alt="" data-card-image>
    </div>


    <div class="card__content">

        <h3 class="card__title title" data-card-title></h3>

        <p class="card__content-info card__content-info-light"
           data-card-info>
        </p>


        <div class="card__content-info"
             data-card-description>
        </div>


        <div class="card__extra" data-card-options>

        </div>


        <button class="card__content-add button button-red shine-button"
                type="button">

            <span>В корзину за</span>

            <span data-card-price>
                0<span>₽</span>
            </span>

        </button>

    </div>

</article>

<div class="basket__button basketJS mob"></div>

<div class="modal">

    <p class="text">
        Данный сайт использует файлы cookie.
        Продолжая просмотр страниц сайта, вы принимаете условия его использования.

        <a href="<?php echo esc_url(home_url('/policy/')); ?>">
            Политика конфиденциальности
        </a>

        и

        <a href="<?php echo esc_url(home_url('/oferta/')); ?>">
            Публичная оферта
        </a>.
    </p>


    <button class="modal__button" type="button">
        <span class="text">Принимаю</span>
    </button>

</div>

<footer class="footer">

    <div class="container">

        <div class="footer__row row">


            <div class="footer__top">

                <div class="footer__left">


                    <ul class="footer__menu">

                        <li>
                            <a href="<?php echo esc_url(home_url('/#pizza')); ?>" class="text">
                                Меню
                            </a>
                        </li>

                        <li>
                            <a href="<?php echo esc_url(home_url('/action/')); ?>" class="text">
                                Акции
                            </a>
                        </li>

                        <li>
                            <a href="<?php echo esc_url(home_url('/contact/')); ?>" class="text">
                                Контакты
                            </a>
                        </li>

                    </ul>


                    <div class="footer__middle">

                        <div class="header__contact">

                            <div class="header__contact-content">

                                <a href="tel:716666">
                                    71-66-66
                                </a>

                                <p>c 9:00-23:00</p>

                            </div>

                        </div>


                        <div class="header__contact">

                            <div class="header__contact-content">
                                <p>
                                    Мы принимаем <br>
                                    оплату картой
                                </p>
                            </div>

                        </div>

                    </div>


                </div>


                <a href="<?php echo esc_url(home_url('/')); ?>"
                   class="footer__right">

                    <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/image/footer__logo.png'); ?>"
                         alt="<?php bloginfo('name'); ?>">

                </a>


            </div>




            <div class="footer__address">

                <span>г. Липецк</span>

                <button class="open-map"
                        data-address="Липецк, ул. Петра Смородина 5А">
                    <span>ул. Петра Смородина д. 5А</span>
                </button>


                <button class="open-map"
                        data-address="Липецк, ул. Интернациональная 42">
                    <span>ул. Интернациональная д. 42</span>
                </button>


                <button class="open-map"
                        data-address="Липецк, ул. Артёмова 3а">
                    <span>ул. Артёмова 3а</span>
                </button>


            </div>




            <div class="footer__bottom">

                <iframe 
                    src="https://yandex.ru/map-widget/v1/?lang=ru_RU&amp;scroll=true&amp;source=constructor-api&amp;um=constructor%3A0c40550a95135dbb55f8499a0515f271c6d291131313cdf6bad8aaa1d173c847"
                    frameborder="0"
                    allowfullscreen="true"
                    width="100%"
                    height="458">
                </iframe>

            </div>



            <div class="footer__line"></div>



            <ul class="footer__menu footer__menu-second">

                <li>
                    <p class="text">ИП Каверин Сергей Николаевич</p>
                </li>

                <li>
                    <p class="text">ИНН 462900801609</p>
                </li>

                <li>
                    <p class="text">ОГРНИП 324460000046531</p>
                </li>

                <li class="footer__menu-right">
                    <a class="text"
                       href="<?php echo esc_url(home_url('/policy/')); ?>">
                        Политика
                    </a>
                </li>

                <li>
                    <a class="text"
                       href="<?php echo esc_url(home_url('/oferta/')); ?>">
                        Оферта
                    </a>
                </li>

            </ul>


        </div>

    </div>

</footer>

<?php wp_footer(); ?>

</body>
</html>