/**
 * (1) 로그인한 상태에서 whiteList(로그인 및 회원가입 경로)에 접근하면 /index로 redirect
 * (2) 로그인하지 않은 상태에서 whiteList 외 경로에 접근하면 /login으로 redirect
 * (3) 로그인한 상태에서 whiteList 외 경로에 접근
 *      혹은 로그인하지 않은 상태에서 whiteList에 접근하면 isLogin=true 쿠키 생성 및 next()
 */
export const authGuard = (req, res, next) => {
    if (isStaticRequest(req.path)) {
        return next();
    }

    const isLogin = !!req?.cookies?.sid;

    // /login과 /login/ 동일시하기 위해 startsWith 사용
    const isWhiteList = whiteList.some((url) => req.path.startsWith(url));

    // (1) 상황
    if (isLogin && isWhiteList) {
        return res.redirect('/index');
    }

    // (2) 상황
    if (!isLogin && !isWhiteList) {
        return res.redirect('/login');
    }

    // (3) 상황
    res.cookie('isLogin', isLogin, {});
    next();
};

const whiteList = ['/login', '/register'];

const isStaticRequest = (path) => {
    return path.match(/\.(js|css|png|jpg|jpeg|gif|ico)$/);
};
