## D3
### SVG
- order of addition important - no z property. E.g. svg.insert('path', '.graticule') # before graticule


### Making the thing
- pass through mouse 


### Snippets
`var shapeData = ["Triangle", "Circle", "Square", "Rectangle"], 
    j = 3;  // Choose the rectangle as default

// Create the shape selectors
var form = d3.select("body").append("form");

labels = form.selectAll("label")
    .data(shapeData)
    .enter()
    .append("label")
    .text(function(d) {return d;})
    .insert("input")
    .attr({
        type: "radio",
        class: "shape",
        name: "mode",
        value: function(d, i) {return i;}
    })
    .property("checked", function(d, i) {return i===j;});
`

