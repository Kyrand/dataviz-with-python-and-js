var test = require('tape');

test('consts test', function(t) {
    var col = nbviz.categoryFill('Chemistry');
    
    t.plan(1)
    
    t.equal(col, {h:0, c:60, l:70});
});
