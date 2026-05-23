document.addEventListener("DOMContentLoaded", function () {
    (function productCardModule() {
        const STORAGE_KEY = 'cuba_cart';

        const triggers = document.querySelectorAll('.menu__item-overlay');
        const card = document.querySelector('.card');
        const overlay = document.querySelector('.opacite');
        const body = document.body;

        if (!card || !overlay || !body || !triggers.length) return;

        const CLASS_ACTIVE = 'active';
        const CLASS_HIDDEN = 'hidden';

        const cardImage = card.querySelector('[data-card-image]');
        const cardTitle = card.querySelector('[data-card-title]');
        const cardInfo = card.querySelector('[data-card-info]');
        const cardDescription = card.querySelector('[data-card-description]');
        const cardOptions = card.querySelector('[data-card-options]');
        const cardPrice = card.querySelector('[data-card-price]');

        function getCart() {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            } catch (e) {
                return [];
            }
        }

        function saveCart(cart) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
            window.dispatchEvent(new CustomEvent('cuba_cart_updated', {
                detail: { cart }
            }));
        }

        function normalizeTarget(target) {
            return target && target.nodeType === 3 ? target.parentElement : target;
        }

        function isFreeBorderByArticle() {
            const article = String(getSelectedFrontpadArticle() || '').trim();
            const selectedSizeValue = getSelectedSizeValue();
        
            const title = cardTitle
                ? cardTitle.textContent.trim().toLowerCase()
                : '';
        
            return (
                article === '508' ||
                (title === 'четыре вкуса' && selectedSizeValue === '40')
            );
        }

        function formatPrice(price) {
            return `${Math.round(price)}<span>₽</span>`;
        }

        function getSelectedSizeValue() {
            const selectedSizeBtn = card.querySelector('[data-option="size"] button.active');
            return selectedSizeBtn ? (selectedSizeBtn.dataset.value || '') : '';
        }

        function moveHighlight(group) {
            if (!group) return;

            const highlight = group.querySelector('.option-highlight');
            if (!highlight) return;

            const isMultiple = group.dataset.multiple === 'true';

            if (isMultiple) {
                highlight.style.opacity = '0';
                highlight.style.width = '0px';
                highlight.style.height = '0px';
                highlight.style.transform = 'translate(0, 0)';
                return;
            }

            const activeBtn = group.querySelector('button.active');

            if (!activeBtn) {
                highlight.style.opacity = '0';
                highlight.style.width = '0px';
                highlight.style.height = '0px';
                highlight.style.transform = 'translate(0, 0)';
                return;
            }

            highlight.style.opacity = '1';
            highlight.style.width = `${activeBtn.offsetWidth}px`;
            highlight.style.height = `${activeBtn.offsetHeight}px`;
            highlight.style.transform = `translate(${activeBtn.offsetLeft}px, ${activeBtn.offsetTop}px)`;
        }

        function toggleBlockedPizzaOptions() {
            const selectedSizeValue = getSelectedSizeValue();
            const title = cardTitle ? cardTitle.textContent.trim().toLowerCase() : '';

            const isSize25 = selectedSizeValue === '25';

            const isBlockedPizza =
                title === 'аморе' ||
                title === 'четыре сыра' ||
                title === '4 сыра';

            const shouldHide = isSize25 || isBlockedPizza;

            const borderGroup = card.querySelector('[data-option="extra"]');

            if (borderGroup) {
                if (shouldHide) {
                    borderGroup.style.display = 'none';

                    borderGroup.querySelectorAll('button').forEach((btn) => {
                        btn.classList.remove('active');
                        btn.setAttribute('aria-pressed', 'false');
                    });
                } else {
                    borderGroup.style.display = '';
                }

                moveHighlight(borderGroup);
            }

            const dopButtons = card.querySelectorAll('[data-option="pizzaExtra"] button[data-value="dopProduct"]');

            let visibleDopCount = 0;

            if (!shouldHide) {
                if (selectedSizeValue === '33') visibleDopCount = 1;
                if (selectedSizeValue === '40') visibleDopCount = 2;
                if (selectedSizeValue === '50') visibleDopCount = 3;
            }

            dopButtons.forEach((btn, index) => {
                const shouldShowDop = index < visibleDopCount;

                if (shouldShowDop) {
                    btn.style.display = '';
                } else {
                    btn.style.display = 'none';
                    btn.classList.remove('active');
                    btn.setAttribute('aria-pressed', 'false');
                }

                moveHighlight(btn.closest('[data-option]'));
            });
        }

        function getCurrentModalPrice() {
            const basePrice = parseFloat(card.dataset.basePrice || '0');
            const freeBorderOnSize50 = card.dataset.freeBorderOnSize50 === 'true';

            let total = basePrice;
            const selectedSizeValue = getSelectedSizeValue();
            const activeButtons = card.querySelectorAll('[data-option] button.active');

            activeButtons.forEach((btn) => {
                let extra = parseFloat(btn.dataset.price || '0');

                const parentGroup = btn.closest('[data-option]');
                const groupKey = parentGroup ? parentGroup.dataset.option : '';
                const isBorderOption = groupKey === 'extra';

                if (
                    (freeBorderOnSize50 && isBorderOption && selectedSizeValue === '50') ||
                    (isBorderOption && isFreeBorderByArticle())
                ) {
                    extra = 0;
                }

                total += extra;
            });

            return total;
        }

        function getSelectedFrontpadArticle() {
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

        function hasPersonaOption() {
            const categories = (card.dataset.productCategories || '').split(',');

            return categories.includes('roll') || categories.includes('set');
        }

        function getMaxPersonaCount() {
            const categories = (card.dataset.productCategories || '').split(',');
            const rollsCount = parseInt(card.dataset.rollsCount || '1', 10) || 1;

            if (categories.includes('set')) {
                return rollsCount * 2;
            }

            if (categories.includes('roll')) {
                return 2;
            }

            return 1;
        }

        function getPersonaCount() {
            const valueEl = card.querySelector('[data-persona-value]');
            const value = valueEl ? parseInt(valueEl.textContent, 10) : 1;

            return Number.isNaN(value) ? 1 : Math.max(1, value);
        }

        function setPersonaCount(value) {
            const valueEl = card.querySelector('[data-persona-value]');
            if (!valueEl) return;

            const max = getMaxPersonaCount();
            const safeValue = Math.min(Math.max(1, value), max);

            valueEl.textContent = safeValue;
        }

        function togglePersonaCounter() {
            const counter = card.querySelector('[data-persona-counter]');
            if (!counter) return;

            counter.style.display = hasPersonaOption() ? '' : 'none';
            setPersonaCount(1);
        }

        function getSelectedOptionsData() {
            const result = {};
            const groups = card.querySelectorAll('[data-option]');
            const freeBorderOnSize50 = card.dataset.freeBorderOnSize50 === 'true';
            const selectedSizeValue = getSelectedSizeValue();

            groups.forEach((group) => {
                if (group.style.display === 'none') return;

                const key = group.dataset.option;
                const isMultiple = group.dataset.multiple === 'true';
                const activeButtons = group.querySelectorAll('button.active');

                if (!key || !activeButtons.length) return;

                const mapButton = (btn) => {
                    let price = parseFloat(btn.dataset.price || '0') || 0;
                    let frontpadArticle = btn.dataset.frontpadArticle || '';

                    if (key === 'extra') {
                    
                        if (
                            (freeBorderOnSize50 && selectedSizeValue === '50') ||
                            isFreeBorderByArticle()
                        ) {
                    
                            price = 0;
                    
                            frontpadArticle =
                                btn.dataset.frontpadFreeArticle ||
                                btn.dataset.frontpadArticle ||
                                '';
                        }
                    }

                    return {
                        label: btn.dataset.label || btn.textContent.trim(),
                        value: btn.dataset.value || '',
                        price: price,
                        frontpad_article: frontpadArticle
                    };
                };

                if (isMultiple) {
                    result[key] = Array.from(activeButtons).map(mapButton);
                } else {
                    result[key] = mapButton(activeButtons[0]);
                }
            });

            if (hasPersonaOption()) {
                const count = getPersonaCount();

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

        function getCartItemKey(item) {
            return JSON.stringify({
                product_id: item.product_id,
                frontpad_article: item.frontpad_article,
                options: item.options
            });
        }

        function addCurrentProductToCart() {
            const finalPrice = getCurrentModalPrice();

            const cartItem = {
                product_id: card.dataset.productId || '',
                frontpad_article: getSelectedFrontpadArticle(),
                title: cardTitle ? cardTitle.textContent.trim() : '',
                image: cardImage ? cardImage.src : '',
                info: cardInfo ? cardInfo.textContent.trim() : '',
                finalPrice: finalPrice,
                quantity: 1,
                options: getSelectedOptionsData()
            };

            const cart = getCart();
            const newKey = getCartItemKey(cartItem);

            const existingItem = cart.find((item) => getCartItemKey(item) === newKey);

            if (existingItem) {
                existingItem.quantity = (existingItem.quantity || 1) + 1;
            } else {
                cart.push(cartItem);
            }

            saveCart(cart);
        }

        function initHighlights() {
            const optionGroups = card.querySelectorAll('[data-option]');
            optionGroups.forEach(moveHighlight);
        }

        function updateOptionButtonLabels() {
            const freeBorderOnSize50 = card.dataset.freeBorderOnSize50 === 'true';
            const selectedSizeValue = getSelectedSizeValue();

            const allButtons = card.querySelectorAll('[data-option] button');

            allButtons.forEach((btn) => {
                const parentGroup = btn.closest('[data-option]');
                const groupKey = parentGroup ? parentGroup.dataset.option : '';
                const label = btn.dataset.label || '';
                const originalPrice = parseFloat(btn.dataset.price || '0');

                let displayPrice = originalPrice;

                if (
                    (freeBorderOnSize50 && groupKey === 'extra' && selectedSizeValue === '50') ||
                    (groupKey === 'extra' && isFreeBorderByArticle())
                ) {
                    displayPrice = 0;
                }

                if (displayPrice > 0) {
                    btn.innerHTML = `<span>${label} +${Math.round(displayPrice)}<span>₽</span></span>`;
                } else {
                    btn.textContent = label;
                }
            });
        }

        function updateModalPrice() {
            toggleBlockedPizzaOptions();

            if (cardPrice) {
                cardPrice.innerHTML = formatPrice(getCurrentModalPrice());
            }

            updateOptionButtonLabels();
        }

        function buildOptionGroupClass(groupKey) {
            const map = {
                size: 'card__content-sizes',
                extra: 'card__content-extra'
            };

            return map[groupKey] || 'card__option';
        }

        function renderOptions(groups) {
            if (!cardOptions) return;

            cardOptions.innerHTML = '';

            if (!groups || !groups.length) return;

            groups.forEach((group) => {
                const wrapper = document.createElement('div');
                wrapper.className = `${buildOptionGroupClass(group.key)} option-group`;
                wrapper.dataset.option = group.key;

                if (group.allow_empty) {
                    wrapper.dataset.allowEmpty = 'true';
                }

                if (group.is_multiple) {
                    wrapper.dataset.multiple = 'true';
                }

                const highlight = document.createElement('span');
                highlight.className = 'option-highlight';
                wrapper.appendChild(highlight);

                group.items.forEach((item) => {
                    const btn = document.createElement('button');
                    btn.className = 'text';
                    btn.type = 'button';
                    btn.setAttribute('aria-pressed', item.is_default ? 'true' : 'false');

                    if (item.is_default) {
                        btn.classList.add('active');
                    }

                    btn.dataset.value = item.value || '';
                    btn.dataset.price = item.price || 0;
                    btn.dataset.label = item.label || '';
                    btn.dataset.frontpadArticle = item.frontpad_article || '';
                    btn.dataset.frontpadFreeArticle = item.frontpad_free_article || '';

                    if (item.price && Number(item.price) > 0) {
                        btn.innerHTML = `<span>${item.label} +${Math.round(item.price)}<span>₽</span></span>`;
                    } else {
                        btn.textContent = item.label;
                    }

                    wrapper.appendChild(btn);
                });

                cardOptions.appendChild(wrapper);
            });
        }

        function bindOptionGroups() {
            const optionGroups = card.querySelectorAll('[data-option]');

            optionGroups.forEach((group) => {
                group.addEventListener('click', (e) => {
                    const target = normalizeTarget(e.target);
                    const btn = target ? target.closest('button') : null;
                    if (!btn || !group.contains(btn)) return;

                    const allowEmpty = group.dataset.allowEmpty === 'true';
                    const isMultiple = group.dataset.multiple === 'true';
                    const isAlreadyActive = btn.classList.contains('active');

                    if (isMultiple) {
                        btn.classList.toggle('active');
                        btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');
                        updateModalPrice();
                        moveHighlight(group);
                        return;
                    }

                    if (allowEmpty && isAlreadyActive) {
                        btn.classList.remove('active');
                        btn.setAttribute('aria-pressed', 'false');
                        updateModalPrice();
                        moveHighlight(group);
                        return;
                    }

                    group.querySelectorAll('button').forEach((b) => {
                        b.classList.remove('active');
                        b.setAttribute('aria-pressed', 'false');
                    });

                    btn.classList.add('active');
                    btn.setAttribute('aria-pressed', 'true');

                    updateModalPrice();
                    moveHighlight(group);
                });
            });

            window.addEventListener('resize', initHighlights);
        }

        function fillCard(product) {
            card.dataset.productId = product.id;
            card.dataset.frontpadArticle = product.frontpad_article || '';
            card.dataset.basePrice = product.base_price || 0;
            card.dataset.rollsCount = product.rolls_count || 1;
            card.dataset.productCategories = Array.isArray(product.categories)
                ? product.categories.join(',')
                : '';
            card.dataset.freeBorderOnSize50 = product.free_border_on_size_50 ? 'true' : 'false';

            if (cardImage) {
                cardImage.src = product.image || '';
                cardImage.alt = product.title || '';
            }

            if (cardTitle) {
                cardTitle.textContent = product.title || '';
            }

            if (cardInfo) {
                cardInfo.textContent = product.modal_info || '';
            }

            if (cardDescription) {
                cardDescription.innerHTML = product.modal_description || '';
            }

            renderOptions(product.option_groups || []);
            bindOptionGroups();
            updateModalPrice();
            togglePersonaCounter();

            requestAnimationFrame(() => {
                requestAnimationFrame(initHighlights);
            });
        }

        async function loadProduct(productId) {
            const formData = new FormData();
            formData.append('action', 'cuba_get_product_modal_data');
            formData.append('product_id', productId);

            const response = await fetch(cubaCardData.ajax_url, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Ошибка запроса');
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.data || 'Не удалось загрузить товар');
            }

            return data.data;
        }
        
        //временно
        let mockOptionsBound = false;
        async function openCard(productId) {
            card.classList.add(CLASS_ACTIVE);
            overlay.classList.add(CLASS_ACTIVE);
            body.classList.add(CLASS_HIDDEN);
            if (!mockOptionsBound) {
                bindOptionGroups();
                mockOptionsBound = true;
            }
            requestAnimationFrame(() => {
                initHighlights();
            });
        }






        function closeCard() {
            card.classList.remove(CLASS_ACTIVE);
            overlay.classList.remove(CLASS_ACTIVE);
            body.classList.remove(CLASS_HIDDEN);
        }

        triggers.forEach((trigger) => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = trigger.dataset.id || null;
                if (!productId) return;
                openCard(productId);
            });
        });

        card.addEventListener('click', (e) => {
            e.stopPropagation();

            const target = normalizeTarget(e.target);
            if (!target) return;

            if (target.closest('[data-persona-minus]')) {
                setPersonaCount(getPersonaCount() - 1);
                return;
            }

            if (target.closest('[data-persona-plus]')) {
                setPersonaCount(getPersonaCount() + 1);
                return;
            }

            if (target.closest('.card__close')) {
                closeCard();
                return;
            }

            if (target.closest('.card__content-add')) {
                closeCard();
            }
        });

        overlay.addEventListener('click', closeCard);

        document.addEventListener('click', (e) => {
            const target = normalizeTarget(e.target);

            if (
                card.classList.contains(CLASS_ACTIVE) &&
                target &&
                !target.closest('.card') &&
                !target.closest('.menu__item-overlay')
            ) {
                closeCard();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeCard();
            }
        });
    })();
});