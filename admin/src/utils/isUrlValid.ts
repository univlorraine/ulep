const isUrlValid = (url: string) => {
    try {
        const isUrl = new URL(url);

        return !!isUrl;
    } catch (e) {
        return false;
    }
};
export default isUrlValid;
