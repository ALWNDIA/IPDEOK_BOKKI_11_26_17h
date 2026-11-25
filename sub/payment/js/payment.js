
document.addEventListener('DOMContentLoaded', () => {
    const CART_KEY = 'ipdeokCart';
    const STATUS_KEY = 'ipdeokDeliveryStatus';

    const DELIVERY_FEE = 3000;

    const menuPrices = {
        '입덕볶이': { '혼자볶이': 8900, '둘이볶이': 13900, '셋이볶이': 18900 },
        '달달볶이': { '혼자볶이': 8900, '둘이볶이': 13900, '셋이볶이': 18900 },
        '위염볶이': { '혼자볶이': 8900, '둘이볶이': 13900, '셋이볶이': 18900 },
        '크림볶이': { '혼자볶이': 9900, '둘이볶이': 14900, '셋이볶이': 19900 },
        '로제볶이': { '혼자볶이': 9900, '둘이볶이': 14900, '셋이볶이': 19900 },
        '바질볶이': { '혼자볶이': 9900, '둘이볶이': 14900, '셋이볶이': 19900 },
        '마라볶이': { '혼자볶이': 9900, '둘이볶이': 14900, '셋이볶이': 19900 },
        '말차볶이': { '혼자볶이': 10900, '둘이볶이': 15900, '셋이볶이': 20900 },
        '해물볶이': { '혼자볶이': 11900, '둘이볶이': 16900, '셋이볶이': 21900 }
    };

    const toppingPrices = {
        '떡': 1000,
        '어묵': 1000,
        '소세지': 1000,
        '당면': 1000,
        '중국당면': 1500,
        '분모자': 1500,
        '유부': 1000
    };

    const sidePrices = {
        '혼자튀김': 4500,
        '둘이튀김': 7500,
        '누드순대': 5000,
        '꼬치어묵': 3500,
        '주먹밥': 3000,
        '계란찜': 4000,
        '감자튀김': 3500
    };

    const drinkPrices = {
        '콜라': 2000,
        '사이다': 2000,
        '쿨피스': 2000,
        '우유': 1500,
        '제로콜라': 2000,
        '제로사이다': 2000,
        '단지우유': 2000,
        '오렌지주스': 2500,
        '환타': 2000
    };

    const $ = id => document.getElementById(id);
    const money = value => `${Number(value || 0).toLocaleString('ko-KR')}원`;

    let cart = readCart();
    let editingIndex = null;
    let editQuantity = 1;

    function readCart() {
        try {
            const saved = JSON.parse(localStorage.getItem(CART_KEY));
            return Array.isArray(saved) ? saved : [];
        } catch {
            return [];
        }
    }

    function saveCart() {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    function getBasePrice(item) {
        if (item.category === 'tteokbokki') {
            return menuPrices[item.name]?.[item.size] ?? Number(item.basePrice || 0);
        }

        if (item.category === 'side') {
            return sidePrices[item.name] ?? Number(item.basePrice || 0);
        }

        if (item.category === 'drink') {
            return drinkPrices[item.name] ?? Number(item.basePrice || 0);
        }

        return Number(item.basePrice || item.unitPrice || item.price || 0);
    }

    function getExtraPrice(item) {
        if (item.category !== 'tteokbokki') return 0;

        return (item.extras || []).reduce((sum, extra) => {
            return sum + (toppingPrices[extra] || 0);
        }, 0);
    }

    function normalizeItem(item) {
        const basePrice = getBasePrice(item);
        const toppingPrice = getExtraPrice(item);
        const unitPrice = basePrice + toppingPrice;
        const quantity = Math.max(1, Number(item.quantity || 1));

        return {
            ...item,
            basePrice,
            toppingPrice,
            unitPrice,
            quantity,
            price: unitPrice * quantity,
            lineTotal: unitPrice * quantity
        };
    }

    function getItemDescription(item) {
        const lines = [];

        if (item.size) lines.push(`사이즈: ${item.size}`);
        if (item.extras?.length) lines.push(`추가 재료: ${item.extras.join(', ')}`);
        if (item.description) lines.push(item.description);

        return lines.join('\n');
    }

    function renderCart() {
        cart = cart.map(normalizeItem);

        const list = $('cartList');
        list.innerHTML = '';

        $('cartCount').textContent =
            `${cart.reduce((sum, item) => sum + item.quantity, 0)}개`;

        $('emptyCart').hidden = cart.length > 0;
        $('checkoutBtn').disabled = cart.length === 0;

        cart.forEach((item, index) => {
            const card = document.createElement('article');
            card.className = 'cart-item';

            const extraLines = item.category === 'tteokbokki'
                ? (item.extras || []).map(extra => `
                    <div class="price-detail-row">
                        <span>추가 ${escapeHTML(extra)}</span>
                        <strong>${money(toppingPrices[extra] || 0)}</strong>
                    </div>
                `).join('')
                : '';

            card.innerHTML = `
                <div class="cart-item-top">
                    <div>
                        <h3 class="cart-item-name">${escapeHTML(item.name)}</h3>
                        <p class="cart-item-description">${escapeHTML(getItemDescription(item))}</p>
                    </div>
                    <button type="button" class="remove-button" data-remove="${index}" aria-label="삭제">×</button>
                </div>

                <div class="cart-price-details">
                    <div class="price-detail-row">
                        <span>기본 메뉴 금액</span>
                        <strong>${money(item.basePrice)}</strong>
                    </div>
                    ${extraLines}
                    <div class="price-detail-row">
                        <span>추가 재료 합계</span>
                        <strong>${money(item.toppingPrice)}</strong>
                    </div>
                    <div class="price-detail-row">
                        <span>1개 금액</span>
                        <strong>${money(item.unitPrice)}</strong>
                    </div>
                </div>

                <div class="cart-item-bottom">
                    <div class="quantity-control">
                        <button type="button" data-minus="${index}" aria-label="수량 줄이기">−</button>
                        <strong>${item.quantity}</strong>
                        <button type="button" data-plus="${index}" aria-label="수량 늘리기">+</button>
                    </div>
                    <strong class="item-total">${money(item.lineTotal)}</strong>
                </div>

                ${item.category === 'tteokbokki' ? `
                    <div class="item-actions">
                        <button type="button" class="edit-button" data-edit="${index}">옵션 수정</button>
                    </div>
                ` : ''}
            `;

            list.appendChild(card);
        });

        updateTotal();
        saveCart();
    }

    function updateTotal() {
        const menuTotal = cart.reduce((sum, item) => {
            return sum + item.unitPrice * item.quantity;
        }, 0);

        const deliveryFee = cart.length ? DELIVERY_FEE : 0;
        const total = menuTotal + deliveryFee;

        $('menuTotal').textContent = money(menuTotal);
        $('deliveryFee').textContent = money(deliveryFee);
        $('grandTotal').textContent = money(total);
        $('bottomTotal').textContent = money(total);
    }

    function escapeHTML(value) {
        return String(value ?? '').replace(/[&<>"']/g, char => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[char]);
    }

    $('cartList').addEventListener('click', event => {
        const removeIndex = event.target.dataset.remove;
        const minusIndex = event.target.dataset.minus;
        const plusIndex = event.target.dataset.plus;
        const editIndex = event.target.dataset.edit;

        if (removeIndex !== undefined) {
            cart.splice(Number(removeIndex), 1);
            renderCart();
        }

        if (minusIndex !== undefined) {
            const item = cart[Number(minusIndex)];
            item.quantity = Math.max(1, Number(item.quantity) - 1);
            renderCart();
        }

        if (plusIndex !== undefined) {
            const item = cart[Number(plusIndex)];
            item.quantity = Number(item.quantity) + 1;
            renderCart();
        }

        if (editIndex !== undefined) {
            openEdit(Number(editIndex));
        }
    });

    function openEdit(index) {
        editingIndex = index;

        const item = cart[index];
        editQuantity = item.quantity;

        $('editTitle').textContent = item.name;
        $('editDescription').textContent = item.description || '원하는 옵션으로 변경해 봐!';

        document.querySelectorAll('input[name="editSize"]').forEach(input => {
            input.checked = input.value === item.size;
        });

        $('editExtras').innerHTML = Object.entries(toppingPrices).map(([name, price]) => `
            <label class="extra-option">
                <input type="checkbox" value="${name}" ${item.extras?.includes(name) ? 'checked' : ''}>
                ${name}
                <span>+${money(price)}</span>
            </label>
        `).join('');

        $('editQuantity').textContent = editQuantity;
        $('editModal').hidden = false;
        updateEditPrice();
    }

    function getEditBasePrice() {
        const item = cart[editingIndex];
        const selectedSize = document.querySelector('input[name="editSize"]:checked')?.value;
        return menuPrices[item.name]?.[selectedSize] || 0;
    }

    function updateEditPrice() {
        if (editingIndex === null) return;

        const basePrice = getEditBasePrice();

        const extras = [...$('editExtras').querySelectorAll('input:checked')];
        const extraPrice = extras.reduce((sum, input) => {
            return sum + toppingPrices[input.value];
        }, 0);

        $('editQuantity').textContent = editQuantity;
        $('editPrice').textContent = money((basePrice + extraPrice) * editQuantity);
    }

    document.querySelectorAll('input[name="editSize"]').forEach(input => {
        input.addEventListener('change', updateEditPrice);
    });

    $('editExtras').addEventListener('change', updateEditPrice);

    $('editMinus').addEventListener('click', () => {
        editQuantity = Math.max(1, editQuantity - 1);
        updateEditPrice();
    });

    $('editPlus').addEventListener('click', () => {
        editQuantity++;
        updateEditPrice();
    });

    function closeEdit() {
        $('editModal').hidden = true;
        editingIndex = null;
    }

    $('editClose').addEventListener('click', closeEdit);

    $('editModal').addEventListener('click', event => {
        if (event.target === $('editModal')) closeEdit();
    });

    $('saveEdit').addEventListener('click', () => {
        if (editingIndex === null) return;

        const item = cart[editingIndex];
        const selectedSize = document.querySelector('input[name="editSize"]:checked');

        if (!selectedSize) {
            alert('사이즈를 선택해 주세요!');
            return;
        }

        const extras = [...$('editExtras').querySelectorAll('input:checked')]
            .map(input => input.value);

        item.size = selectedSize.value;
        item.extras = extras;
        item.quantity = editQuantity;

        cart[editingIndex] = normalizeItem(item);

        closeEdit();
        renderCart();
    });

    $('checkoutBtn').addEventListener('click', () => {
        if (!cart.length) return;

        const total = cart.reduce((sum, item) => {
            return sum + item.unitPrice * item.quantity;
        }, 0) + DELIVERY_FEE;

        localStorage.setItem('ipdeokCheckoutTotal', String(total));
        localStorage.setItem('ipdeokDeliveryStatus', '0');
        localStorage.setItem('ipdeokOrderDate', new Date().toISOString());

        location.href = '../payment_finish/payment_finish.html';
    });

    renderCart();
});
