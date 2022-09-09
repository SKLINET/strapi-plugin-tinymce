"use strict";

module.exports = {
    type: "admin",
    routes: [
        {
            method: "GET",
            path: "/config/:configKey",
            handler: "config.getConfig",
            config: { policies: [] },
        },
    ],
};
