document.addEventListener('DOMContentLoaded', () => {

    // =================================
    // 1. 요소 가져오기
    // =================================

    const authOverlay = document.getElementById('authOverlay');
    const modalClose = document.getElementById('modalClose');

    const loginRequired = document.getElementById('loginRequired');
    const mypageContent = document.getElementById('mypageContent');

    const openLoginBtn = document.getElementById('openLoginBtn');
    const openSignupBtn = document.getElementById('openSignupBtn');

    const authTabs = document.querySelectorAll('.auth-tab');
    const formSwitchButtons = document.querySelectorAll('.form-switch');

    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');

    const signupName = document.getElementById('signupName');
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');
    const signupPasswordCheck = document.getElementById('signupPasswordCheck');

    const loginMessage = document.getElementById('loginMessage');
    const signupMessage = document.getElementById('signupMessage');

    const authTitle = document.getElementById('authTitle');
    const authSubtitle = document.getElementById('authSubtitle');

    const memberName = document.getElementById('memberName');
    const memberEmail = document.getElementById('memberEmail');

    const accountName = document.getElementById('accountName');
    const accountEmail = document.getElementById('accountEmail');

    const logoutBtn = document.getElementById('logoutBtn');
    const orderHistoryBtn = document.getElementById('orderHistoryBtn');

    const toastMessage = document.getElementById('toastMessage');


    // =================================
    // 2. 저장소 설정
    // =================================

    const MEMBER_KEY = 'ipdeokMember';
    const SESSION_KEY = 'ipdeokLoggedIn';


    // 회원 정보 가져오기
    function getMember() {
        try {
            const member = localStorage.getItem(MEMBER_KEY);
            return member ? JSON.parse(member) : null;
        } catch (error) {
            return null;
        }
    }


    // 로그인 상태 확인
    function isLoggedIn() {
        return localStorage.getItem(SESSION_KEY) === 'true';
    }


    // 회원 정보 저장
    function saveMember(member) {
        localStorage.setItem(MEMBER_KEY, JSON.stringify(member));
    }


    // 로그인 상태 저장
    function setLoginState(state) {
        localStorage.setItem(SESSION_KEY, String(state));
    }


    // =================================
    // 3. 알림 메시지
    // =================================

    let toastTimer;

    function showToast(message) {
        toastMessage.textContent = message;
        toastMessage.classList.add('show');

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {
            toastMessage.classList.remove('show');
        }, 2300);
    }


    // =================================
    // 4. 팝업 열기 / 닫기
    // =================================

    function openModal() {
        authOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }


    function closeModal() {
        authOverlay.classList.remove('show');
        document.body.style.overflow = '';
    }


    // 로그인 / 회원가입 화면 전환
    function switchAuth(type) {

        authTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.auth === type);
        });

        loginForm.hidden = type !== 'login';
        signupForm.hidden = type !== 'signup';

        loginMessage.textContent = '';
        signupMessage.textContent = '';

        if (type === 'login') {
            authTitle.textContent = '어서 와요!';
            authSubtitle.textContent = '입덕볶이와 함께 맛있는 하루를 시작해요.';
        } else {
            authTitle.textContent = '처음 만나요!';
            authSubtitle.textContent = '입덕볶이의 새로운 회원이 되어주세요.';
        }

    }


    // 탭 클릭
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchAuth(tab.dataset.auth);
        });
    });


    // 폼 아래 전환 버튼
    formSwitchButtons.forEach(button => {
        button.addEventListener('click', () => {
            switchAuth(button.dataset.auth);
        });
    });


    // 로그인 버튼
    openLoginBtn.addEventListener('click', () => {
        switchAuth('login');
        openModal();
    });


    // 회원가입 버튼
    openSignupBtn.addEventListener('click', () => {
        switchAuth('signup');
        openModal();
    });


    // 팝업 닫기
    modalClose.addEventListener('click', closeModal);


    // 배경 클릭 시 닫기
    authOverlay.addEventListener('click', (event) => {
        if (event.target === authOverlay) {
            closeModal();
        }
    });


    // =================================
    // 5. 마이페이지 화면 표시
    // =================================

    function renderMyPage() {

        const member = getMember();

        if (isLoggedIn() && member) {

            // 로그인한 회원
            loginRequired.hidden = true;
            mypageContent.hidden = false;

            memberName.textContent = member.name;
            memberEmail.textContent = member.email;

            accountName.textContent = member.name;
            accountEmail.textContent = member.email;

            closeModal();

        } else {

            // 로그인하지 않은 회원
            loginRequired.hidden = false;
            mypageContent.hidden = true;

            switchAuth('login');
            openModal();

        }

    }


    // =================================
    // 6. 로그인
    // =================================

    loginForm.addEventListener('submit', (event) => {

        event.preventDefault();

        const email = loginEmail.value.trim();
        const password = loginPassword.value.trim();

        loginMessage.textContent = '';

        if (!email || !password) {
            loginMessage.textContent = '이메일과 비밀번호를 모두 입력해 주세요.';
            return;
        }

        // 기존 회원 정보가 있으면 이름을 가져오고,
        // 없으면 이메일 앞부분을 이름으로 사용
        let member = getMember();

        if (member && member.email === email) {
            // 기존 회원 정보 유지
        } else {
            member = {
                name: email.split('@')[0],
                email: email
            };

            saveMember(member);
        }

        setLoginState(true);

        loginForm.reset();

        renderMyPage();
        showToast('로그인되었어요! 환영해요 ♡');

    });


    // =================================
    // 7. 회원가입
    // =================================

    signupForm.addEventListener('submit', (event) => {

        event.preventDefault();

        const name = signupName.value.trim();
        const email = signupEmail.value.trim();
        const password = signupPassword.value;
        const passwordCheck = signupPasswordCheck.value;

        signupMessage.textContent = '';

        if (!name || !email || !password || !passwordCheck) {
            signupMessage.textContent = '모든 항목을 입력해 주세요.';
            return;
        }

        if (password.length < 4) {
            signupMessage.textContent = '비밀번호는 4자리 이상 입력해 주세요.';
            return;
        }

        if (password !== passwordCheck) {
            signupMessage.textContent = '비밀번호가 서로 일치하지 않아요.';
            return;
        }

        // 비밀번호는 저장하지 않고 회원 이름과 이메일만 저장
        const member = {
            name: name,
            email: email
        };

        saveMember(member);
        setLoginState(true);

        signupForm.reset();

        renderMyPage();
        showToast(`${name}님, 입덕볶이에 오신 걸 환영해요! ♡`);

    });


    // =================================
    // 8. 로그아웃
    // =================================

    logoutBtn.addEventListener('click', () => {

        setLoginState(false);

        renderMyPage();

        switchAuth('login');

        showToast('로그아웃되었어요.');

    });


    // =================================
    // 9. 주문 내역 바로가기
    // =================================

    orderHistoryBtn.addEventListener('click', () => {

        document.getElementById('orderSection').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

    });


    // =================================
    // 10. 처음 페이지 실행
    // =================================

    renderMyPage();

});