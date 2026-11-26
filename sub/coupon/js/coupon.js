document.addEventListener('DOMContentLoaded', () => {

    /* =========================
       COUPON DATA
    ========================= */

    const COUPON_STORAGE_KEY = 'ipdeokUsedCoupons';

    const coupons = [
        {
            id: 'first-15000',
            title: '첫 주문 쿠폰',
            minimum: 15000,
            discount: 3000
        },
        {
            id: 'first-20000',
            title: '첫 주문 쿠폰',
            minimum: 20000,
            discount: 5000
        }
    ];

    /* =========================
       ELEMENTS
    ========================= */

    const couponList = document.getElementById('couponList');
    const emptyCoupons = document.getElementById('emptyCoupons');

    const availableCount = document.getElementById('availableCount');
    const usedCount = document.getElementById('usedCount');

    const confirmOverlay = document.getElementById('confirmOverlay');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmUseButton = document.getElementById('confirmUse');

    const toastMessage = document.getElementById('toastMessage');

    let selectedCouponId = null;
    let toastTimer = null;

    /* =========================
       LOCAL STORAGE
    ========================= */

    function getUsedCoupons() {

        try {
            const saved = JSON.parse(
                localStorage.getItem(COUPON_STORAGE_KEY)
            );

            return Array.isArray(saved) ? saved : [];

        } catch (error) {
            return [];
        }
    }

    function saveUsedCoupons(usedCoupons) {

        localStorage.setItem(
            COUPON_STORAGE_KEY,
            JSON.stringify(usedCoupons)
        );
    }

    /* =========================
       RENDER COUPONS
    ========================= */

    function renderCoupons() {

        const usedCoupons = getUsedCoupons();

        const availableCoupons = coupons.filter(coupon => {
            return !usedCoupons.includes(coupon.id);
        });

        // 사용 가능한 쿠폰 수
        availableCount.textContent = availableCoupons.length;

        // 사용한 쿠폰 수
        usedCount.textContent = usedCoupons.filter(id => {
            return coupons.some(coupon => coupon.id === id);
        }).length;

        // 사용한 쿠폰 숨기기
        coupons.forEach(coupon => {

            const card = couponList.querySelector(
                `[data-coupon-id="${coupon.id}"]`
            );

            if (card) {
                card.hidden = usedCoupons.includes(coupon.id);
            }
        });

        // 쿠폰이 없으면 빈 화면 표시
        emptyCoupons.hidden = availableCoupons.length !== 0;

        couponList.hidden = availableCoupons.length === 0;
    }

    /* =========================
       OPEN CONFIRM POPUP
    ========================= */

    function openConfirm(couponId) {

        const coupon = coupons.find(item => {
            return item.id === couponId;
        });

        if (!coupon) return;

        // 이미 사용한 쿠폰인지 확인
        if (getUsedCoupons().includes(couponId)) {
            renderCoupons();
            return;
        }

        selectedCouponId = couponId;

        confirmMessage.textContent =
            `${coupon.minimum.toLocaleString('ko-KR')}원 이상 결제 시 ` +
            `${coupon.discount.toLocaleString('ko-KR')}원 할인 쿠폰이야. ` +
            `한 번 사용하면 사라져!`;

        confirmOverlay.classList.add('active');
        confirmOverlay.setAttribute('aria-hidden', 'false');
    }

    /* =========================
       CLOSE CONFIRM POPUP
    ========================= */

    function closeConfirm() {

        confirmOverlay.classList.remove('active');

        confirmOverlay.setAttribute('aria-hidden', 'true');

        selectedCouponId = null;
    }

    /* =========================
       TOAST MESSAGE
    ========================= */

    function showToast(message) {

        toastMessage.textContent = message;

        toastMessage.classList.add('show');

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {

            toastMessage.classList.remove('show');

        }, 2200);
    }

    /* =========================
       COUPON BUTTON CLICK
    ========================= */

    couponList.addEventListener('click', event => {

        const button = event.target.closest('[data-use-coupon]');

        if (!button) return;

        openConfirm(button.dataset.useCoupon);
    });

    /* =========================
       CANCEL BUTTON
    ========================= */

    document.getElementById('cancelUse').addEventListener('click', () => {

        closeConfirm();
    });

    /* =========================
       BACKGROUND CLICK
    ========================= */

    confirmOverlay.addEventListener('click', event => {

        if (event.target === confirmOverlay) {
            closeConfirm();
        }
    });

    /* =========================
       CONFIRM COUPON USE
    ========================= */

    confirmUseButton.addEventListener('click', () => {

        if (!selectedCouponId) return;

        const usedCoupons = getUsedCoupons();

        // 중복 사용 방지
        if (!usedCoupons.includes(selectedCouponId)) {

            usedCoupons.push(selectedCouponId);

            saveUsedCoupons(usedCoupons);
        }

        // 팝업 닫기
        closeConfirm();

        // 쿠폰 목록 새로고침
        renderCoupons();

        // 완료 메시지
        showToast('쿠폰을 사용했어! 쿠폰함에서 사라졌어.');
    });

    /* =========================
       ESC KEY
    ========================= */

    document.addEventListener('keydown', event => {

        if (event.key === 'Escape') {
            closeConfirm();
        }
    });

    /* =========================
       INITIAL RENDER
    ========================= */

    renderCoupons();

});