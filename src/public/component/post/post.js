/* HTML */
const generatePostFormHtml = (post) => {
    return `
        <div class="title">게시글 ${post?.id ? '수정' : '작성'}</div>
        <form class="form">
            <div>
                <label for="form-title-input" class="form-label">제목*</label>
                <input
                    name="제목"
                    type="input"
                    class="form-input required"
                    id="form-title-input"
                    placeholder="제목을 입력해주세요. (최대 26글자)"
                    data-validated="false"
                    value="${post?.title ?? ''}"
                />
                <div class="form-helper-text form-helper-title">제목을 작성해주세요</div>
            </div>
            <div>
                <label for="form-content-input" class="form-label">내용*</label>
                <textarea
                    name="내용"
                    class="form-input required"
                    id="form-content-input"
                    placeholder="내용을 입력해주세요."
                    data-validated="false"
                    rows="25"
                >${post?.content ?? ''}</textarea>
                <div class="form-helper-text form-helper-content">내용을 작성해주세요</div>
            </div>
            <div>
                <label for="form-file-input" class="form-label">이미지</label>
                <input name="이미지" type="file" class="" id="form-file-input" />
            </div>
            <div>
                <button class="btn form-submit-btn inactivated" type="button">완료</button>
            </div>
        </form>`;
};

export const paintPostForm = (post = {}) => {
    document.querySelector('section').insertAdjacentHTML('beforeend', generatePostFormHtml(post));
};
