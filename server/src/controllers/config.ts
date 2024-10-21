"use strict";

export default {
    getConfig: async (ctx) => {
        const { configKey } = ctx.params;
        const config = await strapi.plugin('tinymce').service('config').getConfig(configKey);
        ctx.send(config);
    },
};
