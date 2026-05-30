document.addEventListener('DOMContentLoaded', function () {
    const STORAGE_KEY = 'cuba_cart';
    
    function isOrderAllowed() {
        const now = new Date();
    
        const moscowTime = new Date(
            now.toLocaleString('en-US', { timeZone: 'Europe/Moscow' })
        );
    
        const hours = moscowTime.getHours();
    
        return hours >= 10 && hours <= 23;
    }

    let deliveryTimer = null;
    let deliveryRequestId = 0;

    function getCart() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch (e) {
            return [];
        }
    }

    function formatPrice(price) {
        return Math.round(price);
    }

    function getMessagesContainer() {
        return document.querySelector('[data-form-messages]');
    }

    function clearMessages() {
        const container = getMessagesContainer();
        if (container) container.innerHTML = '';
    }

    function showMessage(text, type = 'error') {
        const container = getMessagesContainer();

        if (!container) {
            console.log(text);
            return;
        }

        container.innerHTML = '';

        const message = document.createElement('div');
        message.className = `form__message form__message--${type}`;
        message.textContent = text;

        container.appendChild(message);

        container.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }
    
    function parseDeliveryTimeToMinutes(time = '') {
        const text = String(time).toLowerCase().trim();
    
        const hourMinuteMatch = text.match(/(\d+)\s*:\s*(\d+)/);
        if (hourMinuteMatch) {
            return parseInt(hourMinuteMatch[1], 10) * 60 + parseInt(hourMinuteMatch[2], 10);
        }
    
        const hourMatch = text.match(/(\d+)\s*час/);
        if (hourMatch) {
            return parseInt(hourMatch[1], 10) * 60;
        }
    
        const minuteMatch = text.match(/(\d+)\s*мин/);
        if (minuteMatch) {
            return parseInt(minuteMatch[1], 10);
        }
    
        const numberMatch = text.match(/\d+/);
        if (numberMatch) {
            return parseInt(numberMatch[0], 10);
        }
    
        return 0;
    }
    
    function formatDeliveryMinutes(minutes) {
        if (!minutes) return '';
    
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
    
        if (hours && mins) {
            return `${hours} ч ${mins} мин`;
        }
    
        if (hours) {
            return `${hours} ч`;
        }
    
        return `${mins} мин`;
    }
    
    function getFinalDeliveryTime(zoneTime = '', zone = null) {
        const deliveryTimes = window.cubaCheckoutData?.delivery_times || {};
        const branchKey = getDeliveryBranchKey(zone);
    
        const branchTime = deliveryTimes[branchKey] || '';
    
        const extraMinutes = parseDeliveryTimeToMinutes(branchTime);
        const zoneMinutes = parseDeliveryTimeToMinutes(zoneTime);
    
        return formatDeliveryMinutes(zoneMinutes + extraMinutes);
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

    function getCartSubtotal(cart) {
        return cart.reduce((sum, item) => {
            return sum + ((item.finalPrice || 0) * (item.quantity || 1));
        }, 0);
    }

    function getItemSizeNumber(item) {
        const size = item.options?.size;

        if (!size) return 0;

        const value = size.value || size.label || '';
        const match = String(value).match(/\d+/);

        return match ? parseInt(match[0], 10) : 0;
    }

    function hasFreeDeliveryPizza(cart) {
        return cart.some((item) => {
            const categories = Array.isArray(item.categories) ? item.categories : [];
            const size = getItemSizeNumber(item);
    
            const isPizza =
                categories.includes('pizza') ||
                categories.includes('pizza-50');
    
            return isPizza && size >= 33;
        });
    }

    function getBaseDeliveryPrice(cart) {
        const subtotal = getCartSubtotal(cart);

        if (subtotal >= 1500) return 0;
        if (hasFreeDeliveryPizza(cart)) return 0;

        return 220;
    }
    
    function getPickupDiscount(cart = getCart()) {
        const deliveryType = document.querySelector('input[name="delivery_type"]:checked');
    
        if (deliveryType && deliveryType.value === 'pickup' && hasFreeDeliveryPizza(cart)) {
            return 200;
        }
    
        return 0;
    }

    function getCurrentDeliveryPrice() {
        const deliveryType = document.querySelector('input[name="delivery_type"]:checked');
        const deliveryPriceInput = document.querySelector('input[name="delivery_price"]');

        if (!deliveryType) return 0;
        if (deliveryType.value === 'pickup') return 0;

        const cart = getCart();
        const baseDeliveryPrice = getBaseDeliveryPrice(cart);

        const zoneDeliveryPrice = deliveryPriceInput
            ? parseFloat(deliveryPriceInput.value || '0')
            : 0;

        return baseDeliveryPrice + (Number.isNaN(zoneDeliveryPrice) ? 0 : zoneDeliveryPrice);
    }

    function updateCheckoutTotal() {
        const cart = getCart();
        const subtotal = getCartSubtotal(cart);
        const deliveryPrice = getCurrentDeliveryPrice();
        const pickupDiscount = getPickupDiscount(cart);
        const total = Math.max(0, subtotal + deliveryPrice - pickupDiscount);

        const totalWrapper = document.querySelector('.form__order > .form__order-price');
        if (!totalWrapper) return;

        const totalStrong = totalWrapper.querySelector('strong');
        if (!totalStrong) return;

        const valueSpan = totalStrong.querySelector('span:first-child');
        if (valueSpan) {
            valueSpan.textContent = formatPrice(total);
        }
    }

    function renderCheckoutOrder() {
        let cart = getCart();
        cart = syncGunkanGift(cart);
        
        const orderBlock = document.querySelector('.form__order');
        if (!orderBlock) return;

        const orderList = orderBlock.querySelector('ul');
        if (!orderList) return;

        if (!cart.length) {
            orderList.innerHTML = `
                <li>
                    <p class="text">Корзина пуста</p>
                </li>
            `;
            updateCheckoutTotal();
            return;
        }

        const itemsHtml = cart.map((item) => {
            const optionText = getOptionText(item.options);
            const infoText = optionText || item.info || '';
            const itemTotal = (item.finalPrice || 0) * (item.quantity || 1);

            return `
                <li>
                    <div class="form__order-left">
                        <p class="form__order-title text">
                            <span>${item.title || ''}</span>
                            <span>x</span>
                            <span>${item.quantity || 1} шт.</span>
                        </p>
                        ${infoText ? `<p class="text form__order-about">${infoText}</p>` : ''}
                    </div>
                    <strong class="form__order-price text">
                        <span>${formatPrice(itemTotal)}</span><span>₽</span>
                    </strong>
                </li>
            `;
        }).join('');

        const deliveryPrice = getCurrentDeliveryPrice();
        const pickupDiscount = getPickupDiscount(cart);

        const deliveryHtml = `
            <li>
                <p class="text">Доставка</p>
                <strong class="form__order-price text">
                    <span>${formatPrice(deliveryPrice)}</span><span>₽</span>
                </strong>
            </li>
        `;
        
        const discountHtml = pickupDiscount > 0
        ? `
            <li>
                <p class="text">Скидка за самовывоз</p>
                <strong class="form__order-price text">
                    <span>-${formatPrice(pickupDiscount)}</span><span>₽</span>
                </strong>
            </li>
        `
        : '';

        orderList.innerHTML = itemsHtml + deliveryHtml + discountHtml;
        updateCheckoutTotal();
    }

    function setDeliveryStatus(message = '', type = '') {
        const statusEl = document.querySelector('[data-delivery-status]');
        if (!statusEl) return;

        statusEl.textContent = message;
        statusEl.classList.remove('is-error', 'is-success', 'is-muted');

        if (type) {
            statusEl.classList.add(type);
        }
    }

    function clearDeliveryData() {
        const latInput = document.querySelector('input[name="address_lat"]');
        const lngInput = document.querySelector('input[name="address_lng"]');
        const zoneInput = document.querySelector('input[name="delivery_zone"]');
        const priceInput = document.querySelector('input[name="delivery_price"]');
        const timeInput = document.querySelector('input[name="delivery_time"]');
        const pointInput = document.querySelector('input[name="delivery_point"]');
        const operatorInput = document.querySelector('input[name="need_operator_clarification"]');
        
        if (operatorInput) operatorInput.value = '';
        if (latInput) latInput.value = '';
        if (lngInput) lngInput.value = '';
        if (zoneInput) zoneInput.value = '';
        if (priceInput) priceInput.value = '0';
        if (timeInput) timeInput.value = '';
        if (pointInput) pointInput.value = '';
    }

    //временно
    // function isPointInPolygon(point, polygon) {
    //     const lat = point[0];
    //     const lng = point[1];
    //     let inside = false;
    
    //     for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    //         const latI = polygon[i][0];
    //         const lngI = polygon[i][1];
    //         const latJ = polygon[j][0];
    //         const lngJ = polygon[j][1];
    
    //         const intersect =
    //             ((lngI > lng) !== (lngJ > lng)) &&
    //             (lat < ((latJ - latI) * (lng - lngI)) / (lngJ - lngI) + latI);
    
    //         if (intersect) inside = !inside;
    //     }
    
    //     return inside;
    // }

    // function findDeliveryZoneByCoords(coords) {
    //     const zones = typeof DELIVERY_ZONES !== 'undefined' ? DELIVERY_ZONES : window.DELIVERY_ZONES;
    //     if (!Array.isArray(zones)) return null;
    
    //     const sortedZones = [...zones].sort((a, b) => {
    //         return Number(a.needOperatorClarification) - Number(b.needOperatorClarification);
    //     });
    
    //     for (const zone of sortedZones) {
    //         if (isPointInPolygon(coords, zone.polygon)) {
    //             return zone;
    //         }
    //     }
    
    //     return null;
    // }

    // function normalizeAddressString(str) {
    //     return (str || '')
    //         .toLowerCase()
    //         .replace(/ё/g, 'е')
    //         .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, ' ')
    //         .replace(/\s+/g, ' ')
    //         .trim();
    // }

    // function hasEnoughLetters(str) {
    //     const letters = (str || '').replace(/[^a-zа-яё]/gi, '');
    //     return letters.length >= 4;
    // }

    // function isLocalAddress(foundAddress) {
    //     const text = normalizeAddressString(foundAddress);
    //     return text.includes('курск') || text.includes('курская область');
    // }

    // function isGeocodeMatchValid(inputAddress, house, foundAddress) {
    //     const input = normalizeAddressString(inputAddress);
    //     const found = normalizeAddressString(foundAddress);
    //     const houseValue = normalizeAddressString(house);

    //     if (!input || !found) return false;

    //     const inputTokens = input.split(' ').filter(token => token.length >= 3);
    //     if (!inputTokens.length) return false;

    //     const matchedTokens = inputTokens.filter(token => found.includes(token));
    //     const tokenMatchRatio = matchedTokens.length / inputTokens.length;

    //     if (tokenMatchRatio < 0.5) return false;

    //     if (houseValue) {
    //         const houseDigits = houseValue.match(/\d+/);
    //         if (houseDigits && !found.includes(houseDigits[0])) {
    //             return false;
    //         }
    //     }

    //     return true;
    // }

    // function buildFullAddress() {
    //     const addressInput = document.querySelector('input[name="address"]');
    //     const houseInput = document.querySelector('input[name="house"]');

    //     if (!addressInput || !houseInput) return '';

    //     let address = addressInput.value.trim();
    //     const house = houseInput.value.trim();

    //     if (!address) return '';

    //     const lowerAddress = address.toLowerCase();
    //     const hasRegionOrCity =
    //         lowerAddress.includes('курск') ||
    //         lowerAddress.includes('курская') ||
    //         lowerAddress.includes('область') ||
    //         lowerAddress.includes('район') ||
    //         lowerAddress.includes('пос.') ||
    //         lowerAddress.includes('поселок') ||
    //         lowerAddress.includes('посёлок') ||
    //         lowerAddress.includes('деревня') ||
    //         lowerAddress.includes('д.') ||
    //         lowerAddress.includes('село') ||
    //         lowerAddress.includes('слобода');

    //     if (!hasRegionOrCity) {
    //         address = `Курск, ${address}`;
    //     }

    //     return `${address}, ${house}`;
    // }

    // function geocodeAddress(address) {
    //     return new Promise((resolve, reject) => {
    //         if (typeof ymaps === 'undefined') {
    //             reject(new Error('Yandex Maps API не загружен'));
    //             return;
    //         }

    //         ymaps.ready(function () {
    //             ymaps.geocode(address, {
    //                 results: 1,
    //                 boundedBy: [
    //                     [51.40, 35.70],
    //                     [52.10, 37.10]
    //                 ],
    //                 strictBounds: false
    //             }).then(function (res) {
    //                 const firstGeoObject = res.geoObjects.get(0);

    //                 if (!firstGeoObject) {
    //                     reject(new Error('Адрес не найден'));
    //                     return;
    //                 }

    //                 const coords = firstGeoObject.geometry.getCoordinates();
    //                 const meta = firstGeoObject.properties.get('metaDataProperty');
    //                 const geocoderMetaData = meta ? meta.GeocoderMetaData : null;

    //                 resolve({
    //                     coords,
    //                     foundAddress: geocoderMetaData?.text || '',
    //                     precision: geocoderMetaData?.precision || '',
    //                     kind: geocoderMetaData?.kind || ''
    //                 });
    //             }).catch(reject);
    //         });
    //     });
    // }

    // async function calculateDeliveryByAddress() {
    //     const currentRequestId = ++deliveryRequestId;

    //     const deliveryType = document.querySelector('input[name="delivery_type"]:checked');
    //     if (!deliveryType || deliveryType.value !== 'delivery') {
    //         clearDeliveryData();
    //         setDeliveryStatus('');
    //         renderCheckoutOrder();
    //         return;
    //     }

    //     const addressField = document.querySelector('input[name="address"]');
    //     const houseField = document.querySelector('input[name="house"]');

    //     const addressValue = addressField ? addressField.value.trim() : '';
    //     const houseValue = houseField ? houseField.value.trim() : '';

    //     if (!addressValue || !hasEnoughLetters(addressValue)) {
    //         clearDeliveryData();
    //         setDeliveryStatus('');
    //         renderCheckoutOrder();
    //         return;
    //     }

    //     if (!houseValue || houseValue.length < 1) {
    //         clearDeliveryData();
    //         setDeliveryStatus('Введите номер дома для точного расчёта.', 'is-muted');
    //         renderCheckoutOrder();
    //         return;
    //     }

    //     const fullAddress = buildFullAddress();

    //     try {
    //         setDeliveryStatus('Проверяем адрес...', 'is-muted');

    //         const geocodeResult = await geocodeAddress(fullAddress);

    //         if (currentRequestId !== deliveryRequestId) return;

    //         const coords = geocodeResult.coords;
    //         const foundAddress = geocodeResult.foundAddress || '';
    //         const precision = geocodeResult.precision || '';

    //         if (!isLocalAddress(foundAddress)) {
    //             clearDeliveryData();
    //             setDeliveryStatus('Найден адрес вне Курска и Курской области. Уточните адрес.', 'is-error');
    //             renderCheckoutOrder();
    //             return;
    //         }

    //         if (!isGeocodeMatchValid(addressValue, houseValue, foundAddress)) {
    //             clearDeliveryData();
    //             setDeliveryStatus('Не удалось точно определить адрес. Уточните улицу и дом.', 'is-error');
    //             renderCheckoutOrder();
    //             return;
    //         }

    //         if (precision && !['exact', 'number'].includes(precision)) {
    //             clearDeliveryData();
    //             setDeliveryStatus('Дом найден неточно. Проверьте номер дома.', 'is-error');
    //             renderCheckoutOrder();
    //             return;
    //         }

    //         const latInput = document.querySelector('input[name="address_lat"]');
    //         const lngInput = document.querySelector('input[name="address_lng"]');
    //         const zoneInput = document.querySelector('input[name="delivery_zone"]');
    //         const priceInput = document.querySelector('input[name="delivery_price"]');
    //         const timeInput = document.querySelector('input[name="delivery_time"]');
    //         const pointInput = document.querySelector('input[name="delivery_point"]');

    //         if (latInput) latInput.value = coords[0];
    //         if (lngInput) lngInput.value = coords[1];

    //         const zone = findDeliveryZoneByCoords(coords);

    //         if (!zone) {
    //             clearDeliveryData();
    //             setDeliveryStatus('Адрес вне зоны доставки', 'is-error');
    //             renderCheckoutOrder();
    //             return;
    //         }
            
    //         if (zone.needOperatorClarification) {
    //             clearDeliveryData();
            
    //             const latInput = document.querySelector('input[name="address_lat"]');
    //             const lngInput = document.querySelector('input[name="address_lng"]');
    //             const zoneInput = document.querySelector('input[name="delivery_zone"]');
    //             const operatorInput = document.querySelector('input[name="need_operator_clarification"]');
            
    //             if (latInput) latInput.value = coords[0];
    //             if (lngInput) lngInput.value = coords[1];
    //             if (zoneInput) zoneInput.value = zone.description || 'Время и стоимость доставки уточняйте у оператора';
    //             if (operatorInput) operatorInput.value = '1';
            
    //             setDeliveryStatus(
    //                 'Ваш адрес находится в зоне, где время и стоимость доставки нужно уточнить у оператора. Пожалуйста, свяжитесь с нами по телефону 55-00-15.',
    //                 'is-error'
    //             );
            
    //             renderCheckoutOrder();
    //             return;
    //         }

    //         if (zoneInput) zoneInput.value = zone.description || '';
    //         if (priceInput) priceInput.value = String(zone.price || 0);
    //         if (timeInput) timeInput.value = getFinalDeliveryTime(zone.time, zone);
    //         if (pointInput) pointInput.value = zone.point || '';

    //         const deliveryPrice = getCurrentDeliveryPrice();

    //         const finalDeliveryTime = getFinalDeliveryTime(zone.time, zone);

    //         const deliveryTimeText = finalDeliveryTime
    //             ? ` Доставка в течение ${finalDeliveryTime}.`
    //             : '';
            
    //         setDeliveryStatus(
    //             `Адрес найден. Доставка: ${formatPrice(deliveryPrice)} ₽.${deliveryTimeText}`,
    //             'is-success'
    //         );

    //         renderCheckoutOrder();
    //     } catch (error) {
    //         console.error('Ошибка расчёта доставки:', error);
        
    //         if (currentRequestId !== deliveryRequestId) return;
        
    //         clearDeliveryData();
    //         setDeliveryStatus('Не удалось определить адрес. Проверьте написание.', 'is-error');
    //         renderCheckoutOrder();
    //     }
    // }

    function getDeliveryDetails() {
        const entranceInput = document.querySelector('input[name="entrance"]');
        const floorInput = document.querySelector('input[name="floor"]');
        const apartmentInput = document.querySelector('input[name="apartment"]');

        const entrance = entranceInput ? entranceInput.value.trim() : '';
        const floor = floorInput ? floorInput.value.trim() : '';
        const apartment = apartmentInput ? apartmentInput.value.trim() : '';

        return {
            entrance,
            floor,
            apartment,
            full: [
                entrance ? `Подъезд: ${entrance}` : '',
                floor ? `Этаж: ${floor}` : '',
                apartment ? `Квартира: ${apartment}` : ''
            ].filter(Boolean).join(', ')
        };
    }

    function getPickupPointByAddress(address = '') {
        const text = String(address).toLowerCase();

        if (text.includes('дериглазова')) {
            return '391';
        }

        if (text.includes('кулакова')) {
            return '392';
        }

        return '';
    }
    
    function getPickupMessageByAddress(address = '') {
        const text = String(address).toLowerCase();
        const pickupTimes = window.cubaCheckoutData?.pickup_times || {};
    
        let time = '30 минут';
    
        if (text.includes('дериглазова')) {
            time = pickupTimes.derig || time;
        } else if (text.includes('кулакова')) {
            time = pickupTimes.kulakova || time;
        } else if (text.includes('хрущева') || text.includes('хрущёва')) {
            time = pickupTimes.hruscheva || time;
        }
    
        return `Ваш заказ будет приготовлен в течение ${time}. Пожалуйста, сохраните данные заказа для предоставления.`;
    }

    function getCheckoutOrderData() {
        const cart = getCart();

        const nameInput = document.querySelector('input[name="customer_name"]');
        const phoneInput = document.querySelector('input[name="customer_phone"]');
        const commentInput = document.querySelector('input[name="comment"]');

        const deliveryTypeInput = document.querySelector('input[name="delivery_type"]:checked');
        const paymentInput = document.querySelector('input[name="payment"]:checked');
        const cashChangeInput = document.querySelector('input[name="cash_change"]');

        const pickupAddressText = document.querySelector('#addressSelect .form__select-current .text');

        const addressInput = document.querySelector('input[name="address"]');
        const houseInput = document.querySelector('input[name="house"]');

        const addressLatInput = document.querySelector('input[name="address_lat"]');
        const addressLngInput = document.querySelector('input[name="address_lng"]');
        const deliveryZoneInput = document.querySelector('input[name="delivery_zone"]');
        const deliveryPriceInput = document.querySelector('input[name="delivery_price"]');
        const deliveryTimeInput = document.querySelector('input[name="delivery_time"]');
        const deliveryPointInput = document.querySelector('input[name="delivery_point"]');
        const operatorInput = document.querySelector('input[name="need_operator_clarification"]');

        const deliveryType = deliveryTypeInput ? deliveryTypeInput.value : 'pickup';
        const paymentType = paymentInput ? paymentInput.value : 'card';

        const cartSubtotal = getCartSubtotal(cart);

        const zoneDeliveryPrice = deliveryPriceInput
            ? parseFloat(deliveryPriceInput.value || '0') || 0
            : 0;

        const baseDeliveryPrice = deliveryType === 'delivery'
            ? getBaseDeliveryPrice(cart)
            : 0;

        const deliveryPrice = deliveryType === 'delivery'
            ? baseDeliveryPrice + zoneDeliveryPrice
            : 0;
            
        const pickupDiscount = deliveryType === 'pickup' && hasFreeDeliveryPizza(cart) ? 200 : 0;

        const total = Math.max(0, cartSubtotal + deliveryPrice - pickupDiscount);

        const cashChangeFrom = cashChangeInput
            ? parseFloat(cashChangeInput.value.replace(',', '.') || '0')
            : 0;

        const cashChangeAmount = paymentType === 'cash' && cashChangeFrom > total
            ? cashChangeFrom - total
            : 0;

        const deliveryDetails = getDeliveryDetails();

        const pickupAddress = deliveryType === 'pickup' && pickupAddressText
            ? pickupAddressText.textContent.trim()
            : '';

        const deliveryPoint = deliveryType === 'pickup'
            ? getPickupPointByAddress(pickupAddress)
            : (deliveryPointInput ? deliveryPointInput.value.trim() : '');

        const cartForOrder = [...cart];

        if (deliveryType === 'delivery') {
            if (baseDeliveryPrice === 220) {
                cartForOrder.push({
                    product_id: 'delivery-220',
                    frontpad_article: '18',
                    title: 'Доставка 220',
                    image: '',
                    info: '',
                    finalPrice: 220,
                    quantity: 1,
                    options: {}
                });
            }
        
            if (zoneDeliveryPrice === 50) {
                cartForOrder.push({
                    product_id: 'delivery-50',
                    frontpad_article: '15',
                    title: 'Доставка 50',
                    image: '',
                    info: '',
                    finalPrice: 50,
                    quantity: 1,
                    options: {}
                });
            }
        
            if (zoneDeliveryPrice === 100) {
                cartForOrder.push({
                    product_id: 'delivery-100',
                    frontpad_article: '16',
                    title: 'Доставка 100',
                    image: '',
                    info: '',
                    finalPrice: 100,
                    quantity: 1,
                    options: {}
                });
            }
        }

        return {
            customer: {
                name: nameInput ? nameInput.value.trim() : '',
                phone: phoneInput ? phoneInput.value.trim() : '',
                comment: commentInput ? commentInput.value.trim() : ''
            },
            delivery: {
                type: deliveryType,
                point: deliveryPoint,
                pickup_address: pickupAddress,
                address: deliveryType === 'delivery' && addressInput ? addressInput.value.trim() : '',
                house: deliveryType === 'delivery' && houseInput ? houseInput.value.trim() : '',
                entrance: deliveryType === 'delivery' ? deliveryDetails.entrance : '',
                floor: deliveryType === 'delivery' ? deliveryDetails.floor : '',
                apartment: deliveryType === 'delivery' ? deliveryDetails.apartment : '',
                details: deliveryType === 'delivery' ? deliveryDetails.full : '',
                lat: addressLatInput ? addressLatInput.value.trim() : '',
                lng: addressLngInput ? addressLngInput.value.trim() : '',
                zone: deliveryZoneInput ? deliveryZoneInput.value.trim() : '',
                price: deliveryPrice,
                base_price: baseDeliveryPrice,
                zone_price: zoneDeliveryPrice,
                time: deliveryTimeInput ? deliveryTimeInput.value.trim() : '',
                need_operator_clarification: operatorInput ? operatorInput.value.trim() === '1' : false
            },
            payment: {
                type: paymentType,
                cash_change_from: paymentType === 'cash' ? cashChangeFrom : 0,
                cash_change_amount: paymentType === 'cash' ? cashChangeAmount : 0
            },
            cart: cartForOrder,
            totals: {
                subtotal: cartSubtotal,
                delivery: deliveryPrice,
                discount: pickupDiscount,
                total: total
            }
        };
    }

    const customAddressSelect = document.querySelector('#addressSelect');

    if (customAddressSelect) {
        const customAddressSelectCurrent = customAddressSelect.querySelector('.form__select-current');
        const customAddressSelectCurrentText = customAddressSelect.querySelector('.form__select-current .text');
        const customAddressSelectItems = customAddressSelect.querySelectorAll('.form__select-list li');

        if (customAddressSelectCurrent && customAddressSelectCurrentText && customAddressSelectItems.length) {
            customAddressSelectCurrent.addEventListener('click', function (e) {
                e.stopPropagation();
                customAddressSelect.classList.toggle('open');
            });

            customAddressSelectItems.forEach(function (item) {
                item.addEventListener('click', function (e) {
                    e.stopPropagation();

                    const currentAddressText = customAddressSelectCurrentText.textContent.trim();
                    const selectedAddressText = item.textContent.trim();

                    customAddressSelectCurrentText.textContent = selectedAddressText;
                    item.textContent = currentAddressText;

                    customAddressSelect.classList.remove('open');
                    
                    const selectedDeliveryType = document.querySelector('input[name="delivery_type"]:checked');

                    if (selectedDeliveryType && selectedDeliveryType.value === 'pickup') {
                        const pickupAddress = customAddressSelectCurrentText.textContent.trim();
            
                        setDeliveryStatus(
                            getPickupMessageByAddress(pickupAddress),
                            'is-muted'
                        );
                    }
                });
            });

            document.addEventListener('click', function (e) {
                if (!customAddressSelect.contains(e.target)) {
                    customAddressSelect.classList.remove('open');
                }
            });
        }
    }

    const deliveryTypeRadios = document.querySelectorAll('input[name="delivery_type"]');
    const pickupBlock = document.querySelector('.form__pickup');
    const deliveryBlock = document.querySelector('.form__delivery');
    const deliveryInputs = document.querySelectorAll('.form__address input');

    if (deliveryTypeRadios.length && pickupBlock && deliveryBlock && deliveryInputs.length) {
        function toggleDeliveryTypeBlocks() {
            const selectedDeliveryType = document.querySelector('input[name="delivery_type"]:checked');
            if (!selectedDeliveryType) return;

            if (selectedDeliveryType.value === 'pickup') {
                pickupBlock.style.display = 'flex';
                deliveryBlock.style.display = 'none';

                deliveryInputs.forEach(function (input) {
                    input.removeAttribute('required');
                });

                clearDeliveryData();
                const pickupAddressText = document.querySelector('#addressSelect .form__select-current .text');
                
                const pickupAddress = pickupAddressText
                    ? pickupAddressText.textContent.trim()
                    : '';
                
                setDeliveryStatus(
                    getPickupMessageByAddress(pickupAddress),
                    'is-muted'
                );
            } else {
                pickupBlock.style.display = 'none';
                deliveryBlock.style.display = 'flex';

                deliveryInputs.forEach(function (input) {
                    if (input.name === 'address' || input.name === 'house') {
                        input.setAttribute('required', 'required');
                    } else {
                        input.removeAttribute('required');
                    }
                });

                clearDeliveryData();
                setDeliveryStatus('');
            }

            renderCheckoutOrder();
        }

        toggleDeliveryTypeBlocks();

        deliveryTypeRadios.forEach(function (radio) {
            radio.addEventListener('change', toggleDeliveryTypeBlocks);
        });
    }


    const deliveryPriceInput = document.querySelector('input[name="delivery_price"]');

    if (deliveryPriceInput) {
        deliveryPriceInput.addEventListener('input', renderCheckoutOrder);
        deliveryPriceInput.addEventListener('change', renderCheckoutOrder);
    }

    const addressInput = document.querySelector('input[name="address"]');
    const houseInput = document.querySelector('input[name="house"]');

    function debounceDeliveryCalculation() {
        clearTimeout(deliveryTimer);

        deliveryTimer = setTimeout(() => {
            calculateDeliveryByAddress();
        }, 700);
    }

    //временно
    // if (addressInput) {
    //     addressInput.addEventListener('input', debounceDeliveryCalculation);
    //     addressInput.addEventListener('blur', calculateDeliveryByAddress);
    //     addressInput.addEventListener('change', calculateDeliveryByAddress);
    // }

    // if (houseInput) {
    //     houseInput.addEventListener('input', debounceDeliveryCalculation);
    //     houseInput.addEventListener('blur', calculateDeliveryByAddress);
    //     houseInput.addEventListener('change', calculateDeliveryByAddress);
    // }

    renderCheckoutOrder();

    //временно
    // async function submitOrderToFrontPad(orderData) {
    //     const formData = new FormData();

    //     formData.append('action', 'cuba_submit_order');
    //     formData.append('nonce', cubaCheckoutData.nonce);
    //     formData.append('order', JSON.stringify(orderData));

    //     try {
    //         showMessage('Отправляем заказ...', 'info');

    //         const response = await fetch(cubaCheckoutData.ajax_url, {
    //             method: 'POST',
    //             body: formData
    //         });

    //         const data = await response.json();

    //         if (!data.success) {
    //             const errorMessage =
    //                 data.data?.message ||
    //                 data.message ||
    //                 'Корзина пуста';
            
    //             showMessage(errorMessage, 'error');
    //             return;
    //         }

    //         const fp = data.data?.frontpad_response || '';

    //         if (!fp || fp.toLowerCase().includes('error')) {
    //             showMessage('Ошибка FrontPad: ' + fp, 'error');
    //             return;
    //         }

    //         console.log('Ответ FrontPad:', data.data);

    //         localStorage.removeItem(STORAGE_KEY);
    //         renderCheckoutOrder();

    //         window.location.href = '/thanks/';
    //     } catch (error) {
    //         console.error('Ошибка отправки заказа:', error);
    //         showMessage('Ошибка отправки заказа. Попробуйте ещё раз.', 'error');
    //     }
    // }

    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const cashChangeBlock = document.querySelector('[data-cash-change]');

    function toggleCashChangeBlock() {
        const selectedPayment = document.querySelector('input[name="payment"]:checked');

        if (!cashChangeBlock || !selectedPayment) return;

        if (selectedPayment.value === 'cash') {
            cashChangeBlock.classList.add('active');
        } else {
            cashChangeBlock.classList.remove('active');

            const cashChangeInput = cashChangeBlock.querySelector('input[name="cash_change"]');
            if (cashChangeInput) {
                cashChangeInput.value = '';
                cashChangeInput.classList.remove('is-error');
            }
        }
    }

    paymentRadios.forEach((radio) => {
        radio.addEventListener('change', toggleCashChangeBlock);
    });

    toggleCashChangeBlock();

    const agreeInput = document.querySelector('input[name="agree"]');

    if (agreeInput) {
        agreeInput.addEventListener('change', () => {
            const agreeLabel = agreeInput.closest('.form__agree');

            if (agreeLabel) {
                agreeLabel.classList.remove('is-error');
            }
        });
    }

    const checkoutForm = document.querySelector('.form');

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function (e) {
            e.preventDefault();

            clearMessages();
            
            if (!isOrderAllowed()) {
                showMessage('Сейчас мы закрыты. Заказы принимаются с 10:00 до 23:59 (МСК)', 'error');
                return;
            }

            const orderData = getCheckoutOrderData();
    
            const deliveryArticles = ['15', '16', '18'];

            const hasRealProducts = orderData.cart.some((item) => {
                return !deliveryArticles.includes(String(item.frontpad_article || ''));
            });
            
            if (!hasRealProducts) {
                showMessage('Корзина пуста', 'error');
                return;
            }

            if (!orderData.cart.length) {
                showMessage('Корзина пуста', 'error');
                return;
            }

            if (!orderData.customer.name) {
                showMessage('Введите имя', 'error');
                return;
            }

            if (!orderData.customer.phone) {
                showMessage('Введите телефон', 'error');
                return;
            }

            if (orderData.delivery.type === 'delivery') {
                if (!orderData.delivery.address || !orderData.delivery.house) {
                    showMessage('Заполните адрес и дом для доставки', 'error');
                    return;
                }


                //временно
                // if (!orderData.delivery.zone) {
                //     showMessage('Не удалось определить зону доставки', 'error');
                //     return;
                // }
                
                if (orderData.delivery.need_operator_clarification) {
                    showMessage('Для вашего адреса нужно уточнить время и стоимость доставки у оператора. Заказ через сайт для этой зоны оформить нельзя.', 'error');
                    return;
                }
            }

            if (!agreeInput || !agreeInput.checked) {
                showMessage('Подтвердите согласие с политикой конфиденциальности и офертой', 'error');

                if (agreeInput) {
                    const agreeLabel = agreeInput.closest('.form__agree');

                    if (agreeLabel) {
                        agreeLabel.classList.add('is-error');
                    }
                }

                return;
            }

            if (orderData.payment.type === 'cash') {
                const cashInput = document.querySelector('input[name="cash_change"]');
                const cashFrom = orderData.payment.cash_change_from;
                const total = orderData.totals.total;
            
                if (cashFrom > 0 && cashFrom < total) {
                    showMessage(`Сумма для сдачи (${formatPrice(cashFrom)} ₽) меньше суммы заказа (${formatPrice(total)} ₽)`, 'error');
            
                    if (cashInput) {
                        cashInput.focus();
                        cashInput.classList.add('is-error');
            
                        setTimeout(() => {
                            cashInput.classList.remove('is-error');
                        }, 2000);
                    }
            
                    return;
                }
            }

            //временно
            // submitOrderToFrontPad(orderData);
            console.log(orderData);
            showMessage(
                'Тестовый режим. Заказ сформирован.',
                'success'
            );
        });
    }

    window.cubaCheckout = {
        renderCheckoutOrder,
        getCart,
        getCurrentDeliveryPrice,
        //временно
        // calculateDeliveryByAddress
    };
    
    
    
    function syncGunkanGift(cart) {
        const hasElite = hasEliteSet(cart);
        const hasGift = hasGunkanGift(cart);
    
        // если есть элитный сет и нет подарка → добавить
        if (hasElite && !hasGift) {
            cart.push({
                product_id: 'gift-gunkan',
                frontpad_article: '1000',
                title: 'Сет гунканов (подарок)',
                finalPrice: 0,
                quantity: 1,
                options: {},
                is_gift: true
            });
        }
    
        // если убрали элитный сет → убрать подарок
        if (!hasElite && hasGift) {
            cart = cart.filter(item => !item.is_gift);
        }
    
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        return cart;
    }
    
    function hasEliteSet(cart) {
        return cart.some(item =>
            String(item.title || '').toLowerCase().includes('элитный')
        );
    }
    
    function hasGunkanGift(cart) {
        return cart.some(item =>
            String(item.title || '').toLowerCase().includes('гункан')
            && item.is_gift
        );
    }
    
    function getDeliveryBranchKey(zone) {
        const point = String(zone?.point || '');
        const description = String(zone?.description || '').toLowerCase();
    
        if (point === '391' || description.includes('дериглазова')) {
            return 'derig';
        }
    
        if (point === '392' || description.includes('кулакова')) {
            return 'kulakova';
        }
    
        return 'hruscheva';
    }
    
    
    function toggleOrderAvailability() {
        const btn = document.querySelector('.form button[type="submit"]');
        if (!btn) return;
    
        if (!isOrderAllowed()) {
            btn.disabled = true;
            btn.classList.add('disabled');
    
            setDeliveryStatus('Сейчас мы закрыты. Заказы принимаются с 10:00 до 23:59', 'is-error');
        }
    }
    
    toggleOrderAvailability();
});