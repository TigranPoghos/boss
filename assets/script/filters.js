document.addEventListener('DOMContentLoaded', () => {




    const header = document.querySelector('.header');
    const filters = document.querySelector('.filters');
    if (!header || !filters) return;
    const filtersOffset = filters.offsetTop;
    function stickyFilters() {
        const headerHeight = header.offsetHeight;
        const scrollTop = window.scrollY;
        if (scrollTop >= filtersOffset - headerHeight) {
            filters.classList.add('fixed');
            filters.style.top = `${headerHeight}px`;
            document.body.style.paddingTop =
                `${filters.offsetHeight}px`;
        } else {
            filters.classList.remove('fixed');
            filters.style.top = '';
            document.body.style.paddingTop = '';
        }
    }
    stickyFilters();
    window.addEventListener('scroll', stickyFilters);
    window.addEventListener('resize', stickyFilters);






    const sections = document.querySelectorAll('.menu');
    const filterLinks = document.querySelectorAll('.filters__item');
    if (sections.length && filterLinks.length) {
        const setActiveLink = (id) => {
            filterLinks.forEach((link) => {
                const isActive = link.hash === `#${id}`;

                link.classList.toggle('active', isActive);

                if (isActive) {
                    link.scrollIntoView({
                        behavior: 'smooth',
                        inline: 'center',
                        block: 'nearest'
                    });
                }
            });
        };
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveLink(entry.target.id);
                    }
                });
            },
        {
            threshold: 0.4
        }
    );
    sections.forEach((section) => observer.observe(section));
    }



    if (filters) {
        const scrollContainer = filters.querySelector('.filters__wrapper');
        const prevBtn = filters.querySelector('.swiper-btn-prev');
        const nextBtn = filters.querySelector('.swiper-btn-next');
        const controls = filters.querySelector('.swiper-btn');
        if (scrollContainer && prevBtn && nextBtn && controls) {
            const getGap = () => {
            const styles = window.getComputedStyle(scrollContainer);
            return parseFloat(styles.columnGap || styles.gap || 0);
            };
            const getScrollStep = () => {
            const firstItem = scrollContainer.querySelector('li');
            if (!firstItem) return 200;
            return firstItem.offsetWidth + getGap();
            };
            const updateButtons = () => {
            const hasOverflow = scrollContainer.scrollWidth > scrollContainer.clientWidth + 1;
            controls.style.display = hasOverflow ? 'flex' : 'none';
            if (!hasOverflow) {
                prevBtn.disabled = true;
                nextBtn.disabled = true;
                return;
            }
            const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
            prevBtn.disabled = scrollContainer.scrollLeft <= 1;
            nextBtn.disabled = scrollContainer.scrollLeft >= maxScrollLeft - 1;
            };
            prevBtn.addEventListener('click', () => {
            scrollContainer.scrollBy({
                left: -getScrollStep(),
                behavior: 'smooth'
            });
            });
            nextBtn.addEventListener('click', () => {
            scrollContainer.scrollBy({
                left: getScrollStep(),
                behavior: 'smooth'
            });
            });
            scrollContainer.addEventListener('scroll', updateButtons);
            window.addEventListener('resize', updateButtons);

            updateButtons();
        }
    }




});