import { prefixFileUrlWithBackendUrl } from './prefixFileUrlWithBackendUrl';

export interface MediaLibraryFile {
    alternativeText?: string | null;
    name: string;
    url: string;
    mime: string;
}

export interface EditorAsset {
    alt: string;
    url: string;
    mime: string;
}

/** Maps a Media Library file to what the editor inserts into the rich text. */
export const toEditorAsset = (file: MediaLibraryFile): EditorAsset => ({
    alt: file.alternativeText || file.name,
    url: prefixFileUrlWithBackendUrl(file.url),
    mime: file.mime,
});
