const width = window.innerWidth;
const height = window.innerHeight;

const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", "#0d1117");

const simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(d => d.id).distance(120))
    .force("charge", d3.forceManyBody().strength(-400))
    .force("center", d3.forceCenter(width / 2, height / 2));

d3.json("https://raw.githubusercontent.com/peculiarlibrary/padi-ontology-kernel/main/manifest.json").then(data => {
    
    const nodes = data.assets.map(d => ({ 
        id: d.path, 
        name: d.name, 
        group: d.path.split('/')[0] 
    }));

    const links = [];
    nodes.forEach((a, i) => {
        nodes.forEach((b, j) => {
            if (i < j && a.group === b.group) {
                links.push({ source: a.id, target: b.id });
            }
        });
    });

    const link = svg.append("g")
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke", "#30363d")
        .attr("stroke-width", 1);

    const nodeGroup = svg.append("g")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    // The Node Circle
    nodeGroup.append("circle")
        .attr("r", 12)
        .attr("fill", d => {
            if (d.group === "constraints") return "#ff7b72"; // Red for rules
            if (d.group === "ontology") return "#a5d6ff";    // Blue for structure
            return "#7ee787";                               // Green for others
        })
        .attr("stroke", "#f0f6fc")
        .attr("stroke-width", 2);

    // The Node Label
    nodeGroup.append("text")
        .text(d => d.name)
        .attr("x", 15)
        .attr("y", 5)
        .style("fill", "#c9d1d9")
        .style("font-size", "12px")
        .style("pointer-events", "none");

    simulation.nodes(nodes).on("tick", () => {
        link.attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        nodeGroup.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    simulation.force("link").links(links);

    function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
    }
    function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
    }
    function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
    }
});

// PADI A2UI: Force Anchor & Viewport Bounding
simulation
    .force("center", d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
    .force("x", d3.forceX(window.innerWidth / 2).strength(0.1))
    .force("y", d3.forceY(window.innerHeight / 2).strength(0.1));

// Keep nodes within the visible bounds of the screen
function boxConstraints() {
    nodes.forEach(d => {
        d.x = Math.max(20, Math.min(window.innerWidth - 20, d.x));
        d.y = Math.max(20, Math.min(window.innerHeight - 20, d.y));
    });
}
// Increase centripetal pull to keep clusters visible
simulation
    .force("center", d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2))
    .force("charge", d3.forceManyBody().strength(-150)) // Moderate repulsion
    .force("x", d3.forceX(window.innerWidth / 2).strength(0.15)) // Stronger X-axis gravity
    .force("y", d3.forceY(window.innerHeight / 2).strength(0.15)) // Stronger Y-axis gravity
    .alpha(1).restart(); // Wake up the simulation
