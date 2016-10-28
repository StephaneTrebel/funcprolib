import {
    executeTests,
    prepareForTests
    /*,
        utilityFunctions*/
} from "../tests/unit-tests.js";

const m = prepareForTests(__filename);

executeTests("Main export", [{
    name: "Main function",
    assertions: [{
        when: "...everytime",
        should: "be defined",
        test: (test) => test(function(t) {
            t.equal(
                m({}) !== undefined,
                true
            );
            t.end();
        })
    }]
}]);
