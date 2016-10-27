import {
    executeTests,
    prepareForTests,
    utilityFunctions
} from "../tests/unit-tests.js";

const m = prepareForTests(__filename);

executeTests("Maybe implementation", [{
    name: "createMaybe() - Creating a Maybe",
    assertions: [{
        when: "called without any input",
        should: "return a Maybe(Nothing)",
        test: (test) => test(function(t) {
            const testedModule = m({});
            t.equal(
                testedModule.createMaybe().isNothing(),
                true
            );
            t.end();
        })
    }, {
        when: "called with any null type",
        should: "return a Maybe(Nothing)",
        test: (test) => test(function(t) {
            const testedModule = m({});
            t.equal(testedModule.createMaybe(null).isNothing(), true, "Ok for null");
            t.equal(testedModule.createMaybe(undefined).isNothing(), true, "Ok for undefined");
            t.equal(testedModule.createMaybe(NaN).isNothing(), true, "Ok for NaN");
            t.end();
        })
    }, {
        when: "called with any non-null type",
        should: "return a Maybe(Something)",
        test: (test) => test(function(t) {
            const testedModule = m({});
            t.equal(testedModule.createMaybe("foo").isNothing(), false, "Ok for strings");
            t.equal(testedModule.createMaybe(123).isNothing(), false, "Ok for numbers");
            t.equal(testedModule.createMaybe([]).isNothing(), false, "Ok for arrays");
            t.equal(testedModule.createMaybe({}).isNothing(), false, "Ok for objects");
            t.end();
        })
    }, {
        when: "called with an Error",
        should: "return a Maybe(Nothing)",
        test: (test) => test(function(t) {
            const testedModule = m({});
            t.equal(
                testedModule.createMaybe(new Error("DERP")).isNothing(),
                true
            );
            t.end();
        })
    }, {
        when: "called with a Maybe",
        should: "return the same Maybe",
        test: (test) => test(function(t) {
            const testedModule = m({});
            const something = testedModule.createMaybe();
            t.equal(
                testedModule.createMaybe(something),
                something
            );
            t.end();
        })
    }, {
        when: "called with a Function",
        should: "return a Maybe wrapping the given function application on 'undefined'",
        test: (test) => test(function(t) {
            const testedModule = m({});
            const something = testedModule.createMaybe(() => "foo");
            t.equal(something.isMaybe, true);
            t.equal(something.isNothing(), false);
            t.equal(something.value, "foo");
            t.end();
        })
    }]
}, {
    name: "createMaybe() - Using a Maybe",
    assertions: [{
        when: "a Maybe has its toString method called",
        should: "return a string",
        test: (test) => test(function(t) {
            const testedModule = m({});
            t.equal(typeof testedModule.createMaybe("foo").toString(), "string");
            t.equal(typeof testedModule.createMaybe().toString(), "string");
            t.end();
        })
    }, {
        when: "a Maybe(Nothing) has its map method called with any function",
        should: "return the same Maybe(Nothing) without invoking the mapping function",
        test: (test) => test(function(t) {
            const testedModule = m({});
            const nothing = testedModule.createMaybe();
            t.equal(
                nothing.map(utilityFunctions.throwFnHO("I shan't be thrown !")),
                nothing
            );
            t.end();
        })
    }, {
        when: "a Maybe(Something) has its map method called with any succeeding function",
        should: "return a new Maybe wrapping the application result of given function onto its Something",
        test: (test) => test(function(t) {
            const testedModule = m({});
            const something = testedModule.createMaybe("foo");
            const newSomething = something.map((s) => s + "bar");
            t.equal(newSomething.isMaybe, true, "Applying map() results in a Maybe");
            t.equal(newSomething === something, false, "A different Maybe instance");
            t.equal(newSomething.value, "foobar", "Its content is the function application");
            t.end();
        })
    }, {
        when: "a Maybe(Something) has its map method called with any failing function",
        should: "return a new Maybe(Nothing)",
        test: (test) => test(function(t) {
            const testedModule = m({});
            const something = testedModule.createMaybe("foo");
            const newNothing = something.map(utilityFunctions.throwFnHO("DERP"));
            t.equal(newNothing.isMaybe, true, "Applying map() results in a Maybe");
            t.equal(newNothing === something, false, "A different Maybe instance");
            t.equal(newNothing.isNothing(), true, "Resulting Maybe is a Maybe(Nothing)");
            t.end();
        })
    }, {
        when: "a Maybe(Something) has its orElse method called, regardless of given input",
        should: "return the wrapped Something",
        test: (test) => test(function(t) {
            const testedModule = m({});
            const something = testedModule.createMaybe("foo");
            t.equal(
                something.orElse(utilityFunctions.throwFnHO("I shan't be thrown !")),
                "foo"
            );
            t.end();
        })
    }, {
        when: "a Maybe(Nothing) has its orElse method called with a function",
        should: "return the result of given function called without any parameter",
        test: (test) => test(function(t) {
            const testedModule = m({});
            const nothing = testedModule.createMaybe();
            t.equal(
                nothing.orElse(() => "foo"),
                "foo"
            );
            t.end();
        })
    }, {
        when: "a Maybe(Nothing) has its orElse method called with anything else than function",
        should: "return the given input",
        test: (test) => test(function(t) {
            const testedModule = m({});
            const nothing = testedModule.createMaybe();
            t.equal(
                nothing.orElse("foo"),
                "foo"
            );
            t.end();
        })
    }]
}, {
    name: "maybeFlow()",
    assertions: [{
        when: "called with no function list",
        should: "return a function that returns a Maybe",
        test: (test) => test(function(t) {
            const testedModule = m({});
            t.equal(
                testedModule.maybeFlow()().isMaybe,
                true
            );
            t.end();
        })
    }, {
        when: "called with a function list",
        should: "return a function that will apply all functions of given list on a given Maybe(Something)",
        test: (test) => test(function(t) {
            const testedModule = m({});
            t.equal(
                testedModule.maybeFlow(
                    (a) => a + "bar",
                    (b) => b + "qux"
                )("foo").orElse(),
                "foobarqux"
            );
            t.end();
        })
    }, {
        when: "called with a function list",
        should: "return a function that has an orElse property which is a shortcut to the resulting Maybe.orElse method",
        test: (test) => test(function(t) {
            const testedModule = m({});
            const applier = testedModule.maybeFlow(
                    (a) => a + "bar",
                    (b) => b + "qux"
                ).orElse();
            t.equal(
                applier("foo"),
                "foobarqux"
            );
            t.end();
        })
    }]
}]);
