/* global $, _, crossfilter, d3  */
(function(nbviz) {
    'use strict';
    
    var chartHolder = d3.select('#nobel-time');
    
    var margin = {top:20, right:20, bottom:30, left:40};
    var boundingRect = chartHolder.node().getBoundingClientRect();
    var width = boundingRect.width - margin.left - margin.right,
        height = boundingRect.height - margin.top - margin.bottom;

    var svg = chartHolder.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append('g')
            .attr("class", "chart")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // SCALES
    var xScale = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.1)
        .domain(d3.range(1901, 2015));

    var yScale = d3.scale.ordinal()
        .rangeRoundPoints([height, 0])
        .domain(d3.range(15));

    // AXIS
    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")
        .tickValues(xScale.domain().filter(function(d,i) {return !(d%10);}));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

    // LABELS
    var catLabels = chartHolder.select('svg').append('g')
            .attr('class', 'labels')
            .attr('transform', "translate(10, 10)")
            .selectAll('label').data(nbviz.CATEGORIES)
            .enter().append('g')
            .attr('transform', function(d, i) {
                return "translate(0," + i * 10 + ")";
            });

    catLabels.append('circle')
        .attr('fill', (nbviz.categoryFill))
        .attr('r', xScale.rangeBand()/2);

    catLabels.append('text')
        .text(function(d) {
            return d;
        })
        .attr('dy', '0.4em')
        .attr('x', 10);
    
    // OUR MAIN UPDATE METHOD, CALLED BY nbviz.onDataChange in nbviz_core.js
    nbviz.updateTimeChart = function(data) {
        
        var years = svg.selectAll(".year")
                .data(data, function(d) {
                    return d.key;
                });

        years.enter().append('g')
            .classed('year', true)
            .attr('name', function(d) { return d.key;})
            .attr("transform", function(year) {
                return "translate(" + xScale(+year.key) + ",0)";
            });

        years.exit().remove();

        var winners = years.selectAll(".winner")
                .data(function(d) {
                    return d.values;
                }, function(d) {
                    return d.name;
                });

        winners.enter().append('circle')
            // .attr('class', function(d) {
            //     return 'winner ' + d.country.replace(/ /g, '-');
            // })
            .classed('winner', true)
            .attr('fill', function(d) {
                return nbviz.categoryFill(d.category);
            })
            .attr('cy', height)
            .attr('cx', xScale.rangeBand()/2)
            .attr('r', xScale.rangeBand()/2);

        winners
            .transition().duration(2000)
            .attr('cy', function(d, i) {
            return yScale(i);
            });

        winners.exit().remove();
    };
    
}(window.nbviz = window.nbviz || {}));
