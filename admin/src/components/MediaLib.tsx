import React from 'react';
import { prefixFileUrlWithBackendUrl } from '../utils/prefixFileUrlWithBackendUrl';
import { useStrapiApp } from '@strapi/strapi/admin';

interface MediaLibProps {
    isOpen?: boolean;
    onChange?: (e: any) => void;
    onToggle?: () => void;
}

const MediaLib = ({ isOpen, onChange, onToggle }: MediaLibProps) => {
    const mediaLibraryDialog = useStrapiApp('mediaLibrary', (state: any) => state.components);
    const MediaDialog = mediaLibraryDialog['media-library'];


    const handleSelectAssets = (files: any) => {
        const formattedFiles = files.map((f: any) => ({
            alt: f.alternativeText || f.name,
            url: prefixFileUrlWithBackendUrl(f.url),
            mime: f.mime,
        }));

        if (onChange) onChange(formattedFiles);
    };

    if (!isOpen) {
        return null;
    }

    return <MediaDialog onClose={onToggle} onSelectAssets={handleSelectAssets} />;
};

export default MediaLib;
