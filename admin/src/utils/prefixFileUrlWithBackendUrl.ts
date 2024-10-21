export const prefixFileUrlWithBackendUrl = (path: string) => {
    const url = process.env.BACKEND_URL;

    if (url) {
        return url + path;
    } else {
        return 'http://localhost:1337' + path;
    }
};
