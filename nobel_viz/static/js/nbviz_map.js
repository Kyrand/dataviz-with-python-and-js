/* global $, _, crossfilter, d3, topojson  */
(function(nbviz) {
    'use strict';

    var defaultMapWidth = 960,
        defaultMapHeight = 480;

    var mapBlock = d3.select('#nobel-map'),
        width = parseInt(mapBlock.style('width')),
        height = parseInt(mapBlock.style('height'));

    var svg = mapBlock
            .append('svg');

    var MANUAL_CENTROIDS = {
        France: [2, 46],
        'United States': [-98,35, 39.5]
    };

    // default scale = 153
    var projection_eq = d3.geo.equirectangular()
        .scale(193 * (height/480))
        .center([15,15])
    // .translate([0.9* width / 2, 1.2* height / 2])
        .translate([width / 2, height / 2])
        .precision(.1);

    var projection_cea = d3.geo.conicEqualArea()
        .center([0, 26])
        .scale(128)
        .translate([width / 2, height / 2])
        .precision(.1);
    
    var projection_ceq = d3.geo.conicEquidistant()
        .center([0, 22])
        .scale(128)
        .translate([width / 2, height / 2])
        .precision(.1);
    
    var projection_merc = d3.geo.mercator()
        .scale((width + 1) / 2 / Math.PI)
        .translate([width / 2, height / 2])
        .precision(.1);
    
    var projection = projection_eq;

    var path = d3.geo.path()
            .projection(projection);

    var graticule = d3.geo.graticule()
        .step([20, 20]);

    svg.append("path")
        .datum(graticule)
        .attr("class", "graticule")
        .attr("d", path);

    var getCentroid = function(mapData) {
        var latlng = nbviz.data.countryData[mapData.name].latlng;
        return projection([latlng[1], latlng[0]]);
        // if(coords = MANUAL_CENTROIDS[mapData.name]){
        //     return projection(coords);
        // }

        // return path.centroid(mapData.geo);
    };
        
    // var radiusScale = d3.scale.linear()
    var radiusScale = d3.scale.sqrt()
        // .domain([0, max_winners])
        .range([nbviz.MIN_CENTROID_RADIUS, nbviz.MAX_CENTROID_RADIUS]);
    
    var cnameToCountry = {};
    nbviz.initMap = function(world, names) { 
        // filters
        // topo features
        var land = topojson.feature(world, world.objects.land),
            countries = topojson.feature(world, world.objects.countries).features,
            borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; });
        
        var idToCountry = {};
        countries.forEach(function(c) {
            idToCountry[c.id] = c;
        });
        
        cnameToCountry = {};
        names.forEach(function(n) {
            cnameToCountry[n.name] = idToCountry[n.id];
        });
        
        // normalizing
        
        // var radius_scale = d3.scale.linear()
        //     .domain([0, max_winners])
        //     .range([MIN_CENTROID_RADIUS, MAX_CENTROID_RADIUS]);
        
        // MAIN WORLD MAP
        svg.insert("path", ".graticule")
            .datum(land)
            .attr("class", "land")
            .attr("d", path)
        ;

        // WINNING COUNTRIES
        svg.insert("g", ".graticule")
            .attr("class", 'countries');
        

        // COUNTRIES VALUE-INDICATORS
        svg.insert("g")
            .attr("class", "centroids");
        
        // BOUNDRY MARKS
        svg.insert("path", ".graticule")
        // filter separates exterior from interior arcs...
            .datum(borders)
            .attr("class", "boundary")
            .attr("d", path);

        // nbviz.updateMap(countryData);
    };

    // var tooltip = new kcharts.Tooltip();
    // tooltip.id('#song-tooltip').colored(true);
    // tooltip.dataFormat = function(d) {
    //     var comp = d.data.metadata.COM.split(',');
    //     return {
    //         'composer':comp[1] + ' ' + comp[0],
    //         'title':d.data.metadata.OTL,
    //         'date':d.data.metadata.ODT,
    //         'key':d.data.key
    //     };
    // };
        
    var tooltip = d3.select('#map-tooltip');
    nbviz.updateMap = function(countryData) {
        
        var mapData = nbviz.mapData = countryData
            .filter(function(d) {
                return d.value > 0;
            })
            .map(function(d) {
                return {
                    geo: cnameToCountry[d.key],
                    name: d.key,
                    number: d.value
                };
            });

        // var maxWinners = _.max(_.pluck(mapData, 'number'));
        var maxWinners = d3.max(mapData.map(function(d) {
            return d.number;
        }));
        // DOMAIN OF VALUE-INDINCATOR SCALE 
        radiusScale.domain([0, maxWinners]);

        var countries = svg.select('.countries').selectAll('.country')
            .data(mapData, function(d) {
                return d.name;
            });

        countries.enter()
            .append('path')
            .attr('class', 'country')
            .on('mouseenter', function(d) {
                // console.log('Entered ' + d.name);
                var country = d3.select(this);
                // if(parseFloat(country.style('opacity')) < 0.1){
                //     return;
                // }
                if(!country.classed('visible')){ return; }
                
                var mouseCoords = d3.mouse(this);
                var cData = country.datum();
                var prize_string = (cData.number === 1)?' prize in ': ' prizes in ';
                tooltip.select('h2').text(cData.name);
                tooltip.select('p').text(cData.number + prize_string + nbviz.activeCategory); 
                var borderColor = (nbviz.activeCategory === nbviz.ALL_CATS)? 'goldenrod':nbviz.categoryFill(nbviz.activeCategory);
                tooltip.style('border-color', borderColor);
                var countryClass = cData.name.replace(/ /g, '-');
                
                var w = parseInt(tooltip.style('width')),
                    h = parseInt(tooltip.style('height'));
                tooltip.style('top', (mouseCoords[1]) - h + 'px');
                tooltip.style('left', (mouseCoords[0] - w/2) + 'px');
                
                d3.select(this).classed('active', true);
                
                // d3.selectAll('#nobel-time circle.' + countryClass)
                //     .style('stroke-width', '2px');
            })
            .on('mouseout', function(d) {
                // console.log('Left ' + d.name);
                // tooltip.style('display', 'none');
                tooltip.style('left', '-9999px');
                d3.select(this).classed('active', false);
            })
            // .on('mousemove', function(d) {
            //     var country = d3.select(this);
            //     var tooltip = d3.select('#map-tooltip');
                
            //     var bbox = country.node().getBBox();
            //     // var mp = d3.mouse(this);
               
            //     // tooltip.style('top', mp[1] + 'px');
            //     // tooltip.style('left', mp[0] + 'px');
            //     // tooltip.style('top', getCentroid(d)[1] + 'px');
            //     // tooltip.style('left', getCentroid(d)[0] + 'px');
            // })
        ;

        countries
            .attr('name', function(d) {
                return d.name; 
            })
            .classed('visible', true)
            .transition().duration(nbviz.TRANS_DURATION)
            .style('opacity', 1)
            .attr('d', function(d) {
                return path(d.geo);
            });

        countries.exit()
            .classed('visible', false)
            .transition().duration(nbviz.TRANS_DURATION)
            .style('opacity', 0);
        
        var centroids = svg.select('.centroids').selectAll(".centroid")
            .data(mapData, function(d) {
                return d.name;
            });
        
        centroids.enter().append('circle')
            .attr("class", "centroid");
        
        centroids.attr("name", function(d) {
            return d.name;
        })
            .attr("cx", function(d) {
                return getCentroid(d)[0];
            })
            .attr("cy", function(d) {
                // return path.centroid(d.geo)[1];
                return getCentroid(d)[1];
            })
            .classed('active', function(d) {
                return d.name === nbviz.activeCountry;
            })
            .transition().duration(nbviz.TRANS_DURATION)
            .style('opacity', 1) 
            .attr("r", function(d) {
                return radiusScale(+d.number);
            });

        centroids.exit()
            .style('opacity', 0);
        
    };

    // d3.select(self.frameElement).style("height", height + "px");

}(window.nbviz = window.nbviz || {}));
