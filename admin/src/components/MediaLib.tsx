import React from 'react';
import { useStrapiApp } from '@strapi/strapi/admin';
import { toEditorAsset, type EditorAsset, type MediaLibraryFile } from '../utils/toEditorAsset';

interface MediaLibProps {
    isOpen?: boolean;
    onChange?: (assets: EditorAsset[]) => void;
    onToggle?: () => void;
}

const MediaLib = ({ isOpen, onChange, onToggle }: MediaLibProps) => {
    const mediaLibraryDialog = useStrapiApp('mediaLibrary', (state: any) => state.components);
    const MediaDialog = mediaLibraryDialog['media-library'];

    const handleSelectAssets = (files: MediaLibraryFile[]) => {
        if (onChange) onChange(files.map(toEditorAsset));
    };

    if (!isOpen) {
        return null;
    }

    return <MediaDialog onClose={onToggle} onSelectAssets={handleSelectAssets} />;
};

export default MediaLib;
