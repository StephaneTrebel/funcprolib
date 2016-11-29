import {
    executeTests
} from "../tests/unit-tests.js";

import eitherDefinition from "./either";

const {
    createErroneousMonad,
    createSuccessfulMonad,
    getErroneousValue,
    getSuccessfulValue,
    isInErrorState,
    toString
} = eitherDefinition;

executeTests("Either Monad definition", [{
    name: "createErroneousMonad()",
    assertions: [{
        when: "called with an Error",
        should: "return an Either(Left)",
        test: (test) => test(function(t) {
            const either = createErroneousMonad(new Error("DERP"));
            t.equal(either.hasLeft, true, "It has a Left value");
            t.equal(either.left.includes("DERP"), true, "Left value includes the error message");
            t.end();
        })
    }, {
        when: "called with anything else than an Error",
        should: "return an Either(Left)",
        test: (test) => test(function(t) {
            const testInput = function(input, msg) {
                const either = createErroneousMonad(input);
                t.deepEqual(either.hasLeft, true, `It has a Left value for ${msg}`);
                t.deepEqual(either.left, input, `Ok for ${msg}`);
            };
            testInput("foo", "Strings");
            testInput(123, "Numbers");
            testInput({}, "empty Objects");
            testInput({
                foo: "bar",
                qux: "baz"
            }, "non-empty Objects");
            testInput([], "empty Arrays");
            testInput(["foo", "bar", "qux"], "non-empty Arrays");
            t.end();
        })
    }]
}, {
    name: "createSuccessfulMonad()",
    assertions: [{
        when: "...everytime",
        should: "return an Either(Right) with given input as internal value",
        test: (test) => test(function(t) {
            const testInput = function(input, msg) {
                const either = createSuccessfulMonad(input);
                t.deepEqual(!!either.hasLeft, false, `It has a Right value for ${msg}`);
                t.deepEqual(either.right, input, `Ok for ${msg}`);
            };
            testInput("foo", "Strings");
            testInput(123, "Numbers");
            testInput({}, "empty Objects");
            testInput({
                foo: "bar",
                qux: "baz"
            }, "non-empty Objects");
            testInput([], "empty Arrays");
            testInput(["foo", "bar", "qux"], "non-empty Arrays");
            t.end();
        })
    }]
}, {
    name: "getErroneousValue()",
    assertions: [{
        when: "given any Either(Left)",
        should: "return input left value",
        test: (test) => test(function(t) {
            const testInput = (input, msg) => t.deepEqual(
                getErroneousValue(createErroneousMonad(input)), input, `Ok for ${msg}`
            );
            testInput("foo", "Strings");
            testInput(123, "Numbers");
            testInput({}, "empty Objects");
            testInput({
                foo: "bar",
                qux: "baz"
            }, "non-empty Objects");
            testInput([], "empty Arrays");
            testInput(["foo", "bar", "qux"], "non-empty Arrays");
            t.end();
        })
    }]
}, {
    name: "getSuccessfulValue()",
    assertions: [{
        when: "given any Either(Right)",
        should: "return input right value",
        test: (test) => test(function(t) {
            const testInput = (input, msg) => t.deepEqual(
                getSuccessfulValue(createSuccessfulMonad(input)), input, `Ok for ${msg}`
            );
            testInput("foo", "Strings");
            testInput(123, "Numbers");
            testInput({}, "empty Objects");
            testInput({
                foo: "bar",
                qux: "baz"
            }, "non-empty Objects");
            testInput([], "empty Arrays");
            testInput(["foo", "bar", "qux"], "non-empty Arrays");
            t.end();
        })
    }]
}, {
    name: "isInErrorState()",
    assertions: [{
        when: "given any Either(Right)",
        should: "return false",
        test: (test) => test(function(t) {
            const testInput = (input, msg) => t.deepEqual(
                isInErrorState(createSuccessfulMonad(input)), false, `Ok for ${msg}`
            );
            testInput("foo", "Strings");
            testInput(123, "Numbers");
            testInput({}, "empty Objects");
            testInput({
                foo: "bar",
                qux: "baz"
            }, "non-empty Objects, without an hasLeft property");
            testInput({
                foo: "bar",
                qux: "baz",
                hasLeft: false
            }, "non-empty Objects, with a falsy hasLeft property");
            testInput([], "empty Arrays");
            testInput(["foo", "bar", "qux"], "non-empty Arrays");
            t.end();
        })
    }, {
        when: "given any Either(Left)",
        should: "return true",
        test: (test) => test(function(t) {
            const testInput = (input, msg) => t.deepEqual(
                isInErrorState(createErroneousMonad(input)), true, `Ok for ${msg}`
            );
            testInput(new Error("DERP"), "Errors");
            testInput({
                foo: "bar",
                hasLeft: true
            }, "Objects forcibly having a truthy hasLeft property");
            t.end();
        })
    }]
}, {
    name: "toString()",
    assertions: [{
        when: "given any Either(Right)",
        should: "return a String stating the Monad is an Either(Right)",
        test: (test) => test(function(t) {
            const either = createSuccessfulMonad("foo");
            t.equal(
                toString(either).includes("Either"), true,
                "it states that given input is an Either"
            );
            t.equal(
                toString(either).includes("Right"), true,
                "it states that given input is an Either(Right)"
            );
            t.end();
        })
    }, {
        when: "given any Either(Left)",
        should: "return a String stating the Monad is an Either(Left)",
        test: (test) => test(function(t) {
            const either = createErroneousMonad("foo");
            t.equal(
                toString(either).includes("Either"), true,
                "it states that given input is an Either"
            );
            t.equal(
                toString(either).includes("Left"), true,
                "it states that given input is an Either(Left)"
            );
            t.end();
        })
    }]
}]);
