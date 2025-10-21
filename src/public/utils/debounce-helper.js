// 연속적으로 발생한 이벤트 중 마지막으로 발생한 이벤트만 처리
export function debouncedRequest(fn, delay = 200) {
    let timer;
    return function () {
        const args = arguments;
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}
