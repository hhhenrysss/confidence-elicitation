var data = [];

// popuate data
//
//
getData();

function getData() {
    for (var i = 0; i < 50; i++) {
        q=i
        p = gaussian(q)
        el = {
            "q": q,
            "p": p
        }
        var div = d3.select("body").select("#originData")
        div
            .text("x: "+q + ",y: " + p)
        // .style("left", (d3.event.pageX - 34) + "px")
        // .style("top", (d3.event.pageY - 12) + "px");
        //console.log("x: "+q+"y: "+p);

        data.push(el)
    };
// need to sort for plotting
    data.sort(function(x, y) {
        return x.q - y.q;
    });
}
function gaussian(x) {
    return (-1)*x*x;
};


// create canvass
//
//
var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    },
    width = 200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// axises
//
//
var x = d3.scale.linear()
// .domain([0,d3.max(data)])
    .range([0, width]);//can adjust axis range

var y = d3.scale.linear()
// .domain([0,d3.max(data)])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("top")
    .tickValues([])
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickValues([])

x.domain(d3.extent(data, function(d) {
    return d.q;
}));
y.domain(d3.extent(data, function(d) {
    return d.p;
}));

svg.append("g")
    .attr("class", "x axis")
    // .attr("transform","translate(10,160)")
    .call(xAxis);
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

// function plot
//
//
var container = svg.append("g");

var line = d3.svg.line()
    .x(function(d) {
        return x(d.q);
    })
    .y(function(d) {
        return y(d.p);
    });
container.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line);

// handle
//
//
var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("dragstart", dragstarted)
    .on("drag", dragged)
    .on("dragend", dragended);

handle = [{
    x: 0,
    y: 0
}];

handle_circle = container.append("g")
    .attr("class", "dot")
    .selectAll('circle')
    .data(handle)
    .enter().append("circle")
    .attr("r", 5)
    .attr("cx", function(d) { return d.x;})
    .attr("cy", function(d) { return d.y;})
    .call(drag);

function dragstarted(d) {
    d3.event.sourceEvent.stopPropagation();
    d3.select(this)
        .classed("dragging", true);
}

function dragged(d) {
    d3.select(this)
        .attr("cx", d.x = d3.event.x)
        .attr("cy", d.y = (0.025*d3.event.x *d3.event.x));
}

function dragended(d) {
    d3.select(this)
        .classed("dragging", false);
}

//color indicator
//
//
container.append("rect")
    .attr("x",0)
    .attr("y",-30)
    .attr("width",0)
    .attr("height",20)
    .attr("fill","green")
    .attr("id","horizontal");


container.append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("width",10)
    .attr("height",0)
    .attr("fill","red")
    .attr("id","vertical");


function findTheMouse(){
    var coordinates = d3.mouse(this);
    var div = d3.select("body").select("#realTime")
    div
        .text("x: "+coordinates[0] + ",y: " + coordinates[1])
        .style("left", (d3.event.pageX - 34) + "px")
        .style("top", (d3.event.pageY - 12) + "px");
    svg.select("rect[id='horizontal']")
        .attr("width",coordinates[0])  ;
    svg.select("rect[id='vertical']")
        .attr("height",coordinates[1])  ;
    // .attr("width",xScale)           //pay attention
    // console.log("x: "+coordinates[0]+"y: "+coordinates[1]);
    // console.log("y: "+coordinates[1]);

}
d3.select("svg")
    .on("mousemove", findTheMouse);