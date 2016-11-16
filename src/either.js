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
            newEither.left = (isError(input)) ? input.stack : input;
            newEither.hasLeft = true;
            return newEither;
        }
        if (isFunction(input)) {
            return newEither.map(input);
        }
        newEither.right = input;
        return newEither;
    };
    newEither.toString = () => (newEither.isLeft()) ? `Either(Left(${newEither.left}))` :
        `Either(Right(${JSON.stringify(newEither.right)}))`;
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
                if (newEither.left) {
                    return input(newEither.left);
                }
                return input(new Error("Either is a Left()"));
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
        function(prev, curr) {
            const eitherDebug = "Either Debug - ";
            const temp = prev.map(curr);
            if (prev.isLeft()) {
                console.log(eitherDebug + "Either is a Left(). Bypassing ", curr.toString().split("\n")[0]);
            } else {
                functionCall = functionCall + 1;
                console.log(`${eitherDebug}Call #${functionCall}`);
                console.log(`${eitherDebug}Current value=${prev.toString()}`);
                console.log(`${eitherDebug}Next function=${curr}`);
                console.log(`${eitherDebug}New value=${temp.toString()}`);
            }
            return temp;
        }, createEither(input)
    );
    applier.ifLeft = (errorFn) => (input) => applier(input).ifLeft(errorFn);
    return applier;
};

export {
    createEither,
    eitherFlow
};
