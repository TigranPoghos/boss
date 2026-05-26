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





})