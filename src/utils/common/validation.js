export default {
    url: new RegExp(/^https?:\/\/\w+(\.\w+)*(:[0-9]+)?\/?(\/[.\w]*)*$/),
    isValidJson: jsonStr => {
        try {
            JSON.parse(jsonStr);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }
};
