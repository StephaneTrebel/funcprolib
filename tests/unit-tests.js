"use strict";

const path = require("path");

const {
    executeTests,
    prepareForTests,
    utilityFunctions
} = require("semtest");

const modulePath = (p) => path.join(path.resolve(__dirname, "../src"), p);

const projectModuleNames = {
    lodash: "lodash/fp",

    maybe: modulePath("src/maybe")
};

const projectStubs = {
    lodash: {
        "@noCallThru": false
    }
};

exports.executeTests = executeTests;
exports.prepareForTests = prepareForTests(projectModuleNames, projectStubs);
exports.utilityFunctions = utilityFunctions;
