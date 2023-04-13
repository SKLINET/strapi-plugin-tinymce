"use strict";

module.exports = async ({ strapi }) => {
    const actions = [
        {
            section: "plugins",
            displayName: "Access the plugin settings",
            uid: "settings.read",
            pluginName: "tinymce",
        },
        {
            section: "plugins",
            displayName: "Menu link to plugin settings",
            uid: "menu-link",
            pluginName: "tinymce",
        },
    ];
    await strapi.admin.services.permission.actionProvider.registerMany(actions);
};
