<?php
/*
Template Name: Оформление заказа
*/

get_header();
?>

<section class="order">
    <div class="container">
        <div class="order__row row">

            <h1>
                ОФОРМЛЕНИЕ <br>
                <span>ЗАКАЗА</span>
            </h1>

            <h3 class="subtitle">
                Проверьте заказ и укажите данные для доставки
            </h3>

            <form action="#" class="form">

                <div class="form__left">

                    <h3 class="subtitle">1. ВАШИ ДАННЫЕ</h3>

                    <div class="form__client">
                        <input type="text" name="customer_name" placeholder="Ваше имя" required>
                        <input type="tel" name="customer_phone" placeholder="+7 (___) ___-__-__" required>
                    </div>


                    <h3 class="subtitle">2. СПОСОБ ПОЛУЧЕНИЯ</h3>

                    <div class="form__get-type">

                        <label class="form__get-radio">
                            <input type="radio" name="delivery_type" value="pickup" checked>
                            <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/image/delivery-svg-2.png'); ?>" alt="">
                            <span class="form__get-btn text">Самовывоз</span>
                        </label>

                        <label class="form__get-radio">
                            <input type="radio" name="delivery_type" value="delivery">
                            <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/image/delivery-svg.png'); ?>" alt="">
                            <span class="form__get-btn text">Доставка</span>
                        </label>

                    </div>


                    <div class="form__pickup">

                        <h3 class="subtitle">3. ТОЧКА САМОВЫВОЗА</h3>

                        <div class="form__select" id="addressSelect">

                            <div class="form__select-current">
                                <span class="text">ул. Петра Смородина д. 5А</span>
                            </div>

                            <ul class="form__select-list">
                                <li class="text">ул. Интернациональная д. 42</li>
                                <li class="text">ул. Артёмова 3а</li>
                            </ul>

                        </div>

                    </div>


                    <div class="form__delivery">

                        <h3 class="subtitle">3. АДРЕС ДОСТАВКИ</h3>

                        <div class="form__address">
                            <input type="text" id="address-input" name="address" placeholder="Улица">
                            <input type="text" name="house" placeholder="Дом">

                            <div class="form__address-extra">
                                <input type="text" name="entrance" placeholder="Подъезд">
                                <input type="text" name="floor" placeholder="Этаж">
                                <input type="text" name="apartment" placeholder="Квартира">
                            </div>
                        </div>

                        <input type="hidden" name="address_lat" value="">
                        <input type="hidden" name="address_lng" value="">
                        <input type="hidden" name="delivery_zone" value="">
                        <input type="hidden" name="delivery_price" value="0">
                        <input type="hidden" name="delivery_time" value="">
                        <input type="hidden" name="delivery_point" value="">
                        <input type="hidden" name="need_operator_clarification" value="">

                    </div>


                    <h3 class="subtitle">4. СПОСОБ ОПЛАТЫ</h3>

                    <div class="form__order-pay">

                        <label class="form__order-type">
                            <input type="radio" name="payment" value="card" checked>
                            <p class="text">Картой</p>
                            <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/image/pay-svg.png'); ?>" alt="">
                        </label>

                        <label class="form__order-type">
                            <input type="radio" name="payment" value="cash">
                            <p class="text">Наличными</p>
                            <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/image/pay-svg-2.png'); ?>" alt="">
                        </label>

                        <div class="form__cash-change" data-cash-change>
                            <p class="text">Сдача с купюры</p>
                            <input type="text" name="cash_change" placeholder="Например, 5000">
                        </div>

                    </div>


                    <h3 class="subtitle">5. КОММЕНТАРИЙ К ЗАКАЗУ</h3>

                    <textarea
                        class="form__comment"
                        name="comment"
                        placeholder="Комментарий к заказу (не обязательно)"
                    ></textarea>

                </div>


                <div class="form__order">

                    <h3 class="subtitle">Ваш заказ</h3>

                    <ul>
                        <!-- JS заполнит заказ из корзины -->
                    </ul>

                    <div class="form__order-line form__order-line-top"></div>

                    <div class="form__order-result">
                        <h3 class="subtitle">Итого</h3>

                        <strong class="form__order-price subtitle">
                            <span>0</span><span>₽</span>
                        </strong>
                    </div>

                    <div class="form__order-line"></div>

                    <label class="form__agree">
                        <input type="checkbox" name="agree" required>

                        <span class="form__agree-box"></span>

                        <span class="form__agree-text text">
                            Я согласен с
                            <a href="<?php echo esc_url(home_url('/policy/')); ?>" target="_blank">
                                политикой конфиденциальности
                            </a>
                            и
                            <a href="<?php echo esc_url(home_url('/oferta/')); ?>" target="_blank">
                                офертой
                            </a>
                        </span>
                    </label>

                    <button class="form__button button button-red shine-button" type="submit">
                        <span class="text">Оформить заказ</span>
                    </button>

                    <a class="form__other" href="<?php echo esc_url(home_url('/')); ?>">
                        Изменить заказ
                    </a>

                </div>

            </form>

        </div>
    </div>
</section>

<?php get_footer(); ?>