"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

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

exports.default = {
    createErroneousMonad: createErroneousMonad,
    createSuccessfulMonad: createSuccessfulMonad,
    getErroneousValue: getErroneousValue,
    getSuccessfulValue: getSuccessfulValue,
    isInErrorState: isInErrorState,
    toString: toString
};
//# sourceMappingURL=either.js.map