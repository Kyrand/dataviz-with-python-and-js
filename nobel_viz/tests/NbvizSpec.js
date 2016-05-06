describe("Test Nbviz core functions", function() {
    var testData = [
        {name: 'Albert Einstein', country:'Switzerland', sex:'male', category:'Physics'}, 
        {name: 'Paul Dirac', country:'England', sex:'male', category:'Physics'}, 
        {name: 'Marie Curie', country:'Poland', sex:'female', category:'Chemistry'}
    ];
    var result;
        
    // beforeEach(function() {
    //     // to run before each test... (also have afterEach())
    //     nbviz.makeFilterAndDimensions(testData);
    // });
    
    it('should produce correct color for category', function() {
        var col = nbviz.categoryFill('Chemistry');
        expect(col.toString()).toBe('#ff7aad');
    });

    
    it('should filter winners by countries', function() {
        nbviz.makeFilterAndDimensions(testData);
        nbviz.filterByCountries(['Poland']);
        result = nbviz.countryDim.top(Infinity);
         
        expect(result.length).toBe(1); 
        expect(result[0].name).toBe('Albert Einstein');

        nbviz.filterByCountries([]);
        result = nbviz.countryDim.top(Infinity);
        
        expect(result.length).toBe(3);
        expect(result[2]).toEqual(testData[1]);
    });
    
    
});
