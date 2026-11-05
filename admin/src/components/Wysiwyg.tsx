import React, { useRef, useState } from 'react';
import { Box, Button, Flex, Typography } from '@strapi/design-system';
import { Earth, Image } from '@strapi/icons';
import TinyEditor from './Editor';
import MediaLib from './MediaLib';
import UploadAsset from './UploadAsset';
import type { EditorAsset } from '../utils/toEditorAsset';

interface WysiwygProps {
  disabled?: boolean;
  error?: string;
  name: string;
  onChange: (e: any) => void;
  required?: boolean;
  label?: string;
  placeholder?: string;
  hint?: string;
  value?: any;
  attribute?: any;
}

const Wysiwyg = ({ name, onChange, value, label, disabled, error, required, hint, attribute }: WysiwygProps) => {
  const localized = Boolean(attribute?.pluginOptions?.i18n?.localized || false);
  const disableMediaLibrary = Boolean(attribute?.options?.disableMediaLibrary || false);
  const [mediaLibVisible, setMediaLibVisible] = useState(false);
  // Uploads report their files one by one, faster than the form re-renders with the
  // new value, so each insert builds on the latest value rather than the rendered one.
  const latestValue = useRef(value);
  latestValue.current = value;

  const handleToggleMediaLib = () => setMediaLibVisible((prev) => !prev);

  const insertAssets = (assets: EditorAsset[]) => {
    let newValue = latestValue.current ? latestValue.current : "";

    assets.map((asset) => {
      if (asset.mime.includes("image")) {
        const imgTag = `<p><img src="${asset.url}" alt="${asset.alt}"></img></p>`;
        newValue = `${newValue}${imgTag}`;
      }
      if (asset.mime.includes("video")) {
        const videoTag = `<video><source src="${asset.url}" alt="${asset.alt}"</source></video>`;
        newValue = `${newValue}${videoTag}`;
      }
    });

    latestValue.current = newValue;
    onChange({ target: {name, value: newValue } });
  };

  const handleChangeAssets = (assets: EditorAsset[]) => {
    insertAssets(assets);
    handleToggleMediaLib();
  };

  return (
    <>
      <Box>
        {label && (
          <Flex paddingBottom={1}>
            <Typography variant="pi" fontWeight="bold" textColor="neutral800">
              {label}
            </Typography>
            {required && (
              <Typography variant="omega" fontWeight="bold" textColor="danger600">
                *
              </Typography>
            )}
            {localized && (
              <Flex paddingLeft={1}>
                <Earth width={12} height={12}/>
              </Flex>
            )}
          </Flex>
        )}
        {!disableMediaLibrary && (
          <Flex gap={2} paddingBottom={2}>
            <Box flex={1}>
              <Button
                startIcon={<Image/>}
                variant="secondary"
                fullWidth
                onClick={handleToggleMediaLib}
              >
                Media library
              </Button>
            </Box>
            <Box flex={1}>
              <UploadAsset disabled={Boolean(disabled)} onUpload={insertAssets}/>
            </Box>
          </Flex>
        )}
        <TinyEditor disabled={Boolean(disabled)} name={name} onChange={onChange} value={value} disableMediaLibrary={disableMediaLibrary}/>
        {(error || hint) && (
          <Box paddingTop={1}>
            {error ? (
              <Typography variant="pi" textColor="danger600">
                {error}
              </Typography>
            ) : (
              <Typography variant="pi" textColor="neutral600">
                {hint}
              </Typography>
            )}
          </Box>
        )}
      </Box>
      <MediaLib
        isOpen={mediaLibVisible}
        onChange={handleChangeAssets}
        onToggle={handleToggleMediaLib}
      />
    </>
  );
};

export default Wysiwyg;
