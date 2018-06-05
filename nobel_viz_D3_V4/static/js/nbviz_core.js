/* global $, _, crossfilter, d3  */
(function(nbviz) {
    'use strict';
    
    nbviz.ALL_CATS = 'All Categories';
    nbviz.TRANS_DURATION = 2000;
    nbviz.MAX_CENTROID_RADIUS = 30;
    nbviz.MIN_CENTROID_RADIUS = 2;
    nbviz.COLORS = {palegold:'#E6BE8A'};
    
    nbviz.data = {};
    nbviz.valuePerCapita = 0;
    nbviz.activeCountry = null;
    nbviz.activeCategory = nbviz.ALL_CATS;
    
    nbviz.CATEGORIES = [
        "Chemistry", "Economics", "Literature", "Peace", "Physics", "Physiology or Medicine"
    ];
    
    
    nbviz.categoryFill = function(category){
        var i = nbviz.CATEGORIES.indexOf(category);
        return d3.hcl(i / nbviz.CATEGORIES.length * 360, 60, 70);
    };

        
    // $EVE_API (by default 'http://localhost:5000/api/') is set in
    // index.html (STATIC FILES) and templates/index.html (MONGODB EVE API);
    nbviz.getDataFromAPI = function(resource, callback){
        d3.json($EVE_API + resource, function(error, data) {
            
            if(error){
                return callback(error);
            }
            if('_items' in data){
                callback(null, data._items);
            }
            else{
                callback(null, data);
            }
            
        });
    };
    
    var nestDataByYear = function(entries) {
        return nbviz.data.years = d3.nest()
            .key(function(w) {
                return w.year;
            })
            .entries(entries);
    };

    nbviz.makeFilterAndDimensions = function(winnersData){
        // ADD OUR FILTER AND CREATE CATEGORY DIMENSIONS
        nbviz.filter = crossfilter(winnersData);
        nbviz.countryDim = nbviz.filter.dimension(function(o){
            return o.country;
        });

        nbviz.categoryDim = nbviz.filter.dimension(function(o) {
            return o.category;
        });

        nbviz.genderDim = nbviz.filter.dimension(function(o) {
            return o.gender;
        });
    };
    
    nbviz.filterByCountries = function(countryNames) {
        
        if(!countryNames.length){
            nbviz.countryDim.filter();
        }
        else{
            nbviz.countryDim.filter(function(name) {
                return countryNames.indexOf(name) > -1;
            });
        }
        
        if(countryNames.length === 1){
            nbviz.activeCountry = countryNames[0];
        }
        else{
            nbviz.activeCountry = null;
        }
    };

    nbviz.filterByCategory = function(cat) {
        nbviz.activeCategory = cat;
        
        if(cat === nbviz.ALL_CATS){
            nbviz.categoryDim.filter();
        }
        else{
            nbviz.categoryDim.filter(cat);
        }
    };

    nbviz.getCountryData = function() {
        var countryGroups = nbviz.countryDim.group().all();

        // make main data-ball
        var data = countryGroups.map( function(c) {
            var cData = nbviz.data.countryData[c.key];
            var value = c.value;
            // if per-capita value then divide by pop. size
            if(nbviz.valuePerCapita){
                value /= cData.population;
            }
            return {
                key: c.key,
                value: value,
                code: cData.alpha3Code,
                // population: cData.population
            };
        })
            .sort(function(a, b) {
                return b.value - a.value; // descending
            });

        return data;
    };

    nbviz.onDataChange = function() {
        var data = nbviz.getCountryData();
        nbviz.updateBarChart(data);
        nbviz.updateMap(data);
        nbviz.updateList(nbviz.countryDim.top(Infinity));
        data = nestDataByYear(nbviz.countryDim.top(Infinity));
        nbviz.updateTimeChart(data);
    };
    
}(window.nbviz = window.nbviz || {}));
