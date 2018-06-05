/* global $, _, crossfilter, d3  */
(function(nbviz) {
    'use strict';

    var chartHolder = d3.select('#nobel-bar');

    var margin = {top:20, right:20, bottom:35, left:40};
    var boundingRect = chartHolder.node().getBoundingClientRect();
    var width = boundingRect.width - margin.left - margin.right,
    height = boundingRect.height - margin.top - margin.bottom;
        // width = parseInt(chartHolder.style('width')) - margin.left - margin.right,
        // height = parseInt(chartHolder.style('height')) - margin.top - margin.bottom;
    var xPaddingLeft = 20;//10;

    // SCALES
    var xScale = d3.scaleBand()
        // .rangeRoundBands([0, width], 0.1, 1.4);
          .range([xPaddingLeft, width])
          .padding(0.1)

    var yScale = d3.scaleLinear()
        .range([height, 0]);

    // AXES
    var xAxis = d3.axisBottom()
          .scale(xScale);

    var yAxis = d3.axisLeft()
            .scale(yScale)
            .ticks(10)
            .tickFormat(function(d) {
                if(nbviz.valuePerCapita){
                    return d.toExponential();
                }
                return d;
            });

    var svg = chartHolder.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // ADD AXES
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")");

    svg.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr('id', 'y-axis-label')
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
    ;

    nbviz.updateBarChart = function(data) {
        data = data.filter(function(d) {
            return d.value > 0;
        });
        xScale.domain( data.map(function(d) { return d.code; }) );
        yScale.domain([0, d3.max(data, function(d) { return +d.value; })]);

        svg.select('.x.axis')
            .transition().duration(nbviz.TRANS_DURATION)
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)";
            });

        svg.select('.y.axis')
            .transition().duration(nbviz.TRANS_DURATION)
            .call(yAxis);

        var yLabel = svg.select('#y-axis-label');
        yLabel.text("Number of winners");

        var bars = svg.selectAll(".bar")
            .data(data, function(d) {
                return d.code;
            });

        bars.enter().append("rect")
            .attr("class", "bar")
            .attr("x", xPaddingLeft)
        .merge(bars)
            .classed('active', function(d) {
                return d.key === nbviz.activeCountry;
            })
            .transition().duration(nbviz.TRANS_DURATION)
            .attr("x", function(d) { return xScale(d.code); })
            .attr("width", xScale.bandwidth())
            .attr("y", function(d) { return yScale(d.value); })
            .attr("height", function(d) { return height - yScale(d.value); });


        bars.exit().remove();

    };

}(window.nbviz = window.nbviz || {}));
