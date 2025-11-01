import { generateHeaderProfileImageHtml } from '../image/image.js';
import { destroyCookie } from '../../../utils/cookie-helper.js';
import { requestLogout } from '../../../api/auth.js';

export const paintHeader = async (isLogin = false, loginMemberId = undefined) => {
    const existsBackward = hasBackward(window.location.pathname);

    // header HTML 동적 생성
    const headerHtml = await generateHeaderHtml(isLogin, loginMemberId, existsBackward);
    document.querySelector('header').innerHTML = headerHtml;

    /* 이벤트 처리 */
    // 로그인한 상태라면 노출된 profile 이미지 클릭 이벤트 등록
    if (isLogin) {
        document.querySelector('.header-profile-image').addEventListener('click', headerProfileImageClickListHandler);
        document.querySelector('.logout-btn').addEventListener('click', logoutBtnClickHandler);
    }

    // 뒤로 가기 버튼이 노출된 상태라면 이전 페이지로 이동하는 클릭 이벤트 등록
    if (existsBackward) {
        document.querySelector('.header-backward-btn').addEventListener('click', headerBackwardImageClickHandler);
    }
};

const generateHeaderHtml = async (isLogin = false, loginMemberId = undefined, existsBackward = false) => {
    const headerProfileImageHtml = isLogin ? await generateHeaderProfileImageHtml(loginMemberId) : '';

    return `
        <!-- 뒤로가기 버튼 -->
        <div class="header-backward-container ${existsBackward ? '' : 'conceal'}">
            <button class="header-backward-btn" aria-label="뒤로가기">
                <svg class="header-backward-icon" viewBox="0 0 24 24">
                    <path d="M15 18l-6-6 6-6" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>

        <!-- 로고 -->
        <div class="logo">
            <a href="/index">♡ Gossip Girl ♡</a>
        </div>

        <!-- 프로필 -->
        <div class="header-profile-container ${isLogin ? '' : 'conceal'}">
            <div class="header-profile-image">
                <div class="header-profile-border">
                    ${headerProfileImageHtml}
                </div>
            </div>
            <ul class="header-profile-list">
                <li class="header-profile-list-item"><a href="/account">회원정보수정</a></li>
                <li class="header-profile-list-item"><a href="/account/password">비밀번호수정</a></li>
                <li class="header-profile-list-item logout-btn click">로그아웃</li>
            </ul>
        </div>`;
};

const headerProfileImageClickListHandler = () => {
    document.querySelector('.header-profile-list').classList.toggle('active');
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
    history.back();
};

const hasBackward = (currentUrl) => {
    const backwardList = ['/read', '/write', '/update', '/register'];
    return backwardList.some((url) => currentUrl.startsWith(url));
};
