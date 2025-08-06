import { Context } from 'koa';

export default {
    async uploadImage(ctx: Context) {
        const file = Array.isArray(ctx.request.files.files) ? ctx.request.files.files[0] : ctx.request.files.files;

        if (!file) {
            return ctx.badRequest('No file uploaded');
        }

        try {
            const [createdFile] = await strapi.plugins.upload.services.upload.upload({
                data: {
                    fileInfo: {
                        name: file.originalFilename,
                        caption: '',
                        alternativeText: '',
                    },
                },
                files: file,
            });

            ctx.body = { location: createdFile.url };
        } catch (error) {
            ctx.internalServerError(`Image upload failed ${error?.message || error?.toString()}`);
        }
    },
};
