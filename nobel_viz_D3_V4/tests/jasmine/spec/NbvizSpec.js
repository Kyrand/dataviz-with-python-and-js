describe("Test Nbviz core functions", function() {
    var testData = [
        {name: 'Albert Einstein', country:'Switzerland', sex:'male', category:'Physics'}, 
        {name: 'Paul Dirac', country:'England', sex:'male', category:'Physics'}, 
        {name: 'Marie Curie', country:'Poland', sex:'female', category:'Chemistry'}
    ];
    var result;
        
    beforeEach(function() {
        // to run before each test... (also have afterEach())
        nbviz.makeFilterAndDimensions(testData);
    });
    
    it('should show correct color for category', function() {
        var col = nbviz.categoryFill('Chemistry');
        expect(col.toString()).toEqual('#ff7aad');
    });

    
    it('should filter correctly', function() {
        nbviz.filterByCountries(['Poland']);
        result = nbviz.countryDim.top(Infinity);
        
        expect(result.length).toEqual(1);
        expect(result[0].name).toEqual('Marie Curie');

        nbviz.filterByCountries([]);
        result = nbviz.countryDim.top(Infinity);
        
        expect(result.length).toEqual(3);
    });

    
    
});
