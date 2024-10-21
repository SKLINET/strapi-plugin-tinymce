import React, { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { PLUGIN_ID } from '../pluginId';
import taskRequests from '../api/settings';
import { useFetchClient } from '@strapi/admin/strapi-admin';
import { prefixFileUrlWithBackendUrl } from '../utils/prefixFileUrlWithBackendUrl';

interface TinyEditorProps {
    onChange: (e: any) => void;
    name: string;
    value?: string;
    disabled?: boolean;
}

const TinyEditor = ({ onChange, name, value, disabled }: TinyEditorProps) => {
    const { get } = useFetchClient();

    const [pluginConfig, setPluginConfig] = useState<any>(null);
    const [apiKey, setApiKey] = useState('');
    const [loading, setLoading] = useState(true);
    const uploadUrl = prefixFileUrlWithBackendUrl('/api/upload');

    useEffect(() => {
        const getApiKey = async () => {
            const data = await taskRequests.getSettings();
            if (data) {
                return setApiKey(data.data.apiKey);
            }
        };
        const getPluginConfig = async () => {
            const editor = await get(`/${PLUGIN_ID}/config/editor`);
            if (editor) {
                setPluginConfig(editor);
            }
        };
        getApiKey().then(() => {
            setLoading(false);
        });
        getPluginConfig();
    }, []);

    return !loading && pluginConfig?.data ? (
        <Editor
            apiKey={apiKey || ''}
            tinymceScriptSrc={pluginConfig?.data?.tinymceSrc || undefined}
            value={value}
            tagName={name}
            onEditorChange={(editorContent) => {
                onChange({ target: { name, value: editorContent } });
            }}
            // @ts-ignore
            outputFormat={pluginConfig?.data?.outputFormat || 'html'}
            init={{
                ...pluginConfig?.data?.editorConfig,
                images_upload_handler: async (blobInfo) => {
                    const formData = new FormData();
                    formData.append('files', blobInfo.blob());
                    const response = await fetch(uploadUrl, {
                        method: 'POST',
                        headers: {
                            Authorization: 'Bearer ',
                        },
                        body: formData,
                    })
                        .then((response) => response.json())
                        .catch(function (err) {
                            console.log('error:', err);
                        });
                    return response?.[0]?.url || '';
                },
            }}
        />
    ) : (
        <></>
    );
};

export default TinyEditor;
