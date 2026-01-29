import { useCallback, useEffect, useState } from 'react';
import { Editor, IAllProps } from '@tinymce/tinymce-react';
import { PLUGIN_ID } from '../pluginId';
import taskRequests from '../api/settings';
import { useFetchClient } from '@strapi/strapi/admin';
import { prefixFileUrlWithBackendUrl } from '../utils/prefixFileUrlWithBackendUrl';

interface TinyEditorProps {
    onChange: (e: any) => void;
    name: string;
    value?: string;
    disabled?: boolean;
    disableMediaLibrary?: boolean;
}

type InitOptions = NonNullable<IAllProps['init']>;

const TinyEditor = ({ onChange, name, value, disabled, disableMediaLibrary }: TinyEditorProps) => {
    const { get, post } = useFetchClient();

    const [pluginConfig, setPluginConfig] = useState<any>(null);
    const [apiKey, setApiKey] = useState('');
    const [loading, setLoading] = useState(true);
    const uploadUrl = prefixFileUrlWithBackendUrl('/api/upload', pluginConfig?.data?.defaultAdminDomain || '');

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

    const imageUploadHandler = useCallback<NonNullable<InitOptions['images_upload_handler']>>(
        async (blobInfo) => {
            const data = new FormData();

            data.append('files', blobInfo.blob(), blobInfo.filename());

            try {
                const res = await post<{ location: string }>(`/${PLUGIN_ID}/uploadImage`, data);

                return res.data.location;
            } catch (error) {
                console.error('Image upload failed:', error);

                throw error;
            }
        },
        [post],
    );

    return !loading && pluginConfig?.data ? (
        <Editor
            apiKey={apiKey || ''}
            tinymceScriptSrc={pluginConfig?.data?.tinymceSrc || undefined}
            value={value}
            tagName={name}
            onEditorChange={(editorContent) => {
                onChange({ target: { name, value: editorContent } });
            }}
            init={{
                ...(!disableMediaLibrary && { images_upload_handler: imageUploadHandler }),
                ...(disableMediaLibrary && { paste_data_images: false }),
                ...pluginConfig?.data?.editorConfig,
            }}
        />
    ) : (
        <></>
    );
};

export default TinyEditor;
