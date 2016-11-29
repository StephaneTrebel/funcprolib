"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fp = require("lodash/fp");

function createErroneousMonad() {
    var newMaybe = {};
    newMaybe.isNothing = true;
    return newMaybe;
}

function createSuccessfulMonad(input) {
    var newMaybe = {};
    newMaybe.value = input;
    return newMaybe;
}

function getErroneousValue() {
    return null;
}

function getSuccessfulValue(newMaybe) {
    return (0, _fp.get)("value", newMaybe);
}

function isInErrorState(monad) {
    return !!(0, _fp.get)("isNothing", monad);
}

function toString(monad) {
    if (isInErrorState(monad)) {
        return "Maybe(Nothing)";
    }
    return "Maybe(Something(" + getSuccessfulValue(monad) + "))";
}

exports.default = {
    createErroneousMonad: createErroneousMonad,
    createSuccessfulMonad: createSuccessfulMonad,
    getErroneousValue: getErroneousValue,
    getSuccessfulValue: getSuccessfulValue,
    isInErrorState: isInErrorState,
    toString: toString
};
//# sourceMappingURL=maybe.js.map