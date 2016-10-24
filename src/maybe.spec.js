import path from "path";

import {
    executeTests,
    prepareForTests,
    utilityFunctions
} from path.resolve("tests/unit-tests.js");

const m = prepareForTests(__filename);

executeTests("Maybe implementation", [{
    name: "addMiddlewares()",
    assertions: [{
        when: "there is an error",
        should: "return a rejected Promise",
        test: (test) => test((t) =>
            m({
                middlewares: {
                    loadMiddlewares: utilityFunctions.rejectFn
                }
            })
            .addMiddlewares()
            .catch(() => t.pass(""))
        )
    }]
}]);
