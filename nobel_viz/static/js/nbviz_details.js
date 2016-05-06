/* global $, _, crossfilter, d3  */
(function(nbviz) {
    'use strict';

    // var infoboxAttrs = ['category', 'year', 'country']; 
    
    nbviz.displayWinner = function(_wData) {

        nbviz.getDataFromAPI('winners/' + _wData._id, function(error, wData) {
            
            var nw = d3.select('#nobel-winner');
            
            nw.select('#winner-title').text(wData.name);
            nw.style('border-color', nbviz.categoryFill(wData.category));
            
            nw.selectAll('.property span')
                .text(function(d) {
                    var property = d3.select(this).attr('name');
                    return wData[property];
                });
            
            nw.select('#biobox').html(wData.mini_bio);
            // Add an image if available, otherwise remove the old one
            if(wData.bio_image){
                // nw.select('#picbox').html('<img src="static/images/winners/' + wData.bio_image + '"/>');
                nw.select('#picbox img')
                    .attr('src', 'static/images/winners/' + wData.bio_image)
                    .style('display', 'inline');
                        
            }
            else{
                nw.select('#picbox img').style('display', 'none');
            }

            nw.select('#readmore a').attr('href', 'http://en.wikipedia.org/wiki/' + wData.name);
        });
    };
    
    nbviz.updateList = function(data) {
        var rows, cells;
        var data = data.sort(function(a, b) {
            return +b.year - +a.year;
        });
        
        rows = d3.select('#nobel-list tbody')
            .selectAll('tr')
            .data(data);

        rows.enter().append('tr')
            .on('click', function(d) {
                console.log('You clicked a row ' + JSON.stringify(d));
                nbviz.displayWinner(d);
            });

        rows.exit()
            .transition().duration(nbviz.TRANS_DURATION)
            .style('opacity', 0)
            .remove();

        cells = rows.selectAll('td')
            .data(function(d) {
                return [d.year, d.category, d.name];  
            });
        
        cells.enter().append('td');
        
        cells.html(function(d) {
                return d;
            });

        // display random winner
        if(data.length){
            nbviz.displayWinner(data[Math.floor(Math.random() * data.length)]);
        }
        
    };
}(window.nbviz = window.nbviz || {}));
