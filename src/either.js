import {
    isError,
    isFunction,
    isNull,
    isUndefined
} from "lodash/fp";

function createEither(input) {
    const newEither = {};
    newEither.isEither = true;
    newEither.of = function(input) {
        if (input && input.isEither) {
            return input;
        }
        if (isError(input) || isNull(input) || Number.isNaN(input) || isUndefined(input)) {
            newEither.left = input;
            newEither.hasLeft = true;
            return newEither;
        }
        if (isFunction(input)) {
            return newEither.map(input);
        }
        newEither.right = input;
        return newEither;
    };
    newEither.toString = () => `Either(Left(${newEither.left}), Right(${newEither.right}))`;
    newEither.isLeft = () => !!newEither.hasLeft;
    newEither.map = function(fn) {
        if (newEither.isLeft()) {
            return newEither;
        }
        try {
            return createEither(fn(newEither.right));
        } catch (err) {
            return createEither(err);
        }
    };
    newEither.ifLeft = function(input) {
        if (newEither.isLeft()) {
            if (isFunction(input)) {
                return input(newEither.left);
            }
            return input;
        }
        return newEither.right;
    };
    return newEither.of(input);
}

function eitherFlow(...fns) {
    const applier = (input) => fns.reduce(
        (prev, curr) => prev.map(curr), createEither(input)
    );
    applier.ifLeft = (errorFn) => (input) => applier(input).ifLeft(errorFn);
    return applier;
}

eitherFlow.debug = function(...fns) {
    let functionCall = 0;
    const applier = (input) => fns.reduce(
        (prev, curr) => {
            const eitherDebug = "Either Debug - "
            console.log(eitherDebug + "Call #", ++functionCall);
            console.log(eitherDebug + "Current=", prev);
            console.log(eitherDebug + "Next function=", curr);
            const temp = prev.map(curr);
            console.log(eitherDebug + "New value=", temp);
            return temp;
        }, createEither(input)
    );
    applier.ifLeft = (errorFn) => (input) => applier(input).ifLeft(errorFn);
    return applier;
}

export {
    createEither,
    eitherFlow
};
