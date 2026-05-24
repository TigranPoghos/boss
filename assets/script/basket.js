document.addEventListener("DOMContentLoaded", function () {
   
   
   
    (function basketModule() {
        const STORAGE_KEY = 'cuba_cart';

        const basketBtns = document.querySelectorAll('.basketJS');
        const basket = document.querySelector('.basket');
        const overlay = document.querySelector('.opacite');
        const body = document.body;

        const card = document.querySelector('.card');
        const addToCartBtn = document.querySelector('.card__content-add');

        const basketMenu = document.querySelector('.basket__menu');
        const basketCleanBtn = document.querySelector('.basket__clean');
        const basketTotalValue = document.querySelector('.basket__result .price-value');
        const basketHeaderPrice = document.querySelector('.filters__basket-price');

        if (!basket || !overlay || !body) return;

        const CLASS_ACTIVE = 'active';
        const CLASS_HIDDEN = 'hidden';

        function safeParse(json, fallback) {
            try {
                return JSON.parse(json) ?? fallback;
            } catch (e) {
                return fallback;
            }
        }

        function getCart() {
            return safeParse(localStorage.getItem(STORAGE_KEY), []);
        }

        function saveCart(cart) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        }

        function formatPrice(price) {
            return Math.round(price);
        }

        function openBasket() {
            basket.classList.add(CLASS_ACTIVE);
            overlay.classList.add(CLASS_ACTIVE);
            body.classList.add(CLASS_HIDDEN);
        }

        function closeBasket() {
            basket.classList.remove(CLASS_ACTIVE);
            overlay.classList.remove(CLASS_ACTIVE);
            body.classList.remove(CLASS_HIDDEN);
        }

        function normalizeTarget(target) {
            return target && target.nodeType === 3 ? target.parentElement : target;
        }

        function getSelectedSizeValue() {
            if (!card) return '';

            const selectedSizeBtn = card.querySelector('[data-option="size"] button.active');
            return selectedSizeBtn ? (selectedSizeBtn.dataset.value || '') : '';
        }

        function getSelectedFrontpadArticle() {
            if (!card) return '';

            const selectedSize = card.querySelector('[data-option="size"] button.active');
            const selectedVolume = card.querySelector('[data-option="volume"] button.active');

            if (selectedSize && selectedSize.dataset.frontpadArticle) {
                return selectedSize.dataset.frontpadArticle;
            }

            if (selectedVolume && selectedVolume.dataset.frontpadArticle) {
                return selectedVolume.dataset.frontpadArticle;
            }

            return card.dataset.frontpadArticle || '';
        }
        
        function getSelectedOptions() {
            if (!card) return {};

            const result = {};
            const groups = card.querySelectorAll('[data-option]');

            const freeBorderOnSize50 = card.dataset.freeBorderOnSize50 === 'true';
            const selectedSizeValue = getSelectedSizeValue();

            groups.forEach((group) => {
                const key = group.dataset.option;
                const isMultiple = group.dataset.multiple === 'true';
                const activeButtons = group.querySelectorAll('button.active');

                if (!key) return;

                const mapButton = (btn) => {
                    let price = parseFloat(btn.dataset.price || '0') || 0;
                    let frontpadArticle = btn.dataset.frontpadArticle || '';

                    if (
                        key === 'extra' &&
                        freeBorderOnSize50 &&
                        selectedSizeValue === '50'
                    ) {
                        price = 0;
                    
                        if (btn.dataset.frontpadFreeArticle) {
                            frontpadArticle = btn.dataset.frontpadFreeArticle;
                        }
                    }

                    return {
                        value: btn.dataset.value || '',
                        label: btn.dataset.label || btn.textContent.trim(),
                        price: price,
                        frontpad_article: frontpadArticle
                    };
                };

                if (isMultiple) {
                    result[key] = Array.from(activeButtons).map(mapButton);
                } else {
                    const btn = group.querySelector('button.active');
                    result[key] = btn ? mapButton(btn) : null;
                }
            });
            
            const personaValue = card.querySelector('[data-persona-value]');
            const categories = card.dataset.productCategories
                ? card.dataset.productCategories.split(',').filter(Boolean)
                : [];
            
            if (
                personaValue &&
                (categories.includes('roll') || categories.includes('set'))
            ) {
                const count = parseInt(personaValue.textContent, 10) || 1;
            
                result.persona = {
                    label: `Количество персон: ${count}`,
                    value: String(count),
                    price: 0,
                    quantity: count,
                    frontpad_article: '2000'
                };
            }

            return result;
        }

        function getOptionText(options) {
            if (!options) return '';

            const order = ['size', 'type', 'extra', 'taste', 'volume', 'juice-taste', 'roll-extra', 'pizza-extra', 'persona'];
            const parts = [];

            order.forEach((key) => {
                const value = options[key];
                if (!value) return;

                if (Array.isArray(value)) {
                    if (!value.length) return;
                    parts.push(value.map((item) => item.label).join(', '));
                } else if (value.label) {
                    parts.push(value.label);
                }
            });

            return parts.join(', ');
        }

        function getModalProductData() {
            if (!card) return null;

            const titleEl = card.querySelector('[data-card-title]');
            const imageEl = card.querySelector('[data-card-image]');
            const priceEl = card.querySelector('[data-card-price]');
            const infoEl = card.querySelector('[data-card-info]');

            const id = card.dataset.productId || '';
            const title = titleEl ? titleEl.textContent.trim() : '';
            const image = imageEl ? imageEl.getAttribute('src') || '' : '';
            const info = infoEl ? infoEl.textContent.trim() : '';
            const finalPrice = priceEl
                ? parseFloat((priceEl.textContent || '').replace(/[^\d.,]/g, '').replace(',', '.')) || 0
                : 0;

            if (!id || !title) return null;

            return {
                id: String(id),
                product_id: String(id),
                frontpad_article: getSelectedFrontpadArticle(),
                title,
                image,
                info,
                finalPrice,
                options: getSelectedOptions(),
                categories: card.dataset.productCategories
                    ? card.dataset.productCategories.split(',').filter(Boolean)
                    : [],
                quantity: 1
            };
        }

        function getCartItemSignature(item) {
            return JSON.stringify({
                id: item.id,
                frontpad_article: item.frontpad_article || '',
                options: item.options
            });
        }

        function addToCart(item) {
            const cart = getCart();
            const signature = getCartItemSignature(item);

            const existingIndex = cart.findIndex(
                (cartItem) => getCartItemSignature(cartItem) === signature
            );

            if (existingIndex !== -1) {
                cart[existingIndex].quantity += 1;
            } else {
                cart.push(item);
            }

            saveCart(cart);
            renderCart();
        }

        function removeFromCart(index) {
            const cart = getCart();
            if (typeof cart[index] === 'undefined') return;

            cart.splice(index, 1);
            saveCart(cart);
            renderCart();
        }

        function changeQuantity(index, delta) {
            const cart = getCart();
            if (typeof cart[index] === 'undefined') return;

            cart[index].quantity += delta;

            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }

            saveCart(cart);
            renderCart();
        }

        function clearCart() {
            saveCart([]);
            renderCart();
        }

        function getCartTotal(cart) {
            return cart.reduce((sum, item) => {
                return sum + (item.finalPrice * item.quantity);
            }, 0);
        }

        function updateTotals(cart) {
            const total = getCartTotal(cart);

            if (basketTotalValue) {
                basketTotalValue.textContent = formatPrice(total);
            }

            if (basketHeaderPrice) {
                basketHeaderPrice.textContent = `${formatPrice(total)}₽`;
            }
        }

        function renderCart() {
            const cart = getCart();
            updateTotals(cart);

            if (!basketMenu) return;

            if (!cart.length) {
                basketMenu.innerHTML = '<p class="text">Корзина пуста</p>';
                return;
            }

            basketMenu.innerHTML = cart.map((item, index) => {
                const optionText = getOptionText(item.options);
                const infoText = optionText || item.info || '';
                const itemTotal = item.finalPrice * item.quantity;

                return `
                    <article class="basket__item" data-index="${index}">
                        <div class="basket__item-top">
                            <div class="basket__item-image">
                                ${item.image ? `<img src="${item.image}" alt="${item.title}">` : ''}
                            </div>
                            <div class="basket__item-content">
                                <h3 class="basket__subtitle">${item.title}</h3>
                                <p class="basket__text">${infoText}</p>
                            </div>
                        </div>

                        <div class="basket__item-line"></div>

                        <div class="basket__item-bottom">
                            <div class="basket__item-price">
                                <span class="price-value">${formatPrice(itemTotal)}</span>
                                <span class="price-currency">₽</span>
                            </div>

                            <div class="basket__counter">
                                <button class="basket__counter-btn basket__counter-btn--minus" type="button">
                                    <svg width="15" height="1" viewBox="0 0 15 1" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0.304688 0.304749H14.3225" stroke="white" stroke-width="0.609467" stroke-linecap="round" />
                                    </svg>
                                </button>
                                <span class="basket__counter-value">1</span>
                                <button class="basket__counter-btn basket__counter-btn--plus" type="button">
                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_2056_39)">
                                            <path d="M7.61841 0.304749V14.3225" stroke="white" stroke-width="0.609467" stroke-linecap="round" />
                                            <path d="M14.3225 7.6214H0.304688" stroke="white" stroke-width="0.609467" stroke-linecap="round" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_2056_39">
                                            <rect width="15" height="15" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <button class="basket__item-close" aria-label="Удалить товар" type="button">
                            <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.49997 6.49997L3.5 3.5M3.5 3.5L0.5 0.5M3.5 3.5L6.5 0.5M3.5 3.5L0.5 6.5" stroke="#131B2D" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </button>
                    </article>
                `;
            }).join('');
        }

        basketBtns.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openBasket();
            });
        });

        overlay.addEventListener('click', closeBasket);

        basket.addEventListener('click', (e) => {
            const target = normalizeTarget(e.target);
            if (!target) return;

            e.stopPropagation();

            if (target.closest('.basket__close')) {
                closeBasket();
            }
        });

        document.addEventListener('click', (e) => {
            const target = normalizeTarget(e.target);
            if (!target) return;

            if (
                basket.classList.contains(CLASS_ACTIVE) &&
                !target.closest('.basket') &&
                !target.closest('.basketJS') &&
                !target.closest('.card')
            ) {
                closeBasket();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeBasket();
            }
        });
        //временно
        // if (addToCartBtn) {
        //     addToCartBtn.addEventListener('click', () => {
        //         const item = getModalProductData();
        //         if (!item) return;

        //         addToCart(item);

        //         setTimeout(() => {
        //             openBasket();
        //         }, 0);
        //     });
        // }
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                const item = {
                    id: 'test-1',
                    product_id: 'test-1',
                    frontpad_article: '111',
                    title: 'Пицца тестовая',
                    image: './assets/image/Партизан.webp',
                    info: '50 см, сырный борт, острый соус',
                    finalPrice: 950,
                    options: {},
                    categories: ['pizza'],
                    quantity: 1
                };

                addToCart(item);

                setTimeout(() => {
                    openBasket();
                }, 0);
            });
        }

        if (basketMenu) {
            basketMenu.addEventListener('click', (e) => {
                const target = normalizeTarget(e.target);
                if (!target) return;

                const basketItem = target.closest('.basket__item');
                if (!basketItem) return;

                const index = parseInt(basketItem.dataset.index, 10);
                if (Number.isNaN(index)) return;

                if (target.closest('.basket__counter-btn--plus')) {
                    changeQuantity(index, 1);
                    return;
                }

                if (target.closest('.basket__counter-btn--minus')) {
                    changeQuantity(index, -1);
                    return;
                }

                if (target.closest('.basket__item-close')) {
                    removeFromCart(index);
                }
            });
        }

        if (basketCleanBtn) {
            basketCleanBtn.addEventListener('click', () => {
                clearCart();
            });
        }

        renderCart();

        window.cubaCart = {
            getCart,
            renderCart,
            clearCart,
            openBasket
        };
    })();
    

    
    
    
});