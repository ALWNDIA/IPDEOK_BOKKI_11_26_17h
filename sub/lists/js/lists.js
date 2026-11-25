document.addEventListener('DOMContentLoaded', () => {

    /* =========================
       MENU DATA
    ========================= */

    const products = {
        tteokbokki: [
            { name: '입덕볶이', description: '기본에 충실 !', prices: [8900, 13900, 18900] },
            { name: '달달볶이', description: '학교 앞 분식집 맛 !', prices: [8900, 13900, 18900] },
            { name: '위염볶이', description: '오늘은 위에 구멍이 나게 !', prices: [8900, 13900, 18900] },
            { name: '크림볶이', description: '오늘은 부드럽게 ,', prices: [9900, 14900, 19900] },
            { name: '로제볶이', description: '조금은 덜 느끼하게,', prices: [9900, 14900, 19900] },
            { name: '바질볶이', description: '힐링은 향긋하게 ,', prices: [9900, 14900, 19900] },
            { name: '마라볶이', description: '벌써 찾아왔어 마라주기 !', prices: [9900, 14900, 19900] },
            { name: '말차볶이', description: '뭐? 요즘 이게 유행이라고?', prices: [10900, 15900, 20900] },
            { name: '해물볶이', description: '난 바다 없이 못살아 ,', prices: [11900, 16900, 21900] }
        ],

        side: [
            { name: '혼자튀김', description: '혼자서도 알차게 즐기는 튀김', price: 4500 },
            { name: '둘이튀김', description: '둘이서 넉넉하게 즐기는 튀김', price: 7500 },
            { name: '누드순대', description: '쫄깃하고 담백한 순대', price: 5000 },
            { name: '꼬치어묵', description: '따뜻하고 탱글한 어묵', price: 3500 },
            { name: '주먹밥', description: '떡볶이와 함께 먹기 좋은 주먹밥', price: 3000 },
            { name: '계란찜', description: '부드럽고 포근한 계란찜', price: 4000 },
            { name: '감자튀김', description: '바삭바삭한 감자튀김', price: 3500 }
        ],

        drink: [
            { name: '콜라', description: '시원한 콜라', price: 2000, image: '../../img/cola.jpg' },
            { name: '사이다', description: '톡 쏘는 사이다', price: 2000, image: '../../img/Sprite%20.jpg' },
            { name: '쿨피스', description: '달콤상큼 쿨피스', price: 2000, image: '../../img/collpic.jpg' },
            { name: '우유', description: '고소한 우유', price: 1500, image: '../../img/milk.jpg' },
            { name: '제로콜라', description: '가볍게 즐기는 제로콜라', price: 2000 },
            { name: '제로사이다', description: '깔끔한 제로사이다', price: 2000 },
            { name: '단지우유', description: '달콤한 단지우유', price: 2000 },
            { name: '오렌지주스', description: '상큼한 오렌지주스', price: 2500 },
            { name: '환타', description: '톡톡 튀는 환타', price: 2000 }
        ]
    };

    const sizeNames = ['혼자볶이', '둘이볶이', '셋이볶이'];

    const toppingPrices = {
        떡: 1000,
        어묵: 1000,
        소세지: 1000,
        당면: 1000,
        중국당면: 1500,
        분모자: 1500,
        유부: 1000
    };

    const won = value => `${Number(value).toLocaleString('ko-KR')}원`;

    /* =========================
       ELEMENTS
    ========================= */

    const grid = document.getElementById('productGrid');
    const tabs = document.querySelectorAll('.category-tab');

    const optionOverlay = document.getElementById('optionOverlay');
    const completeOverlay = document.getElementById('completeOverlay');

    const optionName = document.getElementById('optionName');
    const optionDescription = document.getElementById('optionDescription');

    const basePriceElement = document.getElementById('basePrice');
    const extraPriceElement = document.getElementById('extraPrice');
    const totalPriceElement = document.getElementById('totalPrice');
    const buttonPriceElement = document.getElementById('buttonPrice');

    const quantityValue = document.getElementById('quantityValue');

    let currentCategory = 'tteokbokki';
    let selectedProduct = null;
    let selectedQuantity = 1;

    /* =========================
       CART STORAGE
    ========================= */

    function getCart() {
        try {
            const cart = JSON.parse(localStorage.getItem('ipdeokCart'));
            return Array.isArray(cart) ? cart : [];
        } catch (error) {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem('ipdeokCart', JSON.stringify(cart));
    }

    /* =========================
       PRODUCT RENDER
    ========================= */

    function renderProducts(category) {
        currentCategory = category;
        grid.innerHTML = '';

        products[category].forEach(product => {
            const card = document.createElement('article');
            card.className = 'product-card';

            const image = document.createElement('div');
            image.className = 'product-image';

            if (product.image) {
                image.style.backgroundImage = `url("${product.image}")`;
            } else {
                image.classList.add('no-image');
                image.textContent = product.name;
            }

            const info = document.createElement('div');
            info.className = 'product-info';

            const name = document.createElement('h2');
            name.textContent = product.name;

            const description = document.createElement('p');
            description.textContent = product.description;

            const price = document.createElement('strong');
            price.className = 'product-price';

            if (category === 'tteokbokki') {
                price.textContent = `${won(product.prices[0])}~`;
            } else {
                price.textContent = won(product.price);
            }

            const button = document.createElement('button');
            button.className = 'product-order-btn';
            button.type = 'button';
            button.textContent = '주문하기';

            button.addEventListener('click', () => {
                openOptions(product, category);
            });

            info.append(name, description, price, button);
            card.append(image, info);
            grid.appendChild(card);
        });

        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.category === category);
        });
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            renderProducts(tab.dataset.category);
        });
    });

    /* =========================
       OPTION MODAL
    ========================= */

    function openOptions(product, category) {
        selectedProduct = {
            ...product,
            category
        };

        selectedQuantity = 1;

        optionName.textContent = product.name;
        optionDescription.textContent = product.description;
        quantityValue.textContent = selectedQuantity;

        const isTteokbokki = category === 'tteokbokki';

        document.getElementById('sizeSection').hidden = !isTteokbokki;
        document.getElementById('extraSection').hidden = !isTteokbokki;

        document.querySelectorAll('input[name="size"]').forEach(input => {
            input.checked = input.value === '혼자볶이';
        });

        document.querySelectorAll('.extra-options input').forEach(input => {
            input.checked = false;
        });

        updatePrice();

        optionOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeOptions() {
        optionOverlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    document.getElementById('optionClose').addEventListener('click', closeOptions);

    optionOverlay.addEventListener('click', event => {
        if (event.target === optionOverlay) {
            closeOptions();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeOptions();
            completeOverlay.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

    /* =========================
       PRICE CALCULATION
    ========================= */

    function getSelectedSizeIndex() {
        const selectedSize = document.querySelector('input[name="size"]:checked');
        return sizeNames.indexOf(selectedSize?.value || '혼자볶이');
    }

    function getSelectedExtras() {
        return Array.from(
            document.querySelectorAll('.extra-options input:checked')
        ).map(input => input.value);
    }

    function calculatePrice() {
        if (!selectedProduct) return null;

        let basePrice = 0;
        let extraPrice = 0;

        if (selectedProduct.category === 'tteokbokki') {
            const sizeIndex = getSelectedSizeIndex();

            basePrice = selectedProduct.prices[sizeIndex];

            extraPrice = getSelectedExtras().reduce((sum, name) => {
                return sum + (toppingPrices[name] || 0);
            }, 0);
        } else {
            basePrice = selectedProduct.price;
        }

        const unitPrice = basePrice + extraPrice;
        const totalPrice = unitPrice * selectedQuantity;

        return {
            basePrice,
            extraPrice,
            unitPrice,
            totalPrice
        };
    }

    function updatePrice() {
        const result = calculatePrice();
        if (!result) return;

        basePriceElement.textContent = won(result.basePrice);
        extraPriceElement.textContent = won(result.extraPrice);
        totalPriceElement.textContent = won(result.totalPrice);
        buttonPriceElement.textContent = won(result.totalPrice);

        quantityValue.textContent = selectedQuantity;
    }

    document.querySelectorAll('input[name="size"], .extra-options input').forEach(input => {
        input.addEventListener('change', updatePrice);
    });

    /* =========================
       QUANTITY
    ========================= */

    document.getElementById('quantityMinus').addEventListener('click', () => {
        selectedQuantity = Math.max(1, selectedQuantity - 1);
        updatePrice();
    });

    document.getElementById('quantityPlus').addEventListener('click', () => {
        selectedQuantity += 1;
        updatePrice();
    });

    /* =========================
       ADD TO CART
    ========================= */

    document.getElementById('addCartBtn').addEventListener('click', () => {
        if (!selectedProduct) return;

        const result = calculatePrice();

        const isTteokbokki = selectedProduct.category === 'tteokbokki';

        const cartItem = {
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            name: selectedProduct.name,
            category: selectedProduct.category,
            description: selectedProduct.description,
            size: isTteokbokki
                ? document.querySelector('input[name="size"]:checked').value
                : '',
            extras: isTteokbokki ? getSelectedExtras() : [],
            quantity: selectedQuantity,
            basePrice: result.basePrice,
            toppingPrice: result.extraPrice,
            unitPrice: result.unitPrice,
            price: result.totalPrice,
            lineTotal: result.totalPrice
        };

        const cart = getCart();
        cart.push(cartItem);
        saveCart(cart);

        closeOptions();

        completeOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    });

    /* =========================
       COMPLETE MODAL
    ========================= */

    function closeComplete() {
        completeOverlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    document.getElementById('continueBtn').addEventListener('click', () => {
        closeComplete();
        renderProducts('tteokbokki');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.getElementById('goCartBtn').addEventListener('click', () => {
        location.href = '../payment/payment.html';
    });

    completeOverlay.addEventListener('click', event => {
        if (event.target === completeOverlay) {
            closeComplete();
        }
    });

    /* =========================
       INITIALIZE
    ========================= */

    renderProducts('tteokbokki');

    const params = new URLSearchParams(location.search);
    const requestedItem = params.get('item');

    if (requestedItem) {
        const product = products.tteokbokki.find(item => item.name === requestedItem);

        if (product) {
            setTimeout(() => {
                openOptions(product, 'tteokbokki');
            }, 150);
        }
    }

});