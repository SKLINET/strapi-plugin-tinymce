import { useRef, type ChangeEvent, type ComponentType, type DragEvent, type ReactNode } from 'react';
import { Button } from '@strapi/design-system';
import { Upload } from '@strapi/icons';
import { useStrapiApp } from '@strapi/strapi/admin';
import { toEditorAsset, type EditorAsset, type MediaLibraryFile } from '../utils/toEditorAsset';

const ALLOWED_TYPES = ['images', 'videos'];

interface FileDropZoneProps {
    children: ReactNode;
    disabled?: boolean;
    allowedTypes?: string[];
    onDropFiles: (event: DragEvent) => (file: MediaLibraryFile) => void;
}

interface UploadAssetProps {
    disabled?: boolean;
    onUpload: (assets: EditorAsset[]) => void;
}

/**
 * Uploads files picked from the computer into the Media Library and hands each
 * uploaded file to the editor.
 *
 * The new Media Library picker cannot upload, and Strapi exposes no standalone
 * upload dialog. The upload pipeline it does expose to editors is the
 * `media-library-file-drop-zone` component (used by the Blocks editor): it checks
 * permissions and allowed types, uploads through the global upload progress
 * dialog and reports every uploaded file back. The picked files are handed to it
 * as a drop event. On the legacy Media Library the component is not registered,
 * so the button is hidden; the legacy picker can upload by itself.
 */
const UploadAsset = ({ disabled, onUpload }: UploadAssetProps) => {
    const FileDropZone = useStrapiApp(
        'TinyMCEUploadAsset',
        (state: any) => state.components?.['media-library-file-drop-zone'],
    ) as ComponentType<FileDropZoneProps> | undefined;
    const inputRef = useRef<HTMLInputElement>(null);
    const dropTargetRef = useRef<HTMLDivElement>(null);

    if (!FileDropZone) {
        return null;
    }

    const handleFilesPicked = (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);

        // Lets the same file be picked again right after.
        event.target.value = '';

        if (files.length === 0) {
            return;
        }

        const dataTransfer = new DataTransfer();

        files.forEach((file) => dataTransfer.items.add(file));

        const drop = new Event('drop', { bubbles: true, cancelable: true });

        Object.defineProperty(drop, 'dataTransfer', { value: dataTransfer });
        // The input lives inside the drop target, so the target is mounted here.
        dropTargetRef.current!.dispatchEvent(drop);
    };

    return (
        <FileDropZone
            disabled={disabled}
            allowedTypes={ALLOWED_TYPES}
            onDropFiles={() => (file) => onUpload([toEditorAsset(file)])}
        >
            <div ref={dropTargetRef}>
                <Button
                    startIcon={<Upload />}
                    variant="secondary"
                    fullWidth
                    disabled={disabled}
                    onClick={() => inputRef.current?.click()}
                >
                    Upload asset
                </Button>
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    hidden
                    onChange={handleFilesPicked}
                />
            </div>
        </FileDropZone>
    );
};

export default UploadAsset;
