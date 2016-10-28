import {
    isError,
    isFunction
} from "lodash/fp";

function createMaybe(input) {
    const newMaybe = {};
    newMaybe.isMaybe = true;
    newMaybe.of = function(input) {
        if (input && input.isMaybe) {
            return input;
        }
        if (isError(input)) {
            return newMaybe.of();
        }
        if (isFunction(input)) {
            return newMaybe.map(input);
        }
        newMaybe.value = input;

        if (newMaybe.value) {
            newMaybe.isNothing = false;
        } else {
            newMaybe.isNothing = true;
        }
        return newMaybe;
    };
    newMaybe.toString = () => `Maybe(${newMaybe.isNothing ? "Nothing" : newMaybe.value})`;
    newMaybe.map = function(fn) {
        if (newMaybe.isNothing) {
            return newMaybe;
        }
        try {
            return createMaybe(fn(newMaybe.value));
        } catch (err) {
            return createMaybe(err);
        }
    };
    newMaybe.orElse = function(input) {
        if (newMaybe.isNothing) {
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
