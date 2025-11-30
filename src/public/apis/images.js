import { API_SERVER_URI, IMAGE_UPLOAD_URI } from '../utils/constants.js';
import { request, imageUploadRequest, METHOD } from '/apis/request.js';

export const requestImageUpload = async (domain, requestBody) => {
    const params = new URLSearchParams({ category: domain }).toString();
    const url = `${API_SERVER_URI}/images?${params}`;
    return imageUploadRequest({ method: METHOD.POST, url, body: requestBody, isFormData: true });
};
