<h1 align="center">Strapi plugin TinyMCE</h1>

<p align="center">Replaces the default Strapi WYSIWYG editor with a customized build of TinyMCE editor.</p>

## 👋 Intro

* [Features](#features)
* [Installation](#installation)
* [Configuration](#configuration)
* [Requirements](#requirements)

## <a id="features"></a>✨ Key features

* **Anchor:** Add an anchor/bookmark button to the toolbar that inserts an anchor at the editor’s cursor insertion point.
* **Autolink:** Create hyperlinks automatically when a user inputs a valid and complete URL.
* **Autoresize:** Resize the editor automatically to the content inside it, and prevent the editor from expanding infinitely.
* **Code:** Add a toolbar button that allows a user to edit the HTML code hidden by the WYSIWYG view.
* **Code sample:** Insert and embed syntax color highlighted code snippets into the editable area.


And much more ! [List of all features](https://www.tiny.cloud/tinymce/features/).

## <a id="installation"></a>🔧 Installation

Inside your Strapi app, add the package:

With `npm`:
```bash
npm install @sklinet/strapi-plugin-tinymce
```
With `yarn`:
```bash
yarn add @sklinet/strapi-plugin-tinymce
```

In `config/plugins.js` file add:
```js
tinymce:{
    enabled:true
};
```

If you do not yet have this file, then create and add:
```js
module.exports = () => ({
    tinymce:{
      enabled:true
    };
})
```

Then run build:
```bash
npm run build
```

or
```bash
yarn build
```

## <a id="configuration"></a>⚙️ Configuration
TinyMCE outputFormat should be defined in `config.editor`, and init object should be defined in `config.editor.editorConfig` field in `plugins.js` file.

**⚠️ `plugins.js` not `plugin.js` ⚠️**

**`plugins.js` file should be placed in `config` folder.**


Learn more about configuration from [official documentation](https://www.tiny.cloud/docs/tinymce/6/).

**Default configuration:**
```js
// plugins.js
module.exports = ({ env }) => ({
    tinymce: {
        enabled: true,
        resolve: "./src/plugins/tinymce",
        config: {
            editor: {
                outputFormat: "html",
                editorConfig: {
                    language: "sk",
                    height: 500,
                    menubar: false,
                    extended_valid_elements: "span, img, small",
                    forced_root_block: "",
                    convert_urls: false,
                    entity_encoding: "raw",
                    plugins: [
                        "advlist autolink lists link image charmap print preview anchor",
                        "searchreplace visualblocks code fullscreen",
                        "table emoticons nonbreaking",
                        "insertdatetime media table paste code help wordcount",
                    ],
                    toolbar:
                        "undo redo | styleselect | bold italic forecolor backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        table emoticons visualblocks code|\
                        nonbreaking bullist numlist outdent indent | removeformat | help",
                    style_formats: [
                        {
                            title: "Headings",
                            items: [
                                { title: "h1", block: "h1" },
                                { title: "h2", block: "h2" },
                                { title: "h3", block: "h3" },
                                { title: "h4", block: "h4" },
                                { title: "h5", block: "h5" },
                                { title: "h6", block: "h6" },
                            ],
                        },

                        {
                            title: "Text",
                            items: [
                                { title: "Paragraph", block: "p" },
                                {
                                    title: "Paragraph with small letters",
                                    block: "small",
                                },
                            ],
                        },
                    ],
                },
            },
        },
    },
});

```

## <a id="requirements"></a>⚠️ Requirements
Strapi **v4.x.x+**

Node **14 - 16**

Tested on **v4.3.4**
