import {
    get
} from "lodash/fp";

function createErroneousMonad() {
    const newMaybe = {};
    newMaybe.isNothing = true;
    return newMaybe;
}

function createSuccessfulMonad(input) {
    const newMaybe = {};
    newMaybe.value = input;
    return newMaybe;
}

function getErroneousValue() {
    return null;
}

function getSuccessfulValue(newMaybe) {
    return get("value", newMaybe);
}

function isInErrorState(monad) {
    return !!get("isNothing", monad);
}

function toString(monad) {
    if (isInErrorState(monad)) {
        return `Maybe(Nothing)`;
    }
    return `Maybe(Something(${getSuccessfulValue(monad)}))`;
}

export {
    createErroneousMonad,
    createSuccessfulMonad,
    getErroneousValue,
    getSuccessfulValue,
    isInErrorState,
    toString
};
