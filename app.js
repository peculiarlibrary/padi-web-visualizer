const DATA_URL = 'https://raw.githubusercontent.com/peculiarlibrary/padi-ontology-kernel/main/metadata.json';

d3.json(DATA_URL).then(data => {
    const svg = d3.select("#visualizer");
    const width = window.innerWidth, height = window.innerHeight;
    svg.selectAll("*").remove();

    // Safety Filter: Remove links that reference non-existent nodes
    const nodeIds = new Set(data.nodes.map(d => d.id));
    const validLinks = data.links.filter(l => nodeIds.has(l.source) && nodeIds.has(l.target));

    const simulation = d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink(validLinks).id(d => d.id).distance(100))
        .force("charge", d3.forceManyBody().strength(-200))
        .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g").selectAll("line")
        .data(validLinks).enter().append("line")
        .attr("stroke", "#444").attr("stroke-width", 1);

    const node = svg.append("g").selectAll("circle")
        .data(data.nodes).enter().append("circle")
        .attr("r", 6).attr("fill", d => d.group === 1 ? "#f0883e" : "#58a6ff")
        .call(d3.drag()
            .on("start", (e, d) => { if (!e.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
            .on("drag", (e, d) => { d.fx = e.x; d.fy = e.y; }));

    node.append("title").text(d => d.id);

    simulation.on("tick", () => {
        link.attr("x1", d => d.source.x).attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x).attr("y2", d => d.target.y);
        node.attr("cx", d => d.x).attr("cy", d => d.y);
    });
}).catch(err => console.error("Critical Load Failure:", err));
