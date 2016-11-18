"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _unitTests = require("../tests/unit-tests.js");

var m = (0, _unitTests.prepareForTests)(__filename);

(0, _unitTests.executeTests)("Either implementation", [{
    name: "createEither() - Creating a Either",
    assertions: [{
        when: "called without any input",
        should: "return a Either(Left())",
        test: function test(_test) {
            return _test(function (t) {
                var testedModule = m({});
                t.equal(testedModule.createEither().isLeft(), true);
                t.end();
            });
        }
    }, {
        when: "called with any null type",
        should: "return a Either(Left())",
        test: function test(_test2) {
            return _test2(function (t) {
                var testedModule = m({});
                t.equal(testedModule.createEither(null).isLeft(), true, "Ok for null");
                t.equal(testedModule.createEither(undefined).isLeft(), true, "Ok for undefined");
                t.equal(testedModule.createEither(NaN).isLeft(), true, "Ok for NaN");
                t.end();
            });
        }
    }, {
        when: "called with any non-null type",
        should: "return a Either(Left(), Right(Something))",
        test: function test(_test3) {
            return _test3(function (t) {
                var testedModule = m({});
                t.equal(testedModule.createEither("foo").isLeft(), false, "Not a Left()");
                t.equal(testedModule.createEither("foo").right, "foo", "Right has correct value");
                t.equal(testedModule.createEither(123).isLeft(), false, "Not a Left()");
                t.equal(testedModule.createEither(123).right, 123, "Right has correct value");
                t.equal(testedModule.createEither([]).isLeft(), false, "Not a Left()");
                t.deepEqual(testedModule.createEither([]).right, [], "Right has correct value");
                t.equal(testedModule.createEither({}).isLeft(), false, "Not a Left()");
                t.deepEqual(testedModule.createEither({}).right, {}, "Right has correct value");
                t.end();
            });
        }
    }, {
        when: "called with an Error",
        should: "return a Either(Left(given error), Right())",
        test: function test(_test4) {
            return _test4(function (t) {
                var testedModule = m({});
                var err = new Error("DERP");
                var newEither = testedModule.createEither(err);
                t.equal(newEither.isLeft(), true);
                t.equal(newEither.left, err.stack);
                t.end();
            });
        }
    }, {
        when: "called with a Either",
        should: "return the same Either",
        test: function test(_test5) {
            return _test5(function (t) {
                var testedModule = m({});
                var either = testedModule.createEither();
                t.equal(testedModule.createEither(either), either);
                t.end();
            });
        }
    }, {
        when: "called with a Function",
        should: "return a Either wrapping the given function application on 'undefined'",
        test: function test(_test6) {
            return _test6(function (t) {
                var testedModule = m({});
                var either = testedModule.createEither(function () {
                    return "foo";
                });
                t.equal(either.isEither, true);
                t.equal(either.isLeft(), false);
                t.equal(either.right, "foo");
                t.end();
            });
        }
    }]
}, {
    name: "createEither() - Using a Either",
    assertions: [{
        when: "a Either has its toString method called",
        should: "return a string",
        test: function test(_test7) {
            return _test7(function (t) {
                var testedModule = m({});
                t.equal(_typeof(testedModule.createEither("foo").toString()), "string");
                t.equal(_typeof(testedModule.createEither().toString()), "string");
                t.end();
            });
        }
    }, {
        when: "a Either(Left(Something)) has its map method called with any function",
        should: "return the same Either(Left(Something))) without invoking the mapping function",
        test: function test(_test8) {
            return _test8(function (t) {
                var testedModule = m({});
                var either = testedModule.createEither();
                t.equal(either.map(_unitTests.utilityFunctions.throwFnHO("I shan't be thrown !")), either);
                t.end();
            });
        }
    }, {
        when: "a Either(Right(Something)) has its map method called with any succeeding function",
        should: "return a new Either(Right(Something)) wrapping the application result of given function onto its Something",
        test: function test(_test9) {
            return _test9(function (t) {
                var testedModule = m({});
                var either = testedModule.createEither("foo");
                var newEither = either.map(function (s) {
                    return s + "bar";
                });
                t.equal(newEither.isEither, true, "Applying map() results in a Either");
                t.equal(newEither === either, false, "A different Either instance");
                t.equal(newEither.right, "foobar", "Its content is the function application");
                t.end();
            });
        }
    }, {
        when: "a Either(Right(Something)) has its map method called with any failing function",
        should: "return a new Either(Left(failing error))",
        test: function test(_test10) {
            return _test10(function (t) {
                var testedModule = m({});
                var err = new Error("DERP");
                var either = testedModule.createEither("foo");
                var newEither = either.map(function () {
                    throw err;
                });
                t.equal(newEither.isEither, true, "Applying map() results in a Either");
                t.equal(newEither === either, false, "A different Either instance");
                t.equal(newEither.isLeft(), true, "Resulting Either is a Either(Left())");
                t.equal(newEither.left, err.stack, "Left content is the thrown error stack");
                t.end();
            });
        }
    }, {
        when: "a Either(Right()) has its ifLeft method called, regardless of given input",
        should: "return the value wrapped in its Right()",
        test: function test(_test11) {
            return _test11(function (t) {
                var testedModule = m({});
                var either = testedModule.createEither("foo");
                t.equal(either.ifLeft(_unitTests.utilityFunctions.throwFnHO("I shan't be thrown !")), "foo");
                t.end();
            });
        }
    }, {
        when: "a Either(Left()) has its ifLeft method called with a function",
        should: "return the application of given function on the Left() value",
        test: function test(_test12) {
            return _test12(function (t) {
                var testedModule = m({});
                var either = testedModule.createEither();
                t.equal(either.ifLeft(_unitTests.utilityFunctions.idFn).includes("Either is a Left()"), true);
                t.end();
            });
        }
    }, {
        when: "a Either(Left()) has its ifLeft method called with anything else than function",
        should: "return the given input",
        test: function test(_test13) {
            return _test13(function (t) {
                var testedModule = m({});
                var either = testedModule.createEither();
                t.equal(either.ifLeft("foo"), "foo");
                t.end();
            });
        }
    }]
}, {
    name: "eitherFlow()",
    assertions: [{
        when: "called with no function list",
        should: "return a function that returns a Either",
        test: function test(_test14) {
            return _test14(function (t) {
                var testedModule = m({});
                t.equal(testedModule.eitherFlow()().isEither, true);
                t.end();
            });
        }
    }, {
        when: "called with a function list",
        should: "return a function that will apply all functions of given list on a given Either()",
        test: function test(_test15) {
            return _test15(function (t) {
                var testedModule = m({});
                t.equal(testedModule.eitherFlow(function (a) {
                    return a + "bar";
                }, function (b) {
                    return b + "qux";
                })("foo").ifLeft(), "foobarqux");
                t.end();
            });
        }
    }, {
        when: "called with a function list",
        should: "return a function that has an ifLeft property which is a shortcut to the resulting Either().ifLeft method",
        test: function test(_test16) {
            return _test16(function (t) {
                var testedModule = m({});
                var applier = testedModule.eitherFlow(function (a) {
                    return a + "bar";
                }, function (b) {
                    return b + "qux";
                }).ifLeft();
                t.equal(applier("foo"), "foobarqux");
                t.end();
            });
        }
    }]
}, {
    name: "eitherFlow.debug()",
    assertions: [{
        when: "called with no function list",
        should: "return a function that returns a Either",
        test: function test(_test17) {
            return _test17(function (t) {
                var testedModule = m({});
                t.equal(testedModule.eitherFlow.debug()().isEither, true);
                t.end();
            });
        }
    }, {
        when: "called with a function list",
        should: "return a function that will apply all functions of given list on a given Either()",
        test: function test(_test18) {
            return _test18(function (t) {
                var testedModule = m({});
                t.equal(testedModule.eitherFlow.debug(function (a) {
                    return a + "bar";
                }, function (b) {
                    return b + "qux";
                })("foo").ifLeft(), "foobarqux");
                t.end();
            });
        }
    }, {
        when: "called with a function list",
        should: "return a function that will ignore all subsequent function call upon encountering an Either(Left())",
        test: function test(_test19) {
            return _test19(function (t) {
                var testedModule = m({});
                t.equal(testedModule.eitherFlow.debug(function (a) {
                    return a + "bar";
                }, _unitTests.utilityFunctions.throwFnHO("DERP"),
                // istanbul ignore next
                function (b) {
                    return b + "qux";
                })("foo").ifLeft(_unitTests.utilityFunctions.idFn).includes("DERP"), true);
                t.end();
            });
        }
    }, {
        when: "called with a function list",
        should: "return a function that has an ifLeft property which is a shortcut to the resulting Either().ifLeft method",
        test: function test(_test20) {
            return _test20(function (t) {
                var testedModule = m({});
                var applier = testedModule.eitherFlow.debug(function (a) {
                    return a + "bar";
                }, function (b) {
                    return b + "qux";
                }).ifLeft();
                t.equal(applier("foo"), "foobarqux");
                t.end();
            });
        }
    }]
}]);
//# sourceMappingURL=either.spec.js.map