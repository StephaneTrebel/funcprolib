import {
    executeTests,
    prepareForTests,
    utilityFunctions
} from "../tests/unit-tests.js";

const m = prepareForTests(__filename);

executeTests("Either implementation", [{
    name: "createEither() - Creating a Either",
    assertions: [{
        when: "called without any input",
        should: "return a Either(Left())",
        test: (test) => test(function(t) {
            const testedModule = m({});
            t.equal(
                testedModule.createEither().isLeft(),
                true
            );
            t.end();
        })
    }, {
        when: "called with any null type",
        should: "return a Either(Left())",
        test: (test) => test(function(t) {
            const testedModule = m({});
            t.equal(testedModule.createEither(null).isLeft(), true, "Ok for null");
            t.equal(testedModule.createEither(undefined).isLeft(), true, "Ok for undefined");
            t.equal(testedModule.createEither(NaN).isLeft(), true, "Ok for NaN");
            t.end();
        })
    }, {
        when: "called with any non-null type",
        should: "return a Either(Left(), Right(Something))",
        test: (test) => test(function(t) {
            const testedModule = m({});
            t.equal(testedModule.createEither("foo").isLeft(), false, "Not a Left()");
            t.equal(testedModule.createEither("foo").right, "foo", "Right has correct value");
            t.equal(testedModule.createEither(123).isLeft(), false, "Not a Left()");
            t.equal(testedModule.createEither(123).right, 123, "Right has correct value");
            t.equal(testedModule.createEither([]).isLeft(), false, "Not a Left()");
            t.deepEqual(testedModule.createEither([]).right, [], "Right has correct value");
            t.equal(testedModule.createEither({}).isLeft(), false, "Not a Left()");
            t.deepEqual(testedModule.createEither({}).right, {}, "Right has correct value");
            t.end();
        })
    }, {
        when: "called with an Error",
        should: "return a Either(Left(given error), Right())",
        test: (test) => test(function(t) {
            const testedModule = m({});
            const err = new Error("DERP");
            const newEither = testedModule.createEither(err);
            t.equal(newEither.isLeft(), true);
            t.equal(newEither.left, err.stack);
            t.end();
        })
    }, {
        when: "called with a Either",
        should: "return the same Either",
        test: (test) => test(function(t) {
            const testedModule = m({});
            const either = testedModule.createEither();
            t.equal(
                testedModule.createEither(either),
                either
            );
            t.end();
        })
    }, {
        when: "called with a Function",
        should: "return a Either wrapping the given function application on 'undefined'",
        test: (test) => test(function(t) {
            const testedModule = m({});
            const either = testedModule.createEither(() => "foo");
            t.equal(either.isEither, true);
            t.equal(either.isLeft(), false);
            t.equal(either.right, "foo");
            t.end();
        })
    }]
}, {
    name: "createEither() - Using a Either",
    assertions: [{
        when: "a Either has its toString method called",
        should: "return a string",
        test: (test) => test(function(t) {
            const testedModule = m({});
            t.equal(typeof testedModule.createEither("foo").toString(), "string");
            t.equal(typeof testedModule.createEither().toString(), "string");
            t.end();
        })
    }, {
        when: "a Either(Left(Something)) has its map method called with any function",
        should: "return the same Either(Left(Something))) without invoking the mapping function",
        test: (test) => test(function(t) {
            const testedModule = m({});
            const either = testedModule.createEither();
            t.equal(
                either.map(utilityFunctions.throwFnHO("I shan't be thrown !")),
                either
            );
            t.end();
        })
    }, {
        when: "a Either(Right(Something)) has its map method called with any succeeding function",
        should: "return a new Either(Right(Something)) wrapping the application result of given function onto its Something",
        test: (test) => test(function(t) {
            const testedModule = m({});
            const either = testedModule.createEither("foo");
            const newEither = either.map((s) => s + "bar");
            t.equal(newEither.isEither, true, "Applying map() results in a Either");
            t.equal(newEither === either, false, "A different Either instance");
            t.equal(newEither.right, "foobar", "Its content is the function application");
            t.end();
        })
    }, {
        when: "a Either(Right(Something)) has its map method called with any failing function",
        should: "return a new Either(Left(failing error))",
        test: (test) => test(function(t) {
            const testedModule = m({});
            const err = new Error("DERP");
            const either = testedModule.createEither("foo");
            const newEither = either.map(function() {
                throw err;
            });
            t.equal(newEither.isEither, true, "Applying map() results in a Either");
            t.equal(newEither === either, false, "A different Either instance");
            t.equal(newEither.isLeft(), true, "Resulting Either is a Either(Left())");
            t.equal(newEither.left, err.stack, "Left content is the thrown error stack");
            t.end();
        })
    }, {
        when: "a Either(Right()) has its ifLeft method called, regardless of given input",
        should: "return the value wrapped in its Right()",
        test: (test) => test(function(t) {
            const testedModule = m({});
            const either = testedModule.createEither("foo");
            t.equal(
                either.ifLeft(utilityFunctions.throwFnHO("I shan't be thrown !")),
                "foo"
            );
            t.end();
        })
    }, {
        when: "a Either(Left()) has its ifLeft method called with a function",
        should: "return the application of given function on the Left() value",
        test: (test) => test(function(t) {
            const testedModule = m({});
            const either = testedModule.createEither();
            t.equal(
                either.ifLeft(utilityFunctions.idFn).includes("Either is a Left()"),
                true
            );
            t.end();
        })
    }, {
        when: "a Either(Left()) has its ifLeft method called with anything else than function",
        should: "return the given input",
        test: (test) => test(function(t) {
            const testedModule = m({});
            const either = testedModule.createEither();
            t.equal(
                either.ifLeft("foo"),
                "foo"
            );
            t.end();
        })
    }]
}, {
    name: "eitherFlow()",
    assertions: [{
        when: "called with no function list",
        should: "return a function that returns a Either",
        test: (test) => test(function(t) {
            const testedModule = m({});
            t.equal(
                testedModule.eitherFlow()().isEither,
                true
            );
            t.end();
        })
    }, {
        when: "called with a function list",
        should: "return a function that will apply all functions of given list on a given Either()",
        test: (test) => test(function(t) {
            const testedModule = m({});
            t.equal(
                testedModule.eitherFlow(
                    (a) => a + "bar",
                    (b) => b + "qux"
                )("foo").ifLeft(),
                "foobarqux"
            );
            t.end();
        })
    }, {
        when: "called with a function list",
        should: "return a function that has an ifLeft property which is a shortcut to the resulting Either().ifLeft method",
        test: (test) => test(function(t) {
            const testedModule = m({});
            const applier = testedModule.eitherFlow(
                (a) => a + "bar",
                (b) => b + "qux"
            ).ifLeft();
            t.equal(
                applier("foo"),
                "foobarqux"
            );
            t.end();
        })
    }]
}, {
    name: "eitherFlow.debug()",
    assertions: [{
        when: "called with no function list",
        should: "return a function that returns a Either",
        test: (test) => test(function(t) {
            const testedModule = m({});
            t.equal(
                testedModule.eitherFlow.debug()().isEither,
                true
            );
            t.end();
        })
    }, {
        when: "called with a function list",
        should: "return a function that will apply all functions of given list on a given Either()",
        test: (test) => test(function(t) {
            const testedModule = m({});
            t.equal(
                testedModule.eitherFlow.debug(
                    (a) => a + "bar",
                    (b) => b + "qux"
                )("foo").ifLeft(),
                "foobarqux"
            );
            t.end();
        })
    }, {
        when: "called with a function list",
        should: "return a function that will ignore all subsequent function call upon encountering an Either(Left())",
        test: (test) => test(function(t) {
            const testedModule = m({});
            t.equal(
                testedModule.eitherFlow.debug(
                    (a) => a + "bar",
                    utilityFunctions.throwFnHO("DERP"),
                    // istanbul ignore next
                    (b) => b + "qux"
                    )("foo").ifLeft(utilityFunctions.idFn).includes("DERP"),
                true
            );
            t.end();
        })
    }, {
        when: "called with a function list",
        should: "return a function that has an ifLeft property which is a shortcut to the resulting Either().ifLeft method",
        test: (test) => test(function(t) {
            const testedModule = m({});
            const applier = testedModule.eitherFlow.debug(
                (a) => a + "bar",
                (b) => b + "qux"
            ).ifLeft();
            t.equal(
                applier("foo"),
                "foobarqux"
            );
            t.end();
        })
    }]
}]);
