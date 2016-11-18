"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.eitherFlow = exports.createEither = undefined;

var _fp = require("lodash/fp");

function createEither(input) {
    var newEither = {};
    newEither.isEither = true;
    newEither.of = function (input) {
        if (input && input.isEither) {
            return input;
        }
        if ((0, _fp.isError)(input) || (0, _fp.isNull)(input) || Number.isNaN(input) || (0, _fp.isUndefined)(input)) {
            newEither.left = (0, _fp.isError)(input) ? input.stack : input;
            newEither.hasLeft = true;
            return newEither;
        }
        if ((0, _fp.isFunction)(input)) {
            return newEither.map(input);
        }
        newEither.right = input;
        return newEither;
    };
    newEither.toString = function () {
        return newEither.isLeft() ? "Either(Left(" + newEither.left + "))" : "Either(Right(" + JSON.stringify(newEither.right) + "))";
    };
    newEither.isLeft = function () {
        return !!newEither.hasLeft;
    };
    newEither.map = function (fn) {
        if (newEither.isLeft()) {
            return newEither;
        }
        try {
            return createEither(fn(newEither.right));
        } catch (err) {
            return createEither(err);
        }
    };
    newEither.ifLeft = function (input) {
        if (newEither.isLeft()) {
            if ((0, _fp.isFunction)(input)) {
                if (newEither.left) {
                    return input(newEither.left);
                }
                return input(newEither.of(new Error("Either is a Left()")).left);
            }
            return input;
        }
        return newEither.right;
    };
    return newEither.of(input);
}

function eitherFlow() {
    for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
        fns[_key] = arguments[_key];
    }

    var applier = function applier(input) {
        return fns.reduce(function (prev, curr) {
            return prev.map(curr);
        }, createEither(input));
    };
    applier.ifLeft = function (errorFn) {
        return function (input) {
            return applier(input).ifLeft(errorFn);
        };
    };
    return applier;
}

eitherFlow.debug = function () {
    for (var _len2 = arguments.length, fns = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        fns[_key2] = arguments[_key2];
    }

    var functionCall = 0;
    var applier = function applier(input) {
        return fns.reduce(function (prev, curr) {
            var eitherDebug = "Either Debug - ";
            var temp = prev.map(curr);
            if (prev.isLeft()) {
                console.log(eitherDebug + "Either is a Left(). Bypassing ", curr.toString().split("\n")[0]);
            } else {
                functionCall = functionCall + 1;
                console.log(eitherDebug + "Call #" + functionCall);
                console.log(eitherDebug + "Current value=" + prev.toString());
                console.log(eitherDebug + "Next function=" + curr);
                console.log(eitherDebug + "New value=" + temp.toString());
            }
            return temp;
        }, createEither(input));
    };
    applier.ifLeft = function (errorFn) {
        return function (input) {
            return applier(input).ifLeft(errorFn);
        };
    };
    return applier;
};

exports.createEither = createEither;
exports.eitherFlow = eitherFlow;
//# sourceMappingURL=either.js.map