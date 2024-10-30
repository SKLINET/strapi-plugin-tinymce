import pluginPkg from '../../package.json';
import { getTranslation } from './utils/getTranslation';
import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { prefixPluginTranslations } from './utils/prefixPluginTranslations';
import pluginPermissions from './permissions';
import { PluginIcon } from './components/PluginIcon';

const name = pluginPkg.strapi.name;

export default {
    register(app: any) {
        app.customFields.register({
            name: 'tinymce',
            pluginId: PLUGIN_ID,
            type: 'string',
            icon: PluginIcon,
            intlLabel: {
                id: getTranslation('settings.title'),
                defaultMessage: 'TinyMCE',
            },
            intlDescription: {
                id: getTranslation('settings.description'),
                defaultMessage: 'TinyMCE rich text editor',
            },
            isResizable: false,
            default: 12,
            options: {
                advanced: [
                    {
                        type: 'checkbox',
                        name: 'required',
                        intlLabel: {
                            id: getTranslation('settings.required-field'),
                            defaultMessage: 'Required field',
                        },
                        description: "You won't be able to create an entry if this field is empty",
                    },
                ],
            },
            components: {
                Input: async () => import(/* webpackChunkName: "video-field-input-component" */ './components/Wysiwyg'),
            },
        });

        app.createSettingSection(
            {
                id: PLUGIN_ID,
                intlLabel: {
                    id: `${PLUGIN_ID}.plugin.name`,
                    defaultMessage: 'TinyMCE',
                },
            },
            [
                {
                    intlLabel: {
                        id: getTranslation('settings.page-title'),
                        defaultMessage: 'Configuration',
                    },
                    id: 'settings',
                    to: `/settings/${PLUGIN_ID}`,
                    Component: async () => {
                        return import('./pages/Settings');
                    },
                    permissions: pluginPermissions['settings'],
                },
            ],
        );

        app.registerPlugin({
            id: PLUGIN_ID,
            initializer: Initializer,
            isReady: false,
            name: name,
        });
    },

    bootstrap(app: any) {},
    async registerTrads(app: any) {
        const { locales } = app;

        const importedTranslations = await Promise.all(
            (locales as string[]).map((locale) => {
                return import(/* webpackChunkName: "translation-[request]" */ `./translations/${locale}.json`)
                    .then(({ default: data }) => {
                        return {
                            data: prefixPluginTranslations(data, PLUGIN_ID),
                            locale,
                        };
                    })
                    .catch(() => {
                        return {
                            data: {},
                            locale,
                        };
                    });
            }),
        );

        return importedTranslations;
    },
};
