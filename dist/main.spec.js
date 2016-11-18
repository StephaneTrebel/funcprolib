"use strict";

var _unitTests = require("../tests/unit-tests.js");

var m = (0, _unitTests.prepareForTests)(__filename);

(0, _unitTests.executeTests)("Main export", [{
    name: "Main function",
    assertions: [{
        when: "...everytime",
        should: "be defined",
        test: function test(_test) {
            return _test(function (t) {
                t.equal(m({}) !== undefined, true);
                t.end();
            });
        }
    }]
}]);
//# sourceMappingURL=main.spec.js.map