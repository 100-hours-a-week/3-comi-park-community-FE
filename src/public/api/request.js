import { API_SERVER_URI } from '../utils/constants.js';

export const METHOD = Object.freeze({
    GET: 'GET',
    POST: 'POST',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
});

/**
 * 매개변수로 받은 내용을 토대로 공통 요청 처리를 담당합니다.
 *
 * url: '/'로 시작 필수
 * params: String 타입
 * body: Object 타입
 */
export const request = async ({ method = METHOD.GET, url = '/', params = '', body = undefined }) => {
    try {
        const res = await fetch(`${API_SERVER_URI}${url}?${params}`, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            credentials: 'include',
        });
        const json = await res.json();
        return json;
    } catch (error) {
        console.error(error);
        return { success: false, data: '문제가 발생했습니다' };
    }
};
