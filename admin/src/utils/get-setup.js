let setupFunction = () => {};

try {
    const config = require('../../../../../config/plugins')();
    const setupFun = config?.tinymce?.config?.editor?.editorConfig?.setup;

    if (setupFun) {
        setupFunction = setupFun;
    }
} catch (error) {
    console.info('"setup" function for TinyMCE plugin is not defined, skipping');
}

export default setupFunction
