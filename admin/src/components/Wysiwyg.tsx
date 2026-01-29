import React, { useState } from 'react';
import { Box, Button, Flex, Typography } from '@strapi/design-system';
import { Earth, Image } from '@strapi/icons';
import TinyEditor from './Editor';
import MediaLib from './MediaLib';

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

  const handleToggleMediaLib = () => setMediaLibVisible((prev) => !prev);

  const handleChangeAssets = (assets: any) => {
    let newValue = value ? value : "";

    assets.map((asset: any) => {
      if (asset.mime.includes("image")) {
        const imgTag = `<p><img src="${asset.url}" alt="${asset.alt}"></img></p>`;
        newValue = `${newValue}${imgTag}`;
      }
      if (asset.mime.includes("video")) {
        const videoTag = `<video><source src="${asset.url}" alt="${asset.alt}"</source></video>`;
        newValue = `${newValue}${videoTag}`;
      }
    });

    onChange({ target: {name, value: newValue } });
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
          <Button
            startIcon={<Image/>}
            variant="secondary"
            fullWidth
            onClick={handleToggleMediaLib}
          >
            Media library
          </Button>
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
