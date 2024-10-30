"use strict";

import type { Core } from '@strapi/strapi';
import { PLUGIN_ID } from '../../admin/src/pluginId';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.customFields.register({
    name: 'tinymce',
    plugin: PLUGIN_ID,
    type: 'string',
  });
};

export default register;
