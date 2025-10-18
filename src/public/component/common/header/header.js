import { requestLogout } from '../../../api/auth.js';

const generateHeaderHtml = (isLogin = false, existsBackward = false) => {
    return `
        <div class="header-container">
        <div class="backward ${isLogin && existsBackward ? '' : 'conceal'}">
            <span class="backward-image">◀️</span>
        </div>
        <div class="title">
            <span class="title-name">아무 말 대잔치</span>
        </div>
        <div class="profile ${isLogin ? '' : 'conceal'}">
            <span class="profile-image">👤</span>
            <ul class="profile-list hide">
                <li class="profile-list-item"><a href="#">회원정보수정</a></li>
                <li class="profile-list-item"><a href="#">비밀번호수정</a></li>
                <li class="profile-list-item logout-btn click">로그아웃</li>
            </ul>
        </div>
    </div>
    `;
};

const paintHeader = (isLogin, existsBackward) => {
    const headerHtml = generateHeaderHtml(isLogin, existsBackward);
    document.querySelector('header').innerHTML = headerHtml;
};

const profileImageClickListHandler = () => {
    document.querySelector('.profile-list').classList.toggle('hide');
};

const logoutBtnClickHandler = async () => {
    const res = await requestLogout();
    console.log(res);

    if (!res.success) {
        alert(res.data);
        reteurn;
    }

    location.href = '/login';
};

const backwardImageClickHandler = () => {
    history.back();
};

document.addEventListener('DOMContentLoaded', () => {
    const backwardList = ['/read', '/write', '/update'];
    const isLogin = document.cookie.includes('isLogin=true');
    const existsBackward = backwardList.some((url) => window.location.pathname.startsWith(url));

    paintHeader(isLogin, existsBackward);

    // 로그인한 상태라면 노출된 profile 이미지 클릭 이벤트 등록
    if (isLogin) {
        document.querySelector('.profile-image').addEventListener('click', profileImageClickListHandler);
        document.querySelector('.logout-btn').addEventListener('click', logoutBtnClickHandler);
    }

    // 뒤로 가기 버튼이 노출된 상태라면 이전 페이지로 이동하는 클릭 이벤트 등록
    if (existsBackward) {
        document.querySelector('.backward-image').addEventListener('click', backwardImageClickHandler);
    }
});
