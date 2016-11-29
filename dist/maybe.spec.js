"use strict";

var _unitTests = require("../tests/unit-tests.js");

var _maybe = require("./maybe");

var _maybe2 = _interopRequireDefault(_maybe);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createErroneousMonad = _maybe2.default.createErroneousMonad,
    createSuccessfulMonad = _maybe2.default.createSuccessfulMonad,
    getErroneousValue = _maybe2.default.getErroneousValue,
    getSuccessfulValue = _maybe2.default.getSuccessfulValue,
    isInErrorState = _maybe2.default.isInErrorState,
    toString = _maybe2.default.toString;


(0, _unitTests.executeTests)("Maybe Monad definition", [{
    name: "createErroneousMonad()",
    assertions: [{
        when: "...everytime",
        should: "return a Maybe(Nothing)",
        test: function test(_test) {
            return _test(function (t) {
                var maybe = createErroneousMonad(new Error("DERP"));
                t.equal(maybe.isNothing, true, "It is a Nothing");
                t.end();
            });
        }
    }]
}, {
    name: "createSuccessfulMonad()",
    assertions: [{
        when: "...everytime",
        should: "return a Maybe(Something) with given input as internal value",
        test: function test(_test2) {
            return _test2(function (t) {
                var testInput = function testInput(input, msg) {
                    var maybe = createSuccessfulMonad(input);
                    t.deepEqual(!!maybe.isNothing, false, "is a Something for " + msg);
                    t.deepEqual(maybe.value, input, "Value is ok for " + msg);
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
        when: "given any Maybe(Nothing) monad",
        should: "return null",
        test: function test(_test3) {
            return _test3(function (t) {
                t.equal(getErroneousValue(createErroneousMonad()), null);
                t.end();
            });
        }
    }]
}, {
    name: "getSuccessfulValue()",
    assertions: [{
        when: "given any Maybe(Something)",
        should: "return the Somthing value",
        test: function test(_test4) {
            return _test4(function (t) {
                var testInput = function testInput(input, msg) {
                    return t.deepEqual(getSuccessfulValue(createSuccessfulMonad(input)), input, "Ok for " + msg);
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
        when: "given any Maybe(Something)",
        should: "return false",
        test: function test(_test5) {
            return _test5(function (t) {
                var testInput = function testInput(input, msg) {
                    return t.deepEqual(isInErrorState(createSuccessfulMonad(input)), false, "Ok for " + msg);
                };
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
            });
        }
    }, {
        when: "given any Maybe(Nothing)",
        should: "return true",
        test: function test(_test6) {
            return _test6(function (t) {
                var testInput = function testInput(input, msg) {
                    return t.deepEqual(isInErrorState(createErroneousMonad(input)), true, "Ok for " + msg);
                };
                testInput(new Error("DERP"), "Errors");
                testInput({
                    foo: "bar",
                    isNothing: true
                }, "Objects forcibly having a truthy isNothing property");
                t.end();
            });
        }
    }]
}, {
    name: "toString()",
    assertions: [{
        when: "given any Maybe(Something)",
        should: "return a String stating the Monad is a Maybe(Something)",
        test: function test(_test7) {
            return _test7(function (t) {
                var maybe = createSuccessfulMonad("foo");
                t.equal(toString(maybe).includes("Maybe"), true, "it states that given input is an Maybe");
                t.equal(toString(maybe).includes("Something"), true, "it states that given input is a Maybe(Something)");
                t.end();
            });
        }
    }, {
        when: "given any Maybe(Nothing)",
        should: "return a String stating the Monad is a Maybe(Nothing)",
        test: function test(_test8) {
            return _test8(function (t) {
                var maybe = createErroneousMonad("foo");
                t.equal(toString(maybe).includes("Maybe"), true, "it states that given input is a Maybe");
                t.equal(toString(maybe).includes("Nothing"), true, "it states that given input is a Maybe(Nothing)");
                t.end();
            });
        }
    }]
}]);
//# sourceMappingURL=maybe.spec.js.map