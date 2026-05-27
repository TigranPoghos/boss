document.addEventListener("DOMContentLoaded", function(){



    document.querySelectorAll('.open-map').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const address = btn.dataset.address;
            const encoded = encodeURIComponent(address);

            const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
            const isAndroid = /Android/i.test(navigator.userAgent);

            let url = '';

            if (isIOS) {
            url = `https://maps.apple.com/?q=${encoded}`;
            } else if (isAndroid) {
            url = `https://www.google.com/maps?q=${encoded}`;
            } else {
            url = `https://yandex.ru/maps/?text=${encoded}`;
            }

            window.open(url, '_blank');
        });
    });




    let promoSwiper = null;
    function initPromoSwiper() {
        const slider = document.querySelector('.mySwiper');
        if (!slider) return;
        if (window.innerWidth <= 1024 && !promoSwiper) {
            promoSwiper = new Swiper(slider, {
                slidesPerView: 'auto',
                spaceBetween: 16,
                navigation: {
                    nextEl: '.js-promo-next',
                    prevEl: '.js-promo-prev',
                },
                breakpoints: {
                    0: {
                        slidesPerView: 1,
                    },
                    577: {
                        slidesPerView: 'auto',
                    }
                }
            });
        }
        if (window.innerWidth > 1024 && promoSwiper) {

            promoSwiper.destroy(true, true);

            promoSwiper = null;
        }
    }
    initPromoSwiper();
    window.addEventListener('resize', initPromoSwiper);






    const header = document.querySelector('.header');
    if (!header) return;
    function toggleHeaderScroll() {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    toggleHeaderScroll();
    window.addEventListener('scroll', toggleHeaderScroll);





    const burger = document.querySelector('.header__burger');
    const menu = document.querySelector('.burger');
    const overlayheader = document.querySelector('.header__opacite');
    const body = document.body;
    if (burger && menu && overlayheader && header) {
        const menuLinks = menu.querySelectorAll('a');
        function openMenu() {
            menu.classList.add('active');
            overlayheader.classList.add('active');
            body.classList.add('hidden');
            burger.classList.add('active');
            header.classList.add('menu-open');
        }
        function closeMenu() {
            menu.classList.remove('active');
            overlayheader.classList.remove('active');
            body.classList.remove('hidden');
            burger.classList.remove('active');
            header.classList.remove('menu-open');
        }
        burger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (menu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
        document.addEventListener('click', (e) => {
            const clickInsideMenu = menu.contains(e.target);
            const clickOnBurger = burger.contains(e.target);
            if (
                menu.classList.contains('active') &&
                !clickInsideMenu &&
                !clickOnBurger
            ) {
                closeMenu();
            }
        });
        menuLinks.forEach((link) => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });
    }





})