import {
    executeTests
} from "../tests/unit-tests.js";

import {
    createErroneousMonad,
    createSuccessfulMonad,
    getErroneousValue,
    getSuccessfulValue,
    isInErrorState,
    toString
} from "./maybe";

executeTests("Maybe Monad definition", [{
    name: "createErroneousMonad()",
    assertions: [{
        when: "...everytime",
        should: "return a Maybe(Nothing)",
        test: (test) => test(function(t) {
            const maybe = createErroneousMonad(new Error("DERP"));
            t.equal(maybe.isNothing, true, "It is a Nothing");
            t.end();
        })
    }]
}, {
    name: "createSuccessfulMonad()",
    assertions: [{
        when: "...everytime",
        should: "return a Maybe(Something) with given input as internal value",
        test: (test) => test(function(t) {
            const testInput = function(input, msg) {
                const maybe = createSuccessfulMonad(input);
                t.deepEqual(!!maybe.isNothing, false, `is a Something for ${msg}`);
                t.deepEqual(maybe.value, input, `Value is ok for ${msg}`);
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
        when: "given any Maybe(Nothing) monad",
        should: "return null",
        test: (test) => test(function(t) {
            t.equal(getErroneousValue(createErroneousMonad()), null);
            t.end();
        })
    }]
}, {
    name: "getSuccessfulValue()",
    assertions: [{
        when: "given any Maybe(Something)",
        should: "return the Somthing value",
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
        when: "given any Maybe(Something)",
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
            }, "non-empty Objects, without an isNothing property");
            testInput({
                foo: "bar",
                qux: "baz",
                isNothing: false
            }, "non-empty Objects, with a falsy isNothing property");
            testInput([], "empty Arrays");
            testInput(["foo", "bar", "qux"], "non-empty Arrays");
            t.end();
        })
    }, {
        when: "given any Maybe(Nothing)",
        should: "return true",
        test: (test) => test(function(t) {
            const testInput = (input, msg) => t.deepEqual(
                isInErrorState(createErroneousMonad(input)), true, `Ok for ${msg}`
            );
            testInput(new Error("DERP"), "Errors");
            testInput({
                foo: "bar",
                isNothing: true
            }, "Objects forcibly having a truthy isNothing property");
            t.end();
        })
    }]
}, {
    name: "toString()",
    assertions: [{
        when: "given any Maybe(Something)",
        should: "return a String stating the Monad is a Maybe(Something)",
        test: (test) => test(function(t) {
            const maybe = createSuccessfulMonad("foo");
            t.equal(
                toString(maybe).includes("Maybe"), true,
                "it states that given input is an Maybe"
            );
            t.equal(
                toString(maybe).includes("Something"), true,
                "it states that given input is a Maybe(Something)"
            );
            t.end();
        })
    }, {
        when: "given any Maybe(Nothing)",
        should: "return a String stating the Monad is a Maybe(Nothing)",
        test: (test) => test(function(t) {
            const maybe = createErroneousMonad("foo");
            t.equal(
                toString(maybe).includes("Maybe"), true,
                "it states that given input is a Maybe"
            );
            t.equal(
                toString(maybe).includes("Nothing"), true,
                "it states that given input is a Maybe(Nothing)"
            );
            t.end();
        })
    }]
}]);
