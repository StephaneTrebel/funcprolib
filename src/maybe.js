import {
    isError,
    isFunction
} from "lodash/fp";

function newMaybe(input) {
    const internalMaybe = {};
    internalMaybe.isMaybe = true;
    internalMaybe.of = function(input) {
        if (input && input.isMaybe) {
            return input;
        }
        if (isError(input)) {
            return internalMaybe.of();
        }
        if (isFunction(input)) {
            return internalMaybe.map(input);
        }
        internalMaybe.value = input;

        if (internalMaybe.value) {
            internalMaybe.nothing = false;
        } else {
            internalMaybe.nothing = true;
        }

        return internalMaybe;
    };
    internalMaybe.isNothing = function() {
        return internalMaybe.nothing;
    };
    internalMaybe.toString = function() {
        return `Maybe(${internalMaybe.isNothing() ? "Nothing" : internalMaybe.value})`;
    };
    internalMaybe.map = function(fn) {
        if (internalMaybe.isNothing()) {
            return internalMaybe;
        }
        try {
            return internalMaybe.of(fn(internalMaybe.value));
        } catch (err) {
            return internalMaybe.of(err);
        }
    };
    internalMaybe.ifNothing = function(fn) {
        if (internalMaybe.isNothing() && isFunction(fn)) {
            fn();
        }
        return internalMaybe;
    };
    internalMaybe.orElse = function(input) {
        if (internalMaybe.isNothing()) {
            if (isFunction(input)) {
                return input();
            }
            return input;
        }
        return internalMaybe.value;
    };
    return internalMaybe.of(input);
}

function flow(...fns) {
    const applier = (input) => fns.reduce(
        (prev, curr) => prev.map(curr), newMaybe(input)
    );
    applier.orElse = (errorFn) => (input) => applier(input).orElse(errorFn);
    return applier;
}

export {
    flow
};
