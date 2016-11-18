"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _unitTests = require("../tests/unit-tests.js");

var m = (0, _unitTests.prepareForTests)(__filename);

(0, _unitTests.executeTests)("Maybe implementation", [{
    name: "createMaybe() - Creating a Maybe",
    assertions: [{
        when: "called without any input",
        should: "return a Maybe(Nothing)",
        test: function test(_test) {
            return _test(function (t) {
                var testedModule = m({});
                t.equal(testedModule.createMaybe().isNothing(), true);
                t.end();
            });
        }
    }, {
        when: "called with any null type",
        should: "return a Maybe(Nothing)",
        test: function test(_test2) {
            return _test2(function (t) {
                var testedModule = m({});
                t.equal(testedModule.createMaybe(null).isNothing(), true, "Ok for null");
                t.equal(testedModule.createMaybe(undefined).isNothing(), true, "Ok for undefined");
                t.equal(testedModule.createMaybe(NaN).isNothing(), true, "Ok for NaN");
                t.end();
            });
        }
    }, {
        when: "called with any non-null type",
        should: "return a Maybe(Something)",
        test: function test(_test3) {
            return _test3(function (t) {
                var testedModule = m({});
                t.equal(testedModule.createMaybe("foo").isNothing(), false, "Ok for strings");
                t.equal(testedModule.createMaybe(123).isNothing(), false, "Ok for numbers");
                t.equal(testedModule.createMaybe([]).isNothing(), false, "Ok for arrays");
                t.equal(testedModule.createMaybe({}).isNothing(), false, "Ok for objects");
                t.end();
            });
        }
    }, {
        when: "called with an Error",
        should: "return a Maybe(Nothing)",
        test: function test(_test4) {
            return _test4(function (t) {
                var testedModule = m({});
                t.equal(testedModule.createMaybe(new Error("DERP")).isNothing(), true);
                t.end();
            });
        }
    }, {
        when: "called with a Maybe",
        should: "return the same Maybe",
        test: function test(_test5) {
            return _test5(function (t) {
                var testedModule = m({});
                var something = testedModule.createMaybe();
                t.equal(testedModule.createMaybe(something), something);
                t.end();
            });
        }
    }, {
        when: "called with a Function",
        should: "return a Maybe wrapping the given function application on 'undefined'",
        test: function test(_test6) {
            return _test6(function (t) {
                var testedModule = m({});
                var something = testedModule.createMaybe(function () {
                    return "foo";
                });
                t.equal(something.isMaybe, true);
                t.equal(something.isNothing(), false);
                t.equal(something.value, "foo");
                t.end();
            });
        }
    }]
}, {
    name: "createMaybe() - Using a Maybe",
    assertions: [{
        when: "a Maybe has its toString method called",
        should: "return a string",
        test: function test(_test7) {
            return _test7(function (t) {
                var testedModule = m({});
                t.equal(_typeof(testedModule.createMaybe("foo").toString()), "string");
                t.equal(_typeof(testedModule.createMaybe().toString()), "string");
                t.end();
            });
        }
    }, {
        when: "a Maybe(Nothing) has its map method called with any function",
        should: "return the same Maybe(Nothing) without invoking the mapping function",
        test: function test(_test8) {
            return _test8(function (t) {
                var testedModule = m({});
                var nothing = testedModule.createMaybe();
                t.equal(nothing.map(_unitTests.utilityFunctions.throwFnHO("I shan't be thrown !")), nothing);
                t.end();
            });
        }
    }, {
        when: "a Maybe(Something) has its map method called with any succeeding function",
        should: "return a new Maybe wrapping the application result of given function onto its Something",
        test: function test(_test9) {
            return _test9(function (t) {
                var testedModule = m({});
                var something = testedModule.createMaybe("foo");
                var newSomething = something.map(function (s) {
                    return s + "bar";
                });
                t.equal(newSomething.isMaybe, true, "Applying map() results in a Maybe");
                t.equal(newSomething === something, false, "A different Maybe instance");
                t.equal(newSomething.value, "foobar", "Its content is the function application");
                t.end();
            });
        }
    }, {
        when: "a Maybe(Something) has its map method called with any failing function",
        should: "return a new Maybe(Nothing)",
        test: function test(_test10) {
            return _test10(function (t) {
                var testedModule = m({});
                var something = testedModule.createMaybe("foo");
                var newNothing = something.map(_unitTests.utilityFunctions.throwFnHO("DERP"));
                t.equal(newNothing.isMaybe, true, "Applying map() results in a Maybe");
                t.equal(newNothing === something, false, "A different Maybe instance");
                t.equal(newNothing.isNothing(), true, "Resulting Maybe is a Maybe(Nothing)");
                t.end();
            });
        }
    }, {
        when: "a Maybe(Something) has its orElse method called, regardless of given input",
        should: "return the wrapped Something",
        test: function test(_test11) {
            return _test11(function (t) {
                var testedModule = m({});
                var something = testedModule.createMaybe("foo");
                t.equal(something.orElse(_unitTests.utilityFunctions.throwFnHO("I shan't be thrown !")), "foo");
                t.end();
            });
        }
    }, {
        when: "a Maybe(Nothing) has its orElse method called with a function",
        should: "return the result of given function called without any parameter",
        test: function test(_test12) {
            return _test12(function (t) {
                var testedModule = m({});
                var nothing = testedModule.createMaybe();
                t.equal(nothing.orElse(function () {
                    return "foo";
                }), "foo");
                t.end();
            });
        }
    }, {
        when: "a Maybe(Nothing) has its orElse method called with anything else than function",
        should: "return the given input",
        test: function test(_test13) {
            return _test13(function (t) {
                var testedModule = m({});
                var nothing = testedModule.createMaybe();
                t.equal(nothing.orElse("foo"), "foo");
                t.end();
            });
        }
    }]
}, {
    name: "maybeFlow()",
    assertions: [{
        when: "called with no function list",
        should: "return a function that returns a Maybe",
        test: function test(_test14) {
            return _test14(function (t) {
                var testedModule = m({});
                t.equal(testedModule.maybeFlow()().isMaybe, true);
                t.end();
            });
        }
    }, {
        when: "called with a function list",
        should: "return a function that will apply all functions of given list on a given Maybe(Something)",
        test: function test(_test15) {
            return _test15(function (t) {
                var testedModule = m({});
                t.equal(testedModule.maybeFlow(function (a) {
                    return a + "bar";
                }, function (b) {
                    return b + "qux";
                })("foo").orElse(), "foobarqux");
                t.end();
            });
        }
    }, {
        when: "called with a function list",
        should: "return a function that has an orElse property which is a shortcut to the resulting Maybe.orElse method",
        test: function test(_test16) {
            return _test16(function (t) {
                var testedModule = m({});
                var applier = testedModule.maybeFlow(function (a) {
                    return a + "bar";
                }, function (b) {
                    return b + "qux";
                }).orElse();
                t.equal(applier("foo"), "foobarqux");
                t.end();
            });
        }
    }]
}]);
//# sourceMappingURL=maybe.spec.js.map