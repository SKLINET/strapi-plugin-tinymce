import { describe, expect, it } from 'vitest';

import { toEditorAsset } from './toEditorAsset';

describe('toEditorAsset', () => {
    it('keeps absolute URLs and uses the alternative text as alt', () => {
        expect(
            toEditorAsset({
                alternativeText: 'Plan of the flat',
                name: 'plan.png',
                url: 'https://res.cloudinary.com/demo/plan.png',
                mime: 'image/png',
            }),
        ).toEqual({
            alt: 'Plan of the flat',
            url: 'https://res.cloudinary.com/demo/plan.png',
            mime: 'image/png',
        });
    });

    it('falls back to the file name and prefixes relative URLs with the backend URL', () => {
        process.env.STRAPI_ADMIN_BACKEND_URL = 'https://admin.example.test';

        expect(
            toEditorAsset({
                alternativeText: null,
                name: 'clip.mp4',
                url: '/uploads/clip.mp4',
                mime: 'video/mp4',
            }),
        ).toEqual({
            alt: 'clip.mp4',
            url: 'https://admin.example.test/uploads/clip.mp4',
            mime: 'video/mp4',
        });
    });
});
