"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.toString = exports.isInErrorState = exports.getSuccessfulValue = exports.getErroneousValue = exports.createSuccessfulMonad = exports.createErroneousMonad = undefined;

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

exports.createErroneousMonad = createErroneousMonad;
exports.createSuccessfulMonad = createSuccessfulMonad;
exports.getErroneousValue = getErroneousValue;
exports.getSuccessfulValue = getSuccessfulValue;
exports.isInErrorState = isInErrorState;
exports.toString = toString;
//# sourceMappingURL=maybe.js.map