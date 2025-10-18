export const generateWriterInfoHtml = (member) => {
    // TODO: 회원 이미지 가져오기
    return `
        <div class="writer-info" style="display:flex; align-items:center; gap 0.5em;">
            <div class="writer-member-image">👤</div>
            <div class="writer-member-nickname">${member.nickname}</div>
        </div>`;
};
