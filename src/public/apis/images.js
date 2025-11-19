import { IMAGE_UPLOAD_URI } from '../utils/constants.js';
import { imageUploadRequest, METHOD } from '/apis/request.js';

export const requestImageUpload = async (domain, requestBody) => {
    let url;

    if (window.location.hostname.includes('localhost')) {
        url = `${IMAGE_UPLOAD_URI}/images/${domain}`;
    } else {
        const params = new URLSearchParams({ type: domain }).toString();
        url = `${IMAGE_UPLOAD_URI}/images?${params}`;
    }

    return imageUploadRequest({ method: METHOD.POST, url, body: requestBody, isFormData: true });
};
