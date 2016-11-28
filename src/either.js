import {
    get,
    isError
} from "lodash/fp";

function createErroneousMonad(input) {
    const newEither = {};
    newEither.left = (isError(input)) ? input.stack : input;
    newEither.hasLeft = true;
    return newEither;
}

function createSuccessfulMonad(input) {
    const newEither = {};
    newEither.right = input;
    return newEither;
}

function getErroneousValue(monad) {
    return get("left", monad);
}

function getSuccessfulValue(monad) {
    return get("right", monad);
}

function isInErrorState(monad) {
    return !!get("hasLeft", monad);
}

function toString(monad) {
    if (isInErrorState(monad)) {
        return `Either(Left(${getErroneousValue(monad)}))`;
    }
    return `Either(Right(${JSON.stringify(getSuccessfulValue(monad))}))`;
}

export {
    createErroneousMonad,
    createSuccessfulMonad,
    getErroneousValue,
    getSuccessfulValue,
    isInErrorState,
    toString
};
