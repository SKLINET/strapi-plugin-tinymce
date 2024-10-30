"use strict";

function getPluginStore() {
    return strapi.store({
        environment: '',
        type: 'plugin',
        name: 'tinymce',
    });
}
async function createDefaultConfig() {
    const pluginStore = getPluginStore();
    const value = {
        apiKey: '',
    };
    await pluginStore.set({ key: 'settings', value });
    return pluginStore.get({ key: 'settings' });
}

export default () => {
    return {
        async getSettings() {
            const pluginStore = getPluginStore();
            let config = await pluginStore.get({ key: 'settings' });
            if (!config) {
                config = await createDefaultConfig();
            }
            return config;
        },
        async setSettings(settings) {
            const value = settings;
            const pluginStore = getPluginStore();
            await pluginStore.set({ key: 'settings', value });
            return pluginStore.get({ key: 'settings' });
        },
    };
};
