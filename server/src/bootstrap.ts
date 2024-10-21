"use strict";

import type { Core } from '@strapi/strapi';

const bootstrap = async ({ strapi }: { strapi: Core.Strapi }) => {
  const actions = [
    {
      section: 'plugins',
      displayName: 'Access the plugin settings',
      uid: 'settings.read',
      pluginName: 'tinymce',
    },
    {
      section: 'plugins',
      displayName: 'Menu link to plugin settings',
      uid: 'menu-link',
      pluginName: 'tinymce',
    },
  ];
  await strapi.admin.services.permission.actionProvider.registerMany(actions);
};

export default bootstrap;
