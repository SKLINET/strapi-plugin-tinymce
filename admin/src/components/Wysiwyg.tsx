import React from 'react';
import { Box, Flex, Typography } from '@strapi/design-system';
import { Earth } from '@strapi/icons';
import TinyEditor from './Editor';
// import MediaLib from './MediaLib';

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
                                <Earth width={12} height={12} />
                            </Flex>
                        )}
                    </Flex>
                )}
                <TinyEditor disabled={Boolean(disabled)} name={name} onChange={onChange} value={value} />
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
            {/* <MediaLib isOpen={true} /> */}
        </>
    );
};

export default Wysiwyg;
