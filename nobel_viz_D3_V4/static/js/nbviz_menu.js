/* global $, _, crossfilter, d3  */
(function(nbviz) {
    'use strict';

    // Category selector
    
    var catList = [nbviz.ALL_CATS].concat(nbviz.CATEGORIES);
    
    var catSelect = d3.select('#cat-select select');
    
     catSelect.selectAll('option')
        .data(catList).enter()
        .append('option')
        .attr('value', function(d) { return d; })
        .html(function(d) { return d; });
    
    catSelect.on('change', function(d) {
            var category = d3.select(this).property('value');
            nbviz.filterByCategory(category);
            nbviz.onDataChange();
        });
    
    d3.select('#gender-select select')
        .on('change', function(d) {
            var gender = d3.select(this).property('value');
            if(gender === 'All'){
                // Reset the filter to all genders
                nbviz.genderDim.filter();
            }
            else{
                nbviz.genderDim.filter(gender);
            }
            nbviz.onDataChange();
        });
    
    // Country selector
    
    nbviz.initMenu = function() {
        var ALL_WINNERS = 'All Countries';
        var SINGLE_WINNERS = 'Single Winning Countries';
        var DOUBLE_WINNERS = 'Double Winning Countries';
        
        var nats = nbviz.countrySelectGroups = nbviz.countryDim.group().all()
            .sort(function(a, b) {
                return b.value - a.value; // descending
            });
        
        var fewWinners = {1:[], 2:[]};
        var selectData = [ALL_WINNERS];

        nats.forEach(function(o) {
            if(o.value > 2){
                selectData.push(o.key);
            }
            else{
                fewWinners[o.value].push(o.key);
            }
        });

        selectData.push(
            DOUBLE_WINNERS,
            SINGLE_WINNERS
        );

        var countrySelect = d3.select('#country-select select');
        
        countrySelect.selectAll('option')
            .data(selectData).enter()
            .append('option')
            .attr('value', function(d) { return d; })
            .html(function(d){ return d; });
        
         countrySelect.on('change', function(d) {
                var countries;
                var country = d3.select(this).property('value');
             
                if(country === ALL_WINNERS){
                    countries = [];
                }
                else if(country === DOUBLE_WINNERS){
                    countries = fewWinners[2];
                }
                else if(country === SINGLE_WINNERS){
                    countries = fewWinners[1];
                }
                else{
                    countries = [country];
                }
                nbviz.filterByCountries(countries);
                nbviz.onDataChange();
            });
        
        
        d3.selectAll('#metric-radio input').on('change', function() {
                var val = d3.select(this).property('value');
                nbviz.valuePerCapita = parseInt(val);
                nbviz.onDataChange();
            });
        
        
    };
    
}(window.nbviz = window.nbviz || {}));
