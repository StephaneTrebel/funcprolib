import {
    isError,
    isFunction,
    isNull,
    isUndefined
} from "lodash/fp";

function createMaybe(input) {
    const newMaybe = {};
    newMaybe.isMaybe = true;
    newMaybe.of = function(input) {
        if (input && input.isMaybe) {
            return input;
        }
        if (isError(input) || isNull(input) || Number.isNaN(input) || isUndefined(input)) {
            newMaybe.value = input;
            newMaybe.hasNothing = true;
            return newMaybe;
        }
        if (isFunction(input)) {
            return newMaybe.map(input);
        }
        newMaybe.value = input;
        return newMaybe;
    };
    newMaybe.toString = () => `Maybe(${newMaybe.isNothing() ? "Nothing" : newMaybe.value})`;
    newMaybe.isNothing = () => !!newMaybe.hasNothing;
    newMaybe.map = function(fn) {
        if (newMaybe.isNothing()) {
            return newMaybe;
        }
        try {
            return createMaybe(fn(newMaybe.value));
        } catch (err) {
            return createMaybe(err);
        }
    };
    newMaybe.orElse = function(input) {
        if (newMaybe.isNothing()) {
            if (isFunction(input)) {
                return input();
            }
            return input;
        }
        return newMaybe.value;
    };
    return newMaybe.of(input);
}

function maybeFlow(...fns) {
    const applier = (input) => fns.reduce(
        (prev, curr) => prev.map(curr), createMaybe(input)
    );
    applier.orElse = (errorFn) => (input) => applier(input).orElse(errorFn);
    return applier;
}

export {
    createMaybe,
    maybeFlow
};
