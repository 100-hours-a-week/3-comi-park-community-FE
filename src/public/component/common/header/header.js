import { generateHeaderProfileImageHtml } from '/component/common/image/image.js';
import { destroyCookie } from '/utils/cookie-helper.js';
import { requestLogout } from '/apis/auth.js';

export const paintHeader = async (isLogin = false, loginMemberId = undefined) => {
    const headerElement = document.querySelector('header');
    const hasBackward = getBackwardInfo(window.location.pathname);

    // header HTML 동적 생성
    const headerHtml = await generateHeaderHtml(isLogin, loginMemberId, hasBackward);
    headerElement.insertAdjacentHTML('beforeend', headerHtml);

    /* 이벤트 처리 */
    // 로그인한 상태라면 노출된 profile 이미지 클릭 이벤트 등록
    if (isLogin) {
        const profileListElement = headerElement.querySelector('.header-profile-list');

        headerElement
            .querySelector('.header-profile-image')
            .addEventListener('click', () => headerProfileImageClickListHandler(profileListElement));
        headerElement.querySelector('.logout-btn').addEventListener('click', logoutBtnClickHandler);
    }

    // 뒤로 가기 버튼이 노출된 상태라면 이전 페이지로 이동하는 클릭 이벤트 등록
    if (hasBackward) {
        headerElement
            .querySelector('.header-backward-btn')
            .addEventListener('click', () => headerBackwardImageClickHandler());
    }
};

const generateHeaderHtml = async (isLogin = false, loginMemberId = undefined, hasBackward = false) => {
    const headerProfileImageHtml = isLogin ? await generateHeaderProfileImageHtml(loginMemberId) : '';

    return `
        <!-- 뒤로가기 버튼 -->
        <div class="header-backward-container ${hasBackward ? '' : 'conceal'}">
            <button class="header-backward-btn" aria-label="뒤로가기">
                <svg class="header-backward-icon" viewBox="0 0 24 24">
                    <path d="M15 18l-6-6 6-6" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>

        <!-- 로고 -->
        <div class="logo">
            <a href="/">♡ Gossip Girl ♡</a>
        </div>

        <!-- 프로필 -->
        <div class="header-profile-container ${isLogin ? '' : 'conceal'}">
            <div class="header-profile-image">
                <div class="header-profile-border">
                    ${headerProfileImageHtml}
                </div>
            </div>
            <ul class="header-profile-list">
                <li class="header-profile-list-item" onclick="location.href='/account'">회원정보수정</li>
                <li class="header-profile-list-item" onclick="location.href='/account-password'">비밀번호수정</li>
                <li class="header-profile-list-item logout-btn click">로그아웃</li>
            </ul>
        </div>`;
};

const headerProfileImageClickListHandler = (profileListElement) => {
    profileListElement.classList.toggle('active');
};

const logoutBtnClickHandler = async () => {
    const res = await requestLogout();

    if (!res.success) {
        alert(res.data);
        return;
    }

    destroyCookie('loginMemberImageUrl');
    location.replace('/login');
};

const headerBackwardImageClickHandler = () => {
    document.referrer.startsWith(document.location.origin) ? history.back() : (location.href = '/');
};

const getBackwardInfo = (currentUrl) => {
    const baskwards = ['/read', '/write', '/update', '/register', '/terms', '/privacy'];
    return baskwards.find((prefix) => currentUrl.startsWith(prefix));
};
