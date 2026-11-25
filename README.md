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

You will also have to update strapi::security middleware in your middlewares.js file in config folder.
If you didn't update this file yet, then replace "strapi::security" with following code (object)
```js
//middlewares.js

 {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,  
        directives: {
          "script-src": ["'self'", "*.tinymce.com", "*.tiny.cloud", "https:"],
          "connect-src": ["'self'", "*.tinymce.com", "*.tiny.cloud", "blob:", "*.strapi.io"],
          "img-src": [
            "'self'",
            "*.tinymce.com",
            "*.tiny.cloud",
            "data:",
            "blob:",
            "dl.airtable.com",
            "strapi.io",
            "s3.amazonaws.com",
            "cdn.jsdelivr.net",
          ],
          "style-src": [
            "'self'",
            "'unsafe-inline'",
            "*.tinymce.com",
            "*.tiny.cloud",
          ],
          "font-src": ["'self'", "*.tinymce.com", "*.tiny.cloud"],
        },
        upgradeInsecureRequests: null,
      },
    },
  },
```

Then run build:
```bash
npm run build
```

or
```bash
yarn build
```

**After starting your project please add API key for your TinyMCE editor in admin panel in settings/tinymce/configuration**

If TinyMCE editor doesn't appear in your richtext field, please check your console for any hints, you might have incorrectly set your middlewares.

## <a id="configuration"></a>⚙️ Configuration
TinyMCE outputFormat should be defined in `config.editor`, and init object should be defined in `config.editor.editorConfig` field in `plugins.js` file.

**⚠️ `plugins.js` not `plugin.js` ⚠️**

**`plugins.js` file should be placed in `config` folder.**


Learn more about configuration from [official documentation](https://www.tiny.cloud/docs/tinymce/8/).

### TinyMCE 8

The plugin uses TinyMCE 8. Without `tinymceSrc` the editor is loaded from Tiny Cloud with your API key.

To self-host the editor, serve the `tinymce` package from your public folder and point `tinymceSrc` to it:

* copy `node_modules/tinymce` to e.g. `public/tinymce`,
* copy the language packs from `node_modules/tinymce-i18n/langs8` to `public/tinymce/langs`,
* set `license_key: "gpl"` in `editorConfig` to use TinyMCE under its open source licence. A self-hosted TinyMCE 8
  editor without a licence key is disabled.

Both packages are installed with the plugin. If your project has its own `tinymce` or `tinymce-i18n` dependency, make
sure it is version 8 (`tinymce`) and 26 or newer (`tinymce-i18n`), otherwise the old version is copied.

A commercial licence key does not work with the `tinymce` package from npm, because it does not contain the licence
key manager. Use the self-hosted bundle from your Tiny account instead.

#### Upgrading from TinyMCE 7

* **Replace the copied editor files.** The browser loads the copy in your public folder, so a project that only
  updates the plugin keeps running TinyMCE 7. Copy `node_modules/tinymce` again and check that
  `tinymce.majorVersion` in the browser console is `8`.
* **Use `langs8` instead of `langs7`.** Language packs with a region are now named with a hyphen (`fr_FR` is
  `fr-FR`, `pt_BR` is `pt-BR`, `zh_CN` is `zh-CN`), so update `language` in `editorConfig` to match the file name.
  Some packs no longer exist. A missing pack leaves the editor in English.
* **Add `license_key`** if your self-hosted `editorConfig` does not have it yet.
* **Remove `forced_root_block: ""`** from `editorConfig`. An empty value is not valid and TinyMCE logs a warning.
* **A disabled editor** is now controlled by the plugin. The field is read-only when Strapi disables it or when
  `editorConfig.disabled` is `true`.
* TinyMCE 8 sanitizes HTML more strictly. See the
  [migration guide](https://www.tiny.cloud/docs/tinymce/8/migration-from-7x/) for this and other changes.

**Default configuration:**
```js
// plugins.js
module.exports = ({ env }) => ({
    tinymce: {
        enabled: true,
        config: {
            editor: {
                outputFormat: "html",
                tinymceSrc: "/tinymce/tinymce.min.js", // USE WITH YOUR PUBLIC PATH TO TINYMCE LIBRARY FOR USING SELF HOSTED TINYMCE
                editorConfig: {
                    license_key: "gpl", // REQUIRED FOR SELF HOSTED TINYMCE
                    language: "sk",
                    height: 500,
                    menubar: false,
                    extended_valid_elements: "span, img, small",
                    convert_urls: false,
                    entity_encoding: "raw",
                    plugins:
                        "advlist autolink lists link image charmap preview anchor \
                        searchreplace visualblocks code fullscreen table emoticons nonbreaking \
                        insertdatetime media table code help wordcount",
                    toolbar:
                        "undo redo | styles | bold italic forecolor backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        media table emoticons visualblocks code|\
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
Strapi **v5.x.x+**

Node **>= 20.x.x**

Tested on **v5.1.1**
