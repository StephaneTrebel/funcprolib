"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.maybeFlow = exports.createMaybe = exports.eitherFlow = exports.createEither = undefined;
exports.createMonad = createMonad;
exports.flow = flow;

var _fp = require("lodash/fp");

var _either = require("./either");

var _either2 = _interopRequireDefault(_either);

var _maybe = require("./maybe");

var _maybe2 = _interopRequireDefault(_maybe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createMonad(monadDefinition) {
    return function (input) {
        // @note Handle different Monad types here ? E.g Either(Maybe())
        if (input && input.isMonad) {
            return input;
        }
        if ((0, _fp.isFunction)(input)) {
            return function (a) {
                return createMonad(monadDefinition)(a).map(input);
            };
        }

        var newMonad = (0, _fp.isError)(input) || (0, _fp.isNull)(input) || Number.isNaN(input) || (0, _fp.isUndefined)(input) ? monadDefinition.createErroneousMonad(input) : monadDefinition.createSuccessfulMonad(input);
        newMonad.isMonad = true;
        newMonad.toString = function () {
            return monadDefinition.toString(newMonad);
        };

        /**
         * Apply a function on a monad value, but only if the monad is in an ok
         * state
         * @param {Function} fn - Function to apply
         * @return {Object} If everything went right, a new monad with the
         * result of calling given function with the monad value, or the same
         * monad, untouched
         **/
        newMonad.map = function (fn) {
            try {
                if (monadDefinition.isInErrorState(newMonad)) {
                    return newMonad;
                }
                return createMonad(monadDefinition)(fn(monadDefinition.getSuccessfulValue(newMonad)));
            } catch (err) {
                return createMonad(monadDefinition)(err);
            }
        };

        /**
         * Apply a function on a monad erroneous value, or just return the
         * monad right value
         * @node Should be improved to apply given function on right value too
         * @param {Function} fn - Function to apply
         * @return {Object} If everything went right the monad value, or the
         * result of calling the function with the monad's erroneous value
         **/
        newMonad.chain = function (input) {
            if (monadDefinition.isInErrorState(newMonad)) {
                if ((0, _fp.isFunction)(input)) {
                    return input(monadDefinition.getErroneousValue(newMonad));
                }
                return input;
            }
            // @note According to fantasyland specs, we should apply input on
            // the monad value, even if it's not in an erroneous state
            return monadDefinition.getSuccessfulValue(newMonad);
        };

        return newMonad;
    };
}

/**
 * Create a monad out of given input and map any number of functions
 * on it
 * @param {Object} monadDefinition - Monad definition
 * @param {Array<Function>} fns - Functions to apply on the new monad
 * @return {Object} A new Monad on which all given functions will
 * have been called
 **/
function flow(monadDefinition) {
    return function () {
        for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
            fns[_key] = arguments[_key];
        }

        var applier = function applier(input) {
            return fns.reduce(function (prev, curr) {
                return prev.map(curr);
            }, createMonad(monadDefinition)(input));
        };
        applier.chain = function (errorFn) {
            return function (input) {
                return applier(input).chain(errorFn);
            };
        };
        return applier;
    };
}

/**
 * Debug version of flow
 * @node Merge with regular flow
 * @param {Object} monadDefinition - Monad definition
 * @param {Array<Function>} fns - Functions to apply on the new monad
 * @return {Object} A new Monad on which all given functions will
 * have been called
 **/
flow.debug = function (monadDefinition) {
    return function () {
        for (var _len2 = arguments.length, fns = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            fns[_key2] = arguments[_key2];
        }

        var functionCall = 0;
        var applier = function applier(input) {
            return fns.reduce(function (prev, curr) {
                var debug = "FuncProLib Debug - ";
                var temp = prev.map(curr);
                if (prev.chain()) {
                    console.log(debug + "Monad is in an erroneous state. Bypassing ", curr.toString().split("\n")[0]);
                } else {
                    functionCall = functionCall + 1;
                    console.log(debug + "Call #" + functionCall);
                    console.log(debug + "Current value=" + prev.toString());
                    console.log(debug + "Next function=" + curr);
                    console.log(debug + "New value=" + temp.toString());
                }
                return temp;
            }, createMonad(monadDefinition)(input));
        };
        applier.chain = function (errorFn) {
            return function (input) {
                return applier(input).chain(errorFn);
            };
        };
        return applier;
    };
};

// @note Merge into one export const when JSLint accepts it (someday ?)
var createEither = createMonad(_either2.default);
var eitherFlow = flow(_either2.default);
eitherFlow.debug = flow.debug(_either2.default);

var createMaybe = createMonad(_maybe2.default);
var maybeFlow = flow(_maybe2.default);
maybeFlow.debug = flow.debug(_maybe2.default);

exports.createEither = createEither;
exports.eitherFlow = eitherFlow;
exports.createMaybe = createMaybe;
exports.maybeFlow = maybeFlow;
//# sourceMappingURL=main.js.map