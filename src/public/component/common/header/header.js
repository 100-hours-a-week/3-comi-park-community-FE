const generateHeaderHtml = (isLogin = false) => {
    return `
        <div class="header-container">
        <div class="backward ${isLogin ? '' : 'conceal'}">
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
                <li class="profile-list-item"><a href="#">로그아웃</a></li>
            </ul>
        </div>
    </div>
    `;
};

const profileListHandler = () => {
    document.querySelector('.profile-list').classList.toggle('hide');
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. header HTML 패치 및  그리기
    // const headerHtml = await fetchHeaderHtml();
    const headerHtml = generateHeaderHtml();
    document.querySelector('header').innerHTML = headerHtml;

    // 2. 게시글 조회, 수정, 삭제 시 backward 태그 노출
    // TODO: document.querySelector('.backward').classList.remove('conceal');

    // 3. 로그인한 상태라면 profile 태그 노출 및 클릭 이벤트 등록
    // TODO: document.querySelector('.profile').classList.remove('conceal');
    // TODO: document.querySelector('.profile-image').addEventListener('click', profileListHandler);
});
