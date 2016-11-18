"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.maybeFlow = exports.createMaybe = undefined;

var _fp = require("lodash/fp");

function createMaybe(input) {
    var newMaybe = {};
    newMaybe.isMaybe = true;
    newMaybe.of = function (input) {
        if (input && input.isMaybe) {
            return input;
        }
        if ((0, _fp.isError)(input) || (0, _fp.isNull)(input) || Number.isNaN(input) || (0, _fp.isUndefined)(input)) {
            newMaybe.value = input;
            newMaybe.hasNothing = true;
            return newMaybe;
        }
        if ((0, _fp.isFunction)(input)) {
            return newMaybe.map(input);
        }
        newMaybe.value = input;
        return newMaybe;
    };
    newMaybe.toString = function () {
        return "Maybe(" + (newMaybe.isNothing() ? "Nothing" : newMaybe.value) + ")";
    };
    newMaybe.isNothing = function () {
        return !!newMaybe.hasNothing;
    };
    newMaybe.map = function (fn) {
        if (newMaybe.isNothing()) {
            return newMaybe;
        }
        try {
            return createMaybe(fn(newMaybe.value));
        } catch (err) {
            return createMaybe(err);
        }
    };
    newMaybe.orElse = function (input) {
        if (newMaybe.isNothing()) {
            if ((0, _fp.isFunction)(input)) {
                return input();
            }
            return input;
        }
        return newMaybe.value;
    };
    return newMaybe.of(input);
}

function maybeFlow() {
    for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
        fns[_key] = arguments[_key];
    }

    var applier = function applier(input) {
        return fns.reduce(function (prev, curr) {
            return prev.map(curr);
        }, createMaybe(input));
    };
    applier.orElse = function (errorFn) {
        return function (input) {
            return applier(input).orElse(errorFn);
        };
    };
    return applier;
}

exports.createMaybe = createMaybe;
exports.maybeFlow = maybeFlow;
//# sourceMappingURL=maybe.js.map