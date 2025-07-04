import { Route } from '@strapi/types/dist/core';

export default {
    routes: [
        {
            method: 'POST',
            path: '/uploadImage',
            handler: 'admin.uploadImage',
            // Enforce admin authentication
            config: { auth: { scope: ['admin::isAuthenticatedAdmin'] } },
        },
    ] as Route[],
};
