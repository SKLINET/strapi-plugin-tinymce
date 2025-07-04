export const prefixFileUrlWithBackendUrl = (
    path: string,
    url = process.env.STRAPI_ADMIN_BACKEND_URL ?? process.env.BACKEND_URL ?? 'http://localhost:1337',
) => {
    if (path?.startsWith('http')) {
        // Path is already a full URL. No prefix possible.
        return path;
    }

    if (url) {
        return url + path;
    } else {
        return path;
    }
};
