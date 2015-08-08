var path = require('path');
var coffeeCoverage = require('coffee-coverage');
var coverageVar = coffeeCoverage.findIstanbulVariable();
// Only write a coverage report if we're not running inside of Istanbul.
var writeOnExit = (coverageVar == null) ? path.resolve(__dirname, '/coverage/coverage-coffee.json') : null;

coffeeCoverage.register({
    instrumentor: 'istanbul',
    basePath: __dirname,
    exclude: ['/test', '/node_modules', '/.git', '/Gruntfile.coffee', '/cli.coffee', ['src', 'util', 'data'].join(path.sep)],
    coverageVar: coverageVar,
    writeOnExit: writeOnExit,
    initAll: true
});
