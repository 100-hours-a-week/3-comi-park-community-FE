export const API_SERVER_URI = window.location.hostname.includes('localhost')
    ? 'http://localhost:8080/api'
    : 'https://api.co-mi.store/api';

export const IMAGE_UPLOAD_URI = window.location.hostname.includes('localhost')
    ? 'http://localhost:8080/api'
    : 'https://upload.co-mi.store';

export const DEFAULT_MEMBER_IMAGE = '/assets/default-profile-image.png';

export const FOOTER_HEIGHT = '52px';
