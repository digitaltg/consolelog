/*!
 * Copyright (c) 2023 ATD, Inc. All rights reserved.
 */
"use strict";

// translate `main.js` to CommonJS
require = require("esm")(module);
module.exports = require("./main.js");