import { requestAuth, requestRefresh } from '/apis/auth.js';
import { destroyCookie } from '/utils/cookie-helper.js';

/**
 * 인증 정보가 있는지, 있다면 유효한지 여부를 서버에 확인한 후
 * 유효한 로그인 상태가 아니라면 로그인 페이지로 이동합니다
 *
 * 활용) 로그인 정보가 필요한 페이지의 DOMContentLoaded 이벤트 핸들러에서 아래 두 코드 삽입
 *  const { success, loginMemberId } = await getAuth();
 *  if (!success) return;
 */
export const getAuth = async () => {
    let res = await requestAuth();

    if (!res.success) {
        const refreshRes = await requestRefresh();

        if (refreshRes.success) {
            res = await requestAuth();
        }

        if (!res.success) {
            destroyCookie('loginMemberImageUrl');
            location.replace('/login/index.html');
        }
    }

    return { success: res.success, loginMemberId: res.data?.auth?.id };
};
