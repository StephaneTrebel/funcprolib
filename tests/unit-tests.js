"use strict";

const path = require("path");

const {
    executeTests,
    prepareForTests,
    utilityFunctions
} = require("semtest");

const modulePath = (p) => path.join(path.resolve(__dirname, "../dist"), p);

const projectModuleNames = {
    lodash: "lodash/fp",

    maybe: modulePath("maybe")
};

const projectStubs = {
    lodash: {
        "@noCallThru": false
    }
};

exports.executeTests = executeTests;
exports.prepareForTests = prepareForTests(projectModuleNames, projectStubs);
exports.utilityFunctions = utilityFunctions;
