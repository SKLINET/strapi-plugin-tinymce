// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { DragEvent, ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type DropZoneProps = {
    children: ReactNode;
    allowedTypes?: string[];
    onDropFiles: (event: DragEvent) => (file: Record<string, unknown>) => void;
};

const mocks = vi.hoisted(() => ({
    components: {} as Record<string, unknown>,
    allowedTypes: undefined as string[] | undefined,
}));

// Stands in for Strapi's `media-library-file-drop-zone`: it uploads what is dropped
// and hands every uploaded file to the callback `onDropFiles` returned.
const FakeDropZone = ({ children, allowedTypes, onDropFiles }: DropZoneProps) => (
    <div
        onDrop={(event) => {
            mocks.allowedTypes = allowedTypes;
            const onFileUploaded = onDropFiles(event);

            for (const file of Array.from(event.dataTransfer.files)) {
                onFileUploaded({
                    name: file.name,
                    alternativeText: null,
                    url: `https://cdn.example.test/${file.name}`,
                    mime: file.type,
                });
            }
        }}
    >
        {children}
    </div>
);

class FakeDataTransfer {
    files: File[] = [];
    types: string[] = [];
    items = {
        add: (file: File) => {
            this.files.push(file);
            this.types = ['Files'];
        },
    };
}

vi.mock('@strapi/strapi/admin', () => ({
    useStrapiApp: (_name: string, selector: (state: { components: Record<string, unknown> }) => unknown) =>
        selector({ components: mocks.components }),
}));

vi.mock('@strapi/design-system', () => ({
    Button: ({ children, disabled, onClick }: { children: ReactNode; disabled?: boolean; onClick?: () => void }) => (
        <button disabled={disabled} onClick={onClick}>
            {children}
        </button>
    ),
}));

vi.mock('@strapi/icons', () => ({ Upload: () => null }));

import UploadAsset from './UploadAsset';

const pickFiles = (container: HTMLElement, files: File[]) => {
    const input = container.querySelector<HTMLInputElement>('input[type="file"]');

    fireEvent.change(input!, { target: { files } });

    return input!;
};

describe('UploadAsset', () => {
    beforeEach(() => {
        mocks.components = { 'media-library-file-drop-zone': FakeDropZone };
        mocks.allowedTypes = undefined;
        vi.stubGlobal('DataTransfer', FakeDataTransfer);
    });

    afterEach(() => {
        cleanup();
    });

    it('uploads picked files through the Strapi drop zone and inserts each uploaded asset', () => {
        const onUpload = vi.fn();
        const { container } = render(<UploadAsset onUpload={onUpload} />);

        pickFiles(container, [
            new File(['a'], 'plan.png', { type: 'image/png' }),
            new File(['b'], 'clip.mp4', { type: 'video/mp4' }),
        ]);

        expect(mocks.allowedTypes).toEqual(['images', 'videos']);
        expect(onUpload).toHaveBeenNthCalledWith(1, [
            { alt: 'plan.png', url: 'https://cdn.example.test/plan.png', mime: 'image/png' },
        ]);
        expect(onUpload).toHaveBeenNthCalledWith(2, [
            { alt: 'clip.mp4', url: 'https://cdn.example.test/clip.mp4', mime: 'video/mp4' },
        ]);
    });

    it('opens the file picker from the Upload asset button and lets the same file be picked again', () => {
        const click = vi.spyOn(HTMLInputElement.prototype, 'click').mockImplementation(() => undefined);
        const { container } = render(<UploadAsset onUpload={vi.fn()} />);

        fireEvent.click(screen.getByRole('button', { name: 'Upload asset' }));
        const input = pickFiles(container, [new File(['a'], 'plan.png', { type: 'image/png' })]);

        expect(click).toHaveBeenCalledTimes(1);
        expect(input.value).toBe('');
    });

    it('ignores an empty file selection', () => {
        const onUpload = vi.fn();
        const { container } = render(<UploadAsset onUpload={onUpload} />);

        pickFiles(container, []);

        expect(mocks.allowedTypes).toBeUndefined();
        expect(onUpload).not.toHaveBeenCalled();
    });

    it('disables the button when the field is disabled', () => {
        render(<UploadAsset disabled onUpload={vi.fn()} />);

        expect(screen.getByRole('button', { name: 'Upload asset' })).toHaveProperty('disabled', true);
    });

    it('renders nothing when Strapi has no drop zone registered (legacy Media Library)', () => {
        mocks.components = {};

        render(<UploadAsset onUpload={vi.fn()} />);

        expect(screen.queryByRole('button', { name: 'Upload asset' })).toBeNull();
    });
});
