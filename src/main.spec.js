import {
    executeTests,
    utilityFunctions
} from "../tests/unit-tests.js";

import {
    createMonad,
    flow
} from "./main";

executeTests("Main export", [{
    name: "createMonad - Creating a Monad",
    assertions: [{
        when: "called without any input",
        should: "return an erroneous Monad",
        test: (test) => test(function(t) {
            const monad = createMonad({
                createErroneousMonad: () => ({
                    a: true
                })
            })();
            t.equal(monad.isMonad, true);
            t.equal(monad.a, true);
            t.end();
        })
    }, {
        when: "called with any falsy type",
        should: "return an erroneous Monad",
        test: (test) => test(function(t) {
            t.plan(4);
            const c = createMonad({
                createErroneousMonad: () => ({
                    a: true
                })
            });
            t.equal(c(null).isMonad, c(null).a);
            t.equal(c(undefined).isMonad, c(undefined).a);
            t.equal(c(NaN).isMonad, c(NaN).a);
            t.equal(c(new Error("DERP")).isMonad, c(new Error("DERP")).a);
            t.end();
        })
    }, {
        when: "called with any non-null type",
        should: "return a non-erroneous Monad",
        test: (test) => test(function(t) {
            t.plan(4);
            const c = createMonad({
                createSuccessfulMonad: () => ({
                    a: true
                })
            });
            t.equal(c("foo").isMonad, c("foo").a);
            t.equal(c(123).isMonad, c(123).a);
            t.equal(c([]).isMonad, c([]).a);
            t.equal(c({}).isMonad, c({}).a);
            t.end();
        })
    }, {
        when: "called with a Monad",
        should: "return the same Monad",
        test: (test) => test(function(t) {
            const monad = {
                isMonad: true
            };
            // Same reference check
            t.equal(
                createMonad()(monad),
                monad
            );
            t.end();
        })
    }, {
        when: "called with a Function",
        should: "return a function that takes a regular value and returns a new Monad on which given function will have been applied",
        test: (test) => test(function(t) {
            t.plan(1);
            const monadDefinition = {
                createSuccessfulMonad: () => ({}),
                createErroneousMonad: () => ({}),
                getSuccessfulValue: () => "ok",
                isInErrorState: () => false
            };
            createMonad(monadDefinition)(t.pass)("foo");
            t.end();
        })
    }]
}, {
    name: "createMonad - Using a created Monad",
    assertions: [{
        when: "...everytime",
        should: "have a toString method",
        test: (test) => test(function(t) {
            t.equal(
                typeof createMonad({
                    createErroneousMonad: () => ({})
                })().toString,
                "function"
            );
            t.end();
        })
    }, {
        when: "an erroneous Monad has its map method called with any function",
        should: "return the same Monad without invoking the mapping function",
        test: (test) => test(function(t) {
            const monad = createMonad({
                createErroneousMonad: () => ({}),
                isInErrorState: () => true
            })();
            t.equal(
                monad.map(t.fail),
                monad
            );
            t.end();
        })
    }, {
        when: "a successful Monad has its map method called with any function that won't thow",
        should: "return a new successful Monad wrapping the application result of given function onto its internal value",
        test: (test) => test(function(t) {
            const monad = createMonad({
                createSuccessfulMonad: (x) => ({
                    a: x
                }),
                createErroneousMonad: t.fail,
                getSuccessfulValue: (m) => m && m.a,
                isInErrorState: () => false
            })("foo");
            const newMonad = monad.map((s) => s + "bar");
            t.equal(newMonad.isMonad, true, "Result is a Monad");
            t.equal(newMonad === monad, false, "A different Monad instance");
            t.equal(newMonad.a, "foobar", "Its content is the function application");
            t.end();
        })
    }, {
        when: "a successful Monad has its map method called with any throwing function",
        should: "return a new erroneous Monad",
        test: (test) => test(function(t) {
            const err = new Error("DERP");
            const monad = createMonad({
                createSuccessfulMonad: (x) => ({
                    a: x
                }),
                createErroneousMonad: (x) => ({
                    b: x
                }),
                getSuccessfulValue: (m) => m && m.a,
                isInErrorState: (m) => !!m.b
            })("foo");
            const newMonad = monad.map(function() {
                throw err;
            });
            t.equal(newMonad.isMonad, true, "Result is a Monad");
            t.equal(newMonad === monad, false, "A different Monad instance");
            t.equal(!!newMonad.b, true, "Resulting Monad is an erroneous Monad");
            t.end();
        })
    }, {
        when: "a successful Monad has its chain method called, regardless of given input",
        should: "return the Monad internal value",
        test: (test) => test(function(t) {
            const monad = createMonad({
                createSuccessfulMonad: (x) => ({
                    a: x
                }),
                getSuccessfulValue: (m) => m && m.a,
                isInErrorState: (m) => !m.a
            })("foo");
            t.equal(
                monad.chain(t.fail),
                "foo"
            );
            t.end();
        })
    }, {
        when: "an erroneous Monad has its chain method called with a function",
        should: "return the application of given function on the Monad internal value",
        test: (test) => test(function(t) {
            const err = new Error("DERP");
            const monad = createMonad({
                createErroneousMonad: (x) => ({
                    b: x
                }),
                getErroneousValue: (m) => m && m.b,
                isInErrorState: (m) => !!m.b
            })(err);
            t.equal(
                monad.chain((e) => e.message + "foo"),
                "DERPfoo"
            );
            t.end();
        })
    }, {
        when: "an erroneous Monad has its chain method called with anything else than function",
        should: "return the given input",
        test: (test) => test(function(t) {
            const err = new Error("DERP");
            const monad = createMonad({
                createErroneousMonad: (x) => ({
                    b: x
                }),
                isInErrorState: (m) => !!m.b
            })(err);
            t.equal(
                monad.chain("foo"),
                "foo"
            );
            t.end();
        })
    }]
}, {
    name: "flow()",
    assertions: [{
        when: "called with no function list",
        should: "return a function that returns a Monad",
        test: (test) => test(function(t) {
            t.equal(
                flow({
                    createErroneousMonad: () => ({})
                })()().isMonad,
                true
            );
            t.end();
        })
    }, {
        when: "called with a function list",
        should: "return a function that will apply all functions of given list on a given Monad",
        test: (test) => test(function(t) {
            t.equal(
                flow({
                    createSuccessfulMonad: (x) => ({
                        a: x
                    }),
                    getSuccessfulValue: (m) => m && m.a,
                    isInErrorState: (m) => !!m.b
                })(
                    (a) => a + "bar",
                    (b) => b + "qux"
                )("foo").chain(),
                "foobarqux"
            );
            t.end();
        })
    }, {
        when: "called with a function list",
        should: "return a function that has a chain property which is a shortcut to the resulting Monad.chain method",
        test: (test) => test(function(t) {
            const applier = flow({
                createSuccessfulMonad: (x) => ({
                    a: x
                }),
                getSuccessfulValue: (m) => m && m.a,
                isInErrorState: (m) => !!m.b
            })(
                (a) => a + "bar",
                (b) => b + "qux"
            ).chain();
            t.equal(
                applier("foo"),
                "foobarqux"
            );
            t.end();
        })
    }]
}, {
    name: "flow.debug()",
    assertions: [{
        when: "called with no function list",
        should: "return a function that returns a Monad",
        test: (test) => test(function(t) {
            t.equal(
                flow({
                    createErroneousMonad: () => ({})
                })()().isMonad,
                true
            );
            t.end();
        })
    }, {
        when: "called with a function list",
        should: "return a function that will apply all functions of given list on a given Monad",
        test: (test) => test(function(t) {
            t.equal(
                flow({
                    createSuccessfulMonad: (x) => ({
                        a: x
                    }),
                    getSuccessfulValue: (m) => m && m.a,
                    isInErrorState: (m) => !!m.b
                })(
                    (a) => a + "bar",
                    (b) => b + "qux"
                )("foo").chain(),
                "foobarqux"
            );
            t.end();
        })
    }, {
        when: "called with a function list",
        should: "return a function that will ignore all subsequent function calls upon encountering an erroneous Monad",
        test: (test) => test(function(t) {
            t.equal(
                flow.debug({
                    createSuccessfulMonad: (x) => ({
                        a: x
                    }),
                    createErroneousMonad: (x) => ({
                        b: x
                    }),
                    getSuccessfulValue: (m) => m && m.a,
                    getErroneousValue: (m) => m && m.b,
                    isInErrorState: (m) => !!m.b
                })(
                    (a) => a + "bar",
                    utilityFunctions.throwFnHO("DERP"),
                    // istanbul ignore next
                    (b) => b + "qux"
                )("foo").chain(utilityFunctions.idFn).message.includes("DERP"),
                true
            );
            t.end();
        })
    }, {
        when: "called with a function list",
        should: "return a function that has an chain property which is a shortcut to the resulting Monad.chain method",
        test: (test) => test(function(t) {
            const applier = flow.debug({
                createSuccessfulMonad: (x) => ({
                    a: x
                }),
                getSuccessfulValue: (m) => m && m.a,
                isInErrorState: (m) => !!m.b
            })(
                (a) => a + "bar",
                (b) => b + "qux"
            ).chain();
            t.equal(
                applier("foo"),
                "foobarqux"
            );
            t.end();
        })
    }]
}]);
