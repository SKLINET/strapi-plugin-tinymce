// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
    mediaLibOpen: [] as boolean[],
}));

vi.mock('@strapi/design-system', () => {
    const Element = ({ children }: { children?: ReactNode }) => <div>{children}</div>;

    return {
        Box: Element,
        Flex: Element,
        Typography: Element,
        Button: ({ children, onClick }: { children: ReactNode; onClick?: () => void }) => (
            <button onClick={onClick}>{children}</button>
        ),
    };
});

vi.mock('@strapi/icons', () => ({ Earth: () => null, Image: () => null }));

vi.mock('./Editor', () => ({ default: () => null }));

vi.mock('./MediaLib', () => ({
    default: ({ isOpen }: { isOpen?: boolean }) => {
        mocks.mediaLibOpen.push(Boolean(isOpen));

        return null;
    },
}));

// Uploads land one by one, so two files call `onUpload` twice before the form re-renders.
vi.mock('./UploadAsset', () => ({
    default: ({ onUpload }: { onUpload: (assets: { alt: string; url: string; mime: string }[]) => void }) => (
        <button
            onClick={() => {
                onUpload([{ alt: 'Plan', url: 'https://cdn.example.test/plan.png', mime: 'image/png' }]);
                onUpload([{ alt: 'Map', url: 'https://cdn.example.test/map.png', mime: 'image/png' }]);
            }}
        >
            Upload asset
        </button>
    ),
}));

import Wysiwyg from './Wysiwyg';

describe('Wysiwyg', () => {
    afterEach(() => {
        cleanup();
        mocks.mediaLibOpen = [];
    });

    it('appends every uploaded image to the current value without opening the media library', () => {
        const onChange = vi.fn();

        render(<Wysiwyg name="content" value="<p>Intro</p>" onChange={onChange} />);
        fireEvent.click(screen.getByRole('button', { name: 'Upload asset' }));

        expect(onChange).toHaveBeenLastCalledWith({
            target: {
                name: 'content',
                value:
                    '<p>Intro</p>' +
                    '<p><img src="https://cdn.example.test/plan.png" alt="Plan"></img></p>' +
                    '<p><img src="https://cdn.example.test/map.png" alt="Map"></img></p>',
            },
        });
        expect(mocks.mediaLibOpen).not.toContain(true);
    });

    it('hides both media buttons when the media library is disabled for the field', () => {
        render(<Wysiwyg name="content" onChange={vi.fn()} attribute={{ options: { disableMediaLibrary: true } }} />);

        expect(screen.queryByRole('button', { name: 'Media library' })).toBeNull();
        expect(screen.queryByRole('button', { name: 'Upload asset' })).toBeNull();
    });
});
