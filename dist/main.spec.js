"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _unitTests = require("../tests/unit-tests.js");

var _main = require("./main");

(0, _unitTests.executeTests)("Main export", [{
    name: "createMonad - Creating a Monad",
    assertions: [{
        when: "called without any input",
        should: "return an erroneous Monad",
        test: function test(_test) {
            return _test(function (t) {
                var monad = (0, _main.createMonad)({
                    createErroneousMonad: function createErroneousMonad() {
                        return {
                            a: true
                        };
                    }
                })();
                t.equal(monad.isMonad, true);
                t.equal(monad.a, true);
                t.end();
            });
        }
    }, {
        when: "called with any falsy type",
        should: "return an erroneous Monad",
        test: function test(_test2) {
            return _test2(function (t) {
                t.plan(4);
                var c = (0, _main.createMonad)({
                    createErroneousMonad: function createErroneousMonad() {
                        return {
                            a: true
                        };
                    }
                });
                t.equal(c(null).isMonad, c(null).a);
                t.equal(c(undefined).isMonad, c(undefined).a);
                t.equal(c(NaN).isMonad, c(NaN).a);
                t.equal(c(new Error("DERP")).isMonad, c(new Error("DERP")).a);
                t.end();
            });
        }
    }, {
        when: "called with any non-null type",
        should: "return a non-erroneous Monad",
        test: function test(_test3) {
            return _test3(function (t) {
                t.plan(4);
                var c = (0, _main.createMonad)({
                    createSuccessfulMonad: function createSuccessfulMonad() {
                        return {
                            a: true
                        };
                    }
                });
                t.equal(c("foo").isMonad, c("foo").a);
                t.equal(c(123).isMonad, c(123).a);
                t.equal(c([]).isMonad, c([]).a);
                t.equal(c({}).isMonad, c({}).a);
                t.end();
            });
        }
    }, {
        when: "called with a Monad",
        should: "return the same Monad",
        test: function test(_test4) {
            return _test4(function (t) {
                var monad = {
                    isMonad: true
                };
                // Same reference check
                t.equal((0, _main.createMonad)()(monad), monad);
                t.end();
            });
        }
    }, {
        when: "called with a Function",
        should: "return a function that takes a regular value and returns a new Monad on which given function will have been applied",
        test: function test(_test5) {
            return _test5(function (t) {
                t.plan(1);
                var monadDefinition = {
                    createSuccessfulMonad: function createSuccessfulMonad() {
                        return {};
                    },
                    createErroneousMonad: function createErroneousMonad() {
                        return {};
                    },
                    getSuccessfulValue: function getSuccessfulValue() {
                        return "ok";
                    },
                    isInErrorState: function isInErrorState() {
                        return false;
                    }
                };
                (0, _main.createMonad)(monadDefinition)(t.pass)("foo");
                t.end();
            });
        }
    }]
}, {
    name: "createMonad - Using a created Monad",
    assertions: [{
        when: "...everytime",
        should: "have a toString method",
        test: function test(_test6) {
            return _test6(function (t) {
                t.equal(_typeof((0, _main.createMonad)({
                    createErroneousMonad: function createErroneousMonad() {
                        return {};
                    }
                })().toString), "function");
                t.end();
            });
        }
    }, {
        when: "an erroneous Monad has its map method called with any function",
        should: "return the same Monad without invoking the mapping function",
        test: function test(_test7) {
            return _test7(function (t) {
                var monad = (0, _main.createMonad)({
                    createErroneousMonad: function createErroneousMonad() {
                        return {};
                    },
                    isInErrorState: function isInErrorState() {
                        return true;
                    }
                })();
                t.equal(monad.map(t.fail), monad);
                t.end();
            });
        }
    }, {
        when: "a successful Monad has its map method called with any function that won't thow",
        should: "return a new successful Monad wrapping the application result of given function onto its internal value",
        test: function test(_test8) {
            return _test8(function (t) {
                var monad = (0, _main.createMonad)({
                    createSuccessfulMonad: function createSuccessfulMonad(x) {
                        return {
                            a: x
                        };
                    },
                    createErroneousMonad: t.fail,
                    getSuccessfulValue: function getSuccessfulValue(m) {
                        return m && m.a;
                    },
                    isInErrorState: function isInErrorState() {
                        return false;
                    }
                })("foo");
                var newMonad = monad.map(function (s) {
                    return s + "bar";
                });
                t.equal(newMonad.isMonad, true, "Result is a Monad");
                t.equal(newMonad === monad, false, "A different Monad instance");
                t.equal(newMonad.a, "foobar", "Its content is the function application");
                t.end();
            });
        }
    }, {
        when: "a successful Monad has its map method called with any throwing function",
        should: "return a new erroneous Monad",
        test: function test(_test9) {
            return _test9(function (t) {
                var err = new Error("DERP");
                var monad = (0, _main.createMonad)({
                    createSuccessfulMonad: function createSuccessfulMonad(x) {
                        return {
                            a: x
                        };
                    },
                    createErroneousMonad: function createErroneousMonad(x) {
                        return {
                            b: x
                        };
                    },
                    getSuccessfulValue: function getSuccessfulValue(m) {
                        return m && m.a;
                    },
                    isInErrorState: function isInErrorState(m) {
                        return !!m.b;
                    }
                })("foo");
                var newMonad = monad.map(function () {
                    throw err;
                });
                t.equal(newMonad.isMonad, true, "Result is a Monad");
                t.equal(newMonad === monad, false, "A different Monad instance");
                t.equal(!!newMonad.b, true, "Resulting Monad is an erroneous Monad");
                t.end();
            });
        }
    }, {
        when: "a successful Monad has its chain method called, regardless of given input",
        should: "return the Monad internal value",
        test: function test(_test10) {
            return _test10(function (t) {
                var monad = (0, _main.createMonad)({
                    createSuccessfulMonad: function createSuccessfulMonad(x) {
                        return {
                            a: x
                        };
                    },
                    getSuccessfulValue: function getSuccessfulValue(m) {
                        return m && m.a;
                    },
                    isInErrorState: function isInErrorState(m) {
                        return !m.a;
                    }
                })("foo");
                t.equal(monad.chain(t.fail), "foo");
                t.end();
            });
        }
    }, {
        when: "an erroneous Monad has its chain method called with a function",
        should: "return the application of given function on the Monad internal value",
        test: function test(_test11) {
            return _test11(function (t) {
                var err = new Error("DERP");
                var monad = (0, _main.createMonad)({
                    createErroneousMonad: function createErroneousMonad(x) {
                        return {
                            b: x
                        };
                    },
                    getErroneousValue: function getErroneousValue(m) {
                        return m && m.b;
                    },
                    isInErrorState: function isInErrorState(m) {
                        return !!m.b;
                    }
                })(err);
                t.equal(monad.chain(function (e) {
                    return e.message + "foo";
                }), "DERPfoo");
                t.end();
            });
        }
    }, {
        when: "an erroneous Monad has its chain method called with anything else than function",
        should: "return the given input",
        test: function test(_test12) {
            return _test12(function (t) {
                var err = new Error("DERP");
                var monad = (0, _main.createMonad)({
                    createErroneousMonad: function createErroneousMonad(x) {
                        return {
                            b: x
                        };
                    },
                    isInErrorState: function isInErrorState(m) {
                        return !!m.b;
                    }
                })(err);
                t.equal(monad.chain("foo"), "foo");
                t.end();
            });
        }
    }]
}, {
    name: "flow()",
    assertions: [{
        when: "called with no function list",
        should: "return a function that returns a Monad",
        test: function test(_test13) {
            return _test13(function (t) {
                t.equal((0, _main.flow)({
                    createErroneousMonad: function createErroneousMonad() {
                        return {};
                    }
                })()().isMonad, true);
                t.end();
            });
        }
    }, {
        when: "called with a function list",
        should: "return a function that will apply all functions of given list on a given Monad",
        test: function test(_test14) {
            return _test14(function (t) {
                t.equal((0, _main.flow)({
                    createSuccessfulMonad: function createSuccessfulMonad(x) {
                        return {
                            a: x
                        };
                    },
                    getSuccessfulValue: function getSuccessfulValue(m) {
                        return m && m.a;
                    },
                    isInErrorState: function isInErrorState(m) {
                        return !!m.b;
                    }
                })(function (a) {
                    return a + "bar";
                }, function (b) {
                    return b + "qux";
                })("foo").chain(), "foobarqux");
                t.end();
            });
        }
    }, {
        when: "called with a function list",
        should: "return a function that has a chain property which is a shortcut to the resulting Monad.chain method",
        test: function test(_test15) {
            return _test15(function (t) {
                var applier = (0, _main.flow)({
                    createSuccessfulMonad: function createSuccessfulMonad(x) {
                        return {
                            a: x
                        };
                    },
                    getSuccessfulValue: function getSuccessfulValue(m) {
                        return m && m.a;
                    },
                    isInErrorState: function isInErrorState(m) {
                        return !!m.b;
                    }
                })(function (a) {
                    return a + "bar";
                }, function (b) {
                    return b + "qux";
                }).chain();
                t.equal(applier("foo"), "foobarqux");
                t.end();
            });
        }
    }]
}, {
    name: "flow.debug()",
    assertions: [{
        when: "called with no function list",
        should: "return a function that returns a Monad",
        test: function test(_test16) {
            return _test16(function (t) {
                t.equal((0, _main.flow)({
                    createErroneousMonad: function createErroneousMonad() {
                        return {};
                    }
                })()().isMonad, true);
                t.end();
            });
        }
    }, {
        when: "called with a function list",
        should: "return a function that will apply all functions of given list on a given Monad",
        test: function test(_test17) {
            return _test17(function (t) {
                t.equal((0, _main.flow)({
                    createSuccessfulMonad: function createSuccessfulMonad(x) {
                        return {
                            a: x
                        };
                    },
                    getSuccessfulValue: function getSuccessfulValue(m) {
                        return m && m.a;
                    },
                    isInErrorState: function isInErrorState(m) {
                        return !!m.b;
                    }
                })(function (a) {
                    return a + "bar";
                }, function (b) {
                    return b + "qux";
                })("foo").chain(), "foobarqux");
                t.end();
            });
        }
    }, {
        when: "called with a function list",
        should: "return a function that will ignore all subsequent function calls upon encountering an erroneous Monad",
        test: function test(_test18) {
            return _test18(function (t) {
                t.equal(_main.flow.debug({
                    createSuccessfulMonad: function createSuccessfulMonad(x) {
                        return {
                            a: x
                        };
                    },
                    createErroneousMonad: function createErroneousMonad(x) {
                        return {
                            b: x
                        };
                    },
                    getSuccessfulValue: function getSuccessfulValue(m) {
                        return m && m.a;
                    },
                    getErroneousValue: function getErroneousValue(m) {
                        return m && m.b;
                    },
                    isInErrorState: function isInErrorState(m) {
                        return !!m.b;
                    }
                })(function (a) {
                    return a + "bar";
                }, _unitTests.utilityFunctions.throwFnHO("DERP"),
                // istanbul ignore next
                function (b) {
                    return b + "qux";
                })("foo").chain(_unitTests.utilityFunctions.idFn).message.includes("DERP"), true);
                t.end();
            });
        }
    }, {
        when: "called with a function list",
        should: "return a function that has an chain property which is a shortcut to the resulting Monad.chain method",
        test: function test(_test19) {
            return _test19(function (t) {
                var applier = _main.flow.debug({
                    createSuccessfulMonad: function createSuccessfulMonad(x) {
                        return {
                            a: x
                        };
                    },
                    getSuccessfulValue: function getSuccessfulValue(m) {
                        return m && m.a;
                    },
                    isInErrorState: function isInErrorState(m) {
                        return !!m.b;
                    }
                })(function (a) {
                    return a + "bar";
                }, function (b) {
                    return b + "qux";
                }).chain();
                t.equal(applier("foo"), "foobarqux");
                t.end();
            });
        }
    }]
}]);
//# sourceMappingURL=main.spec.js.map