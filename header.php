<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="header">
    <div class="container">
        <div class="header__row row">

            <div class="header__logo">
                <a href="<?php echo esc_url(home_url('/')); ?>">
                    <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/image/logo.png'); ?>" alt="<?php bloginfo('name'); ?>">
                </a>
            </div>

            <ul class="header__menu decs">
                <li>
                    <a href="<?php echo esc_url(home_url('/#pizza')); ?>" class="header__menu-item">Меню</a>
                </li>
                <li>
                    <a href="<?php echo esc_url(home_url('/action/')); ?>" class="header__menu-item">Акции</a>
                </li>
                <li>
                    <a href="<?php echo esc_url(home_url('/contact/')); ?>" class="header__menu-item">Контакты</a>
                </li>
            </ul>

            <div class="header__contact">
                <svg width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.8677 4.94551C12.0014 5.10301 10.3027 6.03676 9.03816 7.05376C6.88941 8.77951 5.33016 11.205 4.56741 14.0085C4.28841 15.03 4.27716 15.1425 4.28166 16.695C4.29066 19.9845 5.19291 23.4653 7.08516 27.495C10.8292 35.478 18.4792 43.1213 26.5184 46.9148C30.2827 48.69 33.6847 49.617 36.8999 49.7408C38.8754 49.8173 40.4909 49.4595 42.4349 48.5145C45.2767 47.133 47.5469 44.7953 48.7552 42.0075C49.0252 41.3865 49.0747 41.1683 49.0769 40.5945C49.0829 40.2129 49.0336 39.8325 48.9307 39.465C48.5032 38.196 45.6794 35.3385 42.6194 33.0773C41.0152 31.8938 38.6842 30.2783 38.2904 30.078C37.6559 29.7799 36.9462 29.6803 36.2542 29.7923C35.2777 29.97 34.9177 30.2243 33.0592 32.0625L31.3312 33.7703L30.2219 33.192C26.0639 31.0185 23.0242 27.981 20.8237 23.8005L20.2297 22.6688L21.9509 20.9273C23.8657 18.99 24.0884 18.6548 24.2099 17.5433C24.2887 16.8255 24.2032 16.2675 23.9309 15.7298C23.5529 14.9828 20.8957 11.1938 19.7189 9.72001C18.2137 7.83901 15.8309 5.63176 14.8072 5.16601C14.192 4.9204 13.5222 4.84425 12.8677 4.94551Z" fill="#E12B23"/>
                </svg>

                <div class="header__contact-content">
                    <a href="tel:716666">71-66-66</a>
                    <p>c 9:00-23:00</p>
                </div>
            </div>

            <div class="header__line decs"></div>

            <button type="button" class="button button-red shine-button basketJS decs">
                <span>Корзина</span>
            </button>

            <button class="header__burger mob" type="button">
                <svg class="header__burger-icon header__burger-icon--menu" width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1H23" stroke="#E12B23" stroke-width="2" stroke-linecap="round"/>
                    <path d="M1 9.78589H23" stroke="#E12B23" stroke-width="2" stroke-linecap="round"/>
                    <path d="M1 18.5715H23" stroke="#E12B23" stroke-width="2" stroke-linecap="round"/>
                </svg>

                <svg class="header__burger-icon header__burger-icon--close" width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.5 17.5L10.25 9.25002M10.25 9.25002L2 1M10.25 9.25002L18.5 1M10.25 9.25002L2 17.5" stroke="#D10D11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>

            <div class="burger">
                <ul class="header__menu">
                    <li>
                        <a href="<?php echo esc_url(home_url('/#pizza')); ?>" class="header__menu-item">Меню</a>
                    </li>
                    <li>
                        <a href="<?php echo esc_url(home_url('/action/')); ?>" class="header__menu-item">Акции</a>
                    </li>
                    <li>
                        <a href="<?php echo esc_url(home_url('/contact/')); ?>" class="header__menu-item">Контакты</a>
                    </li>
                </ul>
            </div>

        </div>
    </div>
</header>

<main class="main">