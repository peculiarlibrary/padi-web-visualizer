const METADATA_URL = 'https://raw.githubusercontent.com/peculiarlibrary/padi-ontology-kernel/main/metadata.json';

// PADI A2UI: Sovereign Rendering Logic
d3.json(METADATA_URL).then(data => {
    const nodes = data.nodes;
    const links = data.links;

    const svg = d3.select("svg")
        .attr("width", window.innerWidth)
        .attr("height", window.innerHeight);

    // Create the visual elements (This was missing in your last 'cat' command)
    const link = svg.append("g").selectAll("line")
        .data(links).enter().append("line")
        .attr("stroke", "#999").attr("stroke-opacity", 0.6);

    const node = svg.append("g").selectAll("circle")
        .data(nodes).enter().append("circle")
        .attr("r", 10).attr("fill", d => d.group === 1 ? "#ff0000" : "#00ff00")
        .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(100))
        .force("charge", d3.forceManyBody().strength(-300))
        .force("center", d3.forceCenter(window.innerWidth / 2, window.innerHeight / 2));

    simulation.on("tick", () => {
        link.attr("x1", d => d.source.x).attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
        node.attr("cx", d => d.x).attr("cy", d => d.y);
    });

    function dragstarted(event) { if (!event.active) simulation.alphaTarget(0.3).restart(); event.subject.fx = event.subject.x; event.subject.fy = event.subject.y; }
    function dragged(event) { event.subject.fx = event.x; event.subject.fy = event.y; }
    function dragended(event) { if (!event.active) simulation.alphaTarget(0); event.subject.fx = null; event.subject.fy = null; }

    console.log("Sovereign Data Linked:", nodes.length, "nodes active.");
}).catch(err => console.error("Bridge Error:", err));
