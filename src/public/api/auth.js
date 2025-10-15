import { API_SERVER_URI } from './constants.js';

export const requestLogin = async (email, password) => {
    try {
        const res = await fetch(`${API_SERVER_URI}/auth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include',
        });
        const json = await res.json();
        return json;
    } catch (error) {
        console.error(error);
        return { success: false, data: '문제가 발생했습니다' };
    }
};
