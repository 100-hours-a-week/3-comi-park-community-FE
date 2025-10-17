/**
 * 특정 형식으로 날짜를 반환합니다
 * 예) 2025-10-11T17:54:10 -> 2025-10-06 17:54:10
 */
export const formatDate = (inputDate) => {
    const object = new Date(inputDate);
    const year = object.getFullYear();
    const month = padZero(object.getMonth() + 1);
    const date = padZero(object.getDate());
    const hour = padZero(object.getHours());
    const minute = padZero(object.getMinutes());
    const second = padZero(object.getSeconds());

    return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
};

/**
 * 숫자(number)를 입력받고 10보다 작을 경우 앞에 0을 붙여 2글자로 반환합니다
 * "문자열".padStart(2, '0')과 동일하게 동작합니다
 */
const padZero = (n) => (n < 10 ? '0' + n : n);

/**
 * 게시글 통계성 데이터(조회수, 좋아요 수, 댓글 수)를 변환합니다
 * 1천 개 이상 1k, 1만 개 이상 10k, 10만 개 이상 100k로 표현합니다
 */
export const formatCount = (count) => {
    return count >= 100000 ? '100k' : count >= 10000 ? '10k' : count > 1000 ? '1k' : count;
};
