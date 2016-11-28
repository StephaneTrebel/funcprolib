import {
    isError,
    isFunction,
    isNull,
    isUndefined
} from "lodash/fp";

import eitherDefinition from "./either";

import maybeDefinition from "./maybe";

export function createMonad(monadDefinition) {
    return function(input) {
        // @note Handle different Monad types here ? E.g Either(Maybe())
        if (input && input.isMonad) {
            return input;
        }
        if (isFunction(input)) {
            return (a) => createMonad(monadDefinition)(a).map(input);
        }

        const newMonad = (isError(input) || isNull(input) || Number.isNaN(input) || isUndefined(input)) ?
            monadDefinition.createErroneousMonad(input) :
            monadDefinition.createSuccessfulMonad(input);
        newMonad.isMonad = true;
        newMonad.toString = () => monadDefinition.toString(newMonad);

        /**
         * Apply a function on a monad value, but only if the monad is in an ok
         * state
         * @param {Function} fn - Function to apply
         * @return {Object} If everything went right, a new monad with the
         * result of calling given function with the monad value, or the same
         * monad, untouched
         **/
        newMonad.map = function(fn) {
            try {
                if (monadDefinition.isInErrorState(newMonad)) {
                    return newMonad;
                }
                return createMonad(monadDefinition)(
                    fn(monadDefinition.getSuccessfulValue(newMonad))
                );
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
        newMonad.chain = function(input) {
            if (monadDefinition.isInErrorState(newMonad)) {
                if (isFunction(input)) {
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
export function flow(monadDefinition) {
    return function(...fns) {
        const applier = (input) => fns.reduce(
            (prev, curr) => prev.map(curr), createMonad(monadDefinition)(input)
        );
        applier.chain = (errorFn) => (input) => applier(input).chain(errorFn);
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
flow.debug = function(monadDefinition) {
    return function(...fns) {
        let functionCall = 0;
        const applier = (input) => fns.reduce(
            function(prev, curr) {
                const debug = "FuncProLib Debug - ";
                const temp = prev.map(curr);
                if (prev.chain()) {
                    console.log(debug + "Monad is in an erroneous state. Bypassing ", curr.toString().split("\n")[0]);
                } else {
                    functionCall = functionCall + 1;
                    console.log(`${debug}Call #${functionCall}`);
                    console.log(`${debug}Current value=${prev.toString()}`);
                    console.log(`${debug}Next function=${curr}`);
                    console.log(`${debug}New value=${temp.toString()}`);
                }
                return temp;
            }, createMonad(monadDefinition)(input)
        );
        applier.chain = (errorFn) => (input) => applier(input).chain(errorFn);
        return applier;
    };
};

// @note Merge into one export const when JSLint accepts it (someday ?)
const createEither = createMonad(eitherDefinition);
const eitherFlow = flow(eitherDefinition);
eitherFlow.debug = flow.debug(eitherDefinition);

const createMaybe = createMonad(maybeDefinition);
const maybeFlow = flow(maybeDefinition);
maybeFlow.debug = flow.debug(maybeDefinition);

export {
    createEither,
    eitherFlow,
    createMaybe,
    maybeFlow
};
