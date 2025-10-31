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
        document.querySelector('.header-backward-image').addEventListener('click', headerBackwardImageClickHandler);
    }
};

const generateHeaderHtml = async (isLogin = false, loginMemberId = undefined, existsBackward = false) => {
    const headerProfileImageHtml = isLogin ? await generateHeaderProfileImageHtml(loginMemberId) : '';

    return `
        <div class="header-container">
            <div class="header-backward-container ${existsBackward ? '' : 'conceal'}">
                <div class="header-backward-image">◀️</div>
            </div>
            <div class="title">
                <div class="title-name"><a href="/index">아무 말 대잔치</a></div>
            </div>
            <div class="header-profile-container ${isLogin ? '' : 'conceal'}">
                <div class="header-profile-image">${headerProfileImageHtml}</div>
                <ul class="header-profile-list hide">
                    <li class="header-profile-list-item"><a href="/account">회원정보수정</a></li>
                    <li class="header-profile-list-item"><a href="/account/password">비밀번호수정</a></li>
                    <li class="header-profile-list-item logout-btn click">로그아웃</li>
                </ul>
            </div>
        </div>
        `;
};

const headerProfileImageClickListHandler = () => {
    document.querySelector('.header-profile-list').classList.toggle('hide');
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
