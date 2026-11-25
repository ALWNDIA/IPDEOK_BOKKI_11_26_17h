
document.addEventListener('DOMContentLoaded', () => {
    const STATUS_KEY = 'ipdeokDeliveryStatus';

    const statusNames = [
        '주문 확인 중',
        '조리 중',
        '픽업 완료',
        '배달 중',
        '배달 완료'
    ];

    const statusMessages = [
        '주문이 정상적으로 접수됐어요.',
        '맛있게 조리하고 있어요.',
        '음식이 배달원에게 전달됐어요.',
        '음식이 고객님께 이동 중이에요.',
        '맛있게 드세요! 배달이 완료됐어요.'
    ];

    let currentStep = Number(localStorage.getItem(STATUS_KEY) || 0);
    currentStep = Math.max(0, Math.min(4, currentStep));

    const money = value =>
        `${Number(value || 0).toLocaleString('ko-KR')}원`;

    const total = Number(localStorage.getItem('ipdeokCheckoutTotal') || 0);

    document.getElementById('orderTotal').textContent = money(total);

    function renderStatus() {
        document.getElementById('currentStatus').textContent =
            statusNames[currentStep];

        document.querySelectorAll('.progress-item').forEach((item, index) => {
            item.classList.toggle('done', index < currentStep);
            item.classList.toggle('current', index === currentStep);

            const dot = item.querySelector('.progress-dot');
            dot.textContent = index < currentStep ? '✓' : String(index + 1);
        });

        const button = document.getElementById('nextStatusBtn');

        button.textContent = currentStep === 4
            ? '배달이 완료됐어요!'
            : '다음 배달 단계 보기';

        button.disabled = currentStep === 4;
    }

    document.getElementById('nextStatusBtn').addEventListener('click', () => {
        if (currentStep >= 4) return;

        currentStep++;
        localStorage.setItem(STATUS_KEY, String(currentStep));
        renderStatus();
    });

    renderStatus();
});
