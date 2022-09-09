import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Editor } from "@tinymce/tinymce-react";
import { request } from "@strapi/helper-plugin";
import pluginId from "../../pluginId";
import taskRequests from "../../api/settings";

const TinyEditor = ({ onChange, name, value }) => {
    const [pluginConfig, setPluginConfig] = useState();
    const [apiKey, setApiKey] = useState("");

    useEffect(() => {
        const getApiKey = async () => {
            const data = await taskRequests.getSettings();
            if (data) {
                return setApiKey(data.data.apiKey);
            }
        };
        const getPluginConfig = async () => {
            const editor = await request(`/${pluginId}/config/editor`, {
                method: "GET",
            });
            if (editor) {
                setPluginConfig(editor);
            }
        };
        getApiKey();
        getPluginConfig();
    }, []);

    return (
        <Editor
            apiKey={apiKey || ""}
            value={value}
            tagName={name}
            onEditorChange={(editorContent) => {
                onChange({ target: { name, value: editorContent } });
            }}
            outputFormat={pluginConfig?.outputFormat || "html"}
            init={pluginConfig?.editorConfig}
        />
    );
};
TinyEditor.propTypes = {
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string,
};
export default TinyEditor;
