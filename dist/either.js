"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.toString = exports.isInErrorState = exports.getSuccessfulValue = exports.getErroneousValue = exports.createSuccessfulMonad = exports.createErroneousMonad = undefined;

var _fp = require("lodash/fp");

function createErroneousMonad(input) {
    var newEither = {};
    newEither.left = (0, _fp.isError)(input) ? input.stack : input;
    newEither.hasLeft = true;
    return newEither;
}

function createSuccessfulMonad(input) {
    var newEither = {};
    newEither.right = input;
    return newEither;
}

function getErroneousValue(monad) {
    return (0, _fp.get)("left", monad);
}

function getSuccessfulValue(monad) {
    return (0, _fp.get)("right", monad);
}

function isInErrorState(monad) {
    return !!(0, _fp.get)("hasLeft", monad);
}

function toString(monad) {
    if (isInErrorState(monad)) {
        return "Either(Left(" + getErroneousValue(monad) + "))";
    }
    return "Either(Right(" + JSON.stringify(getSuccessfulValue(monad)) + "))";
}

exports.createErroneousMonad = createErroneousMonad;
exports.createSuccessfulMonad = createSuccessfulMonad;
exports.getErroneousValue = getErroneousValue;
exports.getSuccessfulValue = getSuccessfulValue;
exports.isInErrorState = isInErrorState;
exports.toString = toString;
//# sourceMappingURL=either.js.map