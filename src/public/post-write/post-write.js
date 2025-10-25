import { paintHeader } from '../component/common/header/header.js';
import { paintPostForm } from '../component/post/post.js';
import { getAuth } from '../utils/auth-guard.js';

document.addEventListener('DOMContentLoaded', async () => {
    const { success, loginMemberId } = await getAuth();

    if (!success) return;

    paintHeader(success, loginMemberId);
    paintPostForm();
});
