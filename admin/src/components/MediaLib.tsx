import React from 'react';
import { prefixFileUrlWithBackendUrl } from '../utils/prefixFileUrlWithBackendUrl';
import { useStrapiApp } from '@strapi/admin/strapi-admin';

interface MediaLibProps {
    isOpen?: boolean;
    onChange?: (e: any) => void;
    onToggle?: () => void;
}

const MediaLib = ({ isOpen, onChange, onToggle }: MediaLibProps) => {
    // const strapiApp = useStrapiApp("Strapi", (state) => state);

    // console.log(strapiApp);

    // const MediaLibraryDialog = useStrapiApp('mediaLibrary', (state) => state.components);

    // console.log(MediaLibraryDialog);

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

    return <></>;

    // return <MediaLibraryDialog onClose={onToggle} onSelectAssets={handleSelectAssets} />;
};

export default MediaLib;
