"use strict";

var _unitTests = require("../tests/unit-tests.js");

var _either = require("./either");

(0, _unitTests.executeTests)("Either Monad definition", [{
    name: "createErroneousMonad()",
    assertions: [{
        when: "called with an Error",
        should: "return an Either(Left)",
        test: function test(_test) {
            return _test(function (t) {
                var either = (0, _either.createErroneousMonad)(new Error("DERP"));
                t.equal(either.hasLeft, true, "It has a Left value");
                t.equal(either.left.includes("DERP"), true, "Left value includes the error message");
                t.end();
            });
        }
    }, {
        when: "called with anything else than an Error",
        should: "return an Either(Left)",
        test: function test(_test2) {
            return _test2(function (t) {
                var testInput = function testInput(input, msg) {
                    var either = (0, _either.createErroneousMonad)(input);
                    t.deepEqual(either.hasLeft, true, "It has a Left value for " + msg);
                    t.deepEqual(either.left, input, "Ok for " + msg);
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
            });
        }
    }]
}, {
    name: "createSuccessfulMonad()",
    assertions: [{
        when: "...everytime",
        should: "return an Either(Right) with given input as internal value",
        test: function test(_test3) {
            return _test3(function (t) {
                var testInput = function testInput(input, msg) {
                    var either = (0, _either.createSuccessfulMonad)(input);
                    t.deepEqual(!!either.hasLeft, false, "It has a Right value for " + msg);
                    t.deepEqual(either.right, input, "Ok for " + msg);
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
            });
        }
    }]
}, {
    name: "getErroneousValue()",
    assertions: [{
        when: "given any Either(Left)",
        should: "return input left value",
        test: function test(_test4) {
            return _test4(function (t) {
                var testInput = function testInput(input, msg) {
                    return t.deepEqual((0, _either.getErroneousValue)((0, _either.createErroneousMonad)(input)), input, "Ok for " + msg);
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
            });
        }
    }]
}, {
    name: "getSuccessfulValue()",
    assertions: [{
        when: "given any Either(Right)",
        should: "return input right value",
        test: function test(_test5) {
            return _test5(function (t) {
                var testInput = function testInput(input, msg) {
                    return t.deepEqual((0, _either.getSuccessfulValue)((0, _either.createSuccessfulMonad)(input)), input, "Ok for " + msg);
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
            });
        }
    }]
}, {
    name: "isInErrorState()",
    assertions: [{
        when: "given any Either(Right)",
        should: "return false",
        test: function test(_test6) {
            return _test6(function (t) {
                var testInput = function testInput(input, msg) {
                    return t.deepEqual((0, _either.isInErrorState)((0, _either.createSuccessfulMonad)(input)), false, "Ok for " + msg);
                };
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
            });
        }
    }, {
        when: "given any Either(Left)",
        should: "return true",
        test: function test(_test7) {
            return _test7(function (t) {
                var testInput = function testInput(input, msg) {
                    return t.deepEqual((0, _either.isInErrorState)((0, _either.createErroneousMonad)(input)), true, "Ok for " + msg);
                };
                testInput(new Error("DERP"), "Errors");
                testInput({
                    foo: "bar",
                    hasLeft: true
                }, "Objects forcibly having a truthy hasLeft property");
                t.end();
            });
        }
    }]
}, {
    name: "toString()",
    assertions: [{
        when: "given any Either(Right)",
        should: "return a String stating the Monad is an Either(Right)",
        test: function test(_test8) {
            return _test8(function (t) {
                var either = (0, _either.createSuccessfulMonad)("foo");
                t.equal((0, _either.toString)(either).includes("Either"), true, "it states that given input is an Either");
                t.equal((0, _either.toString)(either).includes("Right"), true, "it states that given input is an Either(Right)");
                t.end();
            });
        }
    }, {
        when: "given any Either(Left)",
        should: "return a String stating the Monad is an Either(Left)",
        test: function test(_test9) {
            return _test9(function (t) {
                var either = (0, _either.createErroneousMonad)("foo");
                t.equal((0, _either.toString)(either).includes("Either"), true, "it states that given input is an Either");
                t.equal((0, _either.toString)(either).includes("Left"), true, "it states that given input is an Either(Left)");
                t.end();
            });
        }
    }]
}]);
//# sourceMappingURL=either.spec.js.map