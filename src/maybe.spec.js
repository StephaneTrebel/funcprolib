import {
    executeTests,
    prepareForTests /*,
    utilityFunctions*/
} from "../tests/unit-tests.js";

const m = prepareForTests(__filename);

executeTests("Maybe implementation", [{
    name: "maybeFlow()",
    assertions: [{
        when: "called with no input",
        should: "return a function that returns an empty array",
        test: (test) => test(function(t) {
            const testedModule = m({});
            t.equal(
                testedModule.maybeFlow()().isMaybe,
                true
            );
            t.end();
        })
    }]
}]);
