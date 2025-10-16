const fetchHeaderHtml = async () => {
    const res = await fetch('/component/common/header/header.html');
    const headerHtml = await res.text();
    return headerHtml;
};

const profileListHandler = () => {
    document.querySelector('.profile-list').classList.toggle('hide');
};

document.addEventListener('DOMContentLoaded', async () => {
    // 1. header HTML 패치 및  그리기
    const headerHtml = await fetchHeaderHtml();
    document.querySelector('header').innerHTML = headerHtml;

    // 2. 게시글 조회, 수정, 삭제 시 backward 태그 노출
    // TODO: document.querySelector('.backward').classList.remove('conceal');

    // 3. 로그인한 상태라면 profile 태그 노출 및 클릭 이벤트 등록
    // TODO: document.querySelector('.profile').classList.remove('conceal');
    // TODO: document.querySelector('.profile-image').addEventListener('click', profileListHandler);
});
