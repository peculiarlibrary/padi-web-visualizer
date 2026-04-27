const width = window.innerWidth;
const height = window.innerHeight;

const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", "#0d1117");

// Define the simulation forces
const simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(d => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(width / 2, height / 2));

// Fetch from the Sovereign Kernel
d3.json("https://raw.githubusercontent.com/peculiarlibrary/padi-ontology-kernel/main/manifest.json").then(data => {
    
    const nodes = data.assets.map(d => ({ 
        id: d.path, 
        name: d.name, 
        group: d.path.split('/')[0] 
    }));

    // Virtual links based on shared directory structure
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
        .attr("stroke-width", 1.5);

    const node = svg.append("g")
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 10)
        .attr("fill", d => d.group === "constraints" ? "#f85149" : "#58a6ff")
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    node.append("title").text(d => `PADI Asset: ${d.name}\nPath: ${d.id}`);

    simulation.nodes(nodes).on("tick", () => {
        link.attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node.attr("cx", d => d.x)
            .attr("cy", d => d.y);
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
