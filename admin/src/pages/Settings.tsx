import React, { useState, useEffect } from 'react';
import { Box, Flex, Typography, Button, Loader, Field } from '@strapi/design-system';
import { useNotification } from '@strapi/strapi/admin';
import { Check } from '@strapi/icons';
import { useIntl } from 'react-intl';
import { getTranslation } from '../utils/getTranslation';
import taskRequests from '../api/settings';

const Settings = () => {
    const { toggleNotification } = useNotification();

    const [currentApiKey, setCurrentApiKey] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const getApiKey = async () => {
            const data = await taskRequests.getSettings();
            if (data) {
                setIsLoading(false);
                return setCurrentApiKey(data.data.apiKey);
            }
        };
        getApiKey();
    }, [setCurrentApiKey]);

    const handleSubmit = async () => {
        setIsSaving(true);
        await taskRequests.setSettings(currentApiKey);
        setIsSaving(false);
        toggleNotification({
            type: 'success',
            message: formatMessage({
                id: getTranslation('settings.success-message'),
                defaultMessage: 'Settings successfully updated',
            }),
        });
    };

    const handleChange = (e: any) => {
        setCurrentApiKey(() => e.target.value);
    };

    const { formatMessage } = useIntl();

    const title = formatMessage({ id: getTranslation('settings.title'), defaultMessage: 'TinyMCE' });
    const subtitle = formatMessage({
        id: getTranslation('settings.subtitle'),
        defaultMessage: 'Manage the settings of your TinyMCE plugin',
    });
    const label = formatMessage({
        id: getTranslation('settings.content-title'),
        defaultMessage: 'Set your API key for TinyMCE editor.',
    });
    const fieldLabel = formatMessage({
        id: getTranslation('settings.input-title'),
        defaultMessage: 'API key',
    });
    const fieldPlaceholder = formatMessage({
        id: getTranslation('settings.input-placeholder'),
        defaultMessage: 'ex: ADASFNASF46564SAD',
    });

    return (
        <>
            <Box paddingTop={10} paddingBottom={10} paddingLeft={10} paddingRight={10}>
                <Flex justifyContent="space-between">
                    <Flex direction="column" alignItems="start" gap={1}>
                        <Typography variant="alpha" fontWeight="bold">
                            {title}
                        </Typography>
                        <Typography variant="epsilon" fontWeight="normal">
                            {subtitle}
                        </Typography>
                    </Flex>
                    {isLoading ? (
                        <></>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            size="L"
                            startIcon={<Check />}
                            disabled={isSaving}
                            loading={isSaving}
                        >
                            {formatMessage({ id: getTranslation('settings.save-button'), defaultMessage: 'Save' })}
                        </Button>
                    )}
                </Flex>
            </Box>

            {isLoading ? (
                <Flex paddingTop={10} paddingBottom={10} alignItems="center" justifyContent="center">
                    <Loader />
                </Flex>
            ) : (
                <Box paddingBottom={10} paddingLeft={10} paddingRight={10}>
                    <Box
                        paddingTop={6}
                        paddingBottom={6}
                        paddingLeft={8}
                        paddingRight={8}
                        background="neutral0"
                        borderRadius={1}
                        shadow="filterShadow"
                    >
                        <Typography variant="omega" fontWeight="normal">
                            {label}
                        </Typography>
                        <Field.Root id="api-key" paddingTop={4}>
                            <Field.Label>{fieldLabel}</Field.Label>
                            <Field.Input
                                type="text"
                                name="key"
                                value={currentApiKey}
                                onChange={handleChange}
                                placeholder={fieldPlaceholder}
                            />
                            <Field.Hint />
                            <Field.Error />
                        </Field.Root>
                    </Box>
                </Box>
            )}
        </>
    );
};

export default Settings;
