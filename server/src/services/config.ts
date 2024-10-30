"use strict";

export default ({ strapi }) => {
    return {
        getConfig(key = 'editor') {
            return strapi.plugin('tinymce').config(key) ?? {};
        },
    };
};
