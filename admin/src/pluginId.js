const pluginPkg = require("../../package.json");

const pluginId = pluginPkg.name.replace(/^(@sklinet\/strapi-)plugin-/i, "");

module.exports = pluginId;
